/**
 * LAYER 1 – CATEGORIA REPOSITORY
 * Handles all HTTP calls for category management.
 * Depends on: config.js, services/authService.js
 */

const categoriaRepository = (() => {
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
   * GET /api/categorias?workspaceId={id}
   */
  async function listar(workspaceId) {
    const res = await _fetch(`${ENDPOINTS.CATEGORIAS}?workspaceId=${workspaceId}`);
    return res.data; // CategoriaDTO[]
  }

  /**
   * POST /api/categorias
   * Body: { workspaceId, nombre, tipo }
   */
  async function crear(workspaceId, nombre, tipo) {
    const body = new CategoriaRequest(workspaceId, nombre, tipo);
    const res  = await _fetch(ENDPOINTS.CATEGORIAS, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return res.data; // CategoriaDTO
  }

  /**
   * PUT /api/categorias/{id}
   * Body: { workspaceId, nombre, tipo }
   */
  async function actualizar(id, workspaceId, nombre, tipo) {
    const body = new CategoriaRequest(workspaceId, nombre, tipo);
    const res  = await _fetch(ENDPOINTS.CATEGORIA_ID(id), {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return res.data; // CategoriaDTO
  }

  /**
   * DELETE /api/categorias/{id}
   */
  async function eliminar(id) {
    const res = await _fetch(ENDPOINTS.CATEGORIA_ID(id), {
      method: 'DELETE',
    });
    return res.data;
  }

  return { listar, crear, actualizar, eliminar };
})();
