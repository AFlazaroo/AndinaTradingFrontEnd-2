import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UserService } from '../../../services/users/users.service';
import { MercadoColombiaService } from '../../../services/mercado-colombia/mercado-colombia.service';
import { CurrencyPipe } from '@angular/common';

import { DashboardUsuarioDTO, Holding, Operacion, Orden, Usuario } from '../../../models/usuario';
import { PortafolioCompleto, PosicionPaper, ResumenPortafolio } from '../../../models/paper-trading.model';



@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [CurrencyPipe],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {
  currentTime: string = '';
  location: string = 'Cargando ubicación...';
  
  // Datos del portafolio
  portafolio: PortafolioCompleto | null = null;
  resumen: ResumenPortafolio | null = null;
  loading: boolean = true;
  
  // Valores del resumen
  balanceInicial: number = 0;
  balanceDisponible: number = 0;
  valorInvertido: number = 0;
  valorTotal: number = 0;
  gananciaPerdida: number = 0;
  porcentajeGananciaPerdida: number = 0;
  estado: 'GANANDO' | 'PERDIENDO' | 'NEUTRO' = 'NEUTRO';
  estaGanando: boolean = false;
  estaPerdiendo: boolean = false;
  totalAcciones: number = 0;
  cantidadEmpresas: number = 0;
  posiciones: PosicionPaper[] = [];
  
  nombreCompleto = '';
  mostrarEnCOP: boolean = false;

  constructor(
    private userService: UserService,
    private mercadoService: MercadoColombiaService
  ) {}

  ngOnInit(): void {
  this.getLocation();
  this.updateClock();
  this.loadDashboardData();
 
  }

  getSaludo(): string {
  const hora = new Date().getHours();
  if (hora < 12) return 'Buenos días';
  if (hora < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

getMensajePortafolio(): string {
  if (this.posiciones && this.posiciones.length > 0) {
    return 'Revisa tu portafolio y tus operaciones más recientes.';
  } else {
    return 'Aún no tienes acciones registradas. ¡Empieza a invertir hoy!';
  }
}

  updateClock(): void {
    this.currentTime = new Date().toLocaleTimeString();
  }

  getLocation(): void {
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(data => {
        this.location = `${data.city}, ${data.country_name}`;
      })
      .catch(() => {
        this.location = 'Ubicación desconocida';
      });
  }
loadDashboardData(): void {
  // Obtener usuarioId del localStorage (priorizar 'usuarioId' pero mantener compatibilidad)
  const usuarioId = Number(localStorage.getItem('usuarioId') || localStorage.getItem('idUsuario'));
  
  if (!usuarioId) {
    console.warn('No se encontró usuarioId en localStorage');
    this.loading = false;
    return;
  }

  // Cargar datos del usuario para el nombre
  this.userService.getDashboardData(usuarioId).subscribe({
    next: (data) => {
      this.nombreCompleto = `${data.nombre} ${data.apellido}`;
    },
    error: (err) => {
      console.error('Error cargando datos del usuario:', err);
    }
  });

  // Cargar resumen del portafolio (nuevo endpoint)
  this.loading = true;
  this.mercadoService.getResumenPortafolio(usuarioId).subscribe({
    next: (resumenData) => {
      console.log('✅ Resumen del portafolio recibido:', resumenData);
      this.resumen = resumenData;
      
      // Mapear los datos del resumen
      this.balanceInicial = resumenData.balanceInicial || 0;
      this.balanceDisponible = resumenData.balanceDisponible || 0;
      this.valorInvertido = resumenData.valorInvertido || 0;
      this.valorTotal = resumenData.valorTotal || 0;
      this.gananciaPerdida = resumenData.gananciaPerdida || 0;
      this.porcentajeGananciaPerdida = resumenData.porcentaje || 0;
      this.estado = resumenData.estado || 'NEUTRO';
      this.estaGanando = resumenData.estaGanando || false;
      this.estaPerdiendo = resumenData.estaPerdiendo || false;
      this.totalAcciones = resumenData.totalAcciones || 0;
      this.cantidadEmpresas = resumenData.cantidadEmpresas || 0;
      
      // También cargar el portafolio completo para las posiciones
      this.cargarPosiciones(usuarioId);
    },
    error: (err) => {
      console.error('❌ Error cargando resumen:', err);
      this.loading = false;
      // Si falla, intentar con el método anterior
      this.loadDashboardDataFallback(usuarioId);
    }
  });
}

cargarPosiciones(usuarioId: number): void {
  // Cargar posiciones para mostrar en la tabla
  this.mercadoService.getPosicionesUsuario(usuarioId).subscribe({
    next: (posicionesData) => {
      console.log('✅ Posiciones recibidas:', posicionesData);
      this.posiciones = posicionesData || [];
      this.loading = false;
    },
    error: (err) => {
      console.error('❌ Error cargando posiciones:', err);
      this.posiciones = [];
      this.loading = false;
    }
  });
}

loadDashboardDataFallback(usuarioId: number): void {
  // Fallback al método anterior si el nuevo endpoint falla
  this.userService.getDashboardData(usuarioId).subscribe({
    next: (data) => {
      this.valorTotal = data.valorPortafolio?.usd || 0;
      this.nombreCompleto = `${data.nombre} ${data.apellido}`;
    },
    error: (err) => {
      console.error('Error en fallback:', err);
    }
  });
}

alternarMoneda(): void {
  this.mostrarEnCOP = !this.mostrarEnCOP;
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


}