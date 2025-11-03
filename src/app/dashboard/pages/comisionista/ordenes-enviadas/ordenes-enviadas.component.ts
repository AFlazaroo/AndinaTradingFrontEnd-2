import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComisionistasService } from '../../../../services/comisionistas/comisionistas.service';
import { OrdenComisionista, EstadoOrden } from '../../../../models/orden-comisionista.model';

@Component({
  selector: 'app-ordenes-enviadas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ordenes-enviadas.component.html',
  styleUrls: ['./ordenes-enviadas.component.scss']
})
export class OrdenesEnviadasComponent implements OnInit {
  ordenes: OrdenComisionista[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  ordenSeleccionada: OrdenComisionista | null = null;

  constructor(private comisionistasService: ComisionistasService) {}

  ngOnInit(): void {
    this.cargarOrdenes();
  }

  cargarOrdenes(): void {
    const idComisionista = Number(localStorage.getItem('usuarioId') || localStorage.getItem('idUsuario'));
    
    if (!idComisionista) {
      this.errorMessage = 'No se encontró el ID del comisionista';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.comisionistasService.obtenerOrdenesEnviadas(idComisionista).subscribe({
      next: (data) => {
        console.log('✅ Órdenes recibidas:', data);
        this.ordenes = data.sort((a, b) => {
          // Ordenar por fecha más reciente primero
          return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar órdenes:', err);
        this.errorMessage = 'Error al cargar las órdenes enviadas';
        this.loading = false;
      }
    });
  }

  verDetalles(orden: OrdenComisionista): void {
    this.ordenSeleccionada = orden;
  }

  cerrarDetalles(): void {
    this.ordenSeleccionada = null;
  }

  getEstadoBadgeClass(estado: string): string {
    switch (estado) {
      case EstadoOrden.EJECUTADA:
        return 'bg-success';
      case EstadoOrden.ACEPTADA:
        return 'bg-info';
      case EstadoOrden.PENDIENTE_APROBACION:
        return 'bg-warning';
      case EstadoOrden.RECHAZADA:
        return 'bg-danger';
      case EstadoOrden.ERROR_EJECUCION:
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  }

  getEstadoTexto(estado: string): string {
    const estados: { [key: string]: string } = {
      'PENDIENTE_APROBACION': 'Pendiente',
      'ACEPTADA': 'Aceptada',
      'EJECUTADA': 'Ejecutada',
      'RECHAZADA': 'Rechazada',
      'ERROR_EJECUCION': 'Error'
    };
    return estados[estado] || estado;
  }

  formatearFecha(fechaStr: string): string {
    if (!fechaStr) return 'N/A';
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return fechaStr;
    }
  }
}

