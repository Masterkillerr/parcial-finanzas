/**
 * LAYER 1 – TRANSACTION REPOSITORY
 * Handles all HTTP calls for transaction management.
 * Depends on: config.js, services/authService.js, entities.js
 */

const transactionRepository = (() => {
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
   * GET /api/transactions?workspaceId={id}
   */
  async function listar(workspaceId) {
    const res = await _fetch(`${ENDPOINTS.TRANSACTIONS}?workspaceId=${workspaceId}`);
    return res.data; // TransactionDTO[]
  }

  /**
   * POST /api/transactions
   * @param {Object} data – { workspaceId, tipo, categoriaId, beneficiarioId, fecha, monto, descripcion, medioPago }
   */
  async function crear(data) {
    const body = new TransactionRequest(data);
    const res  = await _fetch(ENDPOINTS.TRANSACTIONS, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return res.data; // TransactionDTO
  }

  /**
   * DELETE /api/transactions/{id}
   */
  async function eliminar(id) {
    const res = await _fetch(ENDPOINTS.TRANSACTION_ID(id), {
      method: 'DELETE',
    });
    return res.data;
  }

  return { listar, crear, eliminar };
})();
