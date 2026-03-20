/**
 * LAYER 3 – WORKSPACE PAGE
 * Displays available workspaces and lets user select one.
 * Flow: Workspace selection → Dashboard
 * Depends on: services/workspaceService.js, services/authService.js, ui.js
 */

const workspacePage = (() => {

  function render() {
    const nombre = authService.getNombre();
    return `
    <div class="page-container">
      <div class="workspace-hero">
        <h2 class="workspace-hero__greeting">Hola, <span class="highlight">${nombre}</span> 👋</h2>
        <p class="workspace-hero__subtitle">Selecciona el workspace con el que deseas trabajar</p>
      </div>
      <div id="workspace-list" class="workspace-grid">
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
      </div>
    </div>`;
  }

  async function init() {
    await _loadWorkspaces();
  }

  async function _loadWorkspaces() {
    const container = document.getElementById('workspace-list');
    try {
      // Get from session (already returned by login/registro)
      const workspaces = workspaceService.getWorkspacesFromSession();

      if (!workspaces || workspaces.length === 0) {
        ui.renderEmpty(container, 'No tienes workspaces asignados. Contacta al administrador.');
        return;
      }

      container.innerHTML = workspaces.map(w => `
        <div class="workspace-card glass" data-id="${w.id}" data-nombre="${w.nombre}" id="ws-card-${w.id}">
          <div class="workspace-card__icon">🏢</div>
          <h3 class="workspace-card__name">${w.nombre}</h3>
          <p class="workspace-card__id">ID: ${w.id}</p>
          <button class="btn btn--primary btn--full" data-ws-id="${w.id}" data-ws-nombre="${w.nombre}">
            Seleccionar
          </button>
        </div>
      `).join('');

      container.querySelectorAll('.btn[data-ws-id]').forEach(btn => {
        btn.addEventListener('click', () => _selectWorkspace(btn.dataset.wsId, btn.dataset.wsNombre));
      });

    } catch (err) {
      ui.renderError(container, err.message);
    }
  }

  async function _selectWorkspace(id, nombre) {
    const btn = document.querySelector(`[data-ws-id="${id}"]`);
    ui.setButtonLoading(btn, true);
    try {
      const workspace = new Workspace({ id: parseInt(id), nombre });
      await workspaceService.seleccionar(workspace);
      ui.showToast(`Workspace "${nombre}" seleccionado.`, 'success');
      window.location.hash = '#dashboard';
    } catch (err) {
      ui.showToast(err.message || 'Error al seleccionar workspace.', 'error');
      ui.setButtonLoading(btn, false);
    }
  }

  return { render, init };
})();
