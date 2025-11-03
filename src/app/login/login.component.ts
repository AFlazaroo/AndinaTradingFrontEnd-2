import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../services/users/users.service';
import { OtpService } from '../services/otp/otp.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup;
  showPassword = false;
  requiresOtp = false;
  emailForOtp = '';
  codigoOtp = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private userService: UserService,
    private otpService: OtpService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    this.errorMessage = '';
    console.log('🔐 Intentando login unificado con:', { email });

    // Usar el login unificado que detecta automáticamente el tipo de usuario
    this.userService.loginUnificado(email, password).subscribe({
      next: (response: any) => {
        console.log('✅ Login unificado exitoso:', response);
        
        // Validar que la respuesta sea exitosa
        if (!response.success) {
          this.errorMessage = 'Error al iniciar sesión. Credenciales inválidas.';
          return;
        }

        // Guardar el ID del usuario
        if (response.id) {
          localStorage.setItem('usuarioId', response.id.toString());
          localStorage.setItem('idUsuario', response.id.toString()); // Mantener compatibilidad
          console.log('✅ ID de usuario guardado:', response.id);
        }

        // Guardar tipo de usuario (TRADER o COMISIONISTA)
        if (response.tipoUsuario) {
          localStorage.setItem('tipoUsuario', response.tipoUsuario);
        }
        
        // Guardar rol (puede venir o no según el tipo)
        if (response.rol) {
          localStorage.setItem('rol', response.rol);
        } else if (response.tipoUsuario === 'TRADER') {
          localStorage.setItem('rol', 'Trader');
        } else if (response.tipoUsuario === 'COMISIONISTA') {
          localStorage.setItem('rol', 'Comisionista');
        }
        
        // Guardar nombre completo
        if (response.nombre) {
          const nombreCompleto = response.apellido 
            ? `${response.nombre} ${response.apellido}` 
            : response.nombre;
          localStorage.setItem('nombreUsuario', nombreCompleto);
          localStorage.setItem('nombre', response.nombre);
        }
        
        // Guardar email
        if (response.email) {
          localStorage.setItem('email', response.email);
        }

        // Guardar estado
        if (response.estado !== undefined) {
          localStorage.setItem('estado', response.estado.toString());
        }

        // Guardar token si existe
        if (response.token) {
          localStorage.setItem('token', response.token);
        } else {
          localStorage.setItem('token', 'temp-token-' + Date.now());
        }
        
        console.log('✅ Datos guardados en localStorage:', {
          usuarioId: localStorage.getItem('usuarioId'),
          tipoUsuario: localStorage.getItem('tipoUsuario'),
          nombreUsuario: localStorage.getItem('nombreUsuario'),
          rol: localStorage.getItem('rol'),
          email: localStorage.getItem('email'),
          estado: localStorage.getItem('estado')
        });

        // Redirigir según el campo redirigirA de la respuesta
        if (response.redirigirA) {
          switch (response.redirigirA) {
            case 'panel-trader':
              console.log('📍 Redirigiendo a panel de trader...');
              this.router.navigate(['/dashboard']);
              break;
            case 'panel-comisionista':
              console.log('📍 Redirigiendo a panel de comisionista...');
              this.router.navigate(['/comisionista']);
              break;
            default:
              console.warn('⚠️ Valor de redirigirA no reconocido:', response.redirigirA);
              // Fallback: redirigir según tipoUsuario
              if (response.tipoUsuario === 'TRADER') {
                this.router.navigate(['/dashboard']);
              } else if (response.tipoUsuario === 'COMISIONISTA') {
                this.router.navigate(['/comisionista']);
              } else {
                this.errorMessage = 'Tipo de usuario no reconocido';
              }
              break;
          }
        } else {
          // Fallback si no viene redirigirA: usar tipoUsuario
          console.warn('⚠️ No se recibió redirigirA, usando tipoUsuario como fallback');
          if (response.tipoUsuario === 'TRADER') {
            this.router.navigate(['/dashboard']);
          } else if (response.tipoUsuario === 'COMISIONISTA') {
            this.router.navigate(['/comisionista']);
          } else {
            this.errorMessage = 'Error: No se pudo determinar la redirección';
          }
        }
      },
      error: (err) => {
        console.error('❌ Error en login unificado:', err);
        
        let mensajeError = 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
        
        if (err.status === 401 || err.status === 403) {
          mensajeError = 'Credenciales inválidas. Por favor, verifica tu email y contraseña.';
        } else if (err.status === 404) {
          mensajeError = 'Usuario no encontrado. Por favor, verifica tu email.';
        } else if (err.status === 0) {
          mensajeError = 'Error de conexión. Verifica que el servidor esté en ejecución.';
        }
        
        this.errorMessage = mensajeError;
      }
    });
  }

  verificarOtp(): void {
    if (!this.codigoOtp || !this.emailForOtp) {
      alert('Código OTP requerido');
      return;
    }

    const payload = {
      email: this.emailForOtp,
      codigoOtp: this.codigoOtp
    };

    this.otpService.verificarOtp(payload).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('idUsuario', res.id);
        localStorage.setItem('rol', res.rol);
        localStorage.setItem('nombre', res.nombre);

        // Redirigir según el rol
        switch (res.rol) {
          case 'Trader':
            this.router.navigate(['/dashboard']);
            break;
          case 'Comisionista':
            this.router.navigate(['/comisionista']);
            break;
          case 'Administrador':
            this.router.navigate(['/admin']);
            break;
          case 'AreaLegal':
            this.router.navigate(['/legal']);
            break;
          case 'JuntaDirectiva':
            this.router.navigate(['/junta']);
            break;
          default:
            alert('Rol no reconocido');
            break;
        }
      },
      error: (err) => {
        alert('Código inválido o expirado');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}