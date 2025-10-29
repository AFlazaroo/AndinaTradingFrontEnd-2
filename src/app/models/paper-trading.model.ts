// Modelos para Paper Trading con Interactive Brokers

/**
 * Modelo para la cuenta del usuario en paper trading
 */
export interface CuentaPaper {
  usuarioId: number;
  balance: number;
  efectivoDisponible: number;
  valorTotal: number;
  gananciaPerdida?: number;
  posiciones?: PosicionPaper[];
  transacciones?: TransaccionPaper[];
}

/**
 * Modelo para una posición de acciones
 */
export interface PosicionPaper {
  id?: number;
  usuarioId: number;
  simbolo: string;
  nombreEmpresa: string;
  cantidad: number;
  precioCompra: number;
  precioActual?: number;
  valorTotal?: number;
  gananciaPerdida?: number;
  porcentajeGanancia?: number;
  fechaCompra?: string;
}

/**
 * Modelo para una transacción (compra o venta)
 */
export interface TransaccionPaper {
  id?: number;
  usuarioId: number;
  simbolo: string;
  nombreEmpresa: string;
  tipoTransaccion: 'COMPRA' | 'VENTA';
  cantidad: number;
  precio: number;
  total: number;
  fechaTransaccion?: string;
  estado?: string;
}

/**
 * Modelo para la respuesta de una operación de compra/venta
 */
export interface RespuestaOperacion {
  mensaje: string;
  transaccionId?: number;
  exitoso: boolean;
  balance?: number;
  error?: string;
}

/**
 * Modelo para la solicitud de compra
 */
export interface SolicitudCompra {
  usuarioId: number;
  simbolo: string;
  nombreEmpresa: string;
  cantidad: number;
}

/**
 * Modelo para la solicitud de venta
 */
export interface SolicitudVenta {
  usuarioId: number;
  simbolo: string;
  cantidad: number;
  precio: number;
}

