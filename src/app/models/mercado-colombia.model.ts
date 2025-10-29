// Modelo para acciones del mercado colombiano
export interface AccionColombia {
  simbolo: string;
  nombre: string;
  precioActual: number;
  precioAnterior?: number;
  variacion?: number;
  variacionPorcentual?: number;
  volumen?: number;
  apertura?: number;
  maximo?: number;
  minimo?: number;
  timestamp?: string;
}

// Modelo para el listado de acciones
export interface ListadoAcciones {
  acciones: AccionColombia[];
  timestamp?: string;
}

// Modelo para orden de compra/venta
export interface OrdenMercado {
  simbolo: string;
  tipo: 'compra' | 'venta';
  cantidad: number;
  precio?: number;
  idUsuario: number;
}

// Modelo para respuesta de orden
export interface RespuestaOrden {
  mensaje: string;
  ordenId?: number;
  estado?: string;
}

