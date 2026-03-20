/**
 * LAYER 1 – AUTH REPOSITORY
 * Handles all HTTP calls related to authentication.
 * Depends on: config.js
 */

const authRepository = (() => {
  const { BASE_URL, ENDPOINTS } = CONFIG;

  /**
   * Generic fetch wrapper that returns the parsed JSON or throws on error.
   */
  async function _fetch(endpoint, options = {}) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.mensaje || `HTTP ${response.status}`);
    }
    return json;
  }

  /**
   * POST /api/auth/login
   * @param {string} email
   * @param {string} password
   * @returns {Promise<AuthResponse>} { token, email, nombre, workspaces }
   */
  async function login(email, password) {
    const body = new LoginRequest(email, password);
    const res  = await _fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return res.data; // AuthResponse
  }

  /**
   * POST /api/auth/registro
   * @param {string} nombre
   * @param {string} email
   * @param {string} password
   * @returns {Promise<AuthResponse>}
   */
  async function registro(nombre, email, password) {
    const body = new RegisterRequest(nombre, email, password);
    const res  = await _fetch(ENDPOINTS.REGISTRO, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return res.data; // AuthResponse
  }

  /**
   * GET /api/auth/me  (requires Bearer token)
   * @param {string} token
   * @returns {Promise<string>} email/username
   */
  async function me(token) {
    const res = await _fetch(ENDPOINTS.ME, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  return { login, registro, me };
})();
