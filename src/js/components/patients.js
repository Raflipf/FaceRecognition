export const PatientsComponent = {
  render() {
    return `
            <div class="fade-in">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <i class="fas fa-users"></i>
                            Daftar Pasien
                        </h2>
                        <div style="display: flex; gap: 1rem;">
                            <button class="btn btn-primary" id="refreshPatients">
                                <i class="fas fa-sync-alt"></i>
                                Refresh
                            </button>
                            <button class="btn btn-success" onclick="hospitalApp.router.navigate('add-patient')">
                                <i class="fas fa-user-plus"></i>
                                Tambah Pasien
                            </button>
                        </div>
                    </div>

                    <div class="search-filter-section">
                        <div class="form-group mb-0">
                            <label class="form-label" for="searchPatients">Cari Pasien</label>
                            <input 
                                type="text" 
                                id="searchPatients" 
                                class="form-input" 
                                placeholder="Cari berdasarkan nama, NIK, atau telepon..."
                            >
                        </div>
                        <div class="form-group mb-0">
                            <label class="form-label" for="genderFilter">Filter Jenis Kelamin</label>
                            <select id="genderFilter" class="form-select">
                                <option value="">Semua</option>
                                <option value="male">Laki-laki</option>
                                <option value="female">Perempuan</option>
                            </select>
                        </div>
                        <div class="form-group mb-0">
                            <label class="form-label" for="bloodTypeFilter">Filter Golongan Darah</label>
                            <select id="bloodTypeFilter" class="form-select">
                                <option value="">Semua</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="AB">AB</option>
                                <option value="O">O</option>
                            </select>
                        </div>
                        <div class="form-group mb-0">
                            <label class="form-label" for="statusFilter">Filter Status</label>
                            <select id="statusFilter" class="form-select">
                                <option value="">Semua</option>
                                <option value="active">Aktif</option>
                                <option value="inactive">Tidak Aktif</option>
                            </select>
                        </div>
                    </div>

                    <div class="queue-stats">
                        <div class="stat-card">
                            <div class="stat-number" id="totalPatients">0</div>
                            <div class="stat-label">Total Pasien</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number" id="activePatients">0</div>
                            <div class="stat-label">Pasien Aktif</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number" id="malePatients">0</div>
                            <div class="stat-label">Laki-laki</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number" id="femalePatients">0</div>
                            <div class="stat-label">Perempuan</div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3>
                            <span id="filteredCount">0</span> pasien ditemukan
                        </h3>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-secondary" id="cardViewBtn">
                                <i class="fas fa-th-large"></i>
                                Card View
                            </button>
                            <button class="btn btn-primary" id="tableViewBtn">
                                <i class="fas fa-table"></i>
                                Table View
                            </button>
                        </div>
                    </div>

                    <div id="tableView" style="overflow-x: auto;">
                        <table class="patients-table">
                            <thead>
                                <tr>
                                    <th>Foto</th>
                                    <th>Nama Lengkap</th>
                                    <th>NIK</th>
                                    <th>Umur</th>
                                    <th>Jenis Kelamin</th>
                                    <th>Golongan Darah</th>
                                    <th>No. Telepon</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="patientsTableBody">
                                </tbody>
                        </table>
                    </div>

                    <div id="cardView" style="display: none;">
                        <div id="patientsCardContainer">
                            </div>
                    </div>
                </div>
            </div>
        `;
  },

  init(app) {
    this.app = app;
    this.currentView = "table";
    this.allPatients = [];
    this.filteredPatients = [];

    this.setupEventListeners();
    this.loadPatients();
    this.updateStatistics();
  },

  setupEventListeners() {
    const searchInput = document.getElementById("searchPatients");
    const genderFilter = document.getElementById("genderFilter");
    const bloodTypeFilter = document.getElementById("bloodTypeFilter");
    const statusFilter = document.getElementById("statusFilter");
    const refreshBtn = document.getElementById("refreshPatients");
    const cardViewBtn = document.getElementById("cardViewBtn");
    const tableViewBtn = document.getElementById("tableViewBtn");

    if (searchInput) {
      searchInput.addEventListener("input", () => this.filterPatients());
    }

    [genderFilter, bloodTypeFilter, statusFilter].forEach((element) => {
      if (element) {
        element.addEventListener("change", () => this.filterPatients());
      }
    });

    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => this.refreshData());
    }

    if (cardViewBtn) {
      cardViewBtn.addEventListener("click", () => this.switchView("card"));
    }
    if (tableViewBtn) {
      tableViewBtn.addEventListener("click", () => this.switchView("table"));
    }
  },

  async loadPatients() {
    this.app.showLoading();
    try {
      const token = this.app.currentUser.token;
      const patients = await import("../utils/api.js").then((api) =>
        api.getPatients(token)
      );
      this.allPatients = patients;
      this.filteredPatients = [...patients];
      this.app.storage.set("patients", patients);
      this.renderPatients();
      this.updateStatistics();
    } catch (error) {
      this.app.showNotification(
        "Gagal mengambil data pasien: " + error.message,
        "error"
      );
    } finally {
      this.app.hideLoading();
    }
  },

  async deletePatient(patientId) {
    try {
      const token = this.app.currentUser.token;
      const api = await import("../utils/api.js");

      const confirmed = confirm(
        "Apakah Anda yakin ingin menghapus pasien ini?"
      );
      if (!confirmed) return;

      await api.deletePatient(patientId, token);

      this.app.showNotification("Pasien berhasil dihapus", "success");
      this.refreshData();
    } catch (error) {
      console.error("Gagal menghapus pasien:", error);
      this.app.showNotification(
        "Gagal menghapus pasien: " + error.message,
        "error"
      );
    }
  },

  filterPatients() {
    console.log("--- Memulai proses filter pasien ---");
    const genderFilterElement = document.getElementById("genderFilter");
    const genderFilterValue = genderFilterElement
      ? genderFilterElement.value
      : "";
    console.log(
      `Nilai filter jenis kelamin yang dipilih: '${genderFilterValue}'`
    );

    if (!this.allPatients || this.allPatients.length === 0) {
      console.warn(
        "Daftar semua pasien (this.allPatients) kosong. Tidak dapat memfilter."
      );
    } else {
      console.log(`Memfilter dari total ${this.allPatients.length} pasien.`);
      console.log(
        "Contoh data gender dari beberapa pasien pertama:",
        this.allPatients.slice(0, 5).map((p) => p.gender)
      );
    }

    const searchTerm =
      document.getElementById("searchPatients")?.value.toLowerCase() || "";
    const genderFilter = document.getElementById("genderFilter")?.value || "";
    const bloodTypeFilter =
      document.getElementById("bloodTypeFilter")?.value || "";
    const statusFilter = document.getElementById("statusFilter")?.value || "";

    this.filteredPatients = this.allPatients.filter((patient) => {
      const matchesSearch =
        !searchTerm ||
        (patient.name && patient.name.toLowerCase().includes(searchTerm)) ||
        (patient.nik && patient.nik.includes(searchTerm)) ||
        (patient.phone && patient.phone.includes(searchTerm));

      const patientGender = patient.gender
        ? patient.gender.toLowerCase()
        : undefined;
      const filterGender = genderFilter
        ? genderFilter.toLowerCase()
        : undefined;

      const matchesGender = !filterGender || patientGender === filterGender;

      const matchesBloodType =
        !bloodTypeFilter || patient.bloodType === bloodTypeFilter;
      const matchesStatus = !statusFilter || patient.status === statusFilter;

      return (
        matchesSearch && matchesGender && matchesBloodType && matchesStatus
      );
    });

    console.log(
      `--- Proses filter selesai. Ditemukan ${this.filteredPatients.length} pasien. ---`
    );

    this.renderPatients();
    this.updateFilteredCount();
  },

  renderPatients() {
    if (this.currentView === "table") {
      this.renderTableView();
    } else {
      this.renderCardView();
    }
  },

  renderTableView() {
    const tbody = document.getElementById("patientsTableBody");
    if (!tbody) return;

    if (this.filteredPatients.length === 0) {
      tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 2rem; color: #64748b;">
                        <i class="fas fa-users" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5; display: block;"></i>
                        Tidak ada pasien ditemukan
                    </td>
                </tr>
            `;
      return;
    }

    tbody.innerHTML = this.filteredPatients
      .map((patient) => {
        const patientId = patient._id || patient.id;
        return `
            <tr>
                <td>
                    <div class="patient-avatar" style="width: 40px; height: 40px; font-size: 1rem;">
                        ${
                          patient.photo
                            ? `<img src="${patient.photo}" class="patient-photo" alt="${patient.name}">`
                            : patient.name.charAt(0).toUpperCase()
                        }
                    </div>
                </td>
                <td>
                    <strong>${patient.name}</strong>
                </td>
                <td>${patient.nik}</td>
                <td>${this.calculateAge(patient.birthDate)} tahun</td>
                <td>${this.formatGender(patient.gender)}</td>
                <td>${patient.bloodType || "-"}</td>
                <td>${patient.phone}</td>
                <td>
                    <span class="status-badge status-${
                      patient.status || "active"
                    }">
                        ${
                          patient.status === "inactive"
                            ? "Tidak Aktif"
                            : "Aktif"
                        }
                    </span>
                </td>
                <td>
                    <div style="display: flex; gap: 0.25rem; flex-wrap: wrap;">
                        <button class="btn btn-primary" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;"
                                onclick="patientsComponent.viewPatientDetail('${patientId}')">
                            <i class="fas fa-eye"></i>
                            Detail
                        </button>
                        <button class="btn btn-success" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;"
                                onclick="patientsComponent.addToQueue('${patientId}')">
                            <i class="fas fa-plus"></i>
                            Antri
                        </button>
                         <button class="btn btn-danger" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;"
                                onclick="patientsComponent.deletePatient('${patientId}')">
                            <i class="fas fa-trash"></i>
                            Hapus
                        </button>
                    </div>
                </td>
            </tr>
        `;
      })
      .join("");
  },

  renderCardView() {
    const container = document.getElementById("patientsCardContainer");
    if (!container) return;

    if (this.filteredPatients.length === 0) {
      container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #64748b;">
                    <i class="fas fa-users" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <h3>Tidak ada pasien ditemukan</h3>
                    <p>Coba ubah filter pencarian atau tambah pasien baru</p>
                </div>
            `;
      return;
    }

    container.innerHTML = this.filteredPatients
      .map((patient) => {
        const patientId = patient._id || patient.id;
        return `
            <div class="patient-card">
                <div class="patient-header">
                    <div class="patient-avatar">
                        ${
                          patient.photo
                            ? `<img src="${patient.photo}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" alt="${patient.name}">`
                            : patient.name.charAt(0).toUpperCase()
                        }
                    </div>
                    <div style="flex: 1;">
                        <h3 style="margin: 0; color: #1e293b;">${
                          patient.name
                        }</h3>
                        <p style="margin: 0; color: #64748b;">NIK: ${
                          patient.nik
                        }</p>
                        <span class="status-badge status-${
                          patient.status || "active"
                        }" style="margin-top: 0.5rem; display: inline-block;">
                            ${
                              patient.status === "inactive"
                                ? "Tidak Aktif"
                                : "Aktif"
                            }
                        </span>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <button class="btn btn-primary" style="font-size: 0.875rem; padding: 0.5rem 1rem;"
                                onclick="patientsComponent.viewPatientDetail('${patientId}')">
                            <i class="fas fa-eye"></i>
                            Detail
                        </button>
                        <button class="btn btn-success" style="font-size: 0.875rem; padding: 0.5rem 1rem;"
                                onclick="patientsComponent.addToQueue('${patientId}')">
                            <i class="fas fa-plus"></i>
                            Tambah Antrian
                        </button>
                    </div>
                </div>

                <div class="patient-info">
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
                        <div class="info-label">Golongan Darah</div>
                        <div class="info-value">${
                          patient.bloodType || "-"
                        }</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">No. Telepon</div>
                        <div class="info-value">${patient.phone}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Alamat</div>
                        <div class="info-value">${patient.address}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Terdaftar</div>
                        <div class="info-value">${new Date(
                          patient.registrationDate
                        ).toLocaleDateString("id-ID")}</div>
                    </div>
                </div>
            </div>
        `;
      })
      .join("");
  },

  switchView(viewType) {
    this.currentView = viewType;
    const tableView = document.getElementById("tableView");
    const cardView = document.getElementById("cardView");
    const tableBtn = document.getElementById("tableViewBtn");
    const cardBtn = document.getElementById("cardViewBtn");

    if (viewType === "table") {
      tableView.style.display = "block";
      cardView.style.display = "none";
      tableBtn.classList.add("btn-primary");
      tableBtn.classList.remove("btn-secondary");
      cardBtn.classList.add("btn-secondary");
      cardBtn.classList.remove("btn-primary");
    } else {
      tableView.style.display = "none";
      cardView.style.display = "block";
      cardBtn.classList.add("btn-primary");
      cardBtn.classList.remove("btn-secondary");
      tableBtn.classList.add("btn-secondary");
      tableBtn.classList.remove("btn-primary");
    }

    this.renderPatients();
  },

  updateStatistics() {
    const patients = this.allPatients || [];
    const totalPatients = patients.length;
    const activePatients = patients.filter(
      (p) => p.status !== "inactive"
    ).length;
    const malePatients = patients.filter(
      (p) => p.gender && p.gender.toLowerCase() === "male"
    ).length;
    const femalePatients = patients.filter(
      (p) => p.gender && p.gender.toLowerCase() === "female"
    ).length;

    document.getElementById("totalPatients").textContent = totalPatients;
    document.getElementById("activePatients").textContent = activePatients;
    document.getElementById("malePatients").textContent = malePatients;
    document.getElementById("femalePatients").textContent = femalePatients;
  },

  updateFilteredCount() {
    const countElement = document.getElementById("filteredCount");
    if (countElement) {
      countElement.textContent = this.filteredPatients.length;
    }
  },

  calculateAge(birthDate) {
    if (!birthDate) return "-";
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

  viewPatientDetail(patientId) {
    console.log("Navigating to patient detail with ID:", patientId);
    this.app.router.navigate("patient-record", {
      patientId: String(patientId),
    });
  },

  addToQueue(patientId) {
    console.log("Adding patient to queue with ID:", patientId);
    const patient = this.allPatients.find((p) => (p._id || p.id) === patientId);
    if (patient) {
      this.app.storage.set("selectedPatientForQueue", patient);
      this.app.router.navigate("patient-record", {
        patientId: String(patientId),
      });
    } else {
      console.error("Patient not found with ID:", patientId);
      this.app.showNotification("Pasien tidak ditemukan", "error");
    }
  },

  refreshData() {
    this.loadPatients();
    this.updateStatistics();
    this.app.showNotification("Data pasien berhasil diperbarui", "success");
  },

  destroy() {},
};
