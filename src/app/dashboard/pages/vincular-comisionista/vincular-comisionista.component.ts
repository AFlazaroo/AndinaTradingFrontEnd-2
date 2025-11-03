import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComisionistasService } from '../../../services/comisionistas/comisionistas.service';
import { Comisionista } from '../../../models/comisionista.model';

@Component({
  selector: 'app-vincular-comisionista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vincular-comisionista.component.html',
  styleUrls: ['./vincular-comisionista.component.scss']
})
export class VincularComisionistaComponent implements OnInit {
  comisionistas: Comisionista[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';
  soloActivos: boolean = true; // Por defecto solo mostrar activos
  comisionistaSeleccionado: Comisionista | null = null;
  vinculando: boolean = false;

  constructor(private comisionistasService: ComisionistasService) {}

  ngOnInit(): void {
    this.cargarComisionistas();
  }

  cargarComisionistas(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.comisionistasService.obtenerListado(this.soloActivos).subscribe({
      next: (data) => {
        console.log('✅ Comisionistas recibidos:', data);
        this.comisionistas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar comisionistas:', err);
        this.errorMessage = 'Error al cargar la lista de comisionistas';
        this.loading = false;
      }
    });
  }

  toggleSoloActivos(): void {
    this.soloActivos = !this.soloActivos;
    this.cargarComisionistas();
  }

  vincularComisionista(comisionista: Comisionista): void {
    // Obtener ID del usuario del localStorage
    const idUsuario = Number(localStorage.getItem('usuarioId') || localStorage.getItem('idUsuario'));
    
    if (!idUsuario) {
      this.errorMessage = 'No se encontró el ID del usuario. Por favor, inicia sesión nuevamente.';
      return;
    }

    if (!comisionista.estado) {
      this.errorMessage = 'No puedes vincularte a un comisionista inactivo';
      return;
    }

    // Confirmar acción
    const confirmar = confirm(
      `¿Estás seguro de que deseas vincularte al comisionista ${comisionista.nombre} ${comisionista.apellido}?`
    );

    if (!confirmar) {
      return;
    }

    this.vinculando = true;
    this.errorMessage = '';
    this.successMessage = '';

    console.log('📤 Vinculando usuario:', { idUsuario, idComisionista: comisionista.id });

    this.comisionistasService.vincularUsuario(idUsuario, comisionista.id).subscribe({
      next: (response) => {
        console.log('✅ Usuario vinculado correctamente:', response);
        this.successMessage = `Te has vinculado exitosamente a ${comisionista.nombre} ${comisionista.apellido}`;
        this.vinculando = false;
        
        // Recargar lista después de un momento
        setTimeout(() => {
          this.cargarComisionistas();
        }, 2000);
      },
      error: (err) => {
        console.error('❌ Error al vincular usuario:', err);
        this.vinculando = false;
        
        if (err.status === 400) {
          this.errorMessage = err.error?.message || 'No se puede realizar la vinculación. Verifica que ambos existan y el comisionista esté activo.';
        } else if (err.status === 409) {
          this.errorMessage = 'Ya estás vinculado a este comisionista';
        } else {
          this.errorMessage = 'Error al vincularse al comisionista. Por favor intenta nuevamente.';
        }
      }
    });
  }

  verDetalles(comisionista: Comisionista): void {
    this.comisionistaSeleccionado = comisionista;
  }

  cerrarDetalles(): void {
    this.comisionistaSeleccionado = null;
  }

  getNombreCompleto(comisionista: Comisionista): string {
    return `${comisionista.nombre} ${comisionista.apellido}`;
  }

  getEstadoBadgeClass(estado: boolean): string {
    return estado ? 'bg-success' : 'bg-danger';
  }

  getEstadoTexto(estado: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }

  puedeVincular(comisionista: Comisionista): boolean {
    return comisionista.estado && !this.vinculando;
  }

  /**
   * Obtiene la URL de la imagen del comisionista
   * Asigna imágenes de forma determinística basada en el ID
   * Alterna entre 1h.jpg, 2h.jpg, 3m.jpg, 4m.jpg
   */
  getImagenComisionista(comisionista: Comisionista): string {
    const imagenIndex = comisionista.id % 4;
    const imagenes = ['1h.jpg', '2h.jpg', '3m.jpg', '4m.jpg'];
    return `assets/${imagenes[imagenIndex]}`;
  }
}

