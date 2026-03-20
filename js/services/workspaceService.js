/**
 * LAYER 2 – WORKSPACE SERVICE
 * Business logic for workspace management and active workspace state.
 * Depends on: repositories/workspaceRepository.js, services/authService.js
 */

const workspaceService = (() => {
  const WORKSPACE_ID_KEY     = 'fin_workspace_id';
  const WORKSPACE_NOMBRE_KEY = 'fin_workspace_nombre';

  /** Returns the active workspace id (from localStorage) */
  function getActiveWorkspaceId() {
    const id = localStorage.getItem(WORKSPACE_ID_KEY);
    return id ? parseInt(id, 10) : null;
  }

  /** Returns the active workspace name */
  function getActiveWorkspaceName() {
    return localStorage.getItem(WORKSPACE_NOMBRE_KEY) || '';
  }

  /** Set active workspace in localStorage */
  function _setActive(workspace) {
    localStorage.setItem(WORKSPACE_ID_KEY,     workspace.id);
    localStorage.setItem(WORKSPACE_NOMBRE_KEY, workspace.nombre);
  }

  /**
   * Loads all workspaces for the currently authenticated user.
   * We get the workspaces from the auth data stored at login.
   * @returns {Workspace[]}
   */
  function getWorkspacesFromSession() {
    const authData = authService.getAuthData();
    if (!authData || !authData.workspaces) return [];
    return authData.workspaces.map(w => new Workspace(w));
  }

  /**
   * Fetch workspaces from the API (useful for refresh).
   * Requires a userId – we derive it from a heuristic or store it.
   * @param {number} userId
   */
  async function fetchWorkspaces(userId) {
    const data = await workspaceRepository.listar(userId);
    return (data || []).map(w => new Workspace(w));
  }

  /**
   * Selects a workspace as active (calls API + saves locally).
   * @param {Workspace} workspace
   */
  async function seleccionar(workspace) {
    await workspaceRepository.seleccionar(workspace.id);
    _setActive(workspace);
  }

  /** Clears the active workspace (called on logout) */
  function clearActive() {
    localStorage.removeItem(WORKSPACE_ID_KEY);
    localStorage.removeItem(WORKSPACE_NOMBRE_KEY);
  }

  /** Guard: redirects to workspace page if no workspace selected */
  function requireWorkspace() {
    const id = getActiveWorkspaceId();
    if (!id) {
      window.location.hash = '#workspace';
      throw new Error('Primero debes seleccionar un workspace.');
    }
    return id;
  }

  return {
    getActiveWorkspaceId,
    getActiveWorkspaceName,
    getWorkspacesFromSession,
    fetchWorkspaces,
    seleccionar,
    clearActive,
    requireWorkspace,
  };
})();
