import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComisionistasService } from '../../../../services/comisionistas/comisionistas.service';
import { TraderAsociado } from '../../../../models/trader.model';
import { EnviarOrdenRequest } from '../../../../models/orden-comisionista.model';

@Component({
  selector: 'app-enviar-orden',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './enviar-orden.component.html',
  styleUrls: ['./enviar-orden.component.scss']
})
export class EnviarOrdenComponent implements OnInit {
  ordenForm!: FormGroup;
  traders: TraderAsociado[] = [];
  loadingTraders: boolean = true;
  enviando: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private comisionistasService: ComisionistasService
  ) {
    this.ordenForm = this.fb.group({
      idTrader: ['', [Validators.required]],
      simbolo: ['', [Validators.required, Validators.minLength(1)]],
      nombreEmpresa: [''],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      precioLimite: ['', [Validators.min(0.01)]],
      mensaje: ['']
    });
  }

  ngOnInit(): void {
    this.cargarTraders();
  }

  cargarTraders(): void {
    const idComisionista = Number(localStorage.getItem('usuarioId') || localStorage.getItem('idUsuario'));
    
    if (!idComisionista) {
      this.errorMessage = 'No se encontró el ID del comisionista';
      this.loadingTraders = false;
      return;
    }

    this.loadingTraders = true;
    this.comisionistasService.obtenerTradersAsociados(idComisionista).subscribe({
      next: (data) => {
        console.log('✅ Traders cargados:', data);
        this.traders = data.filter(t => t.estado); // Solo traders activos
        this.loadingTraders = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar traders:', err);
        this.errorMessage = 'Error al cargar la lista de traders';
        this.loadingTraders = false;
      }
    });
  }

  onSubmit(): void {
    if (this.ordenForm.invalid) {
      this.ordenForm.markAllAsTouched();
      this.errorMessage = 'Por favor, completa todos los campos requeridos correctamente';
      return;
    }

    const idComisionista = Number(localStorage.getItem('usuarioId') || localStorage.getItem('idUsuario'));
    
    if (!idComisionista) {
      this.errorMessage = 'No se encontró el ID del comisionista';
      return;
    }

    this.enviando = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.ordenForm.value;
    
    // Validar que la cantidad sea mayor a 0
    const cantidad = Number(formValue.cantidad);
    if (cantidad <= 0 || isNaN(cantidad)) {
      this.errorMessage = 'La cantidad debe ser mayor a 0';
      this.enviando = false;
      return;
    }

    // Validar que el símbolo no esté vacío
    const simbolo = formValue.simbolo?.trim().toUpperCase();
    if (!simbolo || simbolo.length === 0) {
      this.errorMessage = 'El símbolo es requerido';
      this.enviando = false;
      return;
    }

    const orden: EnviarOrdenRequest = {
      idComisionista,
      idTrader: Number(formValue.idTrader),
      simbolo: simbolo,
      nombreEmpresa: formValue.nombreEmpresa?.trim() || undefined,
      cantidad: cantidad,
      precioLimite: (formValue.precioLimite && formValue.precioLimite > 0) ? Number(formValue.precioLimite) : undefined,
      mensaje: formValue.mensaje?.trim() || undefined
    };

    console.log('📤 Enviando orden:', orden);

    this.comisionistasService.enviarOrden(orden).subscribe({
      next: (response) => {
        console.log('✅ Orden enviada exitosamente:', response);
        this.successMessage = response.mensaje || 'Orden enviada exitosamente';
        this.ordenForm.reset();
        this.enviando = false;
        
        // Limpiar mensaje después de 5 segundos
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (err) => {
        console.error('❌ Error al enviar orden:', err);
        this.enviando = false;
        
        if (err.error?.mensaje) {
          this.errorMessage = err.error.mensaje;
        } else if (err.status === 400) {
          this.errorMessage = 'Datos inválidos. Por favor verifica la información';
        } else {
          this.errorMessage = 'Error al enviar la orden. Por favor intenta nuevamente';
        }
      }
    });
  }

  getNombreCompletoTrader(trader: TraderAsociado): string {
    return `${trader.nombre} ${trader.apellido}`;
  }

  getCampoInvalido(campo: string): boolean {
    const control = this.ordenForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getMensajeError(campo: string): string {
    const control = this.ordenForm.get(campo);
    if (control?.errors) {
      if (control.errors['required']) return `${campo} es requerido`;
      if (control.errors['min']) return `${campo} debe ser mayor a 0`;
      if (control.errors['minLength']) return `${campo} inválido`;
    }
    return '';
  }
}

