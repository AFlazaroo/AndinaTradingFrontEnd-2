
export interface Portafolio {
  idPortafolio?: number; // opcional, lo genera el backend
  valor?: number;
  holdings?: Holding[];
  operaciones?: Operacion[];
  fecha_creacion?: string;
}

export interface Holding {
  accion: string;
  cantidad: number;
  precio: number;
  valor: number;
}

export interface Operacion {
  accion: string;
  tipo: string;
  fecha: string;
}

export interface Usuario {
  idUsuario?: number; // opcional para el registro
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
  estado: boolean;
  rol: string;
  portafolio: Portafolio;
}

export interface DashboardUsuarioDTO {
  valorPortafolio: number;
  holdings: Holding[];
  operaciones: Orden[];
}

export interface Holding {
  id_holding: number;
  cantidad: number;
  precio_actual: number;
  precio_compra: number;
  fecha_compra: string;
}

export interface Orden {
  id_orden: number;
  tipo_orden: string;
  fecha_creacion: string;
  cantidad: number;
  precio: number;
}
