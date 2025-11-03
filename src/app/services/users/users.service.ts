import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Usuario, PerfilUsuario, ActualizarPerfilRequest } from '../../models/usuario'; // Correct relative path

interface LoginResponse {
  id_usuario?: number;  // Formato del backend
  id?: number;          // Fallback
  nombre: string;
  apellido?: string;
  email: string;
  rol: string;
  token?: string;
  mensaje?: string;
}

@Injectable({
  providedIn: 'root'
})



export class UserService {
  private baseUrl = 'http://localhost:8081/usuarios';

  constructor(private http: HttpClient) {
  }

  // Registro de usuario
  registrarUsuario(usuario: Usuario): Observable<string> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post('http://localhost:8081/usuarios/registroUsuario', usuario, {
      headers,
      responseType: 'text' // ✅ esta línea es clave
    });
  }

  // Login de usuario - devuelve el rol como string
  login(email: string, contrasena: string): Observable<string> {
    console.log('Enviando petición de login:', {correo: email, contrasena: contrasena});
    return this.http.post('http://localhost:8081/usuarios/login', 
      {correo: email, contrasena: contrasena}, 
      {responseType: 'text'}
    ).pipe(
      map(response => {
        console.log('Respuesta del servidor:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error en el servicio de login:', error);
        throw error;
      })
    );
  }

  // Login completo - devuelve objeto con toda la información
  loginCompleto(email: string, contrasena: string): Observable<any> {
    console.log('Enviando petición de login completo:', {correo: email, contrasena: contrasena});
    return this.http.post<any>('http://localhost:8081/usuarios/login-completo', 
      {correo: email, contrasena: contrasena}
    ).pipe(
      map(response => {
        console.log('Respuesta completa del servidor:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error en el servicio de login:', error);
        throw error;
      })
    );
  }

  /**
   * Login unificado - detecta automáticamente si es Trader o Comisionista
   * POST /auth/login-unificado
   * @param email Email del usuario
   * @param password Contraseña del usuario
   */
  loginUnificado(email: string, password: string): Observable<any> {
    console.log('Enviando petición de login unificado:', { email, password });
    return this.http.post<any>('http://localhost:8081/auth/login-unificado', 
      { email, password }
    ).pipe(
      map(response => {
        console.log('✅ Respuesta del login unificado:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error en el login unificado:', error);
        throw error;
      })
    );
  }

  verificarOtp(payload: { email: string, codigoOtp: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      'http://localhost:8081/auth/mfa/verificar',
      payload
    );
  }

  // Obtener usuario por ID (con modelo tipado)
  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  getUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`http://localhost:8081/usuarios/${id}`);
  }

  // Listar todos los usuarios
  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/listar`);
  }

  getDashboardData(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8081/usuarios/${id}`);
  }

  getLocalDateFormatted(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Obtiene el perfil completo del usuario
   * GET /usuarios/perfil/{idUsuario}
   * @param idUsuario ID del usuario
   */
  obtenerPerfil(idUsuario: number): Observable<PerfilUsuario> {
    return this.http.get<PerfilUsuario>(`${this.baseUrl}/perfil/${idUsuario}`).pipe(
      catchError(error => {
        console.error('Error al obtener perfil:', error);
        throw error;
      })
    );
  }

  /**
   * Actualiza el perfil del usuario
   * PUT /usuarios/perfil/{idUsuario}
   * @param idUsuario ID del usuario
   * @param datosPerfil Datos a actualizar
   */
  actualizarPerfil(idUsuario: number, datosPerfil: ActualizarPerfilRequest): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put(`${this.baseUrl}/perfil/${idUsuario}`, datosPerfil, { headers }).pipe(
      catchError(error => {
        console.error('Error al actualizar perfil:', error);
        throw error;
      })
    );
  }

}
