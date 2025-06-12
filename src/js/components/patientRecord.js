import { Storage } from "../utils/storage.js";

export const PatientRecordComponent = {
  async render(patientId) {
    const patient = await this.getPatient(patientId);

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
                            <p style="color: #64748b;">Data pasien dengan ID ${patientId} tidak dapat ditemukan dalam sistem.</p>
                            <button class="btn btn-primary" onclick="hospitalApp.router.navigate('dashboard')">
                                <i class="fas fa-arrow-left"></i>
                                Kembali ke Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            `;
    }

    const patientIdToUse = patient._id || patient.id;
    const medicalHistory = this.getMedicalHistory(patientIdToUse);

    return `
            <div class="fade-in">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <i class="fas fa-user"></i>
                            Rekam Medis Pasien
                        </h2>
                        <button class="btn btn-secondary" onclick="hospitalApp.router.navigate('patients')">
                            <i class="fas fa-arrow-left"></i>
                            Kembali ke Daftar Pasien
                        </button>
                    </div>

                    <div class="patient-info">
                        <div class="info-item">
                            <div class="info-label">ID Pasien</div>
                            <div class="info-value">${patientIdToUse}</div>
                        </div>
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
                            <div class="info-value">${this.formatGender(
                              patient.gender
                            )}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Alamat</div>
                            <div class="info-value">${
                              patient.address || "-"
                            }</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">No. Telepon</div>
                            <div class="info-value">${
                              patient.phone || "-"
                            }</div>
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
    console.log("PatientRecordComponent.getPatient called with ID:", patientId);

    const recognizedPatient = Storage.get("currentRecognizedPatient");
    if (recognizedPatient) {
      console.log("Found recognized patient:", recognizedPatient.name);
      Storage.remove("currentRecognizedPatient");
      return recognizedPatient;
    }

    const selectedPatient = Storage.get("selectedPatientForQueue");
    if (selectedPatient) {
      console.log("Found selected patient for queue:", selectedPatient.name);
      Storage.remove("selectedPatientForQueue");
      return selectedPatient;
    }

    if (!patientId) {
      console.log("No patientId provided");
      return null;
    }

    const patients = Storage.get("patients") || [];
    console.log("Searching in", patients.length, "patients for ID:", patientId);

    let patient = patients.find((p) => {
      const mongoId = p._id ? p._id.toString() : null;
      const localId = p.id ? p.id.toString() : null;
      const searchId = patientId.toString();

      return mongoId === searchId || localId === searchId;
    });

    if (patient) {
      console.log("Found patient in local storage:", patient.name);
      return patient;
    }

    try {
      console.log("Fetching patient from API with ID:", patientId);
      const token = this.app.currentUser.token;
      const api = await import("../../../js/utils/api.js");
      patient = await api.getPatientById(patientId, token);

      if (patient) {
        console.log("Fetched patient from API:", patient.name);
        patients.push(patient);
        Storage.set("patients", patients);
        return patient;
      }
    } catch (error) {
      console.error("Failed to fetch patient from API:", error);
    }

    console.log("Patient not found with ID:", patientId);
    return null;
  },

  getMedicalHistory(patientId) {
    console.log("Getting medical history for patient ID:", patientId);

    const queue = Storage.get("queue") || [];
    console.log("Total queue entries:", queue.length);

    const searchId = patientId ? patientId.toString() : null;

    const history = queue
      .filter((q) => {
        const queuePatientId = q.patient_id
          ? (q.patient_id._id || q.patient_id).toString()
          : q.patientId
          ? q.patientId.toString()
          : null;
        const isCompleted = q.status === "completed";
        const matchesPatient = queuePatientId === searchId;

        return matchesPatient && isCompleted;
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    console.log("Found", history.length, "medical history entries for patient");
    return history;
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
                    Dr. ${visit.doctorName || "Nama Dokter"} - ${
          visit.doctorSpecialty || "Spesialisasi"
        }
                </div>
                <div class="history-complaint">
                    <strong>Keluhan:</strong> ${visit.complaint || "-"}
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
    if (!birthDate) return 0;
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

  formatGender(gender) {
    if (!gender) return "-";
    const lowerGender = gender.toLowerCase();
    switch (lowerGender) {
      case "male":
        return "Laki-laki";
      case "female":
        return "Perempuan";
      case "other":
        return "Lainnya";
      default:
        return "-";
    }
  },

  async init(app, patientId) {
    console.log(
      "PatientRecordComponent.init called with patientId:",
      patientId
    );
    this.app = app;
    this.patientId = patientId;
    this.patient = await this.getPatient(patientId);

    if (!this.patient) {
      console.log("No patient found, component will show error state");
      return;
    }

    console.log("Patient loaded:", this.patient.name);
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

    const priorityMap = {
      normal: 1,
      urgent: 2,
      emergency: 3,
    };
    const priority = priorityMap[priorityStr] || 1;

    const doctorIdStr = doctorSelect.value;
    const doctor = this.app.doctors.find((d) => d._id === doctorIdStr);
    if (!doctor) {
      this.app.showNotification("Dokter tidak ditemukan", "error");
      return;
    }

    const patientId = this.patient._id || this.patient.id;

    try {
      this.app.showLoading();
      const token = this.app.currentUser.token;
      const api = await import("../../../js/utils/api.js");

      if (!window.queueComponent) {
        console.error("QueueComponent is not available globally.");
        this.app.showNotification(
          "Terjadi kesalahan: Komponen antrian tidak ditemukan.",
          "error"
        );
        return;
      }

      await window.queueComponent.loadQueues();
      const nextQueueNumber = window.queueComponent.getNextQueueNumber(
        doctor._id
      );

      const newQueueEntry = {
        patient_id: patientId,
        doctor_id: doctor._id,
        complaint: complaint,
        priority: priority,
        status: "waiting",
        queueNumber: nextQueueNumber,
        timestamp: new Date().toISOString(),
      };

      console.log("Queue data to send:", newQueueEntry);

      const addedQueue = await api.addQueue(newQueueEntry, token);

      this.app.showModal(
        "Berhasil Ditambahkan",
        `Pasien ${this.patient.name} telah ditambahkan ke antrian Dr. ${doctor.name}.\n\nNomor Antrian: ${addedQueue.queueNumber}`,
        () => {
          this.app.router.navigate("queue");
        }
      );

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
    } finally {
      this.app.hideLoading(); 
    }
  },

};
