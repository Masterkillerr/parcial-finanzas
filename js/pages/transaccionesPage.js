/**
 * LAYER 3 – TRANSACCIONES PAGE
 * Register and list income/expense transactions.
 * Rules (parcial_finanzas.md):
 *   - Must have at least one category before registering movements
 *   - tipo: INGRESO or GASTO (uppercase)
 * Depends on: services/transactionService.js, services/categoriaService.js,
 *             services/beneficiarioService.js, ui.js
 */

const transaccionesPage = (() => {

  function render() {
    return `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2 class="page-title">Movimientos</h2>
          <p class="page-subtitle">Registra ingresos y gastos de tu workspace</p>
        </div>
        <button class="btn btn--primary" id="btn-nueva-tx">+ Nuevo Movimiento</button>
      </div>

      <!-- Summary chips -->
      <div class="tx-summary" id="tx-summary">
        <div class="tx-chip tx-chip--ingreso">
          <span class="tx-chip__label">Total Ingresos</span>
          <span class="tx-chip__value" id="chip-ingresos">$0</span>
        </div>
        <div class="tx-chip tx-chip--gasto">
          <span class="tx-chip__label">Total Gastos</span>
          <span class="tx-chip__value" id="chip-gastos">$0</span>
        </div>
        <div class="tx-chip tx-chip--balance">
          <span class="tx-chip__label">Balance</span>
          <span class="tx-chip__value" id="chip-balance">$0</span>
        </div>
      </div>

      <!-- New Transaction Form (hidden) -->
      <div id="tx-form-container" class="card form-card" style="display:none;">
        <h3 class="form-card__title">Registrar Movimiento</h3>
        <form id="form-transaccion" novalidate>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="tx-tipo">Tipo</label>
              <select class="form-input form-select" id="tx-tipo" required>
                <option value="">-- Seleccionar --</option>
                <option value="INGRESO">INGRESO</option>
                <option value="GASTO">GASTO</option>
              </select>
              <span class="form-error" id="tx-tipo-error"></span>
            </div>
            <div class="form-group">
              <label class="form-label" for="tx-monto">Monto</label>
              <input class="form-input" type="number" id="tx-monto" placeholder="0.00" min="0.01" step="0.01" required/>
              <span class="form-error" id="tx-monto-error"></span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="tx-categoria">Categoría</label>
              <select class="form-input form-select" id="tx-categoria" required>
                <option value="">-- Seleccionar --</option>
              </select>
              <span class="form-error" id="tx-categoria-error"></span>
            </div>
            <div class="form-group">
              <label class="form-label" for="tx-beneficiario">Beneficiario</label>
              <select class="form-input form-select" id="tx-beneficiario">
                <option value="">-- Ninguno --</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="tx-fecha">Fecha</label>
              <input class="form-input" type="date" id="tx-fecha" required/>
              <span class="form-error" id="tx-fecha-error"></span>
            </div>
            <div class="form-group">
              <label class="form-label" for="tx-medio">Medio de Pago</label>
              <select class="form-input form-select" id="tx-medio">
                <option value="">-- Seleccionar --</option>
                <option value="EFECTIVO">Efectivo</option>
                <option value="TRANSFERENCIA">Transferencia</option>
                <option value="TARJETA_DEBITO">Tarjeta Débito</option>
                <option value="TARJETA_CREDITO">Tarjeta Crédito</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="tx-descripcion">Descripción</label>
            <input class="form-input" type="text" id="tx-descripcion" placeholder="Opcional: describe el movimiento"/>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn--ghost" id="btn-cancel-tx">Cancelar</button>
            <button type="submit" class="btn btn--primary" id="btn-save-tx">Guardar</button>
          </div>
        </form>
      </div>

      <!-- Filter row -->
      <div class="filter-tabs">
        <button class="filter-tab filter-tab--active" data-filter="all">Todos</button>
        <button class="filter-tab filter-tab--ingreso" data-filter="INGRESO">Ingresos</button>
        <button class="filter-tab filter-tab--gasto" data-filter="GASTO">Gastos</button>
      </div>

      <!-- Transactions List -->
      <div id="tx-list" class="list-container"></div>
    </div>`;
  }

  let _transacciones  = [];
  let _categorias     = [];
  let _beneficiarios  = [];
  let _filtroActivo   = 'all';

  async function init() {
    _setupForm();
    _setupFilters();
    await _loadData();
  }

  async function _loadData() {
    ui.showLoading();
    try {
      [_transacciones, _categorias, _beneficiarios] = await Promise.all([
        transactionService.listar(),
        categoriaService.listar(),
        beneficiarioService.listar(),
      ]);
      _populateSelects();
      _renderList();
      _updateSummary();
    } catch (err) {
      ui.renderError(document.getElementById('tx-list'), err.message);
    } finally {
      ui.hideLoading();
    }
  }

  function _populateSelects() {
    const catSelect = document.getElementById('tx-categoria');
    const benSelect = document.getElementById('tx-beneficiario');
    if (!catSelect || !benSelect) return;

    // Clear and refill
    catSelect.innerHTML = '<option value="">-- Seleccionar --</option>';
    _categorias.forEach(c => {
      catSelect.innerHTML += `<option value="${c.id}">[${c.tipo}] ${c.nombre}</option>`;
    });

    benSelect.innerHTML = '<option value="">-- Ninguno --</option>';
    _beneficiarios.forEach(b => {
      benSelect.innerHTML += `<option value="${b.id}">${b.nombre}</option>`;
    });
  }

  function _updateSummary() {
    const ingresos = _transacciones
      .filter(t => t.tipo === 'INGRESO')
      .reduce((s, t) => s + (t.monto || 0), 0);
    const gastos = _transacciones
      .filter(t => t.tipo === 'GASTO')
      .reduce((s, t) => s + (t.monto || 0), 0);
    const balance = ingresos - gastos;

    document.getElementById('chip-ingresos').textContent = ui.formatCurrency(ingresos);
    document.getElementById('chip-gastos').textContent   = ui.formatCurrency(gastos);
    const balEl = document.getElementById('chip-balance');
    balEl.textContent = ui.formatCurrency(balance);
    balEl.className = `tx-chip__value ${balance >= 0 ? 'text--positive' : 'text--negative'}`;
  }

  function _renderList() {
    const container = document.getElementById('tx-list');
    let filtered = _transacciones;
    if (_filtroActivo !== 'all') {
      filtered = _transacciones.filter(t => t.tipo === _filtroActivo);
    }

    if (!filtered || filtered.length === 0) {
      ui.renderEmpty(container, 'No hay movimientos registrados.');
      return;
    }

    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Categoría</th>
            <th>Beneficiario</th>
            <th>Descripción</th>
            <th>Medio</th>
            <th class="text-right">Monto</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(t => `
            <tr class="tx-row tx-row--${t.tipo.toLowerCase()}">
              <td>${ui.formatDate(t.fecha)}</td>
              <td><span class="badge badge--${t.tipo.toLowerCase()}">${t.tipo}</span></td>
              <td>${t.categoriaNombre || '—'}</td>
              <td>${t.beneficiarioNombre || '—'}</td>
              <td class="text-muted">${t.descripcion || '—'}</td>
              <td>${t.medioPago || '—'}</td>
              <td class="text-right amount amount--${t.tipo.toLowerCase()}">${ui.formatCurrency(t.monto)}</td>
              <td>
                <button class="btn-icon btn-icon--delete" data-action="delete" data-id="${t.id}" title="Eliminar">🗑️</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;

    container.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', () => _confirmDelete(parseInt(btn.dataset.id)));
    });
  }

  function _setupFilters() {
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('filter-tab--active'));
        tab.classList.add('filter-tab--active');
        _filtroActivo = tab.dataset.filter;
        _renderList();
      });
    });
  }

  function _setupForm() {
    document.getElementById('btn-nueva-tx').addEventListener('click', _openForm);
    document.getElementById('btn-cancel-tx').addEventListener('click', _closeForm);
    document.getElementById('form-transaccion').addEventListener('submit', _handleSubmit);

    const tipoSelect = document.getElementById('tx-tipo');
    const medioGroup = document.getElementById('tx-medio').closest('.form-group');
    if (tipoSelect && medioGroup) {
      tipoSelect.addEventListener('change', (e) => {
        if (e.target.value === 'INGRESO') {
          medioGroup.style.display = 'none';
          document.getElementById('tx-medio').value = '';
        } else {
          medioGroup.style.display = 'flex';
        }
      });
    }

    // Set today's date as default
    const fechaInput = document.getElementById('tx-fecha');
    if (fechaInput) fechaInput.value = new Date().toISOString().split('T')[0];
  }

  function _openForm() {
    const fc = document.getElementById('tx-form-container');
    fc.style.display = 'block';
    fc.scrollIntoView({ behavior: 'smooth' });
    // Reset form
    document.getElementById('form-transaccion').reset();
    document.getElementById('tx-fecha').value = new Date().toISOString().split('T')[0];
    _populateSelects();
  }
  function _closeForm() {
    document.getElementById('tx-form-container').style.display = 'none';
  }

  async function _handleSubmit(e) {
    e.preventDefault();
    const tipo         = document.getElementById('tx-tipo').value;
    const monto        = document.getElementById('tx-monto').value;
    const categoriaId  = document.getElementById('tx-categoria').value;
    const beneficiario = document.getElementById('tx-beneficiario').value;
    const fecha        = document.getElementById('tx-fecha').value;
    const descripcion  = document.getElementById('tx-descripcion').value.trim();
    const medioPago    = document.getElementById('tx-medio').value;

    // Clear errors
    ['tx-tipo-error','tx-monto-error','tx-categoria-error','tx-fecha-error'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });

    let valid = true;
    if (!tipo)        { document.getElementById('tx-tipo-error').textContent      = 'Requerido.'; valid = false; }
    if (!monto || parseFloat(monto) <= 0) { document.getElementById('tx-monto-error').textContent   = 'Monto inválido.'; valid = false; }
    if (!categoriaId) { document.getElementById('tx-categoria-error').textContent = 'Requerido.'; valid = false; }
    if (!fecha)       { document.getElementById('tx-fecha-error').textContent     = 'Requerido.'; valid = false; }
    if (!valid) return;

    const btn = document.getElementById('btn-save-tx');
    ui.setButtonLoading(btn, true);
    try {
      await transactionService.crear({
        tipo,
        monto: parseFloat(monto),
        categoriaId:  parseInt(categoriaId),
        beneficiarioId: beneficiario ? parseInt(beneficiario) : null,
        fecha,
        descripcion:  descripcion || null,
        medioPago:    tipo === 'GASTO' ? (medioPago || null) : null,
      });
      ui.showToast('Movimiento registrado.', 'success');
      _closeForm();
      await _loadData();
    } catch (err) {
      ui.showToast(err.message || 'Error al guardar.', 'error');
    } finally {
      ui.setButtonLoading(btn, false);
    }
  }

  function _confirmDelete(id) {
    const tx = _transacciones.find(t => t.id === id);
    ui.showModal(
      'Eliminar Movimiento',
      `<p>¿Eliminar movimiento de <strong>${ui.formatCurrency(tx?.monto)}</strong> del ${ui.formatDate(tx?.fecha)}?</p>`,
      async () => {
        try {
          await transactionService.eliminar(id);
          ui.showToast('Movimiento eliminado.', 'success');
          await _loadData();
        } catch (err) {
          ui.showToast(err.message || 'Error al eliminar.', 'error');
        }
      }
    );
  }

  return { render, init };
})();
