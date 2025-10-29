import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-traders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2 class="mb-4">Traders Asociados</h2>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <table class="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let trader of traders">
                    <td>{{ trader.nombre }}</td>
                    <td>{{ trader.email }}</td>
                    <td>
                      <span class="badge" [ngClass]="trader.activo ? 'bg-success' : 'bg-danger'">
                        {{ trader.activo ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-primary me-2">Ver Detalles</button>
                      <button class="btn btn-sm btn-info">Ver Portafolio</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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
    }
    .table {
      color: white;
    }
    .badge {
      padding: 0.5em 1em;
    }
  `]
})
export class TradersComponent implements OnInit {
  traders: any[] = [
    { nombre: 'Juan Pérez', email: 'juan@example.com', activo: true },
    { nombre: 'María García', email: 'maria@example.com', activo: true },
    { nombre: 'Carlos López', email: 'carlos@example.com', activo: false }
  ];

  constructor() {}

  ngOnInit(): void {
    // Aquí cargarías los datos reales desde el backend
  }
} 