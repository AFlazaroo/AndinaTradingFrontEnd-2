/**
 * Modelo para datos históricos de precios de una acción
 * Endpoint: GET /api/mercado-colombia/paper/historial-precios/{simbolo}
 */
export interface PuntoHistorial {
  fecha: string; // Formato: YYYYMMDD
  precioCierre: number;
  precioApertura: number;
  precioMaximo: number;
  precioMinimo: number;
  volumen: number;
}

export interface HistorialPreciosResponse {
  success: boolean;
  simbolo: string;
  periodo: string;
  totalPuntos: number;
  message: string;
  datos: PuntoHistorial[];
}

