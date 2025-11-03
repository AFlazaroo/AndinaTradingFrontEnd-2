import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MercadoColombiaService } from '../../../../services/mercado-colombia/mercado-colombia.service';
import { PosicionPaper, ResumenPortafolio } from '../../../../models/paper-trading.model';
import { ModalVentaComponent } from '../../modals/modal-venta/modal-venta.component';
declare var bootstrap: any;

@Component({
  selector: 'app-portafolio',
  standalone: true,
  imports: [CommonModule, RouterModule, ModalVentaComponent],
  templateUrl: './portafolio.component.html',
  styleUrls: ['./portafolio.component.scss']
})
export class PortafolioComponent implements OnInit {
  posiciones: PosicionPaper[] = [];
  resumen: ResumenPortafolio | null = null;
  loading: boolean = true;
  errorMessage: string = '';
  
  // Datos para el modal de venta
  simboloSeleccionado: string = '';
  nombreEmpresaSeleccionada: string = '';
  cantidadDisponible: number = 0;
  precioActualSeleccionado: number = 0;

  @ViewChild(ModalVentaComponent) modalVenta!: ModalVentaComponent;

  constructor(private mercadoService: MercadoColombiaService) {}

  ngOnInit(): void {
    this.cargarPosiciones();
  }

  cargarPosiciones(): void {
    // Obtener el usuarioId del localStorage
    const usuarioId = Number(localStorage.getItem('usuarioId') || localStorage.getItem('idUsuario'));
    
    console.log('📋 Cargando portafolio para usuario:', usuarioId);
    
    if (!usuarioId) {
      this.errorMessage = 'Usuario no autenticado. Por favor, inicia sesión.';
      this.loading = false;
      console.error('❌ No se encontró usuarioId en localStorage');
      return;
    }

    this.loading = true;
    
    // Cargar resumen del portafolio
    this.mercadoService.getResumenPortafolio(usuarioId).subscribe({
      next: (resumenData) => {
        console.log('✅ Resumen del portafolio recibido:', resumenData);
        this.resumen = resumenData;
      },
      error: (err) => {
        console.error('❌ Error al cargar resumen:', err);
      }
    });

    // Cargar posiciones detalladas
    this.mercadoService.getPosicionesUsuario(usuarioId).subscribe({
      next: (data) => {
        console.log('✅ Posiciones recibidas:', data);
        this.posiciones = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar posiciones:', err);
        this.errorMessage = 'Error al cargar tus posiciones';
        this.loading = false;
      }
    });
  }

  abrirModalVenta(posicion: PosicionPaper): void {
    this.simboloSeleccionado = posicion.simbolo;
    this.nombreEmpresaSeleccionada = posicion.nombreEmpresa;
    this.cantidadDisponible = posicion.cantidad;
    // Calcular precio actual desde valorMercadoActual / cantidad
    this.precioActualSeleccionado = posicion.cantidad > 0 
      ? posicion.valorMercadoActual / posicion.cantidad 
      : posicion.precioPromedio;

    // Usar setTimeout para asegurar que el modal se configure después del cambio de detección
    setTimeout(() => {
      if (this.modalVenta) {
        this.modalVenta.symbol = this.simboloSeleccionado;
        this.modalVenta.nombreEmpresa = this.nombreEmpresaSeleccionada;
        this.modalVenta.cantidadDisponible = this.cantidadDisponible;
        this.modalVenta.precioActual = this.precioActualSeleccionado;
        this.modalVenta.open();
      }
    }, 0);
  }

  onConfirmarVenta(datos: { cantidad: number }): void {
    const usuarioId = Number(localStorage.getItem('usuarioId') || localStorage.getItem('idUsuario'));
    
    console.log('🔍 Datos de venta:', {
      usuarioId,
      simbolo: this.simboloSeleccionado,
      cantidad: datos.cantidad,
      nota: 'El precio se obtendrá automáticamente del mercado en tiempo real'
    });

    if (!usuarioId || datos.cantidad < 1) {
      alert('Datos inválidos para la venta');
      console.error('❌ Validación fallida:', { usuarioId, cantidad: datos.cantidad });
      return;
    }

    this.loading = true;
    this.mercadoService.venderAccionesPaper(
      usuarioId,
      this.simboloSeleccionado,
      datos.cantidad
    ).subscribe({
      next: (mensaje) => {
        this.loading = false;
        console.log('✅ Venta exitosa:', mensaje);
        alert(`✅ Venta exitosa!\n\n${mensaje}`);
        // Recargar posiciones y resumen después de la venta
        this.cargarPosiciones();
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Error en la venta:', err);
        
        let errorMsg = 'Error desconocido';
        if (err.error && typeof err.error === 'string') {
          errorMsg = err.error;
        } else if (err.message) {
          errorMsg = err.message;
        }
        
        alert(`❌ Error en la venta:\n\n${errorMsg}`);
      }
    });
  }

  getColorGanancia(ganancia: number): string {
    if (ganancia > 0) return 'text-success';
    if (ganancia < 0) return 'text-danger';
    return 'text-muted';
  }

  getIconoGanancia(ganancia: number): string {
    if (ganancia > 0) return 'bi-arrow-up-circle';
    if (ganancia < 0) return 'bi-arrow-down-circle';
    return 'bi-dash-circle';
  }

  get valorTotalPortafolio(): number {
    return this.resumen?.valorTotal || 0;
  }

  get gananciaPerdidaTotal(): number {
    return this.resumen?.gananciaPerdida || 0;
  }

  get porcentajeGananciaPerdida(): number {
    return this.resumen?.porcentaje || 0;
  }

  get estadoPortafolio(): string {
    return this.resumen?.estado || 'NEUTRO';
  }
}
