import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analisis',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2 class="mb-4">Análisis de Mercado</h2>
      
      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Tendencias del Mercado</h5>
              <div class="chart-placeholder">
                <!-- Aquí irá el gráfico de tendencias -->
                <p class="text-center text-muted">Gráfico de tendencias</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Volumen de Operaciones</h5>
              <div class="chart-placeholder">
                <!-- Aquí irá el gráfico de volumen -->
                <p class="text-center text-muted">Gráfico de volumen</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Análisis Técnico</h5>
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Indicador</th>
                      <th>Valor</th>
                      <th>Señal</th>
                      <th>Interpretación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let indicador of indicadores">
                      <td>{{ indicador.nombre }}</td>
                      <td>{{ indicador.valor }}</td>
                      <td>
                        <span class="badge" [ngClass]="indicador.senal === 'Compra' ? 'bg-success' : 'bg-danger'">
                          {{ indicador.senal }}
                        </span>
                      </td>
                      <td>{{ indicador.interpretacion }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
      margin-bottom: 1rem;
    }
    .card-title {
      color: #fff;
      margin-bottom: 1.5rem;
    }
    .chart-placeholder {
      height: 300px;
      background-color: #2e3446;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .table {
      color: white;
    }
    .badge {
      padding: 0.5em 1em;
    }
  `]
})
export class AnalisisComponent implements OnInit {
  indicadores: any[] = [
    {
      nombre: 'RSI',
      valor: '65.4',
      senal: 'Compra',
      interpretacion: 'Mercado sobrecomprado'
    },
    {
      nombre: 'MACD',
      valor: '0.25',
      senal: 'Venta',
      interpretacion: 'Cruce bajista'
    },
    {
      nombre: 'Media Móvil 50',
      valor: '112.5',
      senal: 'Compra',
      interpretacion: 'Precio por encima de la media'
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Aquí cargarías los datos reales desde el backend
  }
} 