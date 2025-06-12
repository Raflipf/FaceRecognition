import "./styles/main.css";

import { Storage } from "./js/utils/storage.js";
import { Camera } from "./js/utils/camera.js";
import { Router } from "./js/router.js";

import { LoginComponent } from "./js/components/login.js";
import { DashboardComponent } from "./js/components/dashboard.js";
import { FaceRecognitionComponent } from "./js/components/faceRecognition.js";
import { PatientRecordComponent } from "./js/components/patientRecord.js";
import { AddPatientComponent } from "./js/components/addPatient.js";
import { QueueComponent } from "./js/components/queue.js";
import { PatientsComponent } from "./js/components/patients.js";

import { loginUser } from "./js/utils/api.js";

class HospitalApp {
  constructor() {
    this.router = new Router();
    this.storage = Storage;
    this.currentUser = null;
    this.isAuthenticated = false;

    this.init();
  }
  getAuthToken() {
    return localStorage.getItem("authToken");
  }

  init() {

    this.storage.init();

    this.checkAuthState();

    this.setupRoutes();

    this.setupEventListeners();

    this.start();
  }

  checkAuthState() {
    const token = localStorage.getItem("authToken");
    if (token) {
      const savedUser = this.storage.get("currentUser");
      if (savedUser) {
        this.currentUser = savedUser;
        this.isAuthenticated = true;
      }
    }
  }

  setupRoutes() {
    this.router.addRoute("login", () => {
      if (this.isAuthenticated) {
        this.router.navigate("dashboard");
        return;
      }
      this.showLogin();
    });

    this.router.addRoute("dashboard", () => {
      this.requireAuth(() => this.showDashboard());
    });

    this.router.addRoute("face-recognition", () => {
      this.requireAuth(() => this.showFaceRecognition());
    });

    this.router.addRoute("patients", () => {
      this.requireAuth(() => this.showPatients());
    });

    this.router.addRoute("patient-record", () => {
      this.requireAuth(() => this.showPatientRecord());
    });

    this.router.addRoute("add-patient", () => {
      this.requireAuth(() => this.showAddPatient());
    });

    this.router.addRoute("queue", () => {
      this.requireAuth(() => this.showQueue());
    });

    this.router.setDefaultRoute(() => {
      if (this.isAuthenticated) {
        this.router.navigate("dashboard");
      } else {
        this.router.navigate("login");
      }
    });
  }

  setupEventListeners() {
    document.addEventListener("click", (e) => {
      if (e.target.id === "logoutBtn" || e.target.closest("#logoutBtn")) {
        this.logout();
      }
    });

    document.addEventListener("click", (e) => {
      const navLink = e.target.closest(".nav-link");
      if (navLink) {
        e.preventDefault();

        document.querySelectorAll(".nav-link").forEach((link) => {
          link.classList.remove("active");
        });
        navLink.classList.add("active");

        const route = navLink.dataset.route;
        if (route) {
          this.router.navigate(route);
        }
      }
    });

    document.addEventListener("click", (e) => {
      if (e.target.id === "modalClose" || e.target.id === "modalOverlay") {
        this.hideModal();
      }
      if (e.target.id === "modalConfirm" || e.target.id === "modalCancel") {
        this.hideModal();
      }
    });
  }

  requireAuth(callback) {
    if (!this.isAuthenticated) {
      this.router.navigate("login");
      return;
    }
    callback();
  }

  start() {
    this.router.start();
  }

  async login(credentials) {
    this.showLoading();
    try {
      const token = await loginUser(credentials);
      localStorage.setItem("authToken", token);
      this.currentUser = {
        username: credentials.username,
        token: token,
      };
      this.isAuthenticated = true;
      this.storage.set("currentUser", this.currentUser);
      this.hideLoading();
      this.showHeader();
      return this.currentUser;
    } catch (error) {
      this.hideLoading();
      throw error;
    }
  }

  logout() {
    this.showModal(
      "Konfirmasi Logout",
      "Apakah Anda yakin ingin keluar dari sistem?",
      () => {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.storage.remove("currentUser");
        localStorage.removeItem("authToken");
        this.hideHeader();
        this.router.navigate("login");
      },
      true
    );
  }

  showLogin() {
    this.hideHeader();
    document.getElementById("app-content").innerHTML = LoginComponent.render();
    LoginComponent.init(this);
  }

  showDashboard() {
    this.showHeader();
    document.getElementById("app-content").innerHTML =
      DashboardComponent.render();
    DashboardComponent.init(this);
  }

  showFaceRecognition() {
    this.showHeader();
    document.getElementById("app-content").innerHTML =
      FaceRecognitionComponent.render();
    FaceRecognitionComponent.init(this);
  }

  showPatients() {
    this.showHeader();
    document.getElementById("app-content").innerHTML =
      PatientsComponent.render();
    PatientsComponent.init(this);
    window.patientsComponent = PatientsComponent;
  }

  async showPatientRecord() {
    this.showHeader();
    const patientId = this.router.getParams().patientId;
    const content = await PatientRecordComponent.render(patientId);
    document.getElementById("app-content").innerHTML = content;
    await PatientRecordComponent.init(this, patientId);
  }

  showAddPatient() {
    this.showHeader();
    document.getElementById("app-content").innerHTML =
      AddPatientComponent.render();
    AddPatientComponent.init(this);
  }

  showQueue() {
    this.showHeader();
    document.getElementById("app-content").innerHTML = QueueComponent.render();
    QueueComponent.init(this);
  }

  showHeader() {
    document.getElementById("header").style.display = "block";
  }

  hideHeader() {
    document.getElementById("header").style.display = "none";
  }

  showLoading() {
    document.getElementById("loadingSpinner").style.display = "flex";
  }

  hideLoading() {
    document.getElementById("loadingSpinner").style.display = "none";
  }

  showModal(title, message, onConfirm = null, showCancel = false) {
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalMessage").textContent = message;

    const confirmBtn = document.getElementById("modalConfirm");
    const cancelBtn = document.getElementById("modalCancel");

    const newConfirmBtn = confirmBtn.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    if (onConfirm) {
      newConfirmBtn.addEventListener("click", onConfirm);
    }

    newCancelBtn.style.display = showCancel ? "inline-flex" : "none";

    document.getElementById("modalOverlay").style.display = "flex";
  }

  hideModal() {
    document.getElementById("modalOverlay").style.display = "none";
  }

  showNotification(message, type = "info") {
    const title =
      type === "error"
        ? "Error"
        : type === "success"
        ? "Berhasil"
        : "Informasi";
    this.showModal(title, message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.hospitalApp = new HospitalApp();
});
