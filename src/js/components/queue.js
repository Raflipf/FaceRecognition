import { Storage } from "../utils/storage.js";
import {
  getDoctors,
  getQueues,
  getPatients, // Add this import
  addQueue,
  updateQueue,
} from "../../../js/utils/api.js";

export const QueueComponent = {
  doctors: [],
  patients: [], // Add this property
  queues: [],

  async loadPatients() {
    try {
      const token = this.app.currentUser.token;
      const patients = await getPatients(token);
      console.log("Loaded patients:", patients); // Tambahkan ini
      this.patients = patients;
      Storage.set("patients", patients);
      return patients;
    } catch (error) {
      console.error("Failed to load patients:", error); // Tambahkan error detail
      this.patients = Storage.get("patients") || [];
      return this.patients;
    }
  },

  async loadDoctors() {
    try {
      const token = this.app.currentUser.token;
      this.doctors = await getDoctors(token);
      console.log("Loaded doctors:", this.doctors); // Tambahkan ini
      Storage.set("doctors", this.doctors);
    } catch (error) {
      console.error("Failed to load doctors:", error); // Tambahkan error detail
      this.app.showNotification(
        "Gagal mengambil data dokter: " + error.message,
        "error"
      );
      this.doctors = Storage.get("doctors") || [];
    }
  },

  async loadQueues() {
    try {
      const token = this.app.currentUser.token;
      this.queues = await getQueues(token);

      const processedQueues = await this.processQueueData(this.queues);

      Storage.set("queue", processedQueues);
    } catch (error) {
      this.app.showNotification(
        "Gagal mengambil data antrian: " + error.message,
        "error"
      );
      this.queues = Storage.get("queue") || [];
    }
  },

  async processQueueData(queues) {
    // Ensure we have fresh patient and doctor data
    const patients =
      this.patients.length > 0 ? this.patients : await this.loadPatients();
    const doctors =
      this.doctors.length > 0 ? this.doctors : await this.loadDoctors();

    console.log("Processing queues:", queues.length);
    console.log("Available patients:", patients.length);
    console.log("Available doctors:", doctors.length);

    return queues.map((queue) => {
      // Convert IDs to string for comparison
      const queuePatientId = queue.patient_id?.toString();
      const queueDoctorId = queue.doctor_id?.toString();

      // Find patient - handle both _id and id fields
      const patient = patients.find((p) => {
        const patientId = (p._id || p.id)?.toString();
        return patientId && patientId === queuePatientId;
      });

      // Find doctor - handle both _id and id fields
      const doctor = doctors.find((d) => {
        const doctorId = (d._id || d.id)?.toString();
        return doctorId && doctorId === queueDoctorId;
      });

      if (!patient) {
        console.warn("Patient not found for queue:", queue.patient_id);
        console.warn(
          "Available patient IDs:",
          patients.map((p) => (p._id || p.id)?.toString())
        );
      }
      if (!doctor) {
        console.warn("Doctor not found for queue:", queue.doctor_id);
        console.warn(
          "Available doctor IDs:",
          doctors.map((d) => (d._id || d.id)?.toString())
        );
      }

      return {
        ...queue,
        id: queue._id || queue.id,
        patientId: queue.patient_id,
        doctorId: queue.doctor_id,
        patientName: patient ? patient.name : "Pasien Tidak Dikenal",
        doctorName: doctor ? doctor.name : "Dokter Tidak Dikenal",
        doctorSpecialty: doctor
          ? doctor.specialty
          : "Spesialisasi Tidak Dikenal",
      };
    });
  },

  render() {
    const stats = this.getQueueStats();

    return `
            <div class="fade-in">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <i class="fas fa-list-ol"></i>
                            Antrian Pasien
                        </h2>
                        <button class="btn btn-primary" id="refreshQueue">
                            <i class="fas fa-sync-alt"></i>
                            Refresh
                        </button>
                    </div>

                    <div class="queue-stats">
                        <div class="stat-card">
                            <div class="stat-number">${stats.waiting}</div>
                            <div class="stat-label">Menunggu</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${stats.examining}</div>
                            <div class="stat-label">Sedang Diperiksa</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${stats.completed}</div>
                            <div class="stat-label">Selesai Hari Ini</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${stats.total}</div>
                            <div class="stat-label">Total Hari Ini</div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-filter"></i>
                            Filter Antrian
                        </h3>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                        <div class="form-group mb-0">
                            <label class="form-label" for="doctorFilter">Filter Dokter</label>
                            <select id="doctorFilter" class="form-select">
                                <option value="">Semua Dokter</option>
                                ${this.renderDoctorFilterOptions()}
                            </select>
                        </div>
                        
                        <div class="form-group mb-0">
                            <label class="form-label" for="statusFilter">Filter Status</label>
                            <select id="statusFilter" class="form-select">
                                <option value="">Semua Status</option>
                                <option value="waiting">Menunggu</option>
                                <option value="examining">Sedang Diperiksa</option>
                                <option value="completed">Selesai</option>
                            </select>
                        </div>
                        
                        <div class="form-group mb-0">
                            <label class="form-label" for="dateFilter">Filter Tanggal</label>
                            <input type="date" id="dateFilter" class="form-input" value="${
                              new Date().toISOString().split("T")[0]
                            }">
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Daftar Antrian</h3>
                        <span id="queueCount" style="color: #64748b; font-size: 0.875rem;">
                            ${this.getFilteredQueue().length} antrian
                        </span>
                    </div>
                    
                    <div style="overflow-x: auto;">
                        <table class="queue-table">
                            <thead>
                                <tr>
                                    <th>No. Antrian</th>
                                    <th>Waktu</th>
                                    <th>Nama Pasien</th>
                                    <th>Dokter</th>
                                    <th>Keluhan</th>
                                    <th>Prioritas</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="queueTableBody">
                                ${this.renderQueueTable()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
  },

  getQueueStats() {
    const queue = this.getFilteredQueue();
    const today = new Date().toDateString();
    const todayQueue = queue.filter(
      (q) => new Date(q.timestamp).toDateString() === today
    );

    return {
      waiting: todayQueue.filter((q) => q.status === "waiting").length,
      examining: todayQueue.filter((q) => q.status === "examining").length,
      completed: todayQueue.filter((q) => q.status === "completed").length,
      total: todayQueue.length,
    };
  },

  getFilteredQueue() {
    const queue = Storage.get("queue") || [];
    const doctorFilter = document.getElementById("doctorFilter")?.value || "";
    const statusFilter = document.getElementById("statusFilter")?.value || "";
    const dateFilter =
      document.getElementById("dateFilter")?.value ||
      new Date().toISOString().split("T")[0];

    return queue
      .filter((q) => {
        // Handle both doctorId and doctor_id fields
        const queueDoctorId = q.doctorId || q.doctor_id;
        const matchDoctor =
          !doctorFilter || queueDoctorId?.toString() === doctorFilter;
        const matchStatus = !statusFilter || q.status === statusFilter;
        const matchDate =
          !dateFilter ||
          new Date(q.timestamp).toDateString() ===
            new Date(dateFilter).toDateString();

        return matchDoctor && matchStatus && matchDate;
      })
      .sort((a, b) => {
        // Sort by priority first, then by timestamp
        const priorityOrder = { emergency: 3, urgent: 2, normal: 1 };
        const aPriority =
          typeof a.priority === "number"
            ? a.priority === 3
              ? "emergency"
              : a.priority === 2
              ? "urgent"
              : "normal"
            : a.priority;
        const bPriority =
          typeof b.priority === "number"
            ? b.priority === 3
              ? "emergency"
              : b.priority === 2
              ? "urgent"
              : "normal"
            : b.priority;

        const priorityDiff =
          (priorityOrder[bPriority] || 1) - (priorityOrder[aPriority] || 1);
        if (priorityDiff !== 0) return priorityDiff;

        return new Date(a.timestamp) - new Date(b.timestamp);
      });
  },

  renderDoctorFilterOptions() {
    return this.doctors
      .map(
        (doctor) => `
            <option value="${doctor._id || doctor.id}">Dr. ${doctor.name} - ${
          doctor.specialty
        }</option>
        `
      )
      .join("");
  },

  renderQueueTable() {
    const queue = this.getFilteredQueue();

    if (queue.length === 0) {
      return `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: #64748b;">
                        <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5; display: block;"></i>
                        Tidak ada antrian untuk filter yang dipilih
                    </td>
                </tr>
            `;
    }

    return queue
      .map(
        (item) => `
            <tr>
                <td>
                    <strong style="font-size: 1.2rem; color: #3b82f6;">
                        #${item.queueNumber}
                    </strong>
                </td>
                <td>
                    <div style="font-size: 0.875rem;">
                        ${new Date(item.timestamp).toLocaleDateString("id-ID")}
                    </div>
                    <div style="font-size: 0.75rem; color: #64748b;">
                        ${new Date(item.timestamp).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </div>
                </td>
                <td>
                    <strong>${item.patientName}</strong>
                </td>
                <td>
                    <div>Dr. ${item.doctorName}</div>
                    <div style="font-size: 0.875rem; color: #64748b;">${
                      item.doctorSpecialty
                    }</div>
                </td>
                <td>
                    <div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${
                      item.complaint
                    }">
                        ${item.complaint}
                    </div>
                </td>
                <td>
                    <span class="status-badge ${this.getPriorityClass(
                      item.priority
                    )}">
                        ${this.getPriorityLabel(item.priority)}
                    </span>
                </td>
                <td>
                    <span class="status-badge status-${item.status}">
                        ${this.getStatusLabel(item.status)}
                    </span>
                </td>
                <td>
                    <div style="display: flex; gap: 0.25rem; flex-wrap: wrap;">
                        ${this.renderActionButtons(item)}
                    </div>
                </td>
            </tr>
        `
      )
      .join("");
  },

  getPriorityClass(priority) {
    // Handle both string and number priority values
    const priorityValue =
      typeof priority === "number"
        ? priority === 3
          ? "emergency"
          : priority === 2
          ? "urgent"
          : "normal"
        : priority;

    switch (priorityValue) {
      case "emergency":
        return "status-completed"; // Red/danger color
      case "urgent":
        return "status-examining"; // Blue color
      case "normal":
      default:
        return "status-waiting"; // Yellow color
    }
  },

  getPriorityLabel(priority) {
    // Handle both string and number priority values
    const priorityValue =
      typeof priority === "number"
        ? priority === 3
          ? "emergency"
          : priority === 2
          ? "urgent"
          : "normal"
        : priority;

    switch (priorityValue) {
      case "emergency":
        return "Darurat";
      case "urgent":
        return "Mendesak";
      case "normal":
      default:
        return "Normal";
    }
  },

  getStatusLabel(status) {
    switch (status) {
      case "waiting":
        return "Menunggu";
      case "examining":
        return "Diperiksa";
      case "completed":
        return "Selesai";
      default:
        return status;
    }
  },

  renderActionButtons(item) {
    const itemId = item._id || item.id;

    switch (item.status) {
      case "waiting":
        return `
                    <button class="btn btn-primary" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;" 
                            onclick="queueComponent.startExamination('${itemId}')">
                        <i class="fas fa-play"></i>
                        Mulai
                    </button>
                `;
      case "examining":
        return `
                    <button class="btn btn-success" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;" 
                            onclick="queueComponent.completeExamination('${itemId}')">
                        <i class="fas fa-check"></i>
                        Selesai
                    </button>
                `;
      case "completed":
        return `
                    <button class="btn btn-secondary" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;" 
                            onclick="queueComponent.viewDetails('${itemId}')">
                        <i class="fas fa-eye"></i>
                        Detail
                    </button>
                `;
      default:
        return "";
    }
  },

  async init(app) {
    this.app = app;
    window.queueComponent = this;

    // Load data
    await this.loadDoctors();
    await this.loadPatients();
    await this.loadQueues();

    // Render dulu ke DOM (pastikan ada fungsi render ke container ya)
    const container = document.getElementById("app-content"); // atau apapun container lo
    if (container) {
      container.innerHTML = this.render();
    }

    // Baru pasang event listener
    this.setupEventListeners();

    // Mulai auto refresh
    this.startAutoRefresh();
  },

  setupEventListeners() {
    const refreshBtn = document.getElementById("refreshQueue");
    const doctorFilter = document.getElementById("doctorFilter");
    const statusFilter = document.getElementById("statusFilter");
    const dateFilter = document.getElementById("dateFilter");

    refreshBtn.addEventListener("click", () => this.refreshQueue());

    [doctorFilter, statusFilter, dateFilter].forEach((filter) => {
      if (filter) {
        filter.addEventListener("change", () => this.refreshQueue());
      }
    });
  },

  async refreshQueue() {
    // Reload data from API - refresh patients and doctors first
    await this.loadPatients();
    await this.loadDoctors();
    await this.loadQueues();

    const tableBody = document.getElementById("queueTableBody");
    const queueCount = document.getElementById("queueCount");

    if (tableBody) {
      tableBody.innerHTML = this.renderQueueTable();
    }

    if (queueCount) {
      queueCount.textContent = `${this.getFilteredQueue().length} antrian`;
    }

    // Update stats
    const stats = this.getQueueStats();
    const statCards = document.querySelectorAll(".stat-card .stat-number");
    if (statCards.length >= 4) {
      statCards[0].textContent = stats.waiting;
      statCards[1].textContent = stats.examining;
      statCards[2].textContent = stats.completed;
      statCards[3].textContent = stats.total;
    }
  },

  startAutoRefresh() {
    // Auto-refresh every 30 seconds
    this.refreshInterval = setInterval(() => {
      this.refreshQueue();
    }, 30000);
  },

  startExamination(queueId) {
    const queue = Storage.get("queue") || [];
    const queueItem = queue.find(
      (q) =>
        (q._id && q._id.toString() === queueId.toString()) ||
        (q.id && q.id.toString() === queueId.toString())
    );

    if (!queueItem) {
      this.app.showNotification("Item antrian tidak ditemukan", "error");
      return;
    }

    this.app.showModal(
      "Konfirmasi",
      `Mulai pemeriksaan untuk pasien ${queueItem.patientName}?`,
      async () => {
        try {
          // Update via API
          const token = this.app.currentUser.token;
          const updateData = {
            status: "examining",
            examinationStartTime: new Date().toISOString(),
          };

          await updateQueue(queueId, updateData, token);

          // Update local storage
          queueItem.status = "examining";
          queueItem.examinationStartTime = new Date().toISOString();

          // Update doctor status to busy
          const doctors = Storage.get("doctors") || [];
          const doctorId = queueItem.doctorId || queueItem.doctor_id;
          const doctor = doctors.find(
            (d) =>
              (d._id && d._id.toString() === doctorId?.toString()) ||
              (d.id && d.id.toString() === doctorId?.toString())
          );
          if (doctor) {
            doctor.status = "busy";
            Storage.set("doctors", doctors);
          }

          Storage.set("queue", queue);
          this.refreshQueue();

          this.app.showNotification(
            `Pemeriksaan untuk ${queueItem.patientName} telah dimulai`,
            "success"
          );
        } catch (error) {
          this.app.showNotification(
            "Gagal memulai pemeriksaan: " + error.message,
            "error"
          );
        }
      },
      true
    );
  },

  completeExamination(queueId) {
    const queue = Storage.get("queue") || [];
    const queueItem = queue.find(
      (q) =>
        (q._id && q._id.toString() === queueId.toString()) ||
        (q.id && q.id.toString() === queueId.toString())
    );

    if (!queueItem) {
      this.app.showNotification("Item antrian tidak ditemukan", "error");
      return;
    }

    // Show completion form
    this.showCompletionForm(queueItem);
  },

  showCompletionForm(queueItem) {
    const modalContent = `
            <form id="completionForm">
                <div class="form-group">
                    <label class="form-label">Diagnosis</label>
                    <textarea class="form-textarea" id="diagnosis" placeholder="Masukkan diagnosis..." required></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Resep/Obat</label>
                    <textarea class="form-textarea" id="prescription" placeholder="Masukkan resep obat..."></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Catatan Tambahan</label>
                    <textarea class="form-textarea" id="notes" placeholder="Catatan tambahan..."></textarea>
                </div>
            </form>
        `;

    // Create custom modal
    const modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";
    modalOverlay.style.display = "flex";
    modalOverlay.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>Selesaikan Pemeriksaan - ${queueItem.patientName}</h3>
                    <button class="modal-close" id="customModalClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${modalContent}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-success" id="completeBtn">
                        <i class="fas fa-check"></i>
                        Selesaikan
                    </button>
                    <button class="btn btn-secondary" id="cancelBtn">Batal</button>
                </div>
            </div>
        `;

    document.body.appendChild(modalOverlay);

    // Event listeners for custom modal
    const closeModal = () => {
      document.body.removeChild(modalOverlay);
    };

    modalOverlay
      .querySelector("#customModalClose")
      .addEventListener("click", closeModal);
    modalOverlay
      .querySelector("#cancelBtn")
      .addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    modalOverlay.querySelector("#completeBtn").addEventListener("click", () => {
      const diagnosis = document.getElementById("diagnosis").value.trim();
      const prescription = document.getElementById("prescription").value.trim();
      const notes = document.getElementById("notes").value.trim();

      if (!diagnosis) {
        this.app.showNotification("Diagnosis harus diisi", "error");
        return;
      }

      this.finalizeExamination(queueItem, { diagnosis, prescription, notes });
      closeModal();
    });
  },

  async finalizeExamination(queueItem, completionData) {
    try {
      const queue = Storage.get("queue") || [];
      const queueId = queueItem._id || queueItem.id;

      // Update via API
      const token = this.app.currentUser.token;
      const updateData = {
        status: "completed",
        completionTime: new Date().toISOString(),
        diagnosis: completionData.diagnosis,
        prescription: completionData.prescription,
        notes: completionData.notes,
      };

      await updateQueue(queueId, updateData, token);

      // Update local storage
      queueItem.status = "completed";
      queueItem.completionTime = new Date().toISOString();
      queueItem.diagnosis = completionData.diagnosis;
      queueItem.prescription = completionData.prescription;
      queueItem.notes = completionData.notes;

      // Update doctor status back to available
      const doctors = Storage.get("doctors") || [];
      const doctorId = queueItem.doctorId || queueItem.doctor_id;
      const doctor = doctors.find(
        (d) =>
          (d._id && d._id.toString() === doctorId?.toString()) ||
          (d.id && d.id.toString() === doctorId?.toString())
      );
      if (doctor) {
        doctor.status = "available";
        Storage.set("doctors", doctors);
      }

      Storage.set("queue", queue);
      this.refreshQueue();

      this.app.showNotification(
        `Pemeriksaan untuk ${queueItem.patientName} telah selesai`,
        "success"
      );
    } catch (error) {
      this.app.showNotification(
        "Gagal menyelesaikan pemeriksaan: " + error.message,
        "error"
      );
    }
  },

  viewDetails(queueId) {
    const queue = Storage.get("queue") || [];
    const queueItem = queue.find(
      (q) =>
        (q._id && q._id.toString() === queueId.toString()) ||
        (q.id && q.id.toString() === queueId.toString())
    );

    if (!queueItem) {
      this.app.showNotification("Detail tidak ditemukan", "error");
      return;
    }

    // Create custom modal for detailed HTML content
    const modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";
    modalOverlay.style.display = "flex";
    modalOverlay.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>Detail Pemeriksaan</h3>
                    <button class="modal-close" id="detailModalClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="patient-info">
                        <div class="info-item">
                            <div class="info-label">Pasien</div>
                            <div class="info-value">${
                              queueItem.patientName
                            }</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Dokter</div>
                            <div class="info-value">Dr. ${
                              queueItem.doctorName
                            } - ${queueItem.doctorSpecialty}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Waktu Antrian</div>
                            <div class="info-value">${new Date(
                              queueItem.timestamp
                            ).toLocaleString("id-ID")}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Prioritas</div>
                            <div class="info-value">
                                <span class="status-badge ${this.getPriorityClass(
                                  queueItem.priority
                                )}">
                                    ${this.getPriorityLabel(queueItem.priority)}
                                </span>
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Status</div>
                            <div class="info-value">
                                <span class="status-badge status-${
                                  queueItem.status
                                }">
                                    ${this.getStatusLabel(queueItem.status)}
                                </span>
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Keluhan</div>
                            <div class="info-value">${queueItem.complaint}</div>
                        </div>
                        ${
                          queueItem.examinationStartTime
                            ? `
                            <div class="info-item">
                                <div class="info-label">Waktu Mulai Pemeriksaan</div>
                                <div class="info-value">${new Date(
                                  queueItem.examinationStartTime
                                ).toLocaleString("id-ID")}</div>
                            </div>
                        `
                            : ""
                        }
                        ${
                          queueItem.diagnosis
                            ? `
                            <div class="info-item">
                                <div class="info-label">Diagnosis</div>
                                <div class="info-value">${queueItem.diagnosis}</div>
                            </div>
                        `
                            : ""
                        }
                        ${
                          queueItem.prescription
                            ? `
                            <div class="info-item">
                                <div class="info-label">Resep</div>
                                <div class="info-value">${queueItem.prescription}</div>
                            </div>
                        `
                            : ""
                        }
                        ${
                          queueItem.notes
                            ? `
                            <div class="info-item">
                                <div class="info-label">Catatan</div>
                                <div class="info-value">${queueItem.notes}</div>
                            </div>
                        `
                            : ""
                        }
                        ${
                          queueItem.completionTime
                            ? `
                            <div class="info-item">
                                <div class="info-label">Waktu Selesai</div>
                                <div class="info-value">${new Date(
                                  queueItem.completionTime
                                ).toLocaleString("id-ID")}</div>
                            </div>
                        `
                            : ""
                        }
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="detailCloseBtn">
                        <i class="fas fa-times"></i>
                        Tutup
                    </button>
                    ${
                      queueItem.status === "completed"
                        ? ""
                        : `
                        <button class="btn btn-primary" onclick="hospitalApp.router.navigate('patient-record', { patientId: '${
                          queueItem.patientId || queueItem.patient_id
                        }' })">
                            <i class="fas fa-user"></i>
                            Lihat Rekam Medis
                        </button>
                    `
                    }
                </div>
            </div>
        `;

    document.body.appendChild(modalOverlay);

    // Event listeners for custom modal
    const closeModal = () => {
      document.body.removeChild(modalOverlay);
    };

    modalOverlay
      .querySelector("#detailModalClose")
      .addEventListener("click", closeModal);
    modalOverlay
      .querySelector("#detailCloseBtn")
      .addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  },

  destroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    if (window.queueComponent === this) {
      delete window.queueComponent;
    }
  },
};
