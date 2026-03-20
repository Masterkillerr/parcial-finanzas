/**
 * LAYER 2 – CATEGORIA SERVICE
 * Business logic for category management.
 * Rules: tipo must be 'INGRESO' or 'GASTO' (uppercase, as stated in parcial_finanzas.md).
 * Depends on: repositories/categoriaRepository.js, services/workspaceService.js
 */

const categoriaService = (() => {

  function _validate(nombre, tipo) {
    if (!nombre || nombre.trim() === '') {
      throw new Error('El nombre de la categoría es requerido.');
    }
    const tiposValidos = CONFIG.TIPOS_CATEGORIA; // ['INGRESO', 'GASTO']
    if (!tiposValidos.includes(tipo.toUpperCase())) {
      throw new Error(`El tipo debe ser INGRESO o GASTO (en mayúscula).`);
    }
  }

  /**
   * Get all categories for the active workspace.
   * @returns {Promise<Categoria[]>}
   */
  async function listar() {
    const workspaceId = workspaceService.requireWorkspace();
    const data = await categoriaRepository.listar(workspaceId);
    return (data || []).map(c => new Categoria(c));
  }

  /**
   * Create a new category.
   * @param {string} nombre
   * @param {string} tipo – 'INGRESO' | 'GASTO'
   * @returns {Promise<Categoria>}
   */
  async function crear(nombre, tipo) {
    const tipoUpper = tipo.toUpperCase();
    _validate(nombre, tipoUpper);
    const workspaceId = workspaceService.requireWorkspace();
    const data = await categoriaRepository.crear(workspaceId, nombre.trim(), tipoUpper);
    return new Categoria(data);
  }

  /**
   * Update an existing category.
   */
  async function actualizar(id, nombre, tipo) {
    const tipoUpper = tipo.toUpperCase();
    _validate(nombre, tipoUpper);
    const workspaceId = workspaceService.requireWorkspace();
    const data = await categoriaRepository.actualizar(id, workspaceId, nombre.trim(), tipoUpper);
    return new Categoria(data);
  }

  /**
   * Delete a category by id.
   */
  async function eliminar(id) {
    if (!id) throw new Error('ID de categoría inválido.');
    return categoriaRepository.eliminar(id);
  }

  return { listar, crear, actualizar, eliminar };
})();
