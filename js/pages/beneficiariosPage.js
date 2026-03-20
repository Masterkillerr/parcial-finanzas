/**
 * LAYER 3 – BENEFICIARIOS PAGE
 * CRUD interface for beneficiaries (recipients of transactions).
 * Depends on: services/beneficiarioService.js, ui.js
 */

const beneficiariosPage = (() => {

  function render() {
    return `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2 class="page-title">Beneficiarios</h2>
          <p class="page-subtitle">Personas o entidades a quienes van tus movimientos</p>
        </div>
        <button class="btn btn--primary" id="btn-nuevo-beneficiario">+ Nuevo Beneficiario</button>
      </div>

      <!-- Form (hidden) -->
      <div id="beneficiario-form-container" class="card form-card" style="display:none;">
        <h3 class="form-card__title" id="ben-form-title">Nuevo Beneficiario</h3>
        <form id="form-beneficiario" novalidate>
          <input type="hidden" id="ben-edit-id"/>
          <div class="form-group">
            <label class="form-label" for="ben-nombre">Nombre</label>
            <input class="form-input" type="text" id="ben-nombre" placeholder="Ej: Supermercado La 14" required/>
            <span class="form-error" id="ben-nombre-error"></span>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn--ghost" id="btn-cancel-ben">Cancelar</button>
            <button type="submit" class="btn btn--primary" id="btn-save-ben">Guardar</button>
          </div>
        </form>
      </div>

      <!-- Search -->
      <div class="search-bar">
        <input class="form-input search-input" type="search" id="ben-search" placeholder="Buscar beneficiario..."/>
      </div>

      <!-- List -->
      <div id="beneficiarios-list" class="list-container"></div>
    </div>`;
  }

  let _beneficiarios = [];

  async function init() {
    _setupForm();
    _setupSearch();
    await _loadBeneficiarios();
  }

  async function _loadBeneficiarios() {
    const container = document.getElementById('beneficiarios-list');
    ui.showLoading();
    try {
      _beneficiarios = await beneficiarioService.listar();
      _renderList(_beneficiarios);
    } catch (err) {
      ui.renderError(container, err.message);
    } finally {
      ui.hideLoading();
    }
  }

  function _renderList(items) {
    const container = document.getElementById('beneficiarios-list');
    if (!items || items.length === 0) {
      ui.renderEmpty(container, 'No hay beneficiarios. Agrega el primero.');
      return;
    }
    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((b, i) => `
            <tr>
              <td>${i + 1}</td>
              <td><strong>${b.nombre}</strong></td>
              <td><span class="badge ${b.activo ? 'badge--active' : 'badge--inactive'}">${b.activo ? 'Activo' : 'Inactivo'}</span></td>
              <td class="actions-cell">
                <button class="btn-icon btn-icon--edit" data-action="edit" data-id="${b.id}" title="Editar">✏️</button>
                <button class="btn-icon btn-icon--delete" data-action="delete" data-id="${b.id}" title="Eliminar">🗑️</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;

    container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const { action, id } = e.currentTarget.dataset;
        if (action === 'edit')   _openEdit(parseInt(id));
        if (action === 'delete') _confirmDelete(parseInt(id));
      });
    });
  }

  function _setupSearch() {
    document.getElementById('ben-search').addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = _beneficiarios.filter(b => b.nombre.toLowerCase().includes(q));
      _renderList(filtered);
    });
  }

  function _setupForm() {
    document.getElementById('btn-nuevo-beneficiario').addEventListener('click', _openNew);
    document.getElementById('btn-cancel-ben').addEventListener('click', _closeForm);
    document.getElementById('form-beneficiario').addEventListener('submit', _handleSubmit);
  }

  function _openNew() {
    document.getElementById('ben-form-title').textContent = 'Nuevo Beneficiario';
    document.getElementById('ben-edit-id').value  = '';
    document.getElementById('ben-nombre').value   = '';
    _showForm();
  }

  function _openEdit(id) {
    const ben = _beneficiarios.find(b => b.id === id);
    if (!ben) return;
    document.getElementById('ben-form-title').textContent = 'Editar Beneficiario';
    document.getElementById('ben-edit-id').value  = ben.id;
    document.getElementById('ben-nombre').value   = ben.nombre;
    _showForm();
  }

  function _showForm() {
    const fc = document.getElementById('beneficiario-form-container');
    fc.style.display = 'block';
    fc.scrollIntoView({ behavior: 'smooth' });
  }
  function _closeForm() {
    document.getElementById('beneficiario-form-container').style.display = 'none';
  }

  async function _handleSubmit(e) {
    e.preventDefault();
    const id     = document.getElementById('ben-edit-id').value;
    const nombre = document.getElementById('ben-nombre').value.trim();
    const errEl  = document.getElementById('ben-nombre-error');
    errEl.textContent = '';

    if (!nombre) { errEl.textContent = 'Nombre requerido.'; return; }

    const btn = document.getElementById('btn-save-ben');
    ui.setButtonLoading(btn, true);
    try {
      if (id) {
        await beneficiarioService.actualizar(parseInt(id), nombre);
        ui.showToast('Beneficiario actualizado.', 'success');
      } else {
        await beneficiarioService.crear(nombre);
        ui.showToast('Beneficiario creado.', 'success');
      }
      _closeForm();
      await _loadBeneficiarios();
    } catch (err) {
      ui.showToast(err.message || 'Error al guardar.', 'error');
    } finally {
      ui.setButtonLoading(btn, false);
    }
  }

  function _confirmDelete(id) {
    const ben = _beneficiarios.find(b => b.id === id);
    ui.showModal(
      'Eliminar Beneficiario',
      `<p>¿Eliminar a <strong>"${ben?.nombre}"</strong>?</p>`,
      async () => {
        try {
          await beneficiarioService.eliminar(id);
          ui.showToast('Beneficiario eliminado.', 'success');
          await _loadBeneficiarios();
        } catch (err) {
          ui.showToast(err.message || 'Error al eliminar.', 'error');
        }
      }
    );
  }

  return { render, init };
})();
