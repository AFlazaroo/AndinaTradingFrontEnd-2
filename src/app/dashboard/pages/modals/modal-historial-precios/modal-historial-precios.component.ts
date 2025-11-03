import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexOptions } from 'ng-apexcharts';
import { MercadoColombiaService } from '../../../../services/mercado-colombia/mercado-colombia.service';
import { HistorialPreciosResponse, PuntoHistorial } from '../../../../models/historial-precios.model';

@Component({
  selector: 'app-modal-historial-precios',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './modal-historial-precios.component.html',
  styleUrls: ['./modal-historial-precios.component.scss']
})
export class ModalHistorialPreciosComponent implements OnInit, OnChanges {
  @Input() simbolo: string = '';
  @Input() nombreEmpresa: string = '';

  historial: HistorialPreciosResponse | null = null;
  loading: boolean = false;
  errorMessage: string = '';

  chartOptions: ApexOptions = {
    series: [],
    chart: {
      type: 'line',
      height: 400
    }
  };

  constructor(private mercadoService: MercadoColombiaService) {}

  ngOnInit(): void {
    if (this.simbolo) {
      this.cargarHistorial();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['simbolo'] && !changes['simbolo'].firstChange && this.simbolo) {
      this.cargarHistorial();
    }
  }

  cargarHistorial(): void {
    if (!this.simbolo) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.historial = null;

    this.mercadoService.getHistorialPrecios(this.simbolo).subscribe({
      next: (data) => {
        console.log('✅ Historial de precios recibido:', data);
        this.historial = data;
        this.configurarGrafico();
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar historial de precios:', err);
        this.errorMessage = 'Error al cargar el historial de precios';
        this.loading = false;
      }
    });
  }

  configurarGrafico(): void {
    if (!this.historial || !this.historial.datos || this.historial.datos.length === 0) {
      return;
    }

    // Formatear fechas para el gráfico
    const fechas = this.historial.datos.map(punto => this.formatearFecha(punto.fecha));
    const preciosCierre = this.historial.datos.map(punto => punto.precioCierre);
    const preciosApertura = this.historial.datos.map(punto => punto.precioApertura);
    const preciosMaximo = this.historial.datos.map(punto => punto.precioMaximo);
    const preciosMinimo = this.historial.datos.map(punto => punto.precioMinimo);

    this.chartOptions = {
      series: [
        {
          name: 'Precio de Cierre',
          data: preciosCierre,
          type: 'line'
        },
        {
          name: 'Precio de Apertura',
          data: preciosApertura,
          type: 'line'
        },
        {
          name: 'Precio Máximo',
          data: preciosMaximo,
          type: 'line'
        },
        {
          name: 'Precio Mínimo',
          data: preciosMinimo,
          type: 'line'
        }
      ],
      chart: {
        height: 400,
        type: 'line',
        zoom: {
          enabled: true
        },
        toolbar: {
          show: true
        },
        background: 'transparent'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      title: {
        text: `${this.nombreEmpresa || this.simbolo} - Evolución de Precios`,
        align: 'left',
        style: {
          color: '#fff',
          fontSize: '16px',
          fontWeight: '600'
        }
      },
      subtitle: {
        text: this.historial.periodo,
        align: 'left',
        style: {
          color: '#ccc',
          fontSize: '12px'
        }
      },
      grid: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        strokeDashArray: 4
      },
      xaxis: {
        categories: fechas,
        labels: {
          style: {
            colors: '#ccc'
          }
        },
        title: {
          text: 'Fecha',
          style: {
            color: '#ccc'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#ccc'
          },
          formatter: (value: number) => {
            return `$${value.toFixed(2)}`;
          }
        },
        title: {
          text: 'Precio (USD)',
          style: {
            color: '#ccc'
          }
        }
      },
      legend: {
        labels: {
          colors: '#fff'
        }
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (value: number) => {
            return `$${value.toFixed(2)}`;
          }
        }
      },
      colors: ['#0ca77d', '#0d6efd', '#28a745', '#dc3545']
    };
  }

  formatearFecha(fechaStr: string): string {
    // Formato entrada: YYYYMMDD (ej: "20251027")
    if (fechaStr.length !== 8) {
      return fechaStr;
    }

    const año = fechaStr.substring(0, 4);
    const mes = fechaStr.substring(4, 6);
    const dia = fechaStr.substring(6, 8);

    const fecha = new Date(`${año}-${mes}-${dia}`);
    
    // Formato salida: DD/MM/YYYY
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getVariacionPercentual(): number {
    if (!this.historial || !this.historial.datos || this.historial.datos.length < 2) {
      return 0;
    }

    const datos = this.historial.datos;
    const precioInicial = datos[0].precioCierre;
    const precioFinal = datos[datos.length - 1].precioCierre;

    return ((precioFinal - precioInicial) / precioInicial) * 100;
  }

  getPrecioActual(): number {
    if (!this.historial || !this.historial.datos || this.historial.datos.length === 0) {
      return 0;
    }

    return this.historial.datos[this.historial.datos.length - 1].precioCierre;
  }

  getPrecioInicial(): number {
    if (!this.historial || !this.historial.datos || this.historial.datos.length === 0) {
      return 0;
    }

    return this.historial.datos[0].precioCierre;
  }
}

