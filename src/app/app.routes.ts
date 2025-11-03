import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PaginaInicioComponent } from './pagina-inicio/pagina-inicio.component';
import { RegistroComponent } from './registro/registro.component';
import { LayoutComponent } from './dashboard/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: PaginaInicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },

  {
    path: 'dashboard',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'principal', pathMatch: 'full' },
      {
        path: 'principal',
        loadComponent: () =>
          import('./dashboard/pages/principal/principal.component').then(m => m.PrincipalComponent)
      },
      {
        path: 'operaciones',
        loadComponent: () =>
          import('./dashboard/pages/operaciones/operaciones.component').then(m => m.OperacionesComponent)
      },
      {
        path: 'mercado',
        loadComponent: () =>
          import('./dashboard/pages/mercado/mercado.component').then(m => m.MercadoComponent)
      },
      {
        path: 'analisis',
        loadComponent: () =>
          import('./dashboard/pages/analisis/analisis.component').then(m => m.AnalisisComponent)
      },
      {
        path: 'portafolio',
        loadComponent: () =>
          import('./dashboard/pages/comisionista/portafolio/portafolio.component').then(m => m.PortafolioComponent)
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./dashboard/pages/perfil/perfil.component').then(m => m.PerfilComponent)
      },
      {
        path: 'comisionista',
        loadComponent: () =>
          import('./dashboard/pages/vincular-comisionista/vincular-comisionista.component').then(m => m.VincularComisionistaComponent)
      },
      {
        path: 'ordenes-pendientes',
        loadComponent: () =>
          import('./dashboard/pages/ordenes-pendientes/ordenes-pendientes.component').then(m => m.OrdenesPendientesComponent)
      }
    ]
  },
  {
    path: 'comisionista',
    loadComponent: () => import('./dashboard/pages/comisionista/comisionista.component').then(m => m.ComisionistaComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'traders',
        loadComponent: () => import('./dashboard/pages/comisionista/traders/traders.component').then(m => m.TradersComponent)
      },
      {
        path: 'enviar-orden',
        loadComponent: () => import('./dashboard/pages/comisionista/enviar-orden/enviar-orden.component').then(m => m.EnviarOrdenComponent)
      },
      {
        path: 'ordenes-enviadas',
        loadComponent: () => import('./dashboard/pages/comisionista/ordenes-enviadas/ordenes-enviadas.component').then(m => m.OrdenesEnviadasComponent)
      },
      {
        path: 'portafolio',
        loadComponent: () => import('./dashboard/pages/comisionista/portafolio/portafolio.component').then(m => m.PortafolioComponent)
      },
      {
        path: 'mercado',
        loadComponent: () => import('./dashboard/pages/mercado/mercado.component').then(m => m.MercadoComponent)
      },
      {
        path: 'analisis',
        loadComponent: () => import('./dashboard/pages/analisis/analisis.component').then(m => m.AnalisisComponent)
      },
      {
        path: 'operaciones',
        loadComponent: () => import('./dashboard/pages/operaciones/operaciones.component').then(m => m.OperacionesComponent)
      },
      {
        path: '',
        redirectTo: 'traders',
        pathMatch: 'full'
      }
    ]
  }
];