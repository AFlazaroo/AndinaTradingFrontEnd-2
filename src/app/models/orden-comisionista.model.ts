/**
 * Modelos para el sistema de órdenes de comisionista a trader
 */

export enum EstadoOrden {
  PENDIENTE_APROBACION = 'PENDIENTE_APROBACION',
  ACEPTADA = 'ACEPTADA',
  EJECUTADA = 'EJECUTADA',
  RECHAZADA = 'RECHAZADA',
  ERROR_EJECUCION = 'ERROR_EJECUCION'
}

export interface OrdenComisionista {
  id: number;
  idComisionista: number;
  idTrader: number;
  simbolo: string;
  nombreEmpresa?: string;
  cantidad: number;
  precioLimite?: number;
  mensaje?: string;
  estado: EstadoOrden | string;
  fechaCreacion: string;
  fechaAceptacion?: string;
  fechaEjecucion?: string;
  precioEjecucion?: number;
  errorMensaje?: string;
}

export interface EnviarOrdenRequest {
  idComisionista: number;
  idTrader: number;
  simbolo: string;
  nombreEmpresa?: string;
  cantidad: number;
  precioLimite?: number;
  mensaje?: string;
}

export interface RespuestaOrden {
  success: boolean;
  mensaje: string;
  ordenId?: number;
  orden?: OrdenComisionista;
}

