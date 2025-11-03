import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComisionistasService } from '../../../../services/comisionistas/comisionistas.service';
import { TraderAsociado } from '../../../../models/trader.model';

@Component({
  selector: 'app-traders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './traders.component.html',
  styleUrls: ['./traders.component.scss']
})
export class TradersComponent implements OnInit {
  traders: TraderAsociado[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  traderSeleccionado: TraderAsociado | null = null;

  constructor(private comisionistasService: ComisionistasService) {}

  ngOnInit(): void {
    this.cargarTradersAsociados();
  }

  cargarTradersAsociados(): void {
    // Obtener el ID del comisionista logueado desde localStorage
    const idComisionista = Number(localStorage.getItem('usuarioId') || localStorage.getItem('idUsuario'));
    
    if (!idComisionista) {
      this.errorMessage = 'No se encontró el ID del comisionista. Por favor, inicia sesión nuevamente.';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    console.log('📋 Cargando traders asociados para comisionista ID:', idComisionista);

    this.comisionistasService.obtenerTradersAsociados(idComisionista).subscribe({
      next: (data) => {
        console.log('✅ Traders asociados recibidos:', data);
        this.traders = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar traders asociados:', err);
        this.errorMessage = 'Error al cargar la lista de traders asociados';
        this.loading = false;
      }
    });
  }

  verDetalles(trader: TraderAsociado): void {
    this.traderSeleccionado = trader;
  }

  cerrarDetalles(): void {
    this.traderSeleccionado = null;
  }

  getNombreCompleto(trader: TraderAsociado): string {
    return `${trader.nombre} ${trader.apellido}`;
  }

  getEstadoBadgeClass(estado: boolean): string {
    return estado ? 'bg-success' : 'bg-danger';
  }

  getEstadoTexto(estado: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }

  /**
   * Obtiene la URL de la imagen del trader
   * Asigna imágenes de forma determinística basada en el ID
   * Alterna entre 1h.jpg, 2h.jpg, 3m.jpg, 4m.jpg
   */
  getImagenTrader(trader: TraderAsociado): string {
    const imagenIndex = trader.id % 4;
    const imagenes = ['1h.jpg', '2h.jpg', '3m.jpg', '4m.jpg'];
    return `assets/${imagenes[imagenIndex]}`;
  }
} 