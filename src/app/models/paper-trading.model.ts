// Modelos para Paper Trading con Interactive Brokers

/**
 * Modelo para la cuenta del usuario en paper trading
 * Coincide con la respuesta del backend
 */
export interface CuentaPaper {
  id: number;
  usuarioId: number;
  balanceInicial: number;
  balanceActual: number;
  balanceDisponible: number;
  balanceInvertido: number;
  gananciaPerdidaTotal: number;
  fechaCreacion: string;
  activa: boolean;
  posiciones?: PosicionPaper[];
  transacciones?: TransaccionPaper[];
}

/**
 * Modelo para una posición de acciones
 * Coincide con la respuesta del backend
 */
export interface PosicionPaper {
  id: number;
  simbolo: string;
  nombreEmpresa: string;
  cantidad: number;
  precioPromedio: number;        // Antes: precioCompra
  valorMercadoActual: number;    // Antes: valorTotal
  gananciaPerdida: number;
  fechaCompra?: string;
}

/**
 * Modelo para una transacción (compra o venta)
 * Coincide con la respuesta del backend
 */
export interface TransaccionPaper {
  id: number;
  tipo: 'COMPRA' | 'VENTA';      // Antes: tipoTransaccion
  simbolo: string;
  cantidad: number;
  precioUnitario: number;         // Antes: precio
  montoTotal: number;             // Antes: total
  comision: number;
  balanceAnterior: number;
  balancePosterior: number;
  fechaTransaccion: string;
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
 * Nota: El precio se obtiene automáticamente del mercado en tiempo real desde TWS
 */
export interface SolicitudVenta {
  usuarioId: number;
  simbolo: string;
  cantidad: number;
  // precio ya no es necesario - se obtiene automáticamente del mercado
}

/**
 * Modelo para la respuesta completa del portafolio del usuario
 */
export interface PortafolioCompleto {
  balanceInicial: number;
  balanceDisponible: number;
  valorTotalPosiciones: number;
  valorTotalPortafolio: number;
  gananciaPerdida: number;
  porcentajeGananciaPerdida: number;
  totalAcciones: number;
  empresasDiferentes: number;
  posiciones: PosicionPaper[];
}

/**
 * Modelo para el resumen del portafolio del usuario
 * Endpoint: GET /api/mercado-colombia/paper/resumen
 */
export interface ResumenPortafolio {
  balanceInicial: number;
  balanceDisponible: number;
  valorInvertido: number;           // Valor en acciones
  valorTotal: number;                // Total del portafolio
  gananciaPerdida: number;
  porcentaje: number;                 // Porcentaje de ganancia/pérdida
  estado: 'GANANDO' | 'PERDIENDO' | 'NEUTRO';
  estaGanando: boolean;
  estaPerdiendo: boolean;
  totalAcciones: number;
  cantidadEmpresas: number;
}

