// Add Patient Component with TensorFlow.js integration for 5 images embeddings
import * as tf from "@tensorflow/tfjs";

const AddPatientComponent = {
  model: null,
  embeddings: [],

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
                                    Foto untuk Face Recognition (5 gambar)
                                </h3>
                            </div>

                            <div id="photoSection">
                                <div class="camera-container" id="cameraContainer">
                                    <div class="camera-placeholder" id="photoPlaceholder">
                                        <i class="fas fa-camera"></i>
                                        <p>Klik tombol untuk mulai kamera</p>
                                    </div>
                                    <video id="photoCamera" class="camera-preview" style="display: none;" autoplay muted></video>
                                    <canvas id="photoCanvas" style="display: none;"></canvas>
                                    <div id="capturedPhotos" style="display: flex; gap: 10px; margin-top: 10px;"></div>
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

                    <div id="embeddingOutput" style="margin-top: 1rem; white-space: pre-wrap; background: #f0f0f0; padding: 10px; border-radius: 5px; display: none;"></div>
                </div>
            </div>
        `;
  },

  async init(app) {
    this.app = app;
    this.currentStream = null;
    this.capturedPhotosData = [];
    this.embeddings = [];
    this.model = null;

    await this.loadModel();
    this.setupEventListeners();
    this.setupValidation();
  },

  async loadModel() {
    try {
      this.model = await tf.loadGraphModel("model_web/model.json");
      console.log("Model loaded successfully in AddPatientComponent");
    } catch (error) {
      console.error("Failed to load model in AddPatientComponent:", error);
      this.app.showNotification(
        "Gagal memuat model pengenalan wajah.",
        "error"
      );
    }
  },

  setupEventListeners() {
    const form = document.getElementById("addPatientForm");
    const startPhotoBtn = document.getElementById("startPhotoBtn");
    const stopPhotoBtn = document.getElementById("stopPhotoBtn");
    const photoCaptureBtn = document.getElementById("photoCapture");
    const retakePhotoBtn = document.getElementById("retakePhotoBtn");
    const cameraContainer = document.getElementById("cameraContainer");
    const capturedPhotosDiv = document.getElementById("capturedPhotos");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    startPhotoBtn.addEventListener("click", () => this.startPhotoCapture());
    stopPhotoBtn.addEventListener("click", () => this.stopPhotoCapture());
    photoCaptureBtn.addEventListener("click", () => this.capturePhoto());
    retakePhotoBtn.addEventListener("click", () => this.retakePhotos());

    // Show capture button only when camera is started
    cameraContainer.addEventListener("mouseenter", () => {
      if (this.currentStream) {
        photoCaptureBtn.style.display = "inline-block";
      }
    });
    cameraContainer.addEventListener("mouseleave", () => {
      photoCaptureBtn.style.display = "none";
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
    if (this.capturedPhotosData.length >= 5) {
      this.app.showNotification("Anda sudah mengambil 5 foto.", "info");
      return;
    }

    const video = document.getElementById("photoCamera");
    const canvas = document.getElementById("photoCanvas");
    const capturedPhotosDiv = document.getElementById("capturedPhotos");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);
    this.capturedPhotosData.push(imageDataUrl);

    // Show captured photo thumbnails
    const img = document.createElement("img");
    img.src = imageDataUrl;
    img.className = "captured-image";
    img.style.width = "100px";
    img.style.height = "auto";
    img.style.marginRight = "10px";
    capturedPhotosDiv.appendChild(img);

    if (this.capturedPhotosData.length === 5) {
      this.stopPhotoCapture();
      document.getElementById("retakePhotoBtn").style.display = "inline-flex";
      document.getElementById("photoCapture").style.display = "none";
    }
  },

  retakePhotos() {
    this.capturedPhotosData = [];
    this.embeddings = [];
    const capturedPhotosDiv = document.getElementById("capturedPhotos");
    capturedPhotosDiv.innerHTML = "";
    document.getElementById("retakePhotoBtn").style.display = "none";
    this.startPhotoCapture();
  },

  async runInferenceOnImage(imageDataUrl) {
    if (!this.model) {
      throw new Error("Model belum dimuat");
    }

    // Create image element
    const img = new Image();
    img.src = imageDataUrl;

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    // Create tensor from image
    let tensor = tf.browser.fromPixels(img);
    tensor = tf.image.resizeBilinear(tensor, [160, 160]);
    tensor = tensor.expandDims(0);
    tensor = tensor.toFloat().div(tf.scalar(255));

    // Run inference
    const prediction = await this.model.executeAsync(tensor);

    // Dispose tensor
    tf.dispose(tensor);

    let embeddingArray;
    if (Array.isArray(prediction)) {
      embeddingArray = await Promise.all(prediction.map((t) => t.array()));
      prediction.forEach((t) => tf.dispose(t));
      embeddingArray = embeddingArray.flat(Infinity);
    } else {
      embeddingArray = await prediction.array();
      tf.dispose(prediction);
      embeddingArray = Array.isArray(embeddingArray[0])
        ? embeddingArray.flat(Infinity)
        : embeddingArray;
    }

    return embeddingArray;
  },

  async handleSubmit() {
    const errors = this.validateForm();

    if (errors.length > 0) {
      this.app.showNotification("Error:\n" + errors.join("\n"), "error");
      return;
    }

    if (this.capturedPhotosData.length !== 5) {
      this.app.showNotification(
        "Harap ambil 5 foto pasien untuk face recognition.",
        "error"
      );
      return;
    }

    this.app.showLoading();

    try {
      const allEmbeddings = [];
      for (const imageDataUrl of this.capturedPhotosData) {
        const embedding = await this.runInferenceOnImage(imageDataUrl);
        allEmbeddings.push(...embedding); // Flatten all embeddings into one array
      }

      this.embeddings = allEmbeddings;

      // Save patient data with embeddings
      await this.savePatient();

      const embeddingOutput = document.getElementById("embeddingOutput");
      embeddingOutput.style.display = "block";
      embeddingOutput.style.whiteSpace = "pre-wrap";
      embeddingOutput.style.backgroundColor = "#f0f0f0";
      embeddingOutput.style.padding = "10px";
      embeddingOutput.style.borderRadius = "5px";
      embeddingOutput.style.maxHeight = "300px";
      embeddingOutput.style.overflowY = "auto";
      embeddingOutput.textContent = `Embeddings generated: ${
        this.embeddings.length
      } numbers\n\nFirst 10 values: ${this.embeddings
        .slice(0, 10)
        .join(", ")}...`;
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      this.app.showNotification(
        "Gagal menjalankan inferensi model: " + error.message,
        "error"
      );
    } finally {
      this.app.hideLoading();
    }
  },

  async savePatient() {
    const form = document.getElementById("addPatientForm");
    const formData = new FormData(form);

    const newPatient = {
      name: formData.get("fullName").trim(),
      nik: formData.get("nik").trim(),
      birthDate: formData.get("birthDate"),
      gender: formData.get("gender"),
      bloodType: formData.get("bloodType") || null,
      phone: formData.get("phone").trim(),
      email: formData.get("email").trim() || null,
      address: formData.get("address").trim(),
      emergencyContact: formData.get("emergencyContact").trim() || null,
      photos: this.capturedPhotosData,
      embeddings: this.embeddings,
      registrationDate: new Date().toISOString(),
      status: "active",
    };

    try {
      const token = this.app.currentUser.token;
      const api = await import("../js/utils/api.js");
      const savedPatient = await api.addPatient(newPatient, token);

      this.app.showModal(
        "Pasien Berhasil Ditambahkan",
        `Pasien ${savedPatient.name} telah berhasil didaftarkan dalam sistem.\n\nNIK: ${savedPatient.nik}`,
        () => {
          this.app.router.navigate("dashboard");
        }
      );
    } catch (error) {
      console.error("Error saving patient:", error);
      this.app.showNotification(
        "Gagal menambahkan pasien: " + error.message,
        "error"
      );
    }
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
        errors.push(`Field ${field} harus diisi`);
      }
    });

    const nik = formData.get("nik");
    if (nik && nik.length !== 16) {
      errors.push("NIK harus 16 digit");
    }

    const phone = formData.get("phone");
    if (phone && (phone.length < 10 || phone.length > 13)) {
      errors.push("Nomor telepon tidak valid");
    }

    if (this.capturedPhotosData.length !== 5) {
      errors.push("Harap ambil 5 foto pasien untuk face recognition");
    }

    return errors;
  },

  destroy() {
    if (this.currentStream) {
      Camera.stop(this.currentStream);
    }
  },
};

export default AddPatientComponent;
