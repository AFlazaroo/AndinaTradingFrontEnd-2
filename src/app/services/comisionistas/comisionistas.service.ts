import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Comisionista } from '../../models/comisionista.model';
import { TraderAsociado } from '../../models/trader.model';
import { OrdenComisionista, EnviarOrdenRequest, RespuestaOrden } from '../../models/orden-comisionista.model';

@Injectable({
  providedIn: 'root'
})
export class ComisionistasService {
  private baseUrl = 'http://localhost:8081/comisionistas';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de todos los comisionistas
   * GET /comisionistas/listado
   * @param soloActivos Opcional - si es true, solo devuelve comisionistas activos
   */
  obtenerListado(soloActivos?: boolean): Observable<Comisionista[]> {
    let params = new HttpParams();
    if (soloActivos) {
      params = params.set('soloActivos', 'true');
    }

    return this.http.get<Comisionista[]>(`${this.baseUrl}/listado`, { params }).pipe(
      catchError(error => {
        console.error('Error al obtener listado de comisionistas:', error);
        throw error;
      })
    );
  }

  /**
   * Obtiene un comisionista específico por su ID
   * GET /comisionistas/{idComisionista}
   * @param idComisionista ID del comisionista
   */
  obtenerPorId(idComisionista: number): Observable<Comisionista> {
    return this.http.get<Comisionista>(`${this.baseUrl}/${idComisionista}`).pipe(
      catchError(error => {
        console.error('Error al obtener comisionista:', error);
        throw error;
      })
    );
  }

  /**
   * Vincula un usuario/trader a un comisionista
   * POST /comisionistas/vincular?idUsuario={idUsuario}&idComisionista={idComisionista}
   * @param idUsuario ID del usuario/trader
   * @param idComisionista ID del comisionista
   */
  vincularUsuario(idUsuario: number, idComisionista: number): Observable<any> {
    const params = new HttpParams()
      .set('idUsuario', idUsuario.toString())
      .set('idComisionista', idComisionista.toString());

    return this.http.post(`${this.baseUrl}/vincular`, null, { params }).pipe(
      catchError(error => {
        console.error('Error al vincular usuario:', error);
        throw error;
      })
    );
  }

  /**
   * Obtiene todos los traders asociados a un comisionista
   * GET /comisionistas/traders/{idComisionista}
   * @param idComisionista ID del comisionista
   */
  obtenerTradersAsociados(idComisionista: number): Observable<TraderAsociado[]> {
    return this.http.get<TraderAsociado[]>(`${this.baseUrl}/traders/${idComisionista}`).pipe(
      catchError(error => {
        console.error('Error al obtener traders asociados:', error);
        throw error;
      })
    );
  }

  /**
   * Envía una orden de compra a un trader
   * POST /api/ordenes-comisionista/enviar
   * Usa query parameters según la implementación del backend
   * @param orden Datos de la orden a enviar
   */
  enviarOrden(orden: EnviarOrdenRequest): Observable<RespuestaOrden> {
    let params = new HttpParams()
      .set('idComisionista', orden.idComisionista.toString())
      .set('idTrader', orden.idTrader.toString())
      .set('simbolo', orden.simbolo.trim())
      .set('cantidad', orden.cantidad.toString());

    // Agregar parámetros opcionales solo si tienen valor y no están vacíos
    if (orden.nombreEmpresa && orden.nombreEmpresa.trim() !== '') {
      params = params.set('nombreEmpresa', orden.nombreEmpresa.trim());
    }
    if (orden.precioLimite !== undefined && orden.precioLimite !== null && orden.precioLimite > 0) {
      params = params.set('precioLimite', orden.precioLimite.toString());
    }
    if (orden.mensaje && orden.mensaje.trim() !== '') {
      params = params.set('mensaje', orden.mensaje.trim());
    }

    const url = 'http://localhost:8082/api/ordenes-comisionista/enviar';
    console.log('📤 Enviando orden con query params:', params.toString());

    return this.http.post<RespuestaOrden>(url, null, { params }).pipe(
      catchError(error => {
        console.error('❌ Error al enviar orden:', error);
        console.error('Detalles del error:', error.error);
        throw error;
      })
    );
  }

  /**
   * Obtiene todas las órdenes enviadas por un comisionista
   * GET /api/ordenes-comisionista/comisionista/{idComisionista}
   * @param idComisionista ID del comisionista
   */
  obtenerOrdenesEnviadas(idComisionista: number): Observable<OrdenComisionista[]> {
    return this.http.get<OrdenComisionista[]>(`http://localhost:8082/api/ordenes-comisionista/comisionista/${idComisionista}`).pipe(
      catchError(error => {
        console.error('Error al obtener órdenes enviadas:', error);
        throw error;
      })
    );
  }
}

