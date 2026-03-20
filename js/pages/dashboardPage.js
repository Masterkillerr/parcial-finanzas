/**
 * LAYER 3 – DASHBOARD PAGE
 * Visualizes financial data with charts.
 * Uses Chart.js (loaded via CDN in index.html).
 * Depends on: services/dashboardService.js, ui.js
 */

const dashboardPage = (() => {
  let _donutChart = null;
  let _barChart   = null;

  function render() {
    const wsNombre = workspaceService.getActiveWorkspaceName();
    const now      = new Date();
    const mesActual = now.toLocaleString('es-CO', { month: 'long', year: 'numeric' });

    return `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2 class="page-title">Dashboard</h2>
          <p class="page-subtitle">
            <span class="badge badge--workspace">🏢 ${wsNombre}</span>
            <span class="badge badge--date">📅 ${mesActual}</span>
          </p>
        </div>
        <button class="btn btn--ghost" id="btn-refresh-dash">↻ Actualizar</button>
      </div>

      <!-- Month selector -->
      <div class="month-selector">
        <div class="form-row form-row--inline">
          <div class="form-group">
            <label class="form-label" for="dash-anio">Año</label>
            <input class="form-input form-input--sm" type="number" id="dash-anio" value="${now.getFullYear()}" min="2020" max="2030"/>
          </div>
          <div class="form-group">
            <label class="form-label" for="dash-mes">Mes</label>
            <select class="form-input form-select form-input--sm" id="dash-mes">
              ${[...Array(12)].map((_, i) =>
                `<option value="${i+1}" ${i+1 === now.getMonth()+1 ? 'selected' : ''}>
                  ${new Date(2000, i).toLocaleString('es-CO', { month: 'long' })}
                </option>`
              ).join('')}
            </select>
          </div>
          <button class="btn btn--secondary btn--sm" id="btn-apply-month">Aplicar</button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-grid" id="kpi-grid">
        <div class="kpi-card kpi-card--ingreso glass">
          <div class="kpi-card__icon">📈</div>
          <div class="kpi-card__data">
            <span class="kpi-card__label">Total Ingresos</span>
            <span class="kpi-card__value" id="kpi-ingresos">—</span>
          </div>
        </div>
        <div class="kpi-card kpi-card--gasto glass">
          <div class="kpi-card__icon">📉</div>
          <div class="kpi-card__data">
            <span class="kpi-card__label">Total Gastos</span>
            <span class="kpi-card__value" id="kpi-gastos">—</span>
          </div>
        </div>
        <div class="kpi-card kpi-card--balance glass">
          <div class="kpi-card__icon">💼</div>
          <div class="kpi-card__data">
            <span class="kpi-card__label">Balance Neto</span>
            <span class="kpi-card__value" id="kpi-balance">—</span>
          </div>
        </div>
      </div>

      <!-- Charts row -->
      <div class="charts-grid">
        <div class="chart-card glass">
          <h3 class="chart-card__title">Gastos por Categoría</h3>
          <div class="chart-wrapper">
            <canvas id="chart-gastos-categoria"></canvas>
          </div>
          <div id="no-data-donut" class="empty-state" style="display:none;">
            <span class="empty-state__icon">📊</span>
            <p>Sin datos de gastos para este período.</p>
          </div>
        </div>
        <div class="chart-card glass">
          <h3 class="chart-card__title">Flujo de Caja Anual</h3>
          <div class="chart-wrapper">
            <canvas id="chart-flujo-caja"></canvas>
          </div>
          <div id="no-data-bar" class="empty-state" style="display:none;">
            <span class="empty-state__icon">📊</span>
            <p>Sin datos de flujo para este año.</p>
          </div>
        </div>
      </div>
    </div>`;
  }

  async function init() {
    const now = new Date();
    document.getElementById('btn-refresh-dash').addEventListener('click', () => _loadAll());
    document.getElementById('btn-apply-month').addEventListener('click', () => _loadAll());
    await _loadAll();
  }

  async function _loadAll() {
    const anio = parseInt(document.getElementById('dash-anio')?.value || new Date().getFullYear());
    const mes  = parseInt(document.getElementById('dash-mes')?.value  || new Date().getMonth() + 1);

    ui.showLoading();
    try {
      const [summary, gastosCat, flujo] = await Promise.all([
        dashboardService.resumenMensual(anio, mes),
        dashboardService.gastosPorCategoria(anio, mes),
        dashboardService.flujoCaja(anio),
      ]);

      _renderKpis(summary);
      _renderDonutChart(gastosCat);
      _renderBarChart(flujo);
    } catch (err) {
      ui.showToast(err.message || 'Error al cargar el dashboard.', 'error');
    } finally {
      ui.hideLoading();
    }
  }

  function _renderKpis(summary) {
    const ingresos = summary?.totalIngresos || 0;
    const gastos   = summary?.totalGastos   || 0;
    const balance  = summary?.balanceNeto   || 0;

    document.getElementById('kpi-ingresos').textContent = ui.formatCurrency(ingresos);
    document.getElementById('kpi-gastos').textContent   = ui.formatCurrency(gastos);
    const balEl = document.getElementById('kpi-balance');
    balEl.textContent  = ui.formatCurrency(balance);
    balEl.style.color  = balance >= 0 ? 'var(--color-ingreso)' : 'var(--color-gasto)';
  }

  function _renderDonutChart(data) {
    const canvas  = document.getElementById('chart-gastos-categoria');
    const noData  = document.getElementById('no-data-donut');

    if (!data || data.length === 0) {
      canvas.style.display = 'none';
      noData.style.display = 'flex';
      return;
    }
    canvas.style.display = 'block';
    noData.style.display = 'none';

    if (_donutChart) _donutChart.destroy();

    const defaultColors = [
      '#6366f1','#8b5cf6','#ec4899','#f43f5e','#f97316',
      '#eab308','#22c55e','#14b8a6','#3b82f6','#06b6d4',
    ];

    _donutChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.categoria),
        datasets: [{
          data: data.map(d => d.total),
          backgroundColor: data.map((d, i) => d.color || defaultColors[i % defaultColors.length]),
          borderWidth: 2,
          borderColor: 'var(--color-bg-card)',
          hoverOffset: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'var(--color-text-secondary)',
              padding: 16,
              font: { size: 12, family: "'Inter', sans-serif" },
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ui.formatCurrency(ctx.parsed)}`,
            },
          },
        },
      },
    });
  }

  function _renderBarChart(data) {
    const canvas = document.getElementById('chart-flujo-caja');
    const noData = document.getElementById('no-data-bar');

    if (!data || data.length === 0) {
      canvas.style.display = 'none';
      noData.style.display = 'flex';
      return;
    }
    canvas.style.display = 'block';
    noData.style.display = 'none';

    if (_barChart) _barChart.destroy();

    const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

    // Normalize data – API returns array of maps {mes, ingresos, gastos} or similar
    const labels   = data.map(d => meses[(d.mes || d.MES || 1) - 1] || d.mes);
    const ingresos = data.map(d => d.ingresos || d.INGRESOS || d.totalIngresos || 0);
    const gastos   = data.map(d => d.gastos   || d.GASTOS   || d.totalGastos   || 0);

    _barChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Ingresos',
            data: ingresos,
            backgroundColor: 'rgba(34,197,94,0.7)',
            borderColor: '#22c55e',
            borderWidth: 1,
            borderRadius: 6,
          },
          {
            label: 'Gastos',
            data: gastos,
            backgroundColor: 'rgba(239,68,68,0.7)',
            borderColor: '#ef4444',
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: 'var(--color-text-secondary)',
              font: { family: "'Inter', sans-serif" },
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${ui.formatCurrency(ctx.parsed.y)}`,
            },
          },
        },
        scales: {
          x: {
            ticks: { color: 'var(--color-text-secondary)' },
            grid: { color: 'rgba(255,255,255,0.05)' },
          },
          y: {
            ticks: {
              color: 'var(--color-text-secondary)',
              callback: (v) => ui.formatCurrency(v),
            },
            grid: { color: 'rgba(255,255,255,0.05)' },
          },
        },
      },
    });
  }

  return { render, init };
})();
