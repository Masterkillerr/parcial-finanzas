/**
 * LAYER 1 – DASHBOARD REPOSITORY
 * Handles all HTTP calls for dashboard and report data.
 * Depends on: config.js, services/authService.js
 */

const dashboardRepository = (() => {
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
   * GET /api/dashboard/resumen-mensual?workspaceId=&anio=&mes=
   * @returns {Promise<DashboardSummaryDTO>} { totalIngresos, totalGastos, balanceNeto }
   */
  async function resumenMensual(workspaceId, anio, mes) {
    const url = `${ENDPOINTS.DASHBOARD_RESUMEN}?workspaceId=${workspaceId}&anio=${anio}&mes=${mes}`;
    const res  = await _fetch(url);
    return res.data; // DashboardSummaryDTO
  }

  /**
   * GET /api/dashboard/flujo-caja?workspaceId=&anio=
   * @returns {Promise<Array<Object>>} Array of monthly cash-flow maps
   */
  async function flujoCaja(workspaceId, anio) {
    const url = `${ENDPOINTS.DASHBOARD_FLUJO}?workspaceId=${workspaceId}&anio=${anio}`;
    const res  = await _fetch(url);
    return res.data; // List<Map<String,Object>>
  }

  /**
   * GET /api/reportes/gastos-por-categoria?workspaceId=&anio=&mes=
   * @returns {Promise<CategoryReportDTO[]>} { categoria, total, color }
   */
  async function gastosPorCategoria(workspaceId, anio, mes) {
    const url = `${ENDPOINTS.REPORTE_CATEGORIAS}?workspaceId=${workspaceId}&anio=${anio}&mes=${mes}`;
    const res  = await _fetch(url);
    return res.data; // CategoryReportDTO[]
  }

  return { resumenMensual, flujoCaja, gastosPorCategoria };
})();
