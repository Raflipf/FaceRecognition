// Add Patient Component
const AddPatientComponent = {
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
        
        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to image data
        this.capturedPhotoData = canvas.toDataURL('image/jpeg', 0.8);
        capturedPhoto.src = this.capturedPhotoData;
        
        // Stop camera and show captured photo
        this.stopPhotoCapture();
        document.getElementById('photoPlaceholder').style.display = 'none';
        document.getElementById('capturedPhoto').style.display = 'block';
        document.getElementById('retakePhotoBtn').style.display = 'inline-flex';
    },

    retakePhoto() {
        this.capturedPhotoData = null;
        document.getElementById('capturedPhoto').style.display = 'none';
        document.getElementById('photoPlaceholder').style.display = 'flex';
        document.getElementById('retakePhotoBtn').style.display = 'none';
        document.getElementById('startPhotoBtn').style.display = 'inline-flex';
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

        // Photo validation
        if (!this.capturedPhotoData) {
            errors.push('Foto pasien diperlukan untuk face recognition');
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
            photo: this.capturedPhotoData,
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
            `Pasien ${newPatient.name} telah berhasil didaftarkan dalam sistem.\n\nNIK: ${newPatient.nik}`,
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
