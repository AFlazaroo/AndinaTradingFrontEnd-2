import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Usuario } from '../../models/usuario'; // Correct relative path

interface LoginResponse {
  token: string;
  id: number;
  rol: string;
  nombre: string;
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

}
