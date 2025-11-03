/**
 * Modelo para Comisionista
 * Endpoints: GET /comisionistas/listado y GET /comisionistas/{idComisionista}
 */
export interface Comisionista {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  estado: boolean;
}

