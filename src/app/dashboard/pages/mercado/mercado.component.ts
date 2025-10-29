import { Component, OnInit, ViewChild } from '@angular/core';
import { MercadoColombiaService } from '../../../services/mercado-colombia/mercado-colombia.service';
import { CommonModule } from '@angular/common';
import { AccionColombia } from '../../../models/mercado-colombia.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalCompraComponent } from "../modals/modal-compra/modal-compra.component";
declare var bootstrap: any;

@Component({
  selector: 'app-mercado',
  standalone: true,
  templateUrl: './mercado.component.html',
  styleUrls: ['./mercado.component.scss'],
  imports: [CommonModule, ModalCompraComponent]
})


export class MercadoComponent implements OnInit {
  loading = true;
  uiMessage: string | null = null;

  // Datos del mercado colombiano
  acciones: AccionColombia[] = [];
  accionesDestacadas: AccionColombia[] = []; // Ecopetrol, Bancolombia, Avianca
  
  symbolSeleccionado: string = '';
  cantidad: number = 1;
  
  // Control de visualización de gráficos
  mostrarGraficos: boolean = true; // Cambiar a false si los gráficos no funcionan
  
  // Lista de símbolos que no tienen gráfico disponible en TradingView
  simbolosSinGrafico: string[] = ['AVH', 'AVIANCA', 'AVHOQ'];

  @ViewChild(ModalCompraComponent) modalCompra!: ModalCompraComponent;

  constructor(
    private mercadoService: MercadoColombiaService,
    private sanitizer: DomSanitizer
  ) {}

