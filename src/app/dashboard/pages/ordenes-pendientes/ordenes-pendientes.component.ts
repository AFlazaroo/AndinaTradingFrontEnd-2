import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MercadoColombiaService } from '../../../services/mercado-colombia/mercado-colombia.service';
import { OrdenComisionista, EstadoOrden } from '../../../models/orden-comisionista.model';

@Component({
  selector: 'app-ordenes-pendientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ordenes-pendientes.component.html',
  styleUrls: ['./ordenes-pendientes.component.scss']
})
export class OrdenesPendientesComponent implements OnInit {
  ordenes: OrdenComisionista[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';
  ordenSeleccionada: OrdenComisionista | null = null;
  procesandoOrden: number | null = null;

  constructor(private mercadoService: MercadoColombiaService) {}

  ngOnInit(): void {
    this.cargarOrdenesPendientes();
  }

  cargarOrdenesPendientes(): void {
    const idTrader = Number(localStorage.getItem('usuarioId') || localStorage.getItem('idUsuario'));
    
    if (!idTrader) {
      this.errorMessage = 'No se encontró el ID del trader';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.mercadoService.obtenerOrdenesPendientes(idTrader).subscribe({
      next: (data) => {
        console.log('✅ Órdenes pendientes recibidas:', data);
        this.ordenes = data.sort((a, b) => {
          // Ordenar por fecha más reciente primero
          return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar órdenes pendientes:', err);
        this.errorMessage = 'Error al cargar las órdenes pendientes';
        this.loading = false;
      }
    });
  }

  aceptarOrden(orden: OrdenComisionista): void {
    const confirmar = confirm(
      `¿Estás seguro de aceptar esta orden?\n\n` +
      `Símbolo: ${orden.simbolo}\n` +
      `Cantidad: ${orden.cantidad} acciones\n` +
      `Precio límite: ${orden.precioLimite ? '$' + orden.precioLimite.toFixed(2) : 'Sin límite'}\n\n` +
      `Al aceptar, se ejecutará la compra automáticamente.`
    );

    if (!confirmar) {
      return;
    }

    this.procesandoOrden = orden.id;
    this.errorMessage = '';
    this.successMessage = '';

    this.mercadoService.aceptarOrdenComisionista(orden.id).subscribe({
      next: (response) => {
        console.log('✅ Orden aceptada:', response);
        this.successMessage = response.mensaje || 'Orden aceptada y compra ejecutada exitosamente';
        this.procesandoOrden = null;
        
        // Recargar órdenes después de un momento
        setTimeout(() => {
          this.cargarOrdenesPendientes();
        }, 2000);
      },
      error: (err) => {
        console.error('❌ Error al aceptar orden:', err);
        this.procesandoOrden = null;
        
        if (err.error?.mensaje) {
          this.errorMessage = err.error.mensaje;
        } else {
          this.errorMessage = 'Error al aceptar la orden. Por favor intenta nuevamente';
        }
      }
    });
  }

  rechazarOrden(orden: OrdenComisionista): void {
    const confirmar = confirm(
      `¿Estás seguro de rechazar esta orden?\n\n` +
      `Símbolo: ${orden.simbolo}\n` +
      `Cantidad: ${orden.cantidad} acciones`
    );

    if (!confirmar) {
      return;
    }

    this.procesandoOrden = orden.id;
    this.errorMessage = '';
    this.successMessage = '';

    this.mercadoService.rechazarOrdenComisionista(orden.id).subscribe({
      next: (response) => {
        console.log('✅ Orden rechazada:', response);
        this.successMessage = response.mensaje || 'Orden rechazada exitosamente';
        this.procesandoOrden = null;
        
        // Recargar órdenes después de un momento
        setTimeout(() => {
          this.cargarOrdenesPendientes();
        }, 1500);
      },
      error: (err) => {
        console.error('❌ Error al rechazar orden:', err);
        this.procesandoOrden = null;
        
        if (err.error?.mensaje) {
          this.errorMessage = err.error.mensaje;
        } else {
          this.errorMessage = 'Error al rechazar la orden. Por favor intenta nuevamente';
        }
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

  puedeProcesar(orden: OrdenComisionista): boolean {
    return orden.estado === EstadoOrden.PENDIENTE_APROBACION && this.procesandoOrden !== orden.id;
  }
}

