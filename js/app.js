/**
 * LAYER 4 – APP ROUTER & SHELL
 * Hash-based SPA router. Manages navigation, auth guards, and navbar rendering.
 * Depends on: all pages, all services, ui.js
 */

const app = (() => {

  // Route definitions: hash → { page, requiresAuth, requiresWorkspace, title }
  const ROUTES = {
    '#login':         { page: loginPage,        requiresAuth: false,  requiresWorkspace: false, title: 'Iniciar Sesión' },
    '#workspace':     { page: workspacePage,    requiresAuth: true,   requiresWorkspace: false, title: 'Workspace' },
    '#dashboard':     { page: dashboardPage,    requiresAuth: true,   requiresWorkspace: true,  title: 'Dashboard' },
    '#categorias':    { page: categoriasPage,   requiresAuth: true,   requiresWorkspace: true,  title: 'Categorías' },
    '#beneficiarios': { page: beneficiariosPage,requiresAuth: true,   requiresWorkspace: true,  title: 'Beneficiarios' },
    '#transacciones': { page: transaccionesPage,requiresAuth: true,   requiresWorkspace: true,  title: 'Movimientos' },
  };

  const DEFAULT_AUTH_ROUTE     = '#workspace';
  const DEFAULT_UNAUTH_ROUTE   = '#login';
  const DEFAULT_WORKSPACE_ROUTE = '#dashboard';

  function _getHash() {
    return window.location.hash || DEFAULT_UNAUTH_ROUTE;
  }

  function _navigate(hash) {
    window.location.hash = hash;
  }

  async function _render() {
    const hash  = _getHash();
    const route = ROUTES[hash];

    // Unknown route → redirect
    if (!route) {
      _navigate(authService.isAuthenticated() ? DEFAULT_AUTH_ROUTE : DEFAULT_UNAUTH_ROUTE);
      return;
    }

    // Auth guard
    if (route.requiresAuth && !authService.isAuthenticated()) {
      _navigate(DEFAULT_UNAUTH_ROUTE);
      return;
    }

    // Workspace guard
    if (route.requiresWorkspace && !workspaceService.getActiveWorkspaceId()) {
      _navigate('#workspace');
      return;
    }

    // If authenticated and going to login, redirect
    if (hash === '#login' && authService.isAuthenticated()) {
      const wsId = workspaceService.getActiveWorkspaceId();
      _navigate(wsId ? DEFAULT_WORKSPACE_ROUTE : DEFAULT_AUTH_ROUTE);
      return;
    }

    // Render navbar
    _renderNavbar(hash);

    // Render page
    const appEl = document.getElementById('app');
    appEl.innerHTML = route.page.render();
    document.title  = `FinanzApp | ${route.title}`;

    // Init page logic
    if (typeof route.page.init === 'function') {
      await route.page.init();
    }
  }

  function _renderNavbar(activeHash) {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const isAuth = authService.isAuthenticated();
    const wsId   = workspaceService.getActiveWorkspaceId();
    const wsName = workspaceService.getActiveWorkspaceName();

    if (!isAuth) {
      navbar.style.display = 'none';
      return;
    }

    navbar.style.display = 'flex';

    const navLinks = [
      { hash: '#dashboard',     label: '📊 Dashboard',     needsWs: true },
      { hash: '#categorias',    label: '🏷 Categorías',     needsWs: true },
      { hash: '#beneficiarios', label: '👤 Beneficiarios',  needsWs: true },
      { hash: '#transacciones', label: '💳 Movimientos',    needsWs: true },
    ];

    navbar.innerHTML = `
      <div class="nav__brand">
        <span class="nav__logo">💰</span>
        <span class="nav__title">FinanzApp</span>
        ${wsName ? `<span class="nav__workspace">🏢 ${wsName}</span>` : ''}
      </div>
      <nav class="nav__links" id="nav-links">
        ${navLinks.map(link =>
          (!link.needsWs || wsId)
            ? `<a href="${link.hash}" class="nav__link ${activeHash === link.hash ? 'nav__link--active' : ''}">${link.label}</a>`
            : ''
        ).join('')}
        ${!wsId ? `<a href="#workspace" class="nav__link ${activeHash === '#workspace' ? 'nav__link--active' : ''}">🏢 Workspace</a>` : ''}
      </nav>
      <div class="nav__actions">
        <span class="nav__user">👋 ${authService.getNombre()}</span>
        <button class="btn btn--ghost btn--sm" id="btn-logout">Salir</button>
        <button class="nav__hamburger" id="nav-hamburger" aria-label="Menú">☰</button>
      </div>
    `;

    // Hamburger menu (mobile)
    document.getElementById('nav-hamburger')?.addEventListener('click', () => {
      document.getElementById('nav-links')?.classList.toggle('nav__links--open');
    });

    // Close menu on link click (mobile)
    document.querySelectorAll('.nav__link').forEach(a => {
      a.addEventListener('click', () => {
        document.getElementById('nav-links')?.classList.remove('nav__links--open');
      });
    });

    // Logout
    document.getElementById('btn-logout')?.addEventListener('click', () => {
      authService.logout();
      workspaceService.clearActive();
      _navigate('#login');
      ui.showToast('Sesión cerrada.', 'info');
    });
  }

  function init() {
    // Listen to hash changes
    window.addEventListener('hashchange', _render);
    // Initial render
    _render();
  }

  return { init };
})();

// Bootstrap the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => app.init());
