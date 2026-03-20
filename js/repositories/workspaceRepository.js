/**
 * LAYER 1 – WORKSPACE REPOSITORY
 * Handles all HTTP calls related to workspaces.
 * Depends on: config.js, services/authService.js (for token)
 */

const workspaceRepository = (() => {
  const { BASE_URL, ENDPOINTS } = CONFIG;

  async function _fetch(endpoint, options = {}) {
    const token = authService.getToken();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
   * GET /api/workspaces?usuarioId={id}
   * @param {number} usuarioId
   * @returns {Promise<WorkspaceDTO[]>}
   */
  async function listar(usuarioId) {
    const res = await _fetch(`${ENDPOINTS.WORKSPACES}?usuarioId=${usuarioId}`);
    return res.data;
  }

  /**
   * POST /api/workspaces/{id}/seleccionar
   * @param {number} id
   * @returns {Promise<string>}
   */
  async function seleccionar(id) {
    const res = await _fetch(ENDPOINTS.WORKSPACE_SELECCIONAR(id), {
      method: 'POST',
    });
    return res.data;
  }

  return { listar, seleccionar };
})();
