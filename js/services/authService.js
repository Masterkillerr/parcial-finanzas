/**
 * LAYER 2 – AUTH SERVICE
 * Business logic for authentication and session management.
 * Uses localStorage to persist session state.
 * Depends on: repositories/authRepository.js, entities.js
 */

const authService = (() => {
  // Session keys
  const KEYS = {
    TOKEN:      'fin_token',
    USER_ID:    'fin_user_id',
    USER_EMAIL: 'fin_user_email',
    USER_NOMBRE:'fin_user_nombre',
  };

  // ── Private helpers ────────────────────────────────────────────────────────

  function _saveSession(authResponse) {
    localStorage.setItem(KEYS.TOKEN,       authResponse.token);
    localStorage.setItem(KEYS.USER_EMAIL,  authResponse.email);
    localStorage.setItem(KEYS.USER_NOMBRE, authResponse.nombre);
    // The API returns workspaces in the auth response – we'll use index 0 id as userId hint
    // userId is not returned directly; we'll derive it from workspaces if needed
    // Store the full response for workspace access
    localStorage.setItem('fin_auth_data', JSON.stringify(authResponse));
  }

  function _clearSession() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    localStorage.removeItem('fin_auth_data');
    localStorage.removeItem('fin_workspace_id');
    localStorage.removeItem('fin_workspace_nombre');
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /**
   * Authenticates user and saves session.
   * @returns {Promise<User>}
   */
  async function login(email, password) {
    // Validate
    if (!email || !password) throw new Error('Email y contraseña son requeridos.');
    if (!email.includes('@'))  throw new Error('Email inválido.');

    const data = await authRepository.login(email, password);
    _saveSession(data);
    return new User(data);
  }

  /**
   * Registers a new user and saves session.
   * @returns {Promise<User>}
   */
  async function registro(nombre, email, password) {
    if (!nombre || !email || !password) throw new Error('Todos los campos son requeridos.');
    if (!email.includes('@'))           throw new Error('Email inválido.');
    if (password.length < 6)           throw new Error('La contraseña debe tener al menos 6 caracteres.');

    const data = await authRepository.registro(nombre, email, password);
    _saveSession(data);
    return new User(data);
  }

  function logout() {
    _clearSession();
  }

  function getToken() {
    return localStorage.getItem(KEYS.TOKEN);
  }

  function getNombre() {
    return localStorage.getItem(KEYS.USER_NOMBRE) || '';
  }

  function getEmail() {
    return localStorage.getItem(KEYS.USER_EMAIL) || '';
  }

  function getAuthData() {
    const raw = localStorage.getItem('fin_auth_data');
    return raw ? JSON.parse(raw) : null;
  }

  function isAuthenticated() {
    return !!getToken();
  }

  return { login, registro, logout, getToken, getNombre, getEmail, getAuthData, isAuthenticated };
})();
