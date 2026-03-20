/**
 * LAYER 1 – BENEFICIARIO REPOSITORY
 * Handles all HTTP calls for beneficiary management.
 * Depends on: config.js, services/authService.js
 */

const beneficiarioRepository = (() => {
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
   * GET /api/beneficiarios?workspaceId={id}
   */
  async function listar(workspaceId) {
    const res = await _fetch(`${ENDPOINTS.BENEFICIARIOS}?workspaceId=${workspaceId}`);
    return res.data; // BeneficiarioDTO[]
  }

  /**
   * POST /api/beneficiarios
   * Body: { workspaceId, nombre }
   */
  async function crear(workspaceId, nombre) {
    const body = new BeneficiarioRequest(workspaceId, nombre);
    const res  = await _fetch(ENDPOINTS.BENEFICIARIOS, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return res.data; // BeneficiarioDTO
  }

  /**
   * PUT /api/beneficiarios/{id}
   * Body: { workspaceId, nombre }
   */
  async function actualizar(id, workspaceId, nombre) {
    const body = new BeneficiarioRequest(workspaceId, nombre);
    const res  = await _fetch(ENDPOINTS.BENEFICIARIO_ID(id), {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return res.data; // BeneficiarioDTO
  }

  /**
   * DELETE /api/beneficiarios/{id}
   */
  async function eliminar(id) {
    const res = await _fetch(ENDPOINTS.BENEFICIARIO_ID(id), {
      method: 'DELETE',
    });
    return res.data;
  }

  return { listar, crear, actualizar, eliminar };
})();
