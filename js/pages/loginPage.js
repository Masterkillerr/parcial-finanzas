/**
 * LAYER 3 – LOGIN PAGE
 * Handles user registration and login with tab switching.
 * Flow: Login → Workspace selection
 * Depends on: services/authService.js, ui.js
 */

const loginPage = (() => {

  function render() {
    return `
    <div class="auth-container">
      <div class="auth-card glass">
        <div class="auth-logo">
          <span class="auth-logo__icon">💰</span>
          <h1 class="auth-logo__title">FinanzApp</h1>
          <p class="auth-logo__subtitle">Gestiona tus finanzas personales</p>
        </div>

        <!-- Tabs -->
        <div class="auth-tabs">
          <button class="auth-tab auth-tab--active" id="tab-login" data-tab="login">Iniciar Sesión</button>
          <button class="auth-tab" id="tab-register" data-tab="register">Registrarse</button>
        </div>

        <!-- Login Form -->
        <form id="form-login" class="auth-form auth-form--active" novalidate>
          <div class="form-group">
            <label class="form-label" for="login-email">Correo electrónico</label>
            <input class="form-input" type="email" id="login-email" placeholder="tu@email.com" required autocomplete="email"/>
            <span class="form-error" id="login-email-error"></span>
          </div>
          <div class="form-group">
            <label class="form-label" for="login-password">Contraseña</label>
            <div class="input-wrapper">
              <input class="form-input" type="password" id="login-password" placeholder="••••••••" required autocomplete="current-password"/>
              <button type="button" class="btn-eye" id="toggle-login-password">👁</button>
            </div>
            <span class="form-error" id="login-password-error"></span>
          </div>
          <button type="submit" class="btn btn--primary btn--full" id="btn-login">Iniciar Sesión</button>
        </form>

        <!-- Register Form -->
        <form id="form-register" class="auth-form" novalidate>
          <div class="form-group">
            <label class="form-label" for="reg-nombre">Nombre completo</label>
            <input class="form-input" type="text" id="reg-nombre" placeholder="Juan Pérez" required autocomplete="name"/>
            <span class="form-error" id="reg-nombre-error"></span>
          </div>
          <div class="form-group">
            <label class="form-label" for="reg-email">Correo electrónico</label>
            <input class="form-input" type="email" id="reg-email" placeholder="tu@email.com" required autocomplete="email"/>
            <span class="form-error" id="reg-email-error"></span>
          </div>
          <div class="form-group">
            <label class="form-label" for="reg-password">Contraseña</label>
            <div class="input-wrapper">
              <input class="form-input" type="password" id="reg-password" placeholder="Mínimo 6 caracteres" required autocomplete="new-password"/>
              <button type="button" class="btn-eye" id="toggle-reg-password">👁</button>
            </div>
            <span class="form-error" id="reg-password-error"></span>
          </div>
          <button type="submit" class="btn btn--primary btn--full" id="btn-register">Crear Cuenta</button>
        </form>
      </div>
    </div>`;
  }

  function init() {
    _setupTabs();
    _setupLoginForm();
    _setupRegisterForm();
    _setupPasswordToggles();
  }

  function _setupTabs() {
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('auth-tab--active'));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('auth-form--active'));
        tab.classList.add('auth-tab--active');
        document.getElementById(`form-${tab.dataset.tab}`)?.classList.add('auth-form--active');
      });
    });
  }

  function _setupLoginForm() {
    const form = document.getElementById('form-login');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email    = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      _clearErrors(['login-email-error', 'login-password-error']);

      if (!email)    { _showError('login-email-error', 'Campo requerido.'); return; }
      if (!password) { _showError('login-password-error', 'Campo requerido.'); return; }

      const btn = document.getElementById('btn-login');
      ui.setButtonLoading(btn, true);
      try {
        await authService.login(email, password);
        ui.showToast('¡Bienvenido!', 'success');
        window.location.hash = '#workspace';
      } catch (err) {
        ui.showToast(err.message || 'Error al iniciar sesión.', 'error');
      } finally {
        ui.setButtonLoading(btn, false);
      }
    });
  }

  function _setupRegisterForm() {
    const form = document.getElementById('form-register');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombre   = document.getElementById('reg-nombre').value.trim();
      const email    = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;

      _clearErrors(['reg-nombre-error', 'reg-email-error', 'reg-password-error']);

      let valid = true;
      if (!nombre)           { _showError('reg-nombre-error', 'Campo requerido.');valid=false; }
      if (!email)            { _showError('reg-email-error', 'Campo requerido.');valid=false; }
      if (password.length<6) { _showError('reg-password-error', 'Mínimo 6 caracteres.');valid=false; }
      if (!valid) return;

      const btn = document.getElementById('btn-register');
      ui.setButtonLoading(btn, true);
      try {
        await authService.registro(nombre, email, password);
        ui.showToast('¡Cuenta creada! Selecciona tu workspace.', 'success');
        window.location.hash = '#workspace';
      } catch (err) {
        ui.showToast(err.message || 'Error al registrarse.', 'error');
      } finally {
        ui.setButtonLoading(btn, false);
      }
    });
  }

  function _setupPasswordToggles() {
    ['toggle-login-password', 'toggle-reg-password'].forEach(btnId => {
      const btn = document.getElementById(btnId);
      if (!btn) return;
      btn.addEventListener('click', () => {
        const inputId = btnId === 'toggle-login-password' ? 'login-password' : 'reg-password';
        const input = document.getElementById(inputId);
        input.type = input.type === 'password' ? 'text' : 'password';
        btn.textContent = input.type === 'password' ? '👁' : '🙈';
      });
    });
  }

  function _showError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  }

  function _clearErrors(ids) {
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.textContent = ''; el.style.display = 'none'; }
    });
  }

  return { render, init };
})();
