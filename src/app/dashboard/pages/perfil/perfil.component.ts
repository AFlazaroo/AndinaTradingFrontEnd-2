import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/users/users.service';
import { PerfilUsuario, ActualizarPerfilRequest } from '../../../models/usuario';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  perfilForm!: FormGroup;
  perfil: PerfilUsuario | null = null;
  loading: boolean = true;
  guardando: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  modoEdicion: boolean = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.perfilForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });
  }

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    const usuarioId = Number(localStorage.getItem('usuarioId') || localStorage.getItem('idUsuario'));
    
    if (!usuarioId) {
      this.errorMessage = 'Usuario no autenticado. Por favor, inicia sesión.';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    
    this.userService.obtenerPerfil(usuarioId).subscribe({
      next: (data) => {
        console.log('✅ Perfil recibido:', data);
        this.perfil = data;
        
        // Llenar el formulario con los datos del perfil
        this.perfilForm.patchValue({
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          telefono: data.telefono
        });
        
        // Deshabilitar campos en modo visualización
        this.perfilForm.disable();
        this.modoEdicion = false;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar perfil:', err);
        this.errorMessage = 'Error al cargar tu perfil';
        this.loading = false;
      }
    });
  }

  activarEdicion(): void {
    this.modoEdicion = true;
    this.perfilForm.enable();
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelarEdicion(): void {
    if (this.perfil) {
      // Restaurar valores originales
      this.perfilForm.patchValue({
        nombre: this.perfil.nombre,
        apellido: this.perfil.apellido,
        email: this.perfil.email,
        telefono: this.perfil.telefono
      });
    }
    this.perfilForm.disable();
    this.modoEdicion = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  guardarPerfil(): void {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      this.errorMessage = 'Por favor, completa todos los campos correctamente';
      return;
    }

    const usuarioId = Number(localStorage.getItem('usuarioId') || localStorage.getItem('idUsuario'));
    
    if (!usuarioId) {
      this.errorMessage = 'Usuario no autenticado';
      return;
    }

    this.guardando = true;
    this.errorMessage = '';
    this.successMessage = '';

    const datosPerfil: ActualizarPerfilRequest = {
      nombre: this.perfilForm.value.nombre.trim(),
      apellido: this.perfilForm.value.apellido.trim(),
      email: this.perfilForm.value.email.trim(),
      telefono: this.perfilForm.value.telefono.trim()
    };

    console.log('📤 Actualizando perfil:', datosPerfil);

    this.userService.actualizarPerfil(usuarioId, datosPerfil).subscribe({
      next: (response) => {
        console.log('✅ Perfil actualizado:', response);
        this.successMessage = 'Perfil actualizado correctamente';
        
        // Recargar perfil actualizado
        setTimeout(() => {
          this.cargarPerfil();
        }, 1000);
      },
      error: (err) => {
        console.error('❌ Error al actualizar perfil:', err);
        
        if (err.status === 409) {
          this.errorMessage = 'El correo electrónico ya está en uso por otro usuario';
        } else if (err.status === 400) {
          this.errorMessage = err.error?.message || 'Datos inválidos. Por favor verifica la información';
        } else {
          this.errorMessage = 'Error al actualizar el perfil. Por favor intenta nuevamente';
        }
        
        this.guardando = false;
      }
    });
  }

  getCampoInvalido(campo: string): boolean {
    const control = this.perfilForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getMensajeError(campo: string): string {
    const control = this.perfilForm.get(campo);
    if (control?.errors) {
      if (control.errors['required']) return `${campo} es requerido`;
      if (control.errors['email']) return 'Email inválido';
      if (control.errors['minlength']) return `${campo} debe tener al menos ${control.errors['minlength'].requiredLength} caracteres`;
      if (control.errors['pattern']) return 'Teléfono debe tener 10 dígitos numéricos';
    }
    return '';
  }

  getEstadoBadge(): string {
    if (!this.perfil) return 'bg-secondary';
    return this.perfil.estado ? 'bg-success' : 'bg-danger';
  }

  getEstadoTexto(): string {
    if (!this.perfil) return 'Desconocido';
    return this.perfil.estado ? 'Activo' : 'Inactivo';
  }
}

