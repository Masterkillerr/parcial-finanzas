/**
 * LAYER 3 – CATEGORIAS PAGE
 * CRUD interface for categories.
 * Rules (from parcial_finanzas.md):
 *   - Tipo must be INGRESO or GASTO (uppercase)
 *   - Must use workspace
 * Depends on: services/categoriaService.js, ui.js
 */

const categoriasPage = (() => {

  function render() {
    return `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2 class="page-title">Categorías</h2>
          <p class="page-subtitle">Organiza tus movimientos por categoría</p>
        </div>
        <button class="btn btn--primary" id="btn-nueva-categoria">+ Nueva Categoría</button>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-tabs" role="tablist">
        <button class="filter-tab filter-tab--active" data-filter="all">Todas</button>
        <button class="filter-tab filter-tab--ingreso" data-filter="INGRESO">Ingresos</button>
        <button class="filter-tab filter-tab--gasto" data-filter="GASTO">Gastos</button>
      </div>

      <!-- Form (hidden by default) -->
      <div id="categoria-form-container" class="card form-card" style="display:none;">
        <h3 class="form-card__title" id="categoria-form-title">Nueva Categoría</h3>
        <form id="form-categoria" novalidate>
          <input type="hidden" id="categoria-edit-id"/>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="cat-nombre">Nombre</label>
              <input class="form-input" type="text" id="cat-nombre" placeholder="Ej: Alimentación" required/>
              <span class="form-error" id="cat-nombre-error"></span>
            </div>
            <div class="form-group">
              <label class="form-label" for="cat-tipo">Tipo</label>
              <select class="form-input form-select" id="cat-tipo" required>
                <option value="">-- Seleccionar --</option>
                <option value="INGRESO">INGRESO</option>
                <option value="GASTO">GASTO</option>
              </select>
              <span class="form-error" id="cat-tipo-error"></span>
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn--ghost" id="btn-cancel-cat">Cancelar</button>
            <button type="submit" class="btn btn--primary" id="btn-save-cat">Guardar</button>
          </div>
        </form>
      </div>

      <!-- List -->
      <div id="categorias-list" class="cards-grid"></div>
    </div>`;
  }

  let _categorias = [];
  let _filterActivo = 'all';

  async function init() {
    _setupForm();
    _setupFilters();
    await _loadCategorias();
  }

  async function _loadCategorias() {
    const container = document.getElementById('categorias-list');
    ui.showLoading();
    try {
      _categorias = await categoriaService.listar();
      _renderList();
    } catch (err) {
      ui.renderError(container, err.message);
    } finally {
      ui.hideLoading();
    }
  }

  function _renderList() {
    const container = document.getElementById('categorias-list');
    let filtered = _categorias;
    if (_filterActivo !== 'all') {
      filtered = _categorias.filter(c => c.tipo === _filterActivo);
    }

    if (filtered.length === 0) {
      ui.renderEmpty(container, 'No hay categorías. ¡Crea la primera!');
      return;
    }

    container.innerHTML = filtered.map(c => `
      <div class="item-card item-card--${c.tipo.toLowerCase()} glass" data-id="${c.id}">
        <div class="item-card__header">
          <span class="badge badge--${c.tipo.toLowerCase()}">${c.tipo}</span>
          <div class="item-card__actions">
            <button class="btn-icon btn-icon--edit" title="Editar" data-action="edit" data-id="${c.id}">✏️</button>
            <button class="btn-icon btn-icon--delete" title="Eliminar" data-action="delete" data-id="${c.id}">🗑️</button>
          </div>
        </div>
        <h4 class="item-card__name">${c.nombre}</h4>
        <span class="item-card__status ${c.activa ? 'status--active' : 'status--inactive'}">
          ${c.activa ? 'Activa' : 'Inactiva'}
        </span>
      </div>
    `).join('');

    container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const { action, id } = e.currentTarget.dataset;
        if (action === 'edit')   _openEdit(parseInt(id));
        if (action === 'delete') _confirmDelete(parseInt(id));
      });
    });
  }

  function _setupFilters() {
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('filter-tab--active'));
        tab.classList.add('filter-tab--active');
        _filterActivo = tab.dataset.filter;
        _renderList();
      });
    });
  }

  function _setupForm() {
    document.getElementById('btn-nueva-categoria').addEventListener('click', _openNew);
    document.getElementById('btn-cancel-cat').addEventListener('click', _closeForm);
    document.getElementById('form-categoria').addEventListener('submit', _handleSubmit);
  }

  function _openNew() {
    document.getElementById('categoria-form-title').textContent = 'Nueva Categoría';
    document.getElementById('categoria-edit-id').value = '';
    document.getElementById('cat-nombre').value = '';
    document.getElementById('cat-tipo').value   = '';
    _showForm();
  }

  function _openEdit(id) {
    const cat = _categorias.find(c => c.id === id);
    if (!cat) return;
    document.getElementById('categoria-form-title').textContent = 'Editar Categoría';
    document.getElementById('categoria-edit-id').value = cat.id;
    document.getElementById('cat-nombre').value = cat.nombre;
    document.getElementById('cat-tipo').value   = cat.tipo;
    _showForm();
  }

  function _showForm() {
    const fc = document.getElementById('categoria-form-container');
    fc.style.display = 'block';
    fc.scrollIntoView({ behavior: 'smooth' });
  }

  function _closeForm() {
    document.getElementById('categoria-form-container').style.display = 'none';
  }

  async function _handleSubmit(e) {
    e.preventDefault();
    const id     = document.getElementById('categoria-edit-id').value;
    const nombre = document.getElementById('cat-nombre').value.trim();
    const tipo   = document.getElementById('cat-tipo').value;

    // Clear errors
    ['cat-nombre-error', 'cat-tipo-error'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.textContent = ''; el.style.display = 'none'; }
    });

    if (!nombre) { _showFieldError('cat-nombre-error', 'Requerido.'); return; }
    if (!tipo)   { _showFieldError('cat-tipo-error', 'Selecciona un tipo.'); return; }

    const btn = document.getElementById('btn-save-cat');
    ui.setButtonLoading(btn, true);
    try {
      if (id) {
        await categoriaService.actualizar(parseInt(id), nombre, tipo);
        ui.showToast('Categoría actualizada.', 'success');
      } else {
        await categoriaService.crear(nombre, tipo);
        ui.showToast('Categoría creada.', 'success');
      }
      _closeForm();
      await _loadCategorias();
    } catch (err) {
      ui.showToast(err.message || 'Error al guardar.', 'error');
    } finally {
      ui.setButtonLoading(btn, false);
    }
  }

  function _confirmDelete(id) {
    const cat = _categorias.find(c => c.id === id);
    ui.showModal(
      'Eliminar Categoría',
      `<p>¿Estás seguro de eliminar la categoría <strong>"${cat?.nombre}"</strong>?</p>`,
      async () => {
        try {
          await categoriaService.eliminar(id);
          ui.showToast('Categoría eliminada.', 'success');
          await _loadCategorias();
        } catch (err) {
          ui.showToast(err.message || 'Error al eliminar.', 'error');
        }
      }
    );
  }

  function _showFieldError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  }

  return { render, init };
})();
