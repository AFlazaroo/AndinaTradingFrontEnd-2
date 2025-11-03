/**
 * Modelo para Trader asociado a un comisionista
 * Endpoint: GET /comisionistas/traders/{idComisionista}
 */
export interface TraderAsociado {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: string;
  estado: boolean;
}

