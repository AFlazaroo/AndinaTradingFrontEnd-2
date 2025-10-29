import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OtpResponse {
  token: string;
  idUsuario: number;
}

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  private url = 'http://localhost:8081/auth/mfa/verificar';

  constructor(private http: HttpClient) {}

  verificarOtp(payload: { email: string; codigoOtp: string }): Observable<string> {
    return this.http.post('http://localhost:8081/auth/mfa/verificar', payload, {
      responseType: 'text'
    });
  }
}