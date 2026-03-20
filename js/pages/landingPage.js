/**
 * LAYER 3 – Landing Page
 * General information page shown to unauthenticated users.
 */

const landingPage = (() => {
  function render() {
    return `
      <div class="landing-page">
        <!-- Landing Navbar (Simplified, auth buttons only) -->
        <header class="landing-nav">
          <div class="nav__brand">
            <span class="nav__logo">💰</span>
            <span class="nav__title" style="font-size: 1.25rem;">FinanzApp</span>
          </div>
          <div class="landing-nav__actions">
            <a href="#login" class="btn btn--ghost">Iniciar Sesión</a>
            <a href="#login" class="btn btn--primary" onclick="setTimeout(() => document.getElementById('tab-register')?.click(), 50)">Registrarse</a>
          </div>
        </header>

        <!-- Hero Section -->
        <section class="hero-section">
          <div class="hero-glow"></div>
          <h1 class="hero-title">El control de tus finanzas <br><span class="highlight">reinventado.</span></h1>
          <p class="hero-subtitle">
            Una plataforma inteligente para visualizar, planificar y optimizar tu dinero de forma intuitiva.
            Registra movimientos, administra beneficiarios y analiza tus gastos con un diseño premium.
          </p>
          <div class="hero-actions">
            <a href="#login" class="btn btn--primary" style="padding: 0.75rem 1.5rem; font-size: 1rem;" onclick="setTimeout(() => document.getElementById('tab-register')?.click(), 50)">Comenzar Ahora →</a>
            <a href="#login" class="btn btn--secondary" style="padding: 0.75rem 1.5rem; font-size: 1rem;">Ya tengo cuenta</a>
          </div>
        </section>

        <!-- Features Section -->
        <section class="features-section">
          <div class="features-grid">
            
            <div class="feature-card">
              <div class="feature-icon">🏢</div>
              <h3 class="feature-title">Multi-Workspace</h3>
              <p class="feature-text">Gestiona perfiles financieros separados (ej. Casa, Negocio, Personal) de forma totalmente aislada dentro de una misma cuenta.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <h3 class="feature-title">Análisis Visual</h3>
              <p class="feature-text">Descubre a dónde va tu dinero con gráficas interactivas. Monitorea tu flujo de caja anual y gastos por categoría en tiempo real.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <h3 class="feature-title">Cero Fricción</h3>
              <p class="feature-text">Una arquitectura SPA (Single Page Application) que hace que registrar gastos sea instantáneo, sin recargar la página nunca.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">🔒</div>
              <h3 class="feature-title">Seguridad Local</h3>
              <p class="feature-text">Tus tokens de sesión se gestionan localmente, con cifrado a nivel de arquitectura y guardias estrictas contra ingresos no autorizados.</p>
            </div>

          </div>
        </section>

        <!-- Footer Footer -->
        <footer class="landing-footer">
          <div class="footer-content">
            <div class="nav__brand">
              <span class="nav__logo" style="font-size: 1rem;">💰</span>
              <span class="nav__title" style="font-size: 0.9rem;">FinanzApp</span>
            </div>
            <p style="color: var(--color-text-muted); font-size: 0.8rem;">© 2026 FinanzApp Inc. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    `;
  }

  return { render };
})();
