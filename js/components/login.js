// Login Component
const LoginComponent = {
    render() {
        return `
            <div class="login-container">
                <div class="login-card fade-in">
                    <div class="login-header">
                        <i class="fas fa-user-md"></i>
                        <h1>Sistem Rumah Sakit</h1>
                        <p>Silakan login untuk melanjutkan</p>
                    </div>
                    <form id="loginForm">
                        <div class="form-group">
                            <label class="form-label" for="username">Username</label>
                            <input 
                                type="text" 
                                id="username" 
                                name="username" 
                                class="form-input" 
                                placeholder="Masukkan username"
                                required
                            >
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="password">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                class="form-input" 
                                placeholder="Masukkan password"
                                required
                            >
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;">
                            <i class="fas fa-sign-in-alt"></i>
                            Login
                        </button>
                    </form>
                </div>
            </div>
        `;
    },

    init(app) {
        const form = document.getElementById('loginForm');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const credentials = {
                username: usernameInput.value.trim(),
                password: passwordInput.value.trim()
            };

            if (!credentials.username || !credentials.password) {
                app.showNotification('Harap isi semua field', 'error');
                return;
            }

            try {
                await app.login(credentials);
                app.router.navigate('dashboard');
            } catch (error) {
                app.showNotification(error.message, 'error');
            }
        });

        // Focus on username field
        usernameInput.focus();
    }
};