  abrirModalCompra(symbol: string): void {
    this.symbolSeleccionado = symbol;
    this.cantidad = 1;

    const modalElement = document.getElementById('modalCompra');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  onConfirmarCompra(cantidad: number): void {
    const idUsuario = Number(localStorage.getItem('idUsuario'));
    
    console.log('🔍 Datos de compra:', {
      idUsuario,
      cantidad,
      symbolSeleccionado: this.symbolSeleccionado
    });

    if (!idUsuario || cantidad < 1) {
      alert('Datos inválidos - Usuario: ' + idUsuario + ', Cantidad: ' + cantidad);
      console.error('❌ Validación fallida:', { idUsuario, cantidad });
      return;
    }

    // Buscar el nombre de la empresa
    let nombreEmpresa = this.symbolSeleccionado;
    
    // Verificar que los arrays existan antes de buscar
    if (Array.isArray(this.acciones) && this.acciones.length > 0) {
      const accion = this.acciones.find(a => a.simbolo === this.symbolSeleccionado);
      if (accion) {
        nombreEmpresa = accion.nombre;
      }
    }
    
    if (!nombreEmpresa && Array.isArray(this.accionesDestacadas) && this.accionesDestacadas.length > 0) {
      const accion = this.accionesDestacadas.find(a => a.simbolo === this.symbolSeleccionado);
      if (accion) {
        nombreEmpresa = accion.nombre;
      }
    }

    console.log('📤 Enviando solicitud de compra:', {
      usuarioId: idUsuario,
      simbolo: this.symbolSeleccionado,
      nombreEmpresa,
      cantidad
    });

    this.loading = true;
    // Usar el nuevo endpoint de paper trading
    this.mercadoService.comprarAccionesPaper(idUsuario, this.symbolSeleccionado, nombreEmpresa, cantidad).subscribe({
      next: (mensaje) => {
        this.loading = false;
        console.log('✅ Respuesta exitosa del servidor:', mensaje);
        alert(`✅ Compra exitosa!\n\n${mensaje}`);
        // Recargar datos después de la compra
        this.cargarDatosMercado();
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Error completo:', err);
        console.error('❌ Error status:', err.status);
        console.error('❌ Error message:', err.message);
        console.error('❌ Error error:', err.error);
        
        let errorMsg = 'Error desconocido';
        if (err.error && typeof err.error === 'string') {
          errorMsg = err.error;
        } else if (err.message) {
          errorMsg = err.message;
        }
        
        alert(`❌ Error en la compra:\n\n${errorMsg}`);
      }
    });
  }


  ngOnInit(): void {
    this.cargarDatosMercado();
  }

  /**
   * Carga los datos del mercado colombiano
   */
  private cargarDatosMercado(): void {
    this.loading = true;
    this.uiMessage = null;

    // Cargar todas las acciones disponibles
    this.mercadoService.getListadoAcciones().subscribe({
      next: (acciones) => {
        this.acciones = acciones;
        console.log('Acciones colombianas cargadas:', acciones);
      },
      error: (error) => {
        console.error('Error cargando acciones:', error);
        this.uiMessage = error.message || 'Error al cargar datos del mercado colombiano';
        this.acciones = [];
      },
      complete: () => {
        this.loading = false;
      }
    });

    // Cargar acciones destacadas (Ecopetrol, Bancolombia, Avianca)
    this.cargarAccionesDestacadas();
  }

  /**
   * Carga las acciones más importantes: Apple (para pruebas), Ecopetrol, Bancolombia, Avianca
   */
  private cargarAccionesDestacadas(): void {
    Promise.all([
      this.mercadoService.getApple().toPromise(),
      this.mercadoService.getEcopetrol().toPromise(),
      this.mercadoService.getBancolombia().toPromise(),
      this.mercadoService.getAvianca().toPromise()
    ])
    .then(([apple, ecopetrol, bancolombia, avianca]) => {
      this.accionesDestacadas = [apple, ecopetrol, bancolombia, avianca].filter(a => a !== undefined) as AccionColombia[];
      console.log('✅ Acciones destacadas cargadas:', this.accionesDestacadas);
    })
    .catch(error => {
      console.error('❌ Error cargando acciones destacadas:', error);
    });
  }

  /**
   * Obtiene la URL del gráfico de TradingView para una acción colombiana
   * Nota: No todas las acciones colombianas están disponibles en TradingView
   */
  getChartUrl(simbolo: string): SafeResourceUrl {
    // Mapeo de símbolos colombianos y estadounidenses al formato de TradingView
    const symbolMap: { [key: string]: string } = {
      // Acciones estadounidenses (para pruebas)
      'AAPL': 'NASDAQ:AAPL',         // Apple
      'MSFT': 'NASDAQ:MSFT',         // Microsoft
      'GOOGL': 'NASDAQ:GOOGL',       // Google
      'TSLA': 'NASDAQ:TSLA',         // Tesla
      'AMZN': 'NASDAQ:AMZN',         // Amazon
      // Acciones colombianas en NYSE
      'EC': 'NYSE:EC',               // Ecopetrol cotiza en NYSE como EC
      'ECOPETROL': 'NYSE:EC',
      'CIB': 'NYSE:CIB',             // Bancolombia cotiza en NYSE
      'BANCOLOMBIA': 'NYSE:CIB',
      'AVH': 'OTC:AVHOQ',            // Avianca Holdings en mercados OTC (EE.UU.)
      'AVIANCA': 'OTC:AVHOQ',
      'AVHOQ': 'OTC:AVHOQ',          // Avianca Holdings OTC
      'AVT_P': 'BVC:AVT_P',          // Avianca preferentes en BVC
      // Otras empresas colombianas en NYSE/mercados internacionales
      'ISA': 'NYSE:ISA',
      'GEB': 'NYSE:GEB',
      'CEMARGOS': 'NYSE:CLH',
      'NUTRESA': 'NYSE:NUTRESA',
      // Puedes agregar más mapeos según necesites
    };

    // Buscar el símbolo mapeado o usar el símbolo original con BVC
    const tvSymbol = symbolMap[simbolo.toUpperCase()] || `BVC:${simbolo.toUpperCase()}`;
    const url = `https://s.tradingview.com/embed-widget/mini-symbol-overview/?symbol=${tvSymbol}&locale=es&dateRange=1D&colorTheme=dark&autosize=true`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  /**
   * Calcula el porcentaje de variación de una acción
   */
  getVariacionPorcentual(accion: AccionColombia): number {
    return accion.variacionPorcentual || 0;
  }

  /**
   * Determina la clase CSS según la variación
   */
  getVariacionClass(variacion: number): string {
    if (variacion > 0) return 'text-success';
    if (variacion < 0) return 'text-danger';
    return 'text-muted';
  }

  /**
   * Verifica si un símbolo debe mostrar el gráfico de TradingView
   */
  deberaMostrarGrafico(simbolo: string): boolean {
    if (!this.mostrarGraficos) return false;
    return !this.simbolosSinGrafico.includes(simbolo.toUpperCase());
  }
}
