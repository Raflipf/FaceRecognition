import { loginUser } from './utils/api.js';

// Main Application Class
class HospitalApp {
    constructor() {
        this.router = new Router();
        this.currentUser = null;
        this.isAuthenticated = false;
        
        this.init();
    }

    init() {
        // Initialize storage and dummy data
        Storage.init();
        DummyData.init();
        
        // Check if user is already logged in
        this.checkAuthState();
        
        // Initialize router
        this.setupRoutes();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start the application
        this.start();
    }

    checkAuthState() {
        const token = localStorage.getItem('authToken');
        if (token) {
            // For simplicity, assume token is valid
            const savedUser = Storage.get('currentUser');
            if (savedUser) {
                this.currentUser = savedUser;
                this.isAuthenticated = true;
            }
        }
    }

    setupRoutes() {
        // Public routes
        this.router.addRoute('login', () => {
            if (this.isAuthenticated) {
                this.router.navigate('dashboard');
                return;
            }
            this.showLogin();
        });

        // Protected routes
        this.router.addRoute('dashboard', () => {
            this.requireAuth(() => this.showDashboard());
        });

        this.router.addRoute('face-recognition', () => {
            this.requireAuth(() => this.showFaceRecognition());
        });

        this.router.addRoute('patient-record', () => {
            this.requireAuth(() => this.showPatientRecord());
        });

        this.router.addRoute('add-patient', () => {
            this.requireAuth(() => this.showAddPatient());
        });

        this.router.addRoute('queue', () => {
            this.requireAuth(() => this.showQueue());
        });

        // Default route
        this.router.setDefaultRoute(() => {
            if (this.isAuthenticated) {
                this.router.navigate('dashboard');
            } else {
                this.router.navigate('login');
            }
        });
    }

    setupEventListeners() {
        // Logout button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'logoutBtn' || e.target.closest('#logoutBtn')) {
                this.logout();
            }
        });

        // Navigation links
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('.nav-link');
            if (navLink) {
                e.preventDefault();
                
                // Update active navigation
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                navLink.classList.add('active');
                
                // Navigate to route
                const route = navLink.dataset.route;
                if (route) {
                    this.router.navigate(route);
                }
            }
        });

        // Modal close events
        document.addEventListener('click', (e) => {
            if (e.target.id === 'modalClose' || e.target.id === 'modalOverlay') {
                this.hideModal();
            }
            if (e.target.id === 'modalConfirm' || e.target.id === 'modalCancel') {
                this.hideModal();
            }
        });
    }

    requireAuth(callback) {
        if (!this.isAuthenticated) {
            this.router.navigate('login');
            return;
        }
        callback();
    }

    start() {
        // Start the router
        this.router.start();
    }

    // Authentication methods
    async login(credentials) {
        this.showLoading();
        try {
            const token = await loginUser(credentials);
            // Save token to localStorage
            localStorage.setItem('authToken', token);
            // Save user info (for now, just username)
            this.currentUser = {
                username: credentials.username,
                token: token
            };
            this.isAuthenticated = true;
            Storage.set('currentUser', this.currentUser);
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
            'Konfirmasi Logout',
            'Apakah Anda yakin ingin keluar dari sistem?',
            () => {
                this.currentUser = null;
                this.isAuthenticated = false;
                Storage.remove('currentUser');
                localStorage.removeItem('authToken');
                this.hideHeader();
                this.router.navigate('login');
            },
            true
        );
    }

    // Page rendering methods
    showLogin() {
        this.hideHeader();
        document.getElementById('app-content').innerHTML = LoginComponent.render();
        LoginComponent.init(this);
    }

    showDashboard() {
        this.showHeader();
        document.getElementById('app-content').innerHTML = DashboardComponent.render();
        DashboardComponent.init(this);
    }

    showFaceRecognition() {
        this.showHeader();
        document.getElementById('app-content').innerHTML = FaceRecognitionComponent.render();
        FaceRecognitionComponent.init(this);
    }

    showPatientRecord() {
        this.showHeader();
        const patientId = this.router.getParams().patientId;
        document.getElementById('app-content').innerHTML = PatientRecordComponent.render(patientId);
        PatientRecordComponent.init(this, patientId);
    }

    showAddPatient() {
        this.showHeader();
        document.getElementById('app-content').innerHTML = AddPatientComponent.render();
        AddPatientComponent.init(this);
    }

    showQueue() {
        this.showHeader();
        document.getElementById('app-content').innerHTML = QueueComponent.render();
        QueueComponent.init(this);
    }

    // UI utility methods
    showHeader() {
        document.getElementById('header').style.display = 'block';
    }

    hideHeader() {
        document.getElementById('header').style.display = 'none';
    }

    showLoading() {
        document.getElementById('loadingSpinner').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loadingSpinner').style.display = 'none';
    }

    showModal(title, message, onConfirm = null, showCancel = false) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').textContent = message;
        
        const confirmBtn = document.getElementById('modalConfirm');
        const cancelBtn = document.getElementById('modalCancel');
        
        // Remove previous event listeners
        const newConfirmBtn = confirmBtn.cloneNode(true);
        const newCancelBtn = cancelBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        
        if (onConfirm) {
            newConfirmBtn.addEventListener('click', onConfirm);
        }
        
        newCancelBtn.style.display = showCancel ? 'inline-flex' : 'none';
        
        document.getElementById('modalOverlay').style.display = 'flex';
    }

    hideModal() {
        document.getElementById('modalOverlay').style.display = 'none';
    }

    showNotification(message, type = 'info') {
        const title = type === 'error' ? 'Error' : type === 'success' ? 'Berhasil' : 'Informasi';
        this.showModal(title, message);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.hospitalApp = new HospitalApp();
});
