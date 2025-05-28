// Patient Record Component
const PatientRecordComponent = {
    render(patientId) {
        const patient = this.getPatient(patientId);
        
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
                            <div class="info-value">${new Date(patient.birthDate).toLocaleDateString('id-ID')}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Umur</div>
                            <div class="info-value">${this.calculateAge(patient.birthDate)} tahun</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Jenis Kelamin</div>
                            <div class="info-value">${patient.gender === 'M' ? 'Laki-laki' : 'Perempuan'}</div>
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
                            <div class="info-value">${patient.bloodType || '-'}</div>
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

    getPatient(patientId) {
        // First check if there's a currently recognized patient
        const recognizedPatient = Storage.get('currentRecognizedPatient');
        if (recognizedPatient) {
            Storage.remove('currentRecognizedPatient');
            return recognizedPatient;
        }

        // Otherwise, find by ID
        if (!patientId) return null;
        
        const patients = Storage.get('patients') || [];
        return patients.find(p => p.id === parseInt(patientId));
    },

    getMedicalHistory(patientId) {
        const queue = Storage.get('queue') || [];
        return queue
            .filter(q => q.patientId === patientId && q.status === 'completed')
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

        return history.map(visit => `
            <div class="history-item">
                <div class="history-date">
                    ${new Date(visit.timestamp).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
                <div class="history-doctor">
                    <i class="fas fa-user-md"></i>
                    Dr. ${visit.doctorName} - ${visit.doctorSpecialty}
                </div>
                <div class="history-complaint">
                    <strong>Keluhan:</strong> ${visit.complaint}
                    ${visit.diagnosis ? `<br><strong>Diagnosis:</strong> ${visit.diagnosis}` : ''}
                    ${visit.prescription ? `<br><strong>Resep:</strong> ${visit.prescription}` : ''}
                </div>
                ${visit.notes ? `
                    <div style="margin-top: 0.5rem; font-size: 0.875rem; color: #64748b;">
                        <strong>Catatan:</strong> ${visit.notes}
                    </div>
                ` : ''}
            </div>
        `).join('');
    },

    renderDoctorOptions() {
        const doctors = Storage.get('doctors') || [];
        return doctors
            .filter(doctor => doctor.status === 'available')
            .map(doctor => `
                <option value="${doctor.id}" data-name="${doctor.name}" data-specialty="${doctor.specialty}">
                    Dr. ${doctor.name} - ${doctor.specialty}
                </option>
            `).join('');
    },

    calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    },

    init(app, patientId) {
        this.app = app;
        this.patientId = patientId;
        this.patient = this.getPatient(patientId);
        
        if (!this.patient) return;
        
        this.setupEventListeners();
    },

    setupEventListeners() {
        const form = document.getElementById('newVisitForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNewVisit();
        });
    },

    handleNewVisit() {
        const doctorSelect = document.getElementById('doctorSelect');
        const complaintInput = document.getElementById('complaint');
        const prioritySelect = document.getElementById('priority');

        const doctorId = parseInt(doctorSelect.value);
        const selectedOption = doctorSelect.options[doctorSelect.selectedIndex];
        const doctorName = selectedOption.dataset.name;
        const doctorSpecialty = selectedOption.dataset.specialty;
        const complaint = complaintInput.value.trim();
        const priority = prioritySelect.value;

        if (!doctorId || !complaint) {
            this.app.showNotification('Harap isi semua field yang diperlukan', 'error');
            return;
        }

        // Create new queue entry
        const newQueueEntry = {
            id: Date.now(),
            patientId: this.patient.id,
            patientName: this.patient.name,
            doctorId: doctorId,
            doctorName: doctorName,
            doctorSpecialty: doctorSpecialty,
            complaint: complaint,
            priority: priority,
            status: 'waiting',
            timestamp: new Date().toISOString(),
            queueNumber: this.getNextQueueNumber(doctorId)
        };

        // Save to queue
        const queue = Storage.get('queue') || [];
        queue.push(newQueueEntry);
        Storage.set('queue', queue);

        // Show success message and redirect
        this.app.showModal(
            'Berhasil Ditambahkan',
            `Pasien ${this.patient.name} telah ditambahkan ke antrian Dr. ${doctorName}.\n\nNomor Antrian: ${newQueueEntry.queueNumber}`,
            () => {
                this.app.router.navigate('queue');
            }
        );

        // Reset form
        const form = document.getElementById('newVisitForm');
        if (form) {
            form.reset();
        }
    },

    getNextQueueNumber(doctorId) {
        const queue = Storage.get('queue') || [];
        const today = new Date().toDateString();
        
        const todayQueue = queue.filter(q => 
            q.doctorId === doctorId && 
            new Date(q.timestamp).toDateString() === today &&
            q.status !== 'completed'
        );
        
        return todayQueue.length + 1;
    }
};
