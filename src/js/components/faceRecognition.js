// Face Recognition Component
import { Camera } from '../utils/camera.js';
import { Storage } from '../utils/storage.js';

export const FaceRecognitionComponent = {
    render() {
        return `
            <div class="fade-in">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <i class="fas fa-camera"></i>
                            Face Recognition
                        </h2>
                        <p style="margin: 0; color: #64748b;">
                            Identifikasi pasien menggunakan teknologi pengenalan wajah
                        </p>
                    </div>

                    <div id="cameraSection">
                        <div class="camera-container">
                            <div class="camera-placeholder" id="cameraPlaceholder">
                                <i class="fas fa-camera"></i>
                                <p>Klik tombol untuk mulai kamera</p>
                            </div>
                            <video id="cameraPreview" class="camera-preview" style="display: none;" autoplay muted></video>
                            <canvas id="captureCanvas" style="display: none;"></canvas>
                            <button id="captureBtn" class="capture-btn" style="display: none;">
                                <i class="fas fa-camera"></i>
                            </button>
                        </div>

                        <div style="text-align: center; margin-top: 1rem;">
                            <button id="startCameraBtn" class="btn btn-primary">
                                <i class="fas fa-video"></i>
                                Mulai Kamera
                            </button>
                            <button id="stopCameraBtn" class="btn btn-secondary" style="display: none;">
                                <i class="fas fa-video-slash"></i>
                                Berhenti
                            </button>
                        </div>
                    </div>

                    <div id="capturedSection" style="display: none;">
                        <h3>Hasil Capture</h3>
                        <img id="capturedImage" class="captured-image" alt="Captured Image">
                        
                        <div id="recognitionResult" class="recognition-result pending">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Memproses pengenalan wajah...</p>
                        </div>

                        <div style="text-align: center; margin-top: 1rem;">
                            <button id="retakeBtn" class="btn btn-secondary">
                                <i class="fas fa-redo"></i>
                                Ambil Ulang
                            </button>
                        </div>
                    </div>

                    <div id="verificationSection" style="display: none;">
                        <div class="recognition-result success">
                            <i class="fas fa-check-circle"></i>
                            <p>Pasien berhasil diidentifikasi!</p>
                        </div>
                        
                        <div class="patient-info">
                            <div class="info-item">
                                <div class="info-label">Nama Pasien</div>
                                <div class="info-value" id="recognizedName">-</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">NIK</div>
                                <div class="info-value" id="recognizedNik">-</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Tanggal Lahir</div>
                                <div class="info-value" id="recognizedBirth">-</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">Confidence Score</div>
                                <div class="info-value" id="confidenceScore">-</div>
                            </div>
                        </div>

                        <div style="text-align: center; margin-top: 2rem;">
                            <h4>Apakah identifikasi ini benar?</h4>
                            <div style="margin-top: 1rem;">
                                <button id="confirmCorrect" class="btn btn-success" style="margin-right: 1rem;">
                                    <i class="fas fa-check"></i>
                                    Benar
                                </button>
                                <button id="confirmIncorrect" class="btn btn-danger">
                                    <i class="fas fa-times"></i>
                                    Salah
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    init(app) {
        this.app = app;
        this.currentStream = null;
        this.recognizedPatient = null;
        
        this.setupEventListeners();
    },

    setupEventListeners() {
        const startCameraBtn = document.getElementById('startCameraBtn');
        const stopCameraBtn = document.getElementById('stopCameraBtn');
        const captureBtn = document.getElementById('captureBtn');
        const retakeBtn = document.getElementById('retakeBtn');
        const confirmCorrect = document.getElementById('confirmCorrect');
        const confirmIncorrect = document.getElementById('confirmIncorrect');

        startCameraBtn.addEventListener('click', () => this.startCamera());
        stopCameraBtn.addEventListener('click', () => this.stopCamera());
        captureBtn.addEventListener('click', () => this.captureImage());
        retakeBtn.addEventListener('click', () => this.retakePhoto());
        confirmCorrect.addEventListener('click', () => this.confirmIdentification(true));
        confirmIncorrect.addEventListener('click', () => this.confirmIdentification(false));
    },

    async startCamera() {
        try {
            this.currentStream = await Camera.start('cameraPreview');
            
            document.getElementById('cameraPlaceholder').style.display = 'none';
            document.getElementById('cameraPreview').style.display = 'block';
            document.getElementById('captureBtn').style.display = 'block';
            document.getElementById('startCameraBtn').style.display = 'none';
            document.getElementById('stopCameraBtn').style.display = 'inline-flex';
            
        } catch (error) {
            this.app.showNotification('Gagal mengakses kamera: ' + error.message, 'error');
        }
    },

    stopCamera() {
        if (this.currentStream) {
            Camera.stop(this.currentStream);
            this.currentStream = null;
        }
        
        document.getElementById('cameraPlaceholder').style.display = 'flex';
        document.getElementById('cameraPreview').style.display = 'none';
        document.getElementById('captureBtn').style.display = 'none';
        document.getElementById('startCameraBtn').style.display = 'inline-flex';
        document.getElementById('stopCameraBtn').style.display = 'none';
    },

    captureImage() {
        const video = document.getElementById('cameraPreview');
        const canvas = document.getElementById('captureCanvas');
        const capturedImage = document.getElementById('capturedImage');
        
        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to image
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        capturedImage.src = imageDataUrl;
        
        // Stop camera and show captured section
        this.stopCamera();
        document.getElementById('cameraSection').style.display = 'none';
        document.getElementById('capturedSection').style.display = 'block';
        
        // Start face recognition process
        this.processFaceRecognition(imageDataUrl);
    },

    processFaceRecognition(imageDataUrl) {
        // Simulate face recognition processing
        setTimeout(() => {
            const patients = Storage.get('patients') || [];
            
            if (patients.length === 0) {
                this.showNoMatch();
                return;
            }
            
            // Mock face recognition - randomly select a patient for demo
            const mockRecognition = Math.random() > 0.3; // 70% success rate
            
            if (mockRecognition) {
                const randomPatient = patients[Math.floor(Math.random() * patients.length)];
                const confidence = (85 + Math.random() * 10).toFixed(1); // 85-95% confidence
                
                this.showRecognitionResult(randomPatient, confidence);
            } else {
                this.showNoMatch();
            }
        }, 2000);
    },

    showRecognitionResult(patient, confidence) {
        this.recognizedPatient = patient;
        
        document.getElementById('recognizedName').textContent = patient.name;
        document.getElementById('recognizedNik').textContent = patient.nik;
        document.getElementById('recognizedBirth').textContent = new Date(patient.birthDate).toLocaleDateString('id-ID');
        document.getElementById('confidenceScore').textContent = confidence + '%';
        
        document.getElementById('capturedSection').style.display = 'none';
        document.getElementById('verificationSection').style.display = 'block';
    },

    showNoMatch() {
        const resultEl = document.getElementById('recognitionResult');
        resultEl.className = 'recognition-result';
        resultEl.style.background = '#fef2f2';
        resultEl.style.borderColor = '#f87171';
        resultEl.style.color = '#dc2626';
        resultEl.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <p>Wajah tidak dikenali dalam database</p>
            <small>Silakan daftarkan sebagai pasien baru</small>
        `;
        
        // Add button to go to add patient page
        setTimeout(() => {
            resultEl.innerHTML += `
                <div style="margin-top: 1rem;">
                    <button class="btn btn-primary" onclick="hospitalApp.router.navigate('add-patient')">
                        <i class="fas fa-user-plus"></i>
                        Daftarkan Pasien Baru
                    </button>
                </div>
            `;
        }, 1000);
    },

    confirmIdentification(isCorrect) {
        if (isCorrect && this.recognizedPatient) {
            // Store the recognized patient for use in patient record
            Storage.set('currentRecognizedPatient', this.recognizedPatient);
            
            // Navigate to patient record
            this.app.router.navigate('patient-record', { patientId: this.recognizedPatient.id });
        } else {
            // If incorrect, restart the process
            this.app.showNotification('Identifikasi dibatalkan. Silakan coba lagi.', 'info');
            this.retakePhoto();
        }
    },

    retakePhoto() {
        document.getElementById('capturedSection').style.display = 'none';
        document.getElementById('verificationSection').style.display = 'none';
        document.getElementById('cameraSection').style.display = 'block';
        
        // Reset recognition result
        const resultEl = document.getElementById('recognitionResult');
        resultEl.className = 'recognition-result pending';
        resultEl.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            <p>Memproses pengenalan wajah...</p>
        `;
    },

    destroy() {
        if (this.currentStream) {
            Camera.stop(this.currentStream);
        }
    }
};
