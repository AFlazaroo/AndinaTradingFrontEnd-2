import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserService } from '../../../services/users/users.service';
import { CurrencyPipe } from '@angular/common';

import { DashboardUsuarioDTO, Holding, Operacion, Orden, Usuario } from '../../../models/usuario';



@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule ],
  providers: [CurrencyPipe],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {
  currentTime: string = '';
  location: string = 'Cargando ubicación...';
  valorPortafolio: number = 0;
  holdings: any[] = [];
  operaciones: any[] = [];
nombreCompleto = '';
valorTotalHoldings: number = 0;
mostrarEnCOP: boolean = false;

  constructor(private userService: UserService) {}

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
  if (this.holdings && this.holdings.length > 0) {
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
  const idUsuario = localStorage.getItem('idUsuario');
  if (!idUsuario) {
    console.warn('No se encontró idUsuario en localStorage');
    return;
  }

  this.userService.getDashboardData(+idUsuario).subscribe({
    next: (data) => {
      console.log('DATA RECIBIDA:', data);

      this.valorPortafolio = data.valorPortafolio?.usd || 0;
      this.nombreCompleto = `${data.nombre} ${data.apellido}`;
      this.holdings = data.holdings || [];

      this.valorTotalHoldings = this.holdings.reduce(
        (total, h) => total + (h.precio_actual * h.cantidad),
        0
      );

      this.operaciones = (data.operaciones || []).map((op: any) => ({
        ...op,
        tipo: op.tipo === 'compra' ? 'Compra' : 'Venta'
      }));
    },
    error: (err) => {
      console.error('Error cargando datos del dashboard:', err);
    }
  });
}

// Método para mapear las órdenes a operaciones
mapOrdenesToOperaciones(ordenes: Orden[]): any[] {
  return ordenes.map(orden => ({
    tipo: orden.tipo_orden === 'market_order' ? 'Compra' : 'Venta', // Tipo de orden (puedes ajustar esto si es necesario)
    fecha: orden.fecha_creacion // Fecha de la orden
  }));
}

alternarMoneda(): void {
  this.mostrarEnCOP = !this.mostrarEnCOP;
}


}