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
    console.log('Intentando login con:', { email });

    // Intentar primero con el login completo que devuelve el objeto con ID
    this.userService.loginCompleto(email, password).subscribe({
      next: (response: any) => {
        console.log('✅ Login exitoso, respuesta completa:', response);
        
        // Guardar todos los datos del usuario
        if (response.id) {
          localStorage.setItem('idUsuario', response.id.toString());
        } else {
          // Fallback si no viene el ID
          localStorage.setItem('idUsuario', '1');
          console.warn('⚠️ Backend no devolvió ID, usando ID por defecto: 1');
        }
        
        localStorage.setItem('rol', response.rol || response.role || 'Trader');
        localStorage.setItem('token', response.token || 'temp-token-' + Date.now());
        
        if (response.nombre) {
          localStorage.setItem('nombre', response.nombre);
        }
        if (response.email) {
          localStorage.setItem('email', response.email);
        }
        
        console.log('✅ Datos guardados en localStorage:', {
          idUsuario: localStorage.getItem('idUsuario'),
          rol: localStorage.getItem('rol'),
          nombre: localStorage.getItem('nombre'),
          email: localStorage.getItem('email')
        });

        // Redirigir según el rol
        const rol = response.rol || response.role || 'Trader';
        switch (rol.trim()) {
          case 'Trader':
          case 'Traderz':
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
            this.errorMessage = 'Rol no reconocido: ' + rol;
            break;
        }
      },
      error: (err) => {
        console.error('❌ Error en login completo, intentando login simple:', err);
        
        // Fallback: Intentar con el login simple que solo devuelve el rol
        this.userService.login(email, password).subscribe({
          next: (rol: string) => {
            console.log('✅ Login simple exitoso, rol:', rol);
            
            localStorage.setItem('rol', rol);
            localStorage.setItem('token', 'temp-token-' + Date.now());
            localStorage.setItem('idUsuario', '1'); // ID por defecto
            
            console.warn('⚠️ Usando ID de usuario por defecto: 1');
            
            // Redirigir según el rol
            switch (rol.trim()) {
              case 'Trader':
              case 'Traderz':
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
                this.errorMessage = 'Rol no reconocido: ' + rol;
                break;
            }
          },
          error: (err2) => {
            console.error('❌ Error en ambos intentos de login:', err2);
            this.errorMessage = 'Error al iniciar sesión. Por favor, intente nuevamente.';
          }
        });
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