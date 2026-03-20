/**
 * LAYER 2 – TRANSACTION SERVICE
 * Business logic for income and expense registration.
 * Rule: At least one category must exist before registering movements (parcial_finanzas.md).
 * Depends on: repositories/transactionRepository.js, services/workspaceService.js, services/categoriaService.js
 */

const transactionService = (() => {

  async function _validate(data) {
    if (!data.categoriaId) {
      throw new Error('Debes seleccionar una categoría.');
    }
    if (!data.monto || isNaN(parseFloat(data.monto)) || parseFloat(data.monto) <= 0) {
      throw new Error('El monto debe ser un número positivo.');
    }
    if (!data.fecha) {
      throw new Error('La fecha es requerida.');
    }
    if (!data.tipo || !['INGRESO', 'GASTO'].includes(data.tipo.toUpperCase())) {
      throw new Error('El tipo debe ser INGRESO o GASTO.');
    }
    // Rule from parcial_finanzas.md: must exist at least one category
    const categorias = await categoriaService.listar();
    if (!categorias || categorias.length === 0) {
      throw new Error('Debes crear al menos una categoría antes de registrar movimientos.');
    }
  }

  /**
   * Get all transactions for the active workspace.
   * @returns {Promise<Transaction[]>}
   */
  async function listar() {
    const workspaceId = workspaceService.requireWorkspace();
    const data = await transactionRepository.listar(workspaceId);
    return (data || []).map(t => new Transaction(t));
  }

  /**
   * Register a new income or expense.
   * @param {Object} data – { tipo, categoriaId, beneficiarioId, fecha, monto, descripcion, medioPago }
   * @returns {Promise<Transaction>}
   */
  async function crear(data) {
    await _validate(data);
    const workspaceId = workspaceService.requireWorkspace();
    const payload = { ...data, workspaceId, tipo: data.tipo.toUpperCase() };
    const result  = await transactionRepository.crear(payload);
    return new Transaction(result);
  }

  /**
   * Delete a transaction.
   * @param {number} id
   */
  async function eliminar(id) {
    if (!id) throw new Error('ID de transacción inválido.');
    return transactionRepository.eliminar(id);
  }

  return { listar, crear, eliminar };
})();
