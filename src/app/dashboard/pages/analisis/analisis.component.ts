import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-analisis',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-4">
      <h2 class="mb-4 text-white">Análisis por País</h2>

      <!-- 🇨🇴 Colombia -->
      <div class="pais-header mb-3">
        <h3 class="text-white"><span class="pais-flag">🇨🇴</span> Colombia</h3>
      </div>
      <div class="row mb-5">
        <div class="col-md-6 col-lg-4 mb-4" *ngFor="let a of colombia">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div> 
                  <h5 class="card-title mb-1 text-white">{{ a.simbolo }}</h5>
                  <small class="text-muted">{{ a.nombre }}</small>
                </div>
                <span class="badge bg-primary">Colombia</span>
              </div>
              <div class="chart-placeholder mb-2" *ngIf="deberaMostrarGrafico(a.simbolo); else noCol">
                <iframe
                  [src]="getChartUrl(a.simbolo)"
                  width="100%"
                  height="220"
                  frameborder="0"
                  allowtransparency="true"
                  scrolling="no"
                  style="border: none;"></iframe>
              </div>
              <ng-template #noCol>
                <div class="chart-placeholder text-center">
                  <i class="bi bi-graph-up text-primary" style="font-size: 2rem;"></i>
                  <p class="text-muted small mb-0">{{ a.simbolo }}</p>
                  <small class="text-muted" style="font-size: 0.7rem;">Gráfico no disponible</small>
                </div>
              </ng-template>
            </div>
          </div>
        </div>
      </div>

      <!-- 🇪🇨 Ecuador -->
      <div class="pais-header mb-3">
        <h3 class="text-white"><span class="pais-flag">🇪🇨</span> Ecuador</h3>
      </div>
      <div class="row mb-5">
        <div class="col-md-6 col-lg-4 mb-4" *ngFor="let a of ecuador">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h5 class="card-title mb-1 text-white">{{ a.simbolo }}</h5>
                  <small class="text-muted">{{ a.nombre }}</small>
                </div>
                <span class="badge bg-info">Ecuador</span>
              </div>
              <div class="chart-placeholder mb-2" *ngIf="deberaMostrarGrafico(a.simbolo); else noEc">
                <iframe
                  [src]="getChartUrl(a.simbolo)"
                  width="100%"
                  height="220"
                  frameborder="0"
                  allowtransparency="true"
                  scrolling="no"
                  style="border: none;"></iframe>
              </div>
              <ng-template #noEc>
                <div class="chart-placeholder text-center">
                  <i class="bi bi-graph-up text-primary" style="font-size: 2rem;"></i>
                  <p class="text-muted small mb-0">{{ a.simbolo }}</p>
                  <small class="text-muted" style="font-size: 0.7rem;">Gráfico no disponible</small>
                </div>
              </ng-template>
            </div>
          </div>
        </div>
      </div>

      <!-- 🇵🇪 Perú -->
      <div class="pais-header mb-3">
        <h3 class="text-white"><span class="pais-flag">🇵🇪</span> Perú</h3>
      </div>
      <div class="row mb-5">
        <div class="col-md-6 col-lg-4 mb-4" *ngFor="let a of peru">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h5 class="card-title mb-1 text-white">{{ a.simbolo }}</h5>
                  <small class="text-muted">{{ a.nombre }}</small>
                </div>
                <span class="badge bg-danger">Perú</span>
              </div>
              <div class="chart-placeholder mb-2" *ngIf="deberaMostrarGrafico(a.simbolo); else noPe">
                <iframe
                  [src]="getChartUrl(a.simbolo)"
                  width="100%"
                  height="220"
                  frameborder="0"
                  allowtransparency="true"
                  scrolling="no"
                  style="border: none;"></iframe>
              </div>
              <ng-template #noPe>
                <div class="chart-placeholder text-center">
                  <i class="bi bi-graph-up text-primary" style="font-size: 2rem;"></i>
                  <p class="text-muted small mb-0">{{ a.simbolo }}</p>
                  <small class="text-muted" style="font-size: 0.7rem;">Gráfico no disponible</small>
                </div>
              </ng-template>
            </div>
          </div>
        </div>
      </div>

      <!-- 🇻🇪 Venezuela -->
      <div class="pais-header mb-3">
        <h3 class="text-white"><span class="pais-flag">🇻🇪</span> Venezuela</h3>
      </div>
      <div class="row mb-3">
        <div class="col-md-6 col-lg-4 mb-4" *ngFor="let a of venezuela">
          <div class="card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h5 class="card-title mb-1 text-white">{{ a.simbolo }}</h5>
                  <small class="text-muted">{{ a.nombre }}</small>
                </div>
                <span class="badge bg-warning text-dark">Venezuela</span>
              </div>
              <div class="chart-placeholder mb-2" *ngIf="deberaMostrarGrafico(a.simbolo); else noVe">
                <iframe
                  [src]="getChartUrl(a.simbolo)"
                  width="100%"
                  height="220"
                  frameborder="0"
                  allowtransparency="true"
                  scrolling="no"
                  style="border: none;"></iframe>
              </div>
              <ng-template #noVe>
                <div class="chart-placeholder text-center">
                  <i class="bi bi-graph-up text-primary" style="font-size: 2rem;"></i>
                  <p class="text-muted small mb-0">{{ a.simbolo }}</p>
                  <small class="text-muted" style="font-size: 0.7rem;">Gráfico no disponible</small>
                </div>
              </ng-template>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background-color: #1a1d2e;
      border: none;
      border-radius: 10px;
    }
    .chart-placeholder {
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }
    .pais-header {
      border-left: 4px solid #0ca77d;
      padding-left: 1rem;
    }
    .pais-flag { font-size: 2rem; margin-right: .5rem; }
  `]
})
export class AnalisisComponent implements OnInit {
  colombia = [
    { simbolo: 'EC', nombre: 'Ecopetrol' },
    { simbolo: 'CIB', nombre: 'Bancolombia' },
    { simbolo: 'PFBCO', nombre: 'Banco Davivienda' },
    { simbolo: 'NUTRESA', nombre: 'Grupo Nutresa' },
    { simbolo: 'CELSIA', nombre: 'Celsia' },
    { simbolo: 'ISA', nombre: 'ISA' },
    { simbolo: 'CEMARGOS', nombre: 'Cementos Argos' },
    { simbolo: 'BOGOTA', nombre: 'Banco de Bogotá' }
  ];

  ecuador = [
    { simbolo: 'PRONACA', nombre: 'Procesadora Nacional de Alimentos' },
    { simbolo: 'HOLCIM', nombre: 'Holcim Ecuador' },
    { simbolo: 'FAVORITA', nombre: 'La Favorita (Supermaxi)' },
    { simbolo: 'PICHINCHA', nombre: 'Banco Pichincha' },
    { simbolo: 'GUAYAQUIL', nombre: 'Banco de Guayaquil' }
  ];

  peru = [
    { simbolo: 'BVN', nombre: 'Compañía de Minas Buenaventura' },
    { simbolo: 'BAP', nombre: 'Credicorp' },
    { simbolo: 'SCCO', nombre: 'Southern Copper Corporation' },
    { simbolo: 'FERREYCORP', nombre: 'Ferreycorp' },
    { simbolo: 'BACKUS', nombre: 'Backus' }
  ];

  venezuela = [
    { simbolo: 'PDVSA', nombre: 'Petróleos de Venezuela' },
    { simbolo: 'CANTV', nombre: 'CANTV' },
    { simbolo: 'ELECTRICIDAD', nombre: 'Electricidad de Caracas' },
    { simbolo: 'BANVENEZ', nombre: 'Banco de Venezuela' },
    { simbolo: 'SIDERURGICA', nombre: 'Siderúrgica del Orinoco' }
  ];

  // Lista de símbolos que no tienen gráfico en TradingView
  simbolosSinGrafico: string[] = [
    'PRONACA', 'HOLCIM', 'FAVORITA', 'PICHINCHA', 'GUAYAQUIL',
    'FERREYCORP', 'BACKUS',
    'PDVSA', 'CANTV', 'ELECTRICIDAD', 'BANVENEZ', 'SIDERURGICA',
    'NUTRESA', 'CELSIA', 'ISA', 'CEMARGOS', 'PFBCO', 'BOGOTA', 'AVH', 'AVIANCA', 'AVHOQ'
  ];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  deberaMostrarGrafico(simbolo: string): boolean {
    if (!simbolo || simbolo.trim() === '') return false;
    const simboloUpper = simbolo.toUpperCase().trim();
    const noTieneGrafico = this.simbolosSinGrafico.includes(simboloUpper);
    return !noTieneGrafico;
  }

  getChartUrl(simbolo: string): SafeResourceUrl {
    const symbolMap: { [key: string]: string } = {
      // 🇨🇴 Colombia (NYSE)
      'EC': 'NYSE:EC',
      'CIB': 'NYSE:CIB',
      // Nota: PFBCO, BOGOTA, AVH/AVIANCA no están disponibles en TradingView o NYSE
      // 🇵🇪 Perú (NYSE)
      'BVN': 'NYSE:BVN',
      'BAP': 'NYSE:BAP',
      'SCCO': 'NYSE:SCCO'
    };

    const mapped = symbolMap[simbolo.toUpperCase()];
    // Solo usar el símbolo mapeado si existe, de lo contrario usar BVC como fallback
    const finalSymbol = mapped || `BVC:${simbolo.toUpperCase()}`;
    const url = `https://s.tradingview.com/embed-widget/mini-symbol-overview/?symbol=${encodeURIComponent(finalSymbol)}&locale=es&dateRange=1D&colorTheme=dark&autosize=true`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}