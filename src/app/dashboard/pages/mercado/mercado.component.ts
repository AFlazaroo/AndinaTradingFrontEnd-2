import { Component, OnInit, ViewChild } from '@angular/core';
import { MercadoColombiaService } from '../../../services/mercado-colombia/mercado-colombia.service';
import { CommonModule } from '@angular/common';
import { AccionColombia } from '../../../models/mercado-colombia.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalCompraComponent } from "../modals/modal-compra/modal-compra.component";
import { ModalHistorialPreciosComponent } from "../modals/modal-historial-precios/modal-historial-precios.component";
declare var bootstrap: any;

@Component({
  selector: 'app-mercado',
  standalone: true,
  templateUrl: './mercado.component.html',
  styleUrls: ['./mercado.component.scss'],
  imports: [CommonModule, ModalCompraComponent, ModalHistorialPreciosComponent]
})


export class MercadoComponent implements OnInit {
  loading = true;
  uiMessage: string | null = null;

  // Datos del mercado
  acciones: AccionColombia[] = [];
  accionesDestacadas: AccionColombia[] = [];
  
  // Acciones organizadas por país
  accionesColombia: AccionColombia[] = [];
  accionesEcuador: AccionColombia[] = [];
  accionesPeru: AccionColombia[] = [];
  accionesVenezuela: AccionColombia[] = [];
  
  symbolSeleccionado: string = '';
  cantidad: number = 1;
  
  // Control de visualización de gráficos
  mostrarGraficos: boolean = true;
  
  // Lista de símbolos que no tienen gráfico disponible en TradingView
  simbolosSinGrafico: string[] = [
    // Ecuador - No cotizan internacionalmente
    'PRONACA', 'HOLCIM', 'FAVORITA', 'PICHINCHA', 'GUAYAQUIL',
    // Perú - Locales sin cotización NYSE
    'FERREYCORP', 'BACKUS',
    // Venezuela - Mercado muy limitado
    'PDVSA', 'CANTV', 'ELECTRICIDAD', 'BANVENEZ', 'SIDERURGICA',
    // Colombia - Sin cotización internacional disponible
    'NUTRESA', 'CELSIA', 'ISA', 'CEMARGOS', 'AVH', 'AVIANCA', 'AVHOQ', 'PFBCO', 'BOGOTA'
  ];

  // Mapeo de símbolos por país
  private readonly simbolosPorPais = {
    'Colombia': ['EC', 'CIB', 'PFBCO', 'NUTRESA', 'CELSIA', 'ISA', 'CEMARGOS', 'BOGOTA'],
    'Ecuador': ['PRONACA', 'HOLCIM', 'FAVORITA', 'PICHINCHA', 'GUAYAQUIL'],
    'Peru': ['BVN', 'BAP', 'SCCO', 'FERREYCORP', 'BACKUS'],
    'Venezuela': ['PDVSA', 'CANTV', 'ELECTRICIDAD', 'BANVENEZ', 'SIDERURGICA']
  };

  @ViewChild(ModalCompraComponent) modalCompra!: ModalCompraComponent;
  
  // Para el modal de historial de precios
  simboloHistorial: string = '';
  nombreEmpresaHistorial: string = '';

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

