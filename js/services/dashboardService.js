/**
 * LAYER 2 – DASHBOARD SERVICE
 * Business logic for dashboard data aggregation and chart data preparation.
 * Depends on: repositories/dashboardRepository.js, services/workspaceService.js
 */

const dashboardService = (() => {

  function _getCurrentYearMonth() {
    const now = new Date();
    return { anio: now.getFullYear(), mes: now.getMonth() + 1 };
  }

  /**
   * Get monthly summary (totalIngresos, totalGastos, balanceNeto).
   * Defaults to current month/year.
   * @returns {Promise<DashboardSummary>}
   */
  async function resumenMensual(anio, mes) {
    const workspaceId = workspaceService.requireWorkspace();
    const { anio: a, mes: m } = anio && mes
      ? { anio, mes }
      : _getCurrentYearMonth();
    const data = await dashboardRepository.resumenMensual(workspaceId, a, m);
    return data ? new DashboardSummary(data) : new DashboardSummary({ totalIngresos: 0, totalGastos: 0, balanceNeto: 0 });
  }

  /**
   * Get yearly cash flow (array of monthly maps with ingresos/gastos keys).
   * @returns {Promise<Array<{mes, ingresos, gastos}>>}
   */
  async function flujoCaja(anio) {
    const workspaceId = workspaceService.requireWorkspace();
    const year = anio || new Date().getFullYear();
    const data = await dashboardRepository.flujoCaja(workspaceId, year);
    return data || [];
  }

  /**
   * Get expenses breakdown by category for current month.
   * @returns {Promise<CategoryReport[]>}
   */
  async function gastosPorCategoria(anio, mes) {
    const workspaceId = workspaceService.requireWorkspace();
    const { anio: a, mes: m } = anio && mes
      ? { anio, mes }
      : _getCurrentYearMonth();
    const data = await dashboardRepository.gastosPorCategoria(workspaceId, a, m);
    return (data || []).map(c => new CategoryReport(c));
  }

  return { resumenMensual, flujoCaja, gastosPorCategoria };
})();
