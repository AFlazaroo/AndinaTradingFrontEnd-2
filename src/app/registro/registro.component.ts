import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CommonModule, getLocaleDateTimeFormat} from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/users/users.service';
import { Usuario } from '../models/usuario';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  registerForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  get passwordErrors() {
    const password = this.registerForm.get('password')?.value || '';
    return {
      length: password.length >= 6,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSymbol: /[\W_]/.test(password),
      hasLetters: /[a-zA-Z]/.test(password) && /\d/.test(password),
    };
  }

  get showPasswordErrors(): boolean {
    const control = this.registerForm.get('password');
    return !!control?.touched && !!control?.invalid;
  }

  get passwordsMatch(): boolean {
    const pwd = this.registerForm.get('password')?.value;
    const confirm = this.registerForm.get('confirmPassword')?.value;
    return pwd === confirm;
  }

  allPasswordRulesPass(): boolean {
    const errors = this.passwordErrors;
    return errors.length && errors.hasUpperCase && errors.hasNumber && errors.hasSymbol && errors.hasLetters;
  }

  onSubmit(): void {
    if (this.registerForm.invalid || !this.passwordsMatch || !this.allPasswordRulesPass()) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValues = this.registerForm.value;

    const nuevoUsuario: Usuario = {
      nombre: formValues.firstName,
      apellido: formValues.lastName,
      email: formValues.email,
      telefono: formValues.phone,
      password: formValues.password,
      estado: true,
      rol: 'USER',
      portafolio: {
        holdings: [],
        operaciones: [],
        fecha_creacion: this.userService.getLocalDateFormatted()
      }
    };

this.userService.registrarUsuario(nuevoUsuario).subscribe({
  next: () => {
    alert('Usuario registrado correctamente');
    this.router.navigate(['/login']);
  },
  error: (err) => {
    if (err.status === 409) {
      alert('El correo ya está registrado.');
    } else {
      console.error('Error desconocido:', err);
      alert('Error al registrar usuario.');
    }
  }
});
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
