import {
  getUsers,
  getPatients,
  getDoctors,
  getQueues,
} from "../../../js/utils/api.js";

export const DashboardComponent = {
  users: [],
  patients: [],
  doctors: [],
  queues: [],

  async fetchData(token) {
    try {
      this.users = await getUsers(token);
      this.patients = await getPatients(token);
      this.doctors = await getDoctors(token);
      const queues = await getQueues(token);
      this.queues = await this.processQueueData(queues);
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
      this.users = [];
      this.patients = [];
      this.doctors = [];
      this.queues = [];
    }
  },

  render() {
    const stats = this.getStats();

    return `
        <div class="fade-in">
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">
                        <i class="fas fa-tachometer-alt"></i>
                        Dashboard
                    </h2>
                    <p style="margin: 0; color: #64748b;">
                        Selamat datang di Sistem Manajemen Pasien Rumah Sakit
                    </p>
                </div>

                <div class="queue-stats">
                    <div class="stat-card">
                        <div class="stat-number">${stats.totalPatients}</div>
                        <div class="stat-label">Total Pasien</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.queueToday}</div>
                        <div class="stat-label">Antrian Hari Ini</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.activeDoctors}</div>
                        <div class="stat-label">Dokter Aktif</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.completedToday}</div>
                        <div class="stat-label">Selesai Hari Ini</div>
                    </div>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-clock"></i>
                            Antrian Terbaru
                        </h3>
                    </div>
                    <div id="recentQueue">
                        ${this.renderRecentQueue()}
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-user-md"></i>
                            Status Dokter
                        </h3>
                    </div>
                    <div id="doctorStatus">
                        ${this.renderDoctorStatus()}
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">
                        <i class="fas fa-bolt"></i>
                        Aksi Cepat
                    </h3>
                </div>
                <div class="quick-actions">
                    <a href="#face-recognition" class="action-card" data-route="face-recognition">
                        <i class="fas fa-camera"></i>
                        <h3>Face Recognition</h3>
                        <p>Identifikasi pasien dengan wajah</p>
                    </a>
                    <a href="#add-patient" class="action-card" data-route="add-patient">
                        <i class="fas fa-user-plus"></i>
                        <h3>Tambah Pasien</h3>
                        <p>Daftarkan pasien baru</p>
                    </a>
                    <a href="#queue" class="action-card" data-route="queue">
                        <i class="fas fa-list-ol"></i>
                        <h3>Kelola Antrian</h3>
                        <p>Lihat dan kelola antrian</p>
                    </a>
                </div>
            </div>
        </div>
    `;
  },

  getStats() {
    const today = new Date().toDateString();
    const queueToday = this.queues.filter(
      (q) => new Date(q.timestamp).toDateString() === today
    );
    const completedToday = queueToday.filter((q) => q.status === "completed");

    return {
      totalPatients: this.patients.length,
      queueToday: queueToday.length,
      activeDoctors: this.doctors.filter((d) => d.status === "available")
        .length,
      completedToday: completedToday.length,
    };
  },

  async processQueueData(queues) {
    return queues.map((queue) => {
      const patient =
        queue.patient_id && typeof queue.patient_id === "object"
          ? queue.patient_id
          : this.patients.find(
              (p) =>
                (p._id || p.id)?.toString() === queue.patient_id?.toString()
            );

      const doctor =
        queue.doctor_id && typeof queue.doctor_id === "object"
          ? queue.doctor_id
          : this.doctors.find(
              (d) => (d._id || d.id)?.toString() === queue.doctor_id?.toString()
            );

      return {
        ...queue,
        id: queue._id || queue.id,
        patientId: queue.patient_id?._id || queue.patient_id,
        doctorId: queue.doctor_id?._id || queue.doctor_id,
        patientName: patient ? patient.name : "Pasien Tidak Dikenal",
        doctorName: doctor ? doctor.name : "Dokter Tidak Dikenal",
        doctorSpecialty: doctor
          ? doctor.specialty
          : "Spesialisasi Tidak Dikenal",
      };
    });
  },

  renderRecentQueue() {
    const recentQueue = this.queues
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);

    if (recentQueue.length === 0) {
      return '<p style="color: #64748b; text-align: center; padding: 2rem;">Belum ada antrian hari ini</p>';
    }

    return recentQueue
      .map(
        (item) => `
      <div class="history-item" style="margin-bottom: 1rem;">
          <div class="history-date">${new Date(item.timestamp).toLocaleString(
            "id-ID"
          )}</div>
          <div class="history-doctor">${
            item.patientName || "Pasien Tidak Dikenal"
          }</div>
          <div class="history-complaint">
              Dr. ${item.doctorName || "Dokter Tidak Dikenal"} - 
              <span class="status-badge status-${
                item.status === "waiting"
                  ? "waiting"
                  : item.status === "examining"
                  ? "examining"
                  : "completed"
              }">
                  ${
                    item.status === "waiting"
                      ? "Menunggu"
                      : item.status === "examining"
                      ? "Diperiksa"
                      : "Selesai"
                  }
              </span>
          </div>
      </div>
  `
      )
      .join("");
  },

  renderDoctorStatus() {
    return this.doctors
      .map((doctor) => {
        const doctorId = doctor._id || doctor.id;
        const doctorQueue = this.queues.filter(
          (q) =>
            (q.doctorId === doctorId || q.doctor_id === doctorId) &&
            q.status !== "completed"
        );
        const currentPatient = this.queues.find(
          (q) =>
            (q.doctorId === doctorId || q.doctor_id === doctorId) &&
            q.status === "examining"
        );

        return `
            <div class="info-item" style="margin-bottom: 1rem; padding: 1rem; background: #f8fafc; border-radius: 0.5rem;">
                <div class="info-label">Dr. ${doctor.name}</div>
                <div class="info-value">${doctor.specialty}</div>
                <div style="margin-top: 0.5rem;">
                    <span class="status-badge ${
                      doctor.status === "available"
                        ? "status-waiting"
                        : "status-examining"
                    }">
                        ${doctor.status === "available" ? "Tersedia" : "Sibuk"}
                    </span>
                    <small style="margin-left: 0.5rem; color: #64748b;">
                        ${doctorQueue.length} antrian
                    </small>
                </div>
                ${
                  currentPatient
                    ? `
                    <div style="margin-top: 0.5rem; font-size: 0.875rem; color: #3b82f6;">
                        Memeriksa: ${
                          currentPatient.patientName || "Pasien Tidak Dikenal"
                        }
                    </div>
                `
                    : ""
                }
            </div>
        `;
      })
      .join("");
  },

  async init(app) {
    this.app = app;
    const token = this.app.currentUser.token;
    await this.fetchData(token);
  },

  destroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },
};
