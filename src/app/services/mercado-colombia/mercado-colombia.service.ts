import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccionColombia, ListadoAcciones, OrdenMercado, RespuestaOrden } from '../../models/mercado-colombia.model';
import { CuentaPaper, PosicionPaper, TransaccionPaper, RespuestaOperacion } from '../../models/paper-trading.model';

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
   * @param usuarioId ID del usuario
   * @param simbolo Símbolo de la acción
   * @param cantidad Cantidad de acciones a vender
   * @param precio Precio de venta
   */
  venderAccionesPaper(
    usuarioId: number,
    simbolo: string,
    cantidad: number,
    precio: number
  ): Observable<string> {
    const params = new HttpParams()
      .set('usuarioId', usuarioId.toString())
      .set('simbolo', simbolo)
      .set('cantidad', cantidad.toString())
      .set('precio', precio.toString());

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
}

