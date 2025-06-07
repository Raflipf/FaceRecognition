// Add Patient Component
import { Camera } from '../utils/camera.js';
import { Storage } from '../utils/storage.js';

export const AddPatientComponent = {
    render() {
        return `
            <div class="fade-in">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <i class="fas fa-user-plus"></i>
                            Tambah Pasien Baru
                        </h2>
                        <button class="btn btn-secondary" onclick="hospitalApp.router.navigate('dashboard')">
                            <i class="fas fa-arrow-left"></i>
                            Kembali
                        </button>
                    </div>

                    <form id="addPatientForm">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                            <div>
                                <h3 style="margin-bottom: 1rem; color: #1e293b;">
                                    <i class="fas fa-user"></i>
                                    Informasi Pribadi
                                </h3>
                                
                                <div class="form-group">
                                    <label class="form-label" for="fullName">Nama Lengkap *</label>
                                    <input 
                                        type="text" 
                                        id="fullName" 
                                        name="fullName" 
                                        class="form-input" 
                                        placeholder="Masukkan nama lengkap"
                                        required
                                    >
                                </div>

                                <div class="form-group">
                                    <label class="form-label" for="nik">NIK *</label>
                                    <input 
                                        type="text" 
                                        id="nik" 
                                        name="nik" 
                                        class="form-input" 
                                        placeholder="Nomor Induk Kependudukan (16 digit)"
                                        maxlength="16"
                                        pattern="[0-9]{16}"
                                        required
                                    >
                                </div>

                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                    <div class="form-group">
                                        <label class="form-label" for="birthDate">Tanggal Lahir *</label>
                                        <input 
                                            type="date" 
                                            id="birthDate" 
                                            name="birthDate" 
                                            class="form-input"
                                            required
                                        >
                                    </div>

                                    <div class="form-group">
                                        <label class="form-label" for="gender">Jenis Kelamin *</label>
                                        <select id="gender" name="gender" class="form-select" required>
                                            <option value="">-- Pilih --</option>
                                            <option value="M">Laki-laki</option>
                                            <option value="F">Perempuan</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label" for="bloodType">Golongan Darah</label>
                                    <select id="bloodType" name="bloodType" class="form-select">
                                        <option value="">-- Pilih Golongan Darah --</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="AB">AB</option>
                                        <option value="O">O</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <h3 style="margin-bottom: 1rem; color: #1e293b;">
                                    <i class="fas fa-address-card"></i>
                                    Informasi Kontak
                                </h3>

                                <div class="form-group">
                                    <label class="form-label" for="phone">No. Telepon *</label>
                                    <input 
                                        type="tel" 
                                        id="phone" 
                                        name="phone" 
                                        class="form-input" 
                                        placeholder="Contoh: 08123456789"
                                        pattern="[0-9]{10,13}"
                                        required
                                    >
                                </div>

                                <div class="form-group">
                                    <label class="form-label" for="email">Email</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        class="form-input" 
                                        placeholder="contoh@email.com"
                                    >
                                </div>

                                <div class="form-group">
                                    <label class="form-label" for="address">Alamat Lengkap *</label>
                                    <textarea 
                                        id="address" 
                                        name="address" 
                                        class="form-textarea" 
                                        placeholder="Masukkan alamat lengkap"
                                        required
                                    ></textarea>
                                </div>

                                <div class="form-group">
                                    <label class="form-label" for="emergencyContact">Kontak Darurat</label>
                                    <input 
                                        type="text" 
                                        id="emergencyContact" 
                                        name="emergencyContact" 
                                        class="form-input" 
                                        placeholder="Nama & No. Telepon kontak darurat"
                                    >
                                </div>
                            </div>
                        </div>

                        <div class="card" style="margin-top: 2rem;">
                            <div class="card-header">
                                <h3 class="card-title">
                                    <i class="fas fa-camera"></i>
                                    Foto untuk Face Recognition
                                </h3>
                            </div>

                            <div id="photoSection">
                                <div class="camera-container">
                                    <div class="camera-placeholder" id="photoPlaceholder">
                                        <i class="fas fa-camera"></i>
                                        <p>Klik untuk mengambil foto pasien</p>
                                    </div>
                                    <video id="photoCamera" class="camera-preview" style="display: none;" autoplay muted></video>
                                    <canvas id="photoCanvas" style="display: none;"></canvas>
                                    <img id="capturedPhoto" class="captured-image" style="display: none;" alt="Captured Photo">
                                    <button id="photoCapture" class="capture-btn" style="display: none;">
                                        <i class="fas fa-camera"></i>
                                    </button>
                                </div>

                                 <div class="photos-preview-section" style="margin-top: 1.5rem;">
                                    <h4 style="text-align: center; margin-bottom: 1rem; color: #4a5568;">
                                        <i class="fas fa-images"></i>
                                        Foto yang Diambil (<span id="photoCounter">0</span>/5)
                                    </h4>
                                    
                                    <div class="photos-grid" id="photoContainer">
                                        <div class="photo-slot" id="slot1">
                                            <span class="slot-number">1</span>
                                            <div class="slot-placeholder">
                                                <i class="fas fa-camera"></i>
                                            </div>
                                        </div>
                                        <div class="photo-slot" id="slot2">
                                            <span class="slot-number">2</span>
                                            <div class="slot-placeholder">
                                                <i class="fas fa-camera"></i>
                                            </div>
                                        </div>
                                        <div class="photo-slot" id="slot3">
                                            <span class="slot-number">3</span>
                                            <div class="slot-placeholder">
                                                <i class="fas fa-camera"></i>
                                            </div>
                                        </div>
                                        <div class="photo-slot" id="slot4">
                                            <span class="slot-number">4</span>
                                            <div class="slot-placeholder">
                                                <i class="fas fa-camera"></i>
                                            </div>
                                        </div>
                                        <div class="photo-slot" id="slot5">
                                            <span class="slot-number">5</span>
                                            <div class="slot-placeholder">
                                                <i class="fas fa-camera"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div style="text-align: center; margin-top: 1rem;">
                                    <button type="button" id="startPhotoBtn" class="btn btn-primary">
                                        <i class="fas fa-video"></i>
                                        Mulai Kamera
                                    </button>
                                    <button type="button" id="retakePhotoBtn" class="btn btn-secondary" style="display: none;">
                                        <i class="fas fa-redo"></i>
                                        Ambil Ulang
                                    </button>
                                    <button type="button" id="stopPhotoBtn" class="btn btn-secondary" style="display: none;">
                                        <i class="fas fa-video-slash"></i>
                                        Berhenti
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div style="text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e2e8f0;">
                            <button type="submit" class="btn btn-success" style="margin-right: 1rem;">
                                <i class="fas fa-save"></i>
                                Simpan Pasien
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="hospitalApp.router.navigate('dashboard')">
                                <i class="fas fa-times"></i>
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },


    init(app) {
        this.app = app;
        this.currentStream = null;
        this.capturedPhotoData = null;
        this.capturedPhotos = []; // Array untuk menyimpan 5 foto
        
        this.setupEventListeners();
        this.setupValidation();
    },

    setupEventListeners() {
        const form = document.getElementById('addPatientForm');
        const startPhotoBtn = document.getElementById('startPhotoBtn');
        const stopPhotoBtn = document.getElementById('stopPhotoBtn');
        const photoCaptureBtn = document.getElementById('photoCapture');
        const retakePhotoBtn = document.getElementById('retakePhotoBtn');

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Photo capture events
        startPhotoBtn.addEventListener('click', () => this.startPhotoCapture());
        stopPhotoBtn.addEventListener('click', () => this.stopPhotoCapture());
        photoCaptureBtn.addEventListener('click', () => this.capturePhoto());
        retakePhotoBtn.addEventListener('click', () => this.retakePhoto());
    },

    setupValidation() {
        const nikInput = document.getElementById('nik');
        const phoneInput = document.getElementById('phone');

        // NIK validation
        nikInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });

        // Phone validation
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    },

    async startPhotoCapture() {
        try {
            this.currentStream = await Camera.start('photoCamera');
            
            document.getElementById('photoPlaceholder').style.display = 'none';
            document.getElementById('photoCamera').style.display = 'block';
            document.getElementById('photoCapture').style.display = 'block';
            document.getElementById('startPhotoBtn').style.display = 'none';
            document.getElementById('stopPhotoBtn').style.display = 'inline-flex';
            
            this.updateCaptureButton();
            
        } catch (error) {
            this.app.showNotification('Gagal mengakses kamera: ' + error.message, 'error');
        }
    },

    stopPhotoCapture() {
        if (this.currentStream) {
            Camera.stop(this.currentStream);
            this.currentStream = null;
        }
        
        document.getElementById('photoPlaceholder').style.display = 'flex';
        document.getElementById('photoCamera').style.display = 'none';
        document.getElementById('photoCapture').style.display = 'none';
        document.getElementById('startPhotoBtn').style.display = 'inline-flex';
        document.getElementById('stopPhotoBtn').style.display = 'none';
    },

    capturePhoto() {
        const video = document.getElementById('photoCamera');
        const canvas = document.getElementById('photoCanvas');
        const capturedPhoto = document.getElementById('capturedPhoto');

        // Pastikan array foto ada
        if (!this.capturedPhotos) this.capturedPhotos = [];

        if (this.capturedPhotos.length >= 5) {
            this.app.showNotification('Sudah mengambil 5 foto!', 'info');
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const photoData = canvas.toDataURL('image/jpeg', 0.8);
        this.capturedPhotos.push(photoData);

        this.capturedPhotoData = photoData;

        capturedPhoto.src = photoData;
        capturedPhoto.style.display = 'block';

        this.updatePhotoPreview();
        this.updateCaptureButton();
        this.app.showNotification(`Foto ${this.capturedPhotos.length}/5 berhasil diambil`, 'success');

        if (this.capturedPhotos.length === 5) {
            this.stopPhotoCapture();
            this.app.showNotification('Selesai! Sudah mengambil 5 foto untuk face recognition', 'success');
        }

        document.getElementById('photoPlaceholder').style.display = 'none';
        document.getElementById('retakePhotoBtn').style.display = 'inline-flex';
    },

    updateCaptureButton() {
        const captureBtn = document.getElementById('photoCapture');
        const count = this.capturedPhotos ? this.capturedPhotos.length : 0;
        
        if (count >= 5) {
            captureBtn.textContent = 'Selesai (5/5)';
            captureBtn.disabled = true;
        } else {
            captureBtn.textContent = `Ambil Foto (${count}/5)`;
            captureBtn.disabled = false;
        }
    },

    updatePhotoPreview() {
        const photoContainer = document.getElementById('photoContainer');
        if (photoContainer) {
            photoContainer.innerHTML = '';
            this.capturedPhotos.forEach((photo, index) => {
                const img = document.createElement('img');
                img.src = photo;
                img.style.width = '80px';
                img.style.height = '80px';
                img.style.objectFit = 'cover';
                img.style.margin = '5px';
                img.style.border = '2px solid #007bff';
                img.style.borderRadius = '5px';
                img.title = `Foto ${index + 1}`;
                photoContainer.appendChild(img);
            });
        }
    },

    retakePhoto() {
        // Reset semua foto
        this.capturedPhotos = [];
        this.capturedPhotoData = null;
        
        // Reset UI
        document.getElementById('capturedPhoto').style.display = 'none';
        document.getElementById('photoPlaceholder').style.display = 'flex';
        document.getElementById('retakePhotoBtn').style.display = 'none';
        document.getElementById('startPhotoBtn').style.display = 'inline-flex';
        
        // Reset preview container
        const photoContainer = document.getElementById('photoContainer');
        if (photoContainer) {
            photoContainer.innerHTML = '';
        }
        
        // Reset tombol capture
        this.updateCaptureButton();
        
        this.app.showNotification('Semua foto dihapus. Silahkan ambil foto ulang.', 'info');
    },

    validateForm() {
        const form = document.getElementById('addPatientForm');
        const formData = new FormData(form);
        const errors = [];

        // Required fields validation
        const requiredFields = ['fullName', 'nik', 'birthDate', 'gender', 'phone', 'address'];
        requiredFields.forEach(field => {
            if (!formData.get(field) || !formData.get(field).trim()) {
                errors.push(`Field ${field} harus diisi`);
            }
        });

        // NIK validation
        const nik = formData.get('nik');
        if (nik && nik.length !== 16) {
            errors.push('NIK harus 16 digit');
        }

        // Phone validation
        const phone = formData.get('phone');
        if (phone && (phone.length < 10 || phone.length > 13)) {
            errors.push('Nomor telepon tidak valid');
        }

        // Check if NIK already exists
        const patients = Storage.get('patients') || [];
        if (patients.some(p => p.nik === nik)) {
            errors.push('NIK sudah terdaftar dalam sistem');
        }

        // Photo validation - pastikan ada 5 foto
        if (!this.capturedPhotos || this.capturedPhotos.length < 5) {
            errors.push('Diperlukan 5 foto wajah pasien untuk face recognition');
        }

        return errors;
    },

    handleSubmit() {
        const errors = this.validateForm();
        
        if (errors.length > 0) {
            this.app.showNotification('Error:\n' + errors.join('\n'), 'error');
            return;
        }

        this.app.showLoading();

        // Simulate saving delay
        setTimeout(() => {
            this.savePatient();
        }, 1000);
    },

    savePatient() {
        const form = document.getElementById('addPatientForm');
        const formData = new FormData(form);
        
        // Create patient object
        const newPatient = {
            id: Date.now(),
            name: formData.get('fullName').trim(),
            nik: formData.get('nik').trim(),
            birthDate: formData.get('birthDate'),
            gender: formData.get('gender'),
            bloodType: formData.get('bloodType') || null,
            phone: formData.get('phone').trim(),
            email: formData.get('email').trim() || null,
            address: formData.get('address').trim(),
            emergencyContact: formData.get('emergencyContact').trim() || null,
            photo: this.capturedPhotoData, // Foto terakhir untuk preview
            photos: this.capturedPhotos,   // Semua 5 foto untuk face recognition
            registrationDate: new Date().toISOString(),
            status: 'active'
        };

        // Save to storage
        const patients = Storage.get('patients') || [];
        patients.push(newPatient);
        Storage.set('patients', patients);

        this.app.hideLoading();

        // Show success message
        this.app.showModal(
            'Pasien Berhasil Ditambahkan',
            `Pasien ${newPatient.name} telah berhasil didaftarkan dalam sistem dengan 5 foto untuk face recognition.\n\nNIK: ${newPatient.nik}`,
            () => {
                this.app.router.navigate('dashboard');
            }
        );
    },

    destroy() {
        if (this.currentStream) {
            Camera.stop(this.currentStream);
        }
    }
};
