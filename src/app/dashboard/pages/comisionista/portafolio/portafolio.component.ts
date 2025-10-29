import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portafolio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2 class="mb-4">Portafolio de Clientes</h2>
      
      <!-- Resumen Total -->
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="card summary-card">
            <div class="card-body">
              <h5 class="card-title">Valor Total</h5>
              <h3 class="card-value">{{ valorTotal | currency:'USD' }}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card summary-card">
            <div class="card-body">
              <h5 class="card-title">Clientes Activos</h5>
              <h3 class="card-value">{{ clientesActivos }}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card summary-card">
            <div class="card-body">
              <h5 class="card-title">Operaciones Hoy</h5>
              <h3 class="card-value">{{ operacionesHoy }}</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de Portafolios -->
      <div class="card">
        <div class="card-body">
          <table class="table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Valor Portafolio</th>
                <th>Rendimiento</th>
                <th>Última Operación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let portafolio of portafolios">
                <td>{{ portafolio.cliente }}</td>
                <td>{{ portafolio.valor | currency:'USD' }}</td>
                <td [ngClass]="portafolio.rendimiento >= 0 ? 'text-success' : 'text-danger'">
                  {{ portafolio.rendimiento }}%
                </td>
                <td>{{ portafolio.ultimaOperacion | date:'short' }}</td>
                <td>
                  <button class="btn btn-sm btn-primary me-2">Ver Detalles</button>
                  <button class="btn btn-sm btn-info">Ver Historial</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
    }
    .card {
      background-color: #1a1d2e;
      border: none;
      border-radius: 10px;
      margin-bottom: 1rem;
    }
    .summary-card {
      text-align: center;
      .card-title {
        color: #ccc;
        font-size: 1rem;
        margin-bottom: 0.5rem;
      }
      .card-value {
        color: #0CA77D;
        font-size: 2rem;
        margin: 0;
      }
    }
    .table {
      color: white;
    }
    .text-success {
      color: #0CA77D !important;
    }
    .text-danger {
      color: #dc3545 !important;
    }
  `]
})
export class PortafolioComponent implements OnInit {
  valorTotal: number = 1500000;
  clientesActivos: number = 25;
  operacionesHoy: number = 12;

  portafolios: any[] = [
    {
      cliente: 'Juan Pérez',
      valor: 75000,
      rendimiento: 5.2,
      ultimaOperacion: new Date()
    },
    {
      cliente: 'María García',
      valor: 125000,
      rendimiento: -2.1,
      ultimaOperacion: new Date()
    },
    {
      cliente: 'Carlos López',
      valor: 95000,
      rendimiento: 3.8,
      ultimaOperacion: new Date()
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Aquí cargarías los datos reales desde el backend
  }
} 