  abrirModalHistorialPrecios(symbol: string, nombre: string = ''): void {
    this.simboloHistorial = symbol;
    this.nombreEmpresaHistorial = nombre;

    const modalElement = document.getElementById('modalHistorialPrecios');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  onConfirmarCompra(cantidad: number): void {
    // Priorizar 'usuarioId' pero mantener compatibilidad con 'idUsuario'
    const idUsuario = Number(localStorage.getItem('usuarioId') || localStorage.getItem('idUsuario'));
    
    console.log('🔍 Datos de compra:', {
      idUsuario,
      cantidad,
      symbolSeleccionado: this.symbolSeleccionado,
      localStorage: {
        usuarioId: localStorage.getItem('usuarioId'),
        idUsuario: localStorage.getItem('idUsuario'),
        nombreUsuario: localStorage.getItem('nombreUsuario'),
        rol: localStorage.getItem('rol')
      }
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
   * Carga los datos del mercado
   */
  private cargarDatosMercado(): void {
    // Mostrar las acciones organizadas inmediatamente (sin loading)
    this.organizarAccionesPorPais([]);
    this.loading = false;

    // Intentar cargar todas las acciones disponibles del backend (en segundo plano)
    this.mercadoService.getListadoAcciones().subscribe({
      next: (acciones) => {
        this.acciones = acciones;
        console.log('✅ Acciones cargadas del backend:', acciones.length);
        
        // Reorganizar con los datos reales si vienen del backend
        this.organizarAccionesPorPais(acciones);
      },
      error: (error) => {
        console.error('❌ Error cargando acciones del backend:', error);
        // No mostrar error porque ya tenemos las acciones organizadas
      }
    });

    // Intentar cargar acciones destacadas (opcional, no bloquea la UI)
    this.cargarAccionesDestacadas();
  }

  /**
   * Organiza las acciones por país según su símbolo
   */
  private organizarAccionesPorPais(acciones: AccionColombia[]): void {
    // Diccionario de nombres por símbolo (según lista del usuario)
    const nombrePorSimbolo: Record<string, string> = {
      // Colombia
      EC: 'Ecopetrol', CIB: 'Bancolombia', PFBCO: 'Banco Davivienda', NUTRESA: 'Grupo Nutresa',
      CELSIA: 'Celsia', ISA: 'ISA', CEMARGOS: 'Cementos Argos', BOGOTA: 'Banco de Bogotá',
      // Ecuador
      PRONACA: 'Procesadora Nacional de Alimentos', HOLCIM: 'Holcim Ecuador', FAVORITA: 'La Favorita (Supermaxi)',
      PICHINCHA: 'Banco Pichincha', GUAYAQUIL: 'Banco de Guayaquil',
      // Perú
      BVN: 'Compañía de Minas Buenaventura', BAP: 'Credicorp', SCCO: 'Southern Copper Corporation',
      FERREYCORP: 'Ferreycorp', BACKUS: 'Backus',
      // Venezuela
      PDVSA: 'Petróleos de Venezuela', CANTV: 'CANTV', ELECTRICIDAD: 'Electricidad de Caracas',
      BANVENEZ: 'Banco de Venezuela', SIDERURGICA: 'Siderúrgica del Orinoco'
    };

    const porSimbolo: Record<string, AccionColombia> = {};
    for (const a of acciones) {
      porSimbolo[a.simbolo.toUpperCase()] = a;
    }

    const crearAccionFallback = (sim: string): AccionColombia => ({
      simbolo: sim,
      nombre: nombrePorSimbolo[sim] || sim,
      precioActual: 0,
      apertura: 0,
      maximo: 0,
      minimo: 0,
      volumen: 0,
      variacionPorcentual: 0
    } as unknown as AccionColombia);

    const buildLista = (pais: keyof typeof this.simbolosPorPais): AccionColombia[] => {
      return this.simbolosPorPais[pais].map(sim => {
        const key = sim.toUpperCase();
        return porSimbolo[key] || crearAccionFallback(key);
      });
    };

    this.accionesColombia = buildLista('Colombia');
    this.accionesEcuador = buildLista('Ecuador');
    this.accionesPeru = buildLista('Peru');
    this.accionesVenezuela = buildLista('Venezuela');

    console.log('📊 Acciones por país:', {
      Colombia: this.accionesColombia.length,
      Ecuador: this.accionesEcuador.length,
      Peru: this.accionesPeru.length,
      Venezuela: this.accionesVenezuela.length
    });
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
    // Mapeo de símbolos al formato de TradingView
    const symbolMap: { [key: string]: string } = {
      // Acciones estadounidenses (para pruebas)
      'AAPL': 'NASDAQ:AAPL',         // Apple
      'MSFT': 'NASDAQ:MSFT',         // Microsoft
      'GOOGL': 'NASDAQ:GOOGL',       // Google
      'TSLA': 'NASDAQ:TSLA',         // Tesla
      'AMZN': 'NASDAQ:AMZN',         // Amazon
      
      // 🇨🇴 COLOMBIA - NYSE
      'EC': 'NYSE:EC',               // Ecopetrol
      'ECOPETROL': 'NYSE:EC',
      'CIB': 'NYSE:CIB',             // Bancolombia
      'BANCOLOMBIA': 'NYSE:CIB',
      // Nota: PFBCO, BOGOTA, AVH/AVIANCA no están disponibles en TradingView o NYSE
      
      // 🇵🇪 PERÚ - NYSE
      'BVN': 'NYSE:BVN',             // Buenaventura
      'BAP': 'NYSE:BAP',             // Credicorp
      'SCCO': 'NYSE:SCCO',           // Southern Copper
      
      // Otros
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
    if (!simbolo || simbolo.trim() === '') return false;
    const simboloUpper = simbolo.toUpperCase().trim();
    const noTieneGrafico = this.simbolosSinGrafico.includes(simboloUpper);
    return !noTieneGrafico;
  }

  /**
   * Formatea el precio mostrando "N/A" si es 0 o no está disponible
   */
  formatearPrecio(accion: AccionColombia): string {
    if (!accion || !accion.precioActual || accion.precioActual === 0) {
      return 'N/A';
    }
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(accion.precioActual);
  }

  /**
   * Formatea el porcentaje de variación mostrando "--" si es 0 o no está disponible
   */
  formatearVariacionPorcentual(accion: AccionColombia): string {
    const variacion = this.getVariacionPorcentual(accion);
    if (variacion === 0 || variacion === null || variacion === undefined || isNaN(variacion)) {
      return '--';
    }
    return `${variacion >= 0 ? '+' : ''}${variacion.toFixed(2)}%`;
  }

  /**
   * Verifica si la acción tiene datos de precio disponibles
   */
  tieneDatosPrecio(accion: AccionColombia): boolean {
    return accion && accion.precioActual !== undefined && accion.precioActual !== null && accion.precioActual > 0;
  }
}
