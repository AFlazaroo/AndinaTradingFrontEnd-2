import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MercadoColombiaService } from '../../../services/mercado-colombia/mercado-colombia.service';
import { TransaccionPaper } from '../../../models/paper-trading.model';

@Component({
  selector: 'app-operaciones',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './operaciones.component.html',
  styleUrls: ['./operaciones.component.scss']
})
export class OperacionesComponent implements OnInit {
  transacciones: TransaccionPaper[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private mercadoService: MercadoColombiaService) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    // Priorizar 'usuarioId' pero mantener compatibilidad con 'idUsuario'
    const idUsuario = Number(localStorage.getItem('usuarioId') || localStorage.getItem('idUsuario'));
    
    console.log('📋 Cargando historial para usuario:', idUsuario);
    
    if (!idUsuario) {
      this.errorMessage = 'Usuario no autenticado. Por favor, inicia sesión.';
      this.loading = false;
      console.error('❌ No se encontró usuarioId en localStorage');
      return;
    }

    this.loading = true;
    this.mercadoService.getHistorialTransacciones(idUsuario).subscribe({
      next: (data) => {
        console.log('✅ Historial de transacciones recibido:', data);
        this.transacciones = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar historial:', err);
        this.errorMessage = 'Error al cargar el historial de transacciones';
        this.loading = false;
      }
    });
  }

  getIconoTipo(tipo: string): string {
    return tipo === 'COMPRA' ? 'bi-cart-plus' : 'bi-cart-dash';
  }

  getColorTipo(tipo: string): string {
    return tipo === 'COMPRA' ? 'text-success' : 'text-danger';
  }
}