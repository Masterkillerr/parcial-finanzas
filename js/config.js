/**
 * LAYER 0 – CONFIGURATION
 * Central configuration for the Finanzas API
 */

const CONFIG = {
  BASE_URL: 'https://finanzas-api.ubunifusoft.digital',
  ENDPOINTS: {
    // Auth
    LOGIN:    '/api/auth/login',
    REGISTRO: '/api/auth/registro',
    ME:       '/api/auth/me',

    // Workspaces
    WORKSPACES:           '/api/workspaces',
    WORKSPACE_SELECCIONAR: (id) => `/api/workspaces/${id}/seleccionar`,

    // Categorías
    CATEGORIAS:    '/api/categorias',
    CATEGORIA_ID:  (id) => `/api/categorias/${id}`,

    // Beneficiarios
    BENEFICIARIOS:   '/api/beneficiarios',
    BENEFICIARIO_ID: (id) => `/api/beneficiarios/${id}`,

    // Transacciones
    TRANSACTIONS:   '/api/transactions',
    TRANSACTION_ID: (id) => `/api/transactions/${id}`,

    // Dashboard
    DASHBOARD_RESUMEN: '/api/dashboard/resumen-mensual',
    DASHBOARD_FLUJO:   '/api/dashboard/flujo-caja',

    // Reportes
    REPORTE_CATEGORIAS: '/api/reportes/gastos-por-categoria',
  },

  // Tipos de categoría válidos (según reglas del modelo)
  TIPOS_CATEGORIA: ['INGRESO', 'GASTO'],

  // Medios de pago disponibles
  MEDIOS_PAGO: ['EFECTIVO', 'TRANSFERENCIA', 'TARJETA_DEBITO', 'TARJETA_CREDITO'],
};

// Freeze para evitar mutaciones accidentales
Object.freeze(CONFIG);
Object.freeze(CONFIG.ENDPOINTS);
