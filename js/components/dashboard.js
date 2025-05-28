// Dashboard Component
const DashboardComponent = {
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
        const patients = Storage.get('patients') || [];
        const queue = Storage.get('queue') || [];
        const doctors = Storage.get('doctors') || [];
        
        const today = new Date().toDateString();
        const queueToday = queue.filter(q => new Date(q.timestamp).toDateString() === today);
        const completedToday = queueToday.filter(q => q.status === 'completed');

        return {
            totalPatients: patients.length,
            queueToday: queueToday.length,
            activeDoctors: doctors.filter(d => d.status === 'available').length,
            completedToday: completedToday.length
        };
    },

    renderRecentQueue() {
        const queue = Storage.get('queue') || [];
        const recentQueue = queue
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5);

        if (recentQueue.length === 0) {
            return '<p style="color: #64748b; text-align: center; padding: 2rem;">Belum ada antrian hari ini</p>';
        }

        return recentQueue.map(item => `
            <div class="history-item" style="margin-bottom: 1rem;">
                <div class="history-date">${new Date(item.timestamp).toLocaleString('id-ID')}</div>
                <div class="history-doctor">${item.patientName}</div>
                <div class="history-complaint">
                    Dr. ${item.doctorName} - 
                    <span class="status-badge status-${item.status === 'waiting' ? 'waiting' : item.status === 'examining' ? 'examining' : 'completed'}">
                        ${item.status === 'waiting' ? 'Menunggu' : item.status === 'examining' ? 'Diperiksa' : 'Selesai'}
                    </span>
                </div>
            </div>
        `).join('');
    },

    renderDoctorStatus() {
        const doctors = Storage.get('doctors') || [];
        const queue = Storage.get('queue') || [];

        return doctors.map(doctor => {
            const doctorQueue = queue.filter(q => q.doctorId === doctor.id && q.status !== 'completed');
            const currentPatient = queue.find(q => q.doctorId === doctor.id && q.status === 'examining');
            
            return `
                <div class="info-item" style="margin-bottom: 1rem; padding: 1rem; background: #f8fafc; border-radius: 0.5rem;">
                    <div class="info-label">Dr. ${doctor.name}</div>
                    <div class="info-value">${doctor.specialty}</div>
                    <div style="margin-top: 0.5rem;">
                        <span class="status-badge ${doctor.status === 'available' ? 'status-waiting' : 'status-examining'}">
                            ${doctor.status === 'available' ? 'Tersedia' : 'Sibuk'}
                        </span>
                        <small style="margin-left: 0.5rem; color: #64748b;">
                            ${doctorQueue.length} antrian
                        </small>
                    </div>
                    ${currentPatient ? `
                        <div style="margin-top: 0.5rem; font-size: 0.875rem; color: #3b82f6;">
                            Memeriksa: ${currentPatient.patientName}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    },

    init(app) {
        // Auto-refresh dashboard every 30 seconds
        this.refreshInterval = setInterval(() => {
            const recentQueueEl = document.getElementById('recentQueue');
            const doctorStatusEl = document.getElementById('doctorStatus');
            
            if (recentQueueEl) {
                recentQueueEl.innerHTML = this.renderRecentQueue();
            }
            if (doctorStatusEl) {
                doctorStatusEl.innerHTML = this.renderDoctorStatus();
            }
        }, 30000);
    },

    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
};
