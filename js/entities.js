/**
 * LAYER 0 – ENTITIES
 * Data model definitions based on the Finanzas API contracts.
 * These mirror the DTO classes returned/sent by the REST API.
 */

// ─── Auth ────────────────────────────────────────────────────────────────────

class User {
  constructor({ token, email, nombre, workspaces = [] }) {
    this.token      = token;
    this.email      = email;
    this.nombre     = nombre;
    this.workspaces = workspaces.map(w => new Workspace(w));
  }
}

// RegisterRequest → { nombre, email, password }
class RegisterRequest {
  constructor(nombre, email, password) {
    this.nombre   = nombre;
    this.email    = email;
    this.password = password;
  }
}

// LoginRequest → { email, password }
class LoginRequest {
  constructor(email, password) {
    this.email    = email;
    this.password = password;
  }
}

// ─── Workspace ───────────────────────────────────────────────────────────────

class Workspace {
  constructor({ id, nombre }) {
    this.id     = id;
    this.nombre = nombre;
  }
}

// ─── Categoría ───────────────────────────────────────────────────────────────

class Categoria {
  /**
   * @param {number} id
   * @param {string} nombre
   * @param {string} tipo  – 'INGRESO' | 'GASTO'  (siempre mayúsculas)
   * @param {boolean} activa
   */
  constructor({ id, nombre, tipo, activa = true }) {
    this.id     = id;
    this.nombre = nombre;
    this.tipo   = tipo;    // 'INGRESO' | 'GASTO'
    this.activa = activa;
  }
}

// CategoriaRequest → { workspaceId, nombre, tipo }
class CategoriaRequest {
  constructor(workspaceId, nombre, tipo) {
    this.workspaceId = workspaceId;
    this.nombre      = nombre;
    this.tipo        = tipo.toUpperCase(); // Garantiza mayúsculas
  }
}

// ─── Beneficiario ────────────────────────────────────────────────────────────

class Beneficiario {
  constructor({ id, nombre, activo = true }) {
    this.id     = id;
    this.nombre = nombre;
    this.activo = activo;
  }
}

// BeneficiarioRequest → { workspaceId, nombre }
class BeneficiarioRequest {
  constructor(workspaceId, nombre) {
    this.workspaceId = workspaceId;
    this.nombre      = nombre;
  }
}

// ─── Transaction ─────────────────────────────────────────────────────────────

class Transaction {
  constructor({ id, tipo, categoriaNombre, beneficiarioNombre, fecha, monto, descripcion, medioPago, fuenteNombre, creadaEn }) {
    this.id                 = id;
    this.tipo               = tipo;
    this.categoriaNombre    = categoriaNombre;
    this.beneficiarioNombre = beneficiarioNombre;
    this.fecha              = fecha;
    this.monto              = monto;
    this.descripcion        = descripcion;
    this.medioPago          = medioPago;
    this.fuenteNombre       = fuenteNombre;
    this.creadaEn           = creadaEn;
  }
}

// TransactionRequest → { workspaceId, tipo, categoriaId, beneficiarioId, fecha, monto, descripcion, medioPago }
class TransactionRequest {
  constructor({ workspaceId, tipo, categoriaId, beneficiarioId, fecha, monto, descripcion, medioPago }) {
    this.workspaceId    = workspaceId;
    this.tipo           = tipo;
    this.categoriaId    = categoriaId;
    this.beneficiarioId = beneficiarioId;
    this.fecha          = fecha;
    this.monto          = parseFloat(monto);
    this.descripcion    = descripcion;
    this.medioPago      = medioPago;
  }
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

class DashboardSummary {
  constructor({ totalIngresos, totalGastos, balanceNeto }) {
    this.totalIngresos = totalIngresos;
    this.totalGastos   = totalGastos;
    this.balanceNeto   = balanceNeto;
  }
}

class CategoryReport {
  constructor({ categoria, total, color }) {
    this.categoria = categoria;
    this.total     = total;
    this.color     = color;
  }
}
