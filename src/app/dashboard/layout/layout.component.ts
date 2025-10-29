import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/users/users.service'; // ajusta la ruta si es diferente
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  isCollapsed = false;
  usuario?: Usuario;
   nombreCompleto = '';

  menu = [
    { icon: 'bi-calendar', label: 'Dashboard Principal' },
    { icon: 'bi-currency-dollar', label: 'Operaciones' },
    { icon: 'bi-graph-up-arrow', label: 'Mercado y Análisis' },
    { icon: 'bi-tools', label: 'Gestión de Perfil' },
    { icon: 'bi-person-badge', label: 'Comisionista' },
    { icon: 'bi-journal-text', label: 'Reportes y Finanzas' }
  ];

  constructor(
    private router: Router,
    private userService: UserService // ✅ inyectado correctamente
  ) {}

ngOnInit(): void {
  const idUsuario = localStorage.getItem('idUsuario');
  console.log('ID usuario recuperado:', idUsuario);

  if (idUsuario) {
    this.userService.getDashboardData(+idUsuario).subscribe({
      next: data => {
        console.log('Datos del usuario recibidos:', data);
        this.nombreCompleto = `${data.nombre} ${data.apellido}`;
      },
      error: (err: any) => {
        console.error('Error al obtener datos del usuario en layout:', err);
      }
    });
  } else {
    console.warn('No hay idUsuario en localStorage');
  }
}

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
