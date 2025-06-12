export const LoginComponent = {
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
                        <button type="submit" id="loginButton" class="btn btn-primary" style="width: 100%;">
                            <i class="fas fa-sign-in-alt"></i>
                            Login
                        </button>
                    </form>
                    <div class="mt-3 text-center">
                        <small style="color: #64748b;">
                            Kredensial: username: <strong>admin1</strong>, password: <strong>admin1</strong>
                        </small>
                    </div>
                </div>
            </div>
        `;
  },

  init(app) {
    const form = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginButton = document.getElementById("loginButton");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const credentials = {
        username: usernameInput.value.trim(),
        password: passwordInput.value.trim(),
      };

      if (!credentials.username || !credentials.password) {
        app.showNotification("Harap isi semua field", "error");
        return;
      }

      this.setLoadingState(loginButton, true);

      try {
        await app.login(credentials);

        app.showNotification("Login berhasil! Memuat dashboard...", "success");

        setTimeout(() => {
          app.router.navigate("dashboard");
        }, 500);
      } catch (error) {
        console.error("Login error:", error);
        app.showNotification(error.message || "Login gagal", "error");
        this.setLoadingState(loginButton, false);
      }
    });

    usernameInput.focus();

    passwordInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        form.dispatchEvent(new Event("submit"));
      }
    });
  },

  setLoadingState(button, isLoading) {
    if (isLoading) {
      button.disabled = true;
      button.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                Memuat...
            `;
      button.classList.add("loading");
    } else {
      button.disabled = false;
      button.innerHTML = `
                <i class="fas fa-sign-in-alt"></i>
                Login
            `;
      button.classList.remove("loading");
    }
  },
};
