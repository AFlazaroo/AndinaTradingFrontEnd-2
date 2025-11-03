import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccionColombia, ListadoAcciones, OrdenMercado, RespuestaOrden } from '../../models/mercado-colombia.model';
import { CuentaPaper, PosicionPaper, TransaccionPaper, RespuestaOperacion, PortafolioCompleto, ResumenPortafolio } from '../../models/paper-trading.model';
import { HistorialPreciosResponse } from '../../models/historial-precios.model';
import { OrdenComisionista, RespuestaOrden as RespuestaOrdenComisionista } from '../../models/orden-comisionista.model';

@Injectable({
  providedIn: 'root'
})
export class MercadoColombiaService {
  private readonly baseUrl = 'http://localhost:8082/api/mercado-colombia';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el listado completo de acciones colombianas disponibles
   */
  getListadoAcciones(): Observable<AccionColombia[]> {
    return this.http.get<AccionColombia[]>(`${this.baseUrl}/listado`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene datos de Apple (AAPL) - Para pruebas
   */
  getApple(): Observable<AccionColombia> {
    return this.http.get<AccionColombia>(`${this.baseUrl}/accion/AAPL?exchange=SMART&currency=USD`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene datos específicos de Ecopetrol (EC)
   */
  getEcopetrol(): Observable<AccionColombia> {
    return this.http.get<AccionColombia>(`${this.baseUrl}/ecopetrol`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene datos específicos de Bancolombia (CIB)
   */
  getBancolombia(): Observable<AccionColombia> {
    return this.http.get<AccionColombia>(`${this.baseUrl}/bancolombia`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene datos específicos de Avianca (AVH)
   */
  getAvianca(): Observable<AccionColombia> {
    return this.http.get<AccionColombia>(`${this.baseUrl}/avianca`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene datos de cualquier acción por su símbolo
   * @param simbolo Símbolo de la acción (ej: EC, CIB, AVH)
   */
  getAccionPorSimbolo(simbolo: string): Observable<AccionColombia> {
    return this.http.get<AccionColombia>(`${this.baseUrl}/accion/${simbolo}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Coloca una orden de compra o venta
   * @param simbolo Símbolo de la acción
   * @param tipo Tipo de operación: 'compra' o 'venta'
   * @param cantidad Cantidad de acciones
   * @param idUsuario ID del usuario que realiza la operación
   * @param precio Precio (opcional, para órdenes limitadas)
   */
  colocarOrden(
    simbolo: string,
    tipo: 'compra' | 'venta',
    cantidad: number,
    idUsuario: number,
    precio?: number
  ): Observable<string> {
    const params = new HttpParams()
      .set('tipo', tipo)
      .set('cantidad', cantidad.toString())
      .set('idUsuario', idUsuario.toString())
      .set('precio', precio ? precio.toString() : '');

    return this.http.post(`${this.baseUrl}/orden/${simbolo}`, null, {
      params,
      responseType: 'text'
    }).pipe(catchError(this.handleError));
  }

  // ============================================
  // MÉTODOS DE PAPER TRADING
  // ============================================

  /**
   * Compra acciones en modo paper trading
   * @param usuarioId ID del usuario
   * @param simbolo Símbolo de la acción
   * @param nombreEmpresa Nombre de la empresa
   * @param cantidad Cantidad de acciones a comprar
   */
  comprarAccionesPaper(
    usuarioId: number,
    simbolo: string,
    nombreEmpresa: string,
    cantidad: number
  ): Observable<string> {
    const params = new HttpParams()
      .set('usuarioId', usuarioId.toString())
      .set('simbolo', simbolo)
      .set('nombreEmpresa', nombreEmpresa)
      .set('cantidad', cantidad.toString());

    return this.http.post(`${this.baseUrl}/paper/comprar`, null, {
      params,
      responseType: 'text'
    }).pipe(catchError(this.handleError));
  }

  /**
   * Vende acciones en modo paper trading
   * El precio se obtiene automáticamente del mercado en tiempo real desde TWS
   * @param usuarioId ID del usuario
   * @param simbolo Símbolo de la acción
   * @param cantidad Cantidad de acciones a vender
   */
  venderAccionesPaper(
    usuarioId: number,
    simbolo: string,
    cantidad: number
  ): Observable<string> {
    const params = new HttpParams()
      .set('usuarioId', usuarioId.toString())
      .set('simbolo', simbolo)
      .set('cantidad', cantidad.toString());

    return this.http.post(`${this.baseUrl}/paper/vender`, null, {
      params,
      responseType: 'text'
    }).pipe(catchError(this.handleError));
  }

  /**
   * Obtiene la cuenta del usuario con balance, posiciones y transacciones
   * @param usuarioId ID del usuario
   */
  getCuentaUsuario(usuarioId: number): Observable<CuentaPaper> {
    const params = new HttpParams().set('usuarioId', usuarioId.toString());
    return this.http.get<CuentaPaper>(`${this.baseUrl}/paper/cuenta`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene las posiciones del usuario
   * @param usuarioId ID del usuario
   */
  getPosicionesUsuario(usuarioId: number): Observable<PosicionPaper[]> {
    const params = new HttpParams().set('usuarioId', usuarioId.toString());
    return this.http.get<PosicionPaper[]>(`${this.baseUrl}/paper/posiciones`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene el historial de transacciones del usuario
   * @param usuarioId ID del usuario
   */
  getHistorialTransacciones(usuarioId: number): Observable<TransaccionPaper[]> {
    const params = new HttpParams().set('usuarioId', usuarioId.toString());
    return this.http.get<TransaccionPaper[]>(`${this.baseUrl}/paper/historial`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene el portafolio completo del usuario con todos los detalles
   * @param usuarioId ID del usuario
   */
  getPortafolioCompleto(usuarioId: number): Observable<PortafolioCompleto> {
    const params = new HttpParams().set('usuarioId', usuarioId.toString());
    return this.http.get<PortafolioCompleto>(`${this.baseUrl}/paper/portafolio`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene el resumen del portafolio del usuario con información consolidada
   * @param usuarioId ID del usuario
   */
  getResumenPortafolio(usuarioId: number): Observable<ResumenPortafolio> {
    const params = new HttpParams().set('usuarioId', usuarioId.toString());
    return this.http.get<ResumenPortafolio>(`${this.baseUrl}/paper/resumen`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('[MercadoColombiaService] Error:', error);
    
    let errorMessage = 'Error al consultar el mercado colombiano';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = error.error?.message || 
                     error.message || 
                     `Error del servidor: ${error.status}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Obtiene el historial de precios de una acción (últimos 5 días hábiles)
   * GET /api/mercado-colombia/paper/historial-precios/{simbolo}
   * @param simbolo Símbolo de la acción (ej: AAPL, EC, CIB)
   */
  getHistorialPrecios(simbolo: string): Observable<HistorialPreciosResponse> {
    return this.http.get<HistorialPreciosResponse>(`${this.baseUrl}/paper/historial-precios/${simbolo}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene las órdenes pendientes de un trader
   * GET /api/mercado-colombia/paper/ordenes-comisionista/pendientes?usuarioId={idTrader}
   * @param idTrader ID del trader
   */
  obtenerOrdenesPendientes(idTrader: number): Observable<OrdenComisionista[]> {
    const params = new HttpParams().set('usuarioId', idTrader.toString());
    return this.http.get<OrdenComisionista[]>(`${this.baseUrl}/paper/ordenes-comisionista/pendientes`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Acepta una orden de comisionista (ejecuta la compra automáticamente)
   * POST /api/mercado-colombia/paper/ordenes-comisionista/{ordenId}/aceptar
   * @param ordenId ID de la orden
   */
  aceptarOrdenComisionista(ordenId: number): Observable<RespuestaOrdenComisionista> {
    return this.http.post<RespuestaOrdenComisionista>(`${this.baseUrl}/paper/ordenes-comisionista/${ordenId}/aceptar`, null)
      .pipe(catchError(this.handleError));
  }

  /**
   * Rechaza una orden de comisionista
   * POST /api/mercado-colombia/paper/ordenes-comisionista/{ordenId}/rechazar
   * @param ordenId ID de la orden
   */
  rechazarOrdenComisionista(ordenId: number): Observable<RespuestaOrdenComisionista> {
    return this.http.post<RespuestaOrdenComisionista>(`${this.baseUrl}/paper/ordenes-comisionista/${ordenId}/rechazar`, null)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene una orden específica por su ID
   * GET /api/ordenes-comisionista/{id}
   * @param ordenId ID de la orden
   */
  obtenerOrdenPorId(ordenId: number): Observable<OrdenComisionista> {
    return this.http.get<OrdenComisionista>(`http://localhost:8082/api/ordenes-comisionista/${ordenId}`)
      .pipe(catchError(this.handleError));
  }
}

