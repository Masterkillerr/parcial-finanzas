/**
 * LAYER 2 – BENEFICIARIO SERVICE
 * Business logic for beneficiary management.
 * Depends on: repositories/beneficiarioRepository.js, services/workspaceService.js
 */

const beneficiarioService = (() => {

  function _validate(nombre) {
    if (!nombre || nombre.trim() === '') {
      throw new Error('El nombre del beneficiario es requerido.');
    }
  }

  /**
   * Get all beneficiaries for the active workspace.
   * @returns {Promise<Beneficiario[]>}
   */
  async function listar() {
    const workspaceId = workspaceService.requireWorkspace();
    const data = await beneficiarioRepository.listar(workspaceId);
    return (data || []).map(b => new Beneficiario(b));
  }

  /**
   * Create a new beneficiary.
   * @param {string} nombre
   * @returns {Promise<Beneficiario>}
   */
  async function crear(nombre) {
    _validate(nombre);
    const workspaceId = workspaceService.requireWorkspace();
    const data = await beneficiarioRepository.crear(workspaceId, nombre.trim());
    return new Beneficiario(data);
  }

  /**
   * Update a beneficiary.
   */
  async function actualizar(id, nombre) {
    _validate(nombre);
    const workspaceId = workspaceService.requireWorkspace();
    const data = await beneficiarioRepository.actualizar(id, workspaceId, nombre.trim());
    return new Beneficiario(data);
  }

  /**
   * Delete a beneficiary.
   */
  async function eliminar(id) {
    if (!id) throw new Error('ID de beneficiario inválido.');
    return beneficiarioRepository.eliminar(id);
  }

  return { listar, crear, actualizar, eliminar };
})();
