// Add Patient Component - Fixed Version
import { Camera } from "../utils/camera.js";
import { Storage } from "../utils/storage.js";
import { addPatient } from "../../../js/utils/api.js";

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
                                            <option value="male">Laki-laki</option>
                                            <option value="female">Perempuan</option>
                                            <option value="other">Lainnya</option>
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
                                    <button type="button" id="photoCapture" class="capture-btn" style="display: none;">
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
    this.capturedPhotos = [];

    this.setupEventListeners();
    this.setupValidation();
  },

  setupEventListeners() {
    const form = document.getElementById("addPatientForm");
    const startPhotoBtn = document.getElementById("startPhotoBtn");
    const stopPhotoBtn = document.getElementById("stopPhotoBtn");
    const photoCaptureBtn = document.getElementById("photoCapture");
    const retakePhotoBtn = document.getElementById("retakePhotoBtn");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    startPhotoBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.startPhotoCapture();
    });

    stopPhotoBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.stopPhotoCapture();
    });

    photoCaptureBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.capturePhoto();
    });

    retakePhotoBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.retakePhoto();
    });
  },

  setupValidation() {
    const nikInput = document.getElementById("nik");
    const phoneInput = document.getElementById("phone");

    nikInput.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "");
    });

    phoneInput.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "");
    });
  },

  async startPhotoCapture() {
    try {
      this.currentStream = await Camera.start("photoCamera");

      document.getElementById("photoPlaceholder").style.display = "none";
      document.getElementById("photoCamera").style.display = "block";
      document.getElementById("photoCapture").style.display = "block";
      document.getElementById("startPhotoBtn").style.display = "none";
      document.getElementById("stopPhotoBtn").style.display = "inline-flex";

      this.updateCaptureButton();
    } catch (error) {
      this.app.showNotification(
        "Gagal mengakses kamera: " + error.message,
        "error"
      );
    }
  },

  stopPhotoCapture() {
    if (this.currentStream) {
      Camera.stop(this.currentStream);
      this.currentStream = null;
    }

    document.getElementById("photoPlaceholder").style.display = "flex";
    document.getElementById("photoCamera").style.display = "none";
    document.getElementById("photoCapture").style.display = "none";
    document.getElementById("startPhotoBtn").style.display = "inline-flex";
    document.getElementById("stopPhotoBtn").style.display = "none";
  },

  capturePhoto() {
    const video = document.getElementById("photoCamera");
    const canvas = document.getElementById("photoCanvas");
    const capturedPhoto = document.getElementById("capturedPhoto");

    if (!this.capturedPhotos) this.capturedPhotos = [];

    if (this.capturedPhotos.length >= 5) {
      this.app.showNotification("Sudah mengambil 5 foto!", "info");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photoData = canvas.toDataURL("image/jpeg", 0.8);
    this.capturedPhotos.push(photoData);

    this.capturedPhotoData = photoData;

    capturedPhoto.src = photoData;
    capturedPhoto.style.display = "block";

    this.updatePhotoPreview();
    this.updateCaptureButton();
    this.updatePhotoCounter();
    this.app.showNotification(
      `Foto ${this.capturedPhotos.length}/5 berhasil diambil`,
      "success"
    );

    if (this.capturedPhotos.length === 5) {
      this.stopPhotoCapture();
      this.app.showNotification(
        "Selesai! Sudah mengambil 5 foto untuk face recognition",
        "success"
      );
    }

    document.getElementById("photoPlaceholder").style.display = "none";
    document.getElementById("retakePhotoBtn").style.display = "inline-flex";
  },

  updateCaptureButton() {
    const captureBtn = document.getElementById("photoCapture");
    const count = this.capturedPhotos ? this.capturedPhotos.length : 0;

    if (count >= 5) {
      captureBtn.innerHTML = '<i class="fas fa-check"></i> Selesai (5/5)';
      captureBtn.disabled = true;
    } else {
      captureBtn.innerHTML = `<i class="fas fa-camera"></i> Ambil Foto (${count}/5)`;
      captureBtn.disabled = false;
    }
  },

  updatePhotoCounter() {
    const counter = document.getElementById("photoCounter");
    if (counter) {
      counter.textContent = this.capturedPhotos.length;
    }
  },

  updatePhotoPreview() {
    const photoContainer = document.getElementById("photoContainer");
    if (photoContainer) {
      photoContainer.innerHTML = "";

      for (let i = 0; i < 5; i++) {
        const slot = document.createElement("div");
        slot.className = "photo-slot";
        slot.id = `slot${i + 1}`;

        const slotNumber = document.createElement("span");
        slotNumber.className = "slot-number";
        slotNumber.textContent = i + 1;

        if (this.capturedPhotos[i]) {
          const img = document.createElement("img");
          img.src = this.capturedPhotos[i];
          img.style.width = "100%";
          img.style.height = "100%";
          img.style.objectFit = "cover";
          img.style.borderRadius = "8px";
          img.title = `Foto ${i + 1}`;

          slot.appendChild(slotNumber);
          slot.appendChild(img);
        } else {
          const placeholder = document.createElement("div");
          placeholder.className = "slot-placeholder";
          placeholder.innerHTML = '<i class="fas fa-camera"></i>';

          slot.appendChild(slotNumber);
          slot.appendChild(placeholder);
        }

        photoContainer.appendChild(slot);
      }
    }
  },

  retakePhoto() {
    this.capturedPhotos = [];
    this.capturedPhotoData = null;

    document.getElementById("capturedPhoto").style.display = "none";
    document.getElementById("photoPlaceholder").style.display = "flex";
    document.getElementById("retakePhotoBtn").style.display = "none";
    document.getElementById("startPhotoBtn").style.display = "inline-flex";

    this.updatePhotoPreview();
    this.updatePhotoCounter();

    this.updateCaptureButton();

    this.app.showNotification(
      "Semua foto dihapus. Silahkan ambil foto ulang.",
      "info"
    );
  },

  validateForm() {
    const form = document.getElementById("addPatientForm");
    const formData = new FormData(form);
    const errors = [];

    const requiredFields = [
      "fullName",
      "nik",
      "birthDate",
      "gender",
      "phone",
      "address",
    ];
    requiredFields.forEach((field) => {
      if (!formData.get(field) || !formData.get(field).trim()) {
        const fieldLabels = {
          fullName: "Nama Lengkap",
          nik: "NIK",
          birthDate: "Tanggal Lahir",
          gender: "Jenis Kelamin",
          phone: "No. Telepon",
          address: "Alamat",
        };
        errors.push(`${fieldLabels[field]} harus diisi`);
      }
    });

    const nik = formData.get("nik");
    if (nik && nik.length !== 16) {
      errors.push("NIK harus 16 digit");
    }

    const phone = formData.get("phone");
    if (phone && (phone.length < 10 || phone.length > 13)) {
      errors.push("Nomor telepon tidak valid (10-13 digit)");
    }
    return errors;
  },

  async handleSubmit() {
    const errors = this.validateForm();

    if (errors.length > 0) {
      this.app.showNotification("Error:\n" + errors.join("\n"), "error");
      return;
    }

    this.app.showLoading("Menyimpan data pasien...");

    try {
      await this.savePatientToBackend();
    } catch (error) {
      this.app.hideLoading();
      this.app.showNotification(
        "Gagal menyimpan pasien: " + error.message,
        "error"
      );
    }
  },

  getAuthToken() {
    let token = Storage.get("token");

    if (token) {
      return token;
    }

    if (this.app && this.app.currentUser && this.app.currentUser.token) {
      return this.app.currentUser.token;
    }

    const userData = Storage.get("currentUser");
    if (userData && userData.token) {
      return userData.token;
    }

    try {
      const sessionToken = sessionStorage.getItem("token");
      if (sessionToken) {
        return sessionToken;
      }
    } catch (e) {
      console.warn("Session storage not available");
    }

    return null;
  },

  async savePatientToBackend() {
    const form = document.getElementById("addPatientForm");
    const formData = new FormData(form);

    const token = this.getAuthToken();

    if (!token) {
      throw new Error("Token tidak ditemukan. Silakan login ulang.");
    }

    const patientData = {
      name: formData.get("fullName").trim(),
      nik: formData.get("nik").trim(),
      birthDate: formData.get("birthDate"),
      gender: formData.get("gender"),
      bloodType: formData.get("bloodType") || undefined,
      phone: formData.get("phone").trim(),
      email: formData.get("email").trim() || undefined,
      address: formData.get("address").trim(),
      emergencyContact: formData.get("emergencyContact").trim() || undefined,
      photos: this.capturedPhotos,
      embeddings: [],
      status: "active",
    };

    Object.keys(patientData).forEach((key) => {
      if (patientData[key] === undefined) {
        delete patientData[key];
      }
    });

    try {
      const response = await addPatient(patientData, token);

      this.app.hideLoading();

      this.app.showModal(
        "Pasien Berhasil Ditambahkan",
        `Pasien ${patientData.name} telah berhasil didaftarkan dalam sistem dengan 5 foto untuk face recognition.\n\nNIK: ${patientData.nik}`,
        () => {
          this.app.router.navigate("dashboard");
        }
      );

      this.savePatientToLocalStorage(patientData, response);
    } catch (error) {
      console.error("Backend error:", error);

      try {
        this.savePatientToLocalStorage(patientData);
        this.app.hideLoading();

        this.app.showModal(
          "Pasien Disimpan Lokal",
          `Pasien ${patientData.name} berhasil disimpan secara lokal.\n\nCatatan: Data akan disinkronisasi ketika koneksi ke server pulih.\n\nNIK: ${patientData.nik}`,
          () => {
            this.app.router.navigate("dashboard");
          }
        );
      } catch (localError) {
        throw new Error(
          "Gagal menyimpan ke server dan local storage: " + localError.message
        );
      }
    }
  },

  savePatientToLocalStorage(patientData, backendResponse = null) {
    const localPatient = {
      id: backendResponse?.data?.id || Date.now(),
      ...patientData,
      photo: this.capturedPhotoData,
      registrationDate: new Date().toISOString(),
      synced: backendResponse ? true : false,
    };

    const patients = Storage.get("patients") || [];
    patients.push(localPatient);
    Storage.set("patients", patients);

    return localPatient;
  },

  destroy() {
    if (this.currentStream) {
      Camera.stop(this.currentStream);
    }
  },
};
