/**
 * LAYER 3 – UI HELPERS
 * Shared UI utilities: toasts, modals, loading state, formatting.
 * No dependencies on other app layers.
 */

const ui = (() => {

  // ── Toast Notifications ────────────────────────────────────────────────────

  function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;

    const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
    toast.innerHTML = `
      <span class="toast__icon">${icons[type] || icons.info}</span>
      <span class="toast__message">${message}</span>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('toast--visible'));

    setTimeout(() => {
      toast.classList.remove('toast--visible');
      toast.addEventListener('transitionend', () => toast.remove());
    }, duration);
  }

  // ── Loading Overlay ────────────────────────────────────────────────────────

  function showLoading() {
    const el = document.getElementById('loading-overlay');
    if (el) el.classList.add('loading--active');
  }

  function hideLoading() {
    const el = document.getElementById('loading-overlay');
    if (el) el.classList.remove('loading--active');
  }

  // ── Modal ──────────────────────────────────────────────────────────────────

  function showModal(title, bodyHTML, onConfirm = null) {
    const modal   = document.getElementById('modal');
    const mTitle  = document.getElementById('modal-title');
    const mBody   = document.getElementById('modal-body');
    const mConfirm= document.getElementById('modal-confirm');
    const mCancel = document.getElementById('modal-cancel');

    if (!modal) return;
    mTitle.textContent = title;
    mBody.innerHTML    = bodyHTML;

    modal.classList.add('modal--active');

    // Clone to remove old listeners
    const newConfirm = mConfirm.cloneNode(true);
    mConfirm.parentNode.replaceChild(newConfirm, mConfirm);
    const newCancel = mCancel.cloneNode(true);
    mCancel.parentNode.replaceChild(newCancel, mCancel);

    newCancel.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) hideModal(); });

    if (onConfirm) {
      newConfirm.style.display = 'block';
      newConfirm.addEventListener('click', () => { hideModal(); onConfirm(); });
    } else {
      newConfirm.style.display = 'none';
    }
  }

  function hideModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.classList.remove('modal--active');
  }

  // ── Formatting Helpers ─────────────────────────────────────────────────────

  function formatCurrency(amount, currency = 'COP') {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount || 0);
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  }

  // ── Render helpers ─────────────────────────────────────────────────────────

  function renderError(container, message) {
    container.innerHTML = `<div class="empty-state">
      <span class="empty-state__icon">⚠</span>
      <p>${message}</p>
    </div>`;
  }

  function renderEmpty(container, message = 'No hay datos disponibles.') {
    container.innerHTML = `<div class="empty-state">
      <span class="empty-state__icon">📭</span>
      <p>${message}</p>
    </div>`;
  }

  function setButtonLoading(btn, loading) {
    if (loading) {
      btn.dataset.originalText = btn.textContent;
      btn.textContent = 'Cargando...';
      btn.disabled = true;
    } else {
      btn.textContent = btn.dataset.originalText || btn.textContent;
      btn.disabled = false;
    }
  }

  return {
    showToast, showLoading, hideLoading,
    showModal, hideModal,
    formatCurrency, formatDate,
    renderError, renderEmpty, setButtonLoading,
  };
})();
