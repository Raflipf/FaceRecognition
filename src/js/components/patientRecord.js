// Patient Record Component
import { Storage } from "../utils/storage.js";

export const PatientRecordComponent = {
  async render(patientId) {
    const patient = this.patient || (await this.getPatient(patientId));

    if (!patient) {
      return `
                <div class="fade-in">
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title">
                                <i class="fas fa-user"></i>
                                Rekam Medis Pasien
                            </h2>
                        </div>
                        <div style="text-align: center; padding: 2rem;">
                            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #f59e0b; margin-bottom: 1rem;"></i>
                            <h3>Pasien tidak ditemukan</h3>
                            <p style="color: #64748b;">Data pasien tidak dapat ditemukan dalam sistem.</p>
                            <button class="btn btn-primary" onclick="hospitalApp.router.navigate('dashboard')">
                                <i class="fas fa-arrow-left"></i>
                                Kembali ke Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            `;
    }

    const medicalHistory = this.getMedicalHistory(patient.id);

    return `
            <div class="fade-in">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <i class="fas fa-user"></i>
                            Rekam Medis Pasien
                        </h2>
                        <button class="btn btn-secondary" onclick="hospitalApp.router.navigate('dashboard')">
                            <i class="fas fa-arrow-left"></i>
                            Kembali
                        </button>
                    </div>

                    <div class="patient-info">
                        <div class="info-item">
                            <div class="info-label">Nama Lengkap</div>
                            <div class="info-value">${patient.name}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">NIK</div>
                            <div class="info-value">${patient.nik}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Tanggal Lahir</div>
                            <div class="info-value">${new Date(
                              patient.birthDate
                            ).toLocaleDateString("id-ID")}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Umur</div>
                            <div class="info-value">${this.calculateAge(
                              patient.birthDate
                            )} tahun</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Jenis Kelamin</div>
                            <div class="info-value">${
                              patient.gender === "M" ? "Laki-laki" : "Perempuan"
                            }</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Alamat</div>
                            <div class="info-value">${patient.address}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">No. Telepon</div>
                            <div class="info-value">${patient.phone}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Golongan Darah</div>
                            <div class="info-value">${
                              patient.bloodType || "-"
                            }</div>
                        </div>
                    </div>

                    <div class="medical-history">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h3>
                                <i class="fas fa-history"></i>
                                Riwayat Kunjungan
                            </h3>
                            <span style="color: #64748b; font-size: 0.875rem;">
                                ${medicalHistory.length} kunjungan
                            </span>
                        </div>
                        
                        <div id="medicalHistoryList">
                            ${this.renderMedicalHistory(medicalHistory)}
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-plus-circle"></i>
                            Tambah Kunjungan Baru
                        </h3>
                    </div>
                    
                    <form id="newVisitForm">
                        <div class="form-group">
                            <label class="form-label" for="doctorSelect">Pilih Dokter</label>
                            <select id="doctorSelect" class="form-select" required>
                                <option value="">-- Pilih Dokter --</option>
                                ${this.renderDoctorOptions()}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="complaint">Keluhan</label>
                            <textarea 
                                id="complaint" 
                                class="form-textarea" 
                                placeholder="Masukkan keluhan pasien..."
                                required
                            ></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="priority">Prioritas</label>
                            <select id="priority" class="form-select" required>
                                <option value="normal">Normal</option>
                                <option value="urgent">Mendesak</option>
                                <option value="emergency">Darurat</option>
                            </select>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-plus"></i>
                            Tambah ke Antrian
                        </button>
                    </form>
                </div>
            </div>
        `;
  },

  async getPatient(patientId) {
    // First check if there's a currently recognized patient
    const recognizedPatient = Storage.get("currentRecognizedPatient");
    if (recognizedPatient) {
      Storage.remove("currentRecognizedPatient");
      return recognizedPatient;
    }

    // Otherwise, find by ID with type-coerced comparison as string
    if (!patientId) return null;

    const patients = Storage.get("patients") || [];
    let patient = patients.find((p) => String(p.id) === String(patientId)); // compare as strings

    if (!patient) {
      // Fallback: fetch patient from API
      try {
        const token = this.app.currentUser.token;
        const api = await import("../../../js/utils/api.js");
        patient = await api.getPatientById(patientId, token);
        if (patient) {
          // Update Storage with fetched patient
          patients.push(patient);
          Storage.set("patients", patients);
        }
      } catch (error) {
        console.error("Failed to fetch patient from API:", error);
      }
    }

    return patient;
  },

  getMedicalHistory(patientId) {
    const queue = Storage.get("queue") || [];
    return queue
      .filter((q) => q.patientId === patientId && q.status === "completed")
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  renderMedicalHistory(history) {
    if (history.length === 0) {
      return `
                <div style="text-align: center; padding: 2rem; color: #64748b;">
                    <i class="fas fa-clipboard" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>Belum ada riwayat kunjungan</p>
                </div>
            `;
    }

    return history
      .map(
        (visit) => `
            <div class="history-item">
                <div class="history-date">
                    ${new Date(visit.timestamp).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </div>
                <div class="history-doctor">
                    <i class="fas fa-user-md"></i>
                    Dr. ${visit.doctorName} - ${visit.doctorSpecialty}
                </div>
                <div class="history-complaint">
                    <strong>Keluhan:</strong> ${visit.complaint}
                    ${
                      visit.diagnosis
                        ? `<br><strong>Diagnosis:</strong> ${visit.diagnosis}`
                        : ""
                    }
                    ${
                      visit.prescription
                        ? `<br><strong>Resep:</strong> ${visit.prescription}`
                        : ""
                    }
                </div>
                ${
                  visit.notes
                    ? `
                    <div style="margin-top: 0.5rem; font-size: 0.875rem; color: #64748b;">
                        <strong>Catatan:</strong> ${visit.notes}
                    </div>
                `
                    : ""
                }
            </div>
        `
      )
      .join("");
  },

  renderDoctorOptions() {
    if (!this.app || !this.app.doctors) {
      return "";
    }
    const doctors = this.app.doctors;
    return doctors
      .filter((doctor) => doctor.status === "available")
      .map(
        (doctor) => `
                <option value="${doctor._id}" data-name="${doctor.name}" data-specialty="${doctor.specialty}">
                    Dr. ${doctor.name} - ${doctor.specialty}
                </option>
            `
      )
      .join("");
  },

  calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  },

  async init(app, patientId) {
    this.app = app;
    this.patientId = patientId;
    this.patient = await this.getPatient(patientId);

    if (!this.patient) return;

    await this.loadDoctors();

    this.setupEventListeners();
  },

  async loadDoctors() {
    try {
      const token = this.app.currentUser.token;
      const api = await import("../../../js/utils/api.js");
      this.app.doctors = await api.getDoctors(token);
    } catch (error) {
      this.app.showNotification(
        "Gagal mengambil data dokter: " + error.message,
        "error"
      );
      this.app.doctors = [];
    }
  },

  setupEventListeners() {
    const form = document.getElementById("newVisitForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleNewVisit();
    });
  },

  async handleNewVisit() {
    const doctorSelect = document.getElementById("doctorSelect");
    const complaintInput = document.getElementById("complaint");
    const prioritySelect = document.getElementById("priority");

    const complaint = complaintInput.value.trim();
    const priorityStr = prioritySelect.value;

    if (!complaint) {
      this.app.showNotification(
        "Harap isi semua field yang diperlukan",
        "error"
      );
      return;
    }

    // Map priority string to integer as per API example
    const priorityMap = {
      normal: 1,
      urgent: 2,
      emergency: 3,
    };
    const priority = priorityMap[priorityStr] || 1;

    // Find doctor object by selected doctor id string
    const doctorIdStr = doctorSelect.value;
    const doctor = this.app.doctors.find((d) => d._id === doctorIdStr);
    if (!doctor) {
      this.app.showNotification("Dokter tidak ditemukan", "error");
      return;
    }

    // Create new queue entry with valid _id fields
    const newQueueEntry = {
      patient_id: this.patient._id || this.patient.id, // use _id if available
      doctor_id: doctor._id,
      complaint: complaint,
      priority: priority,
      status: "waiting",
      queueNumber: this.getNextQueueNumber(doctor._id), // keep capitalization as in example
      examinationStartTime: null,
      completionTime: null,
      diagnosis: "",
      prescription: "",
      notes: "",
    };

    console.log("Queue data to send:", newQueueEntry);

    try {
      const token = this.app.currentUser.token;
      const api = await import("../../../js/utils/api.js");
      const addedQueue = await api.addQueue(newQueueEntry, token);

      this.app.showModal(
        "Berhasil Ditambahkan",
        `Pasien ${this.patient.name} telah ditambahkan ke antrian Dr. ${doctor.name}.\n\nNomor Antrian: ${addedQueue.queueNumber}`,
        () => {
          this.app.router.navigate("queue");
        }
      );

      // Reset form
      const form = document.getElementById("newVisitForm");
      if (form) {
        form.reset();
      }
    } catch (error) {
      console.error("Error adding queue:", error);
      if (error.response) {
        error.response.json().then((data) => {
          this.app.showNotification(
            "Gagal menambahkan antrian: " + (data.message || error.message),
            "error"
          );
        });
      } else {
        this.app.showNotification(
          "Gagal menambahkan antrian: " + error.message,
          "error"
        );
      }
    }
  },

  getNextQueueNumber(doctorId) {
    const queue = Storage.get("queue") || [];
    const today = new Date().toDateString();

    const todayQueue = queue.filter(
      (q) =>
        q.doctorId === doctorId &&
        new Date(q.timestamp).toDateString() === today &&
        q.status !== "completed"
    );

    return todayQueue.length + 1;
  },
};
