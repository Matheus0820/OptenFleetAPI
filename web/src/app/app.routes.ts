import { Routes } from '@angular/router';
import { authGuard, gestorGuard } from './core/auth';

export const routes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./pages/landing').then((m) => m.Landing) },
  { path: 'login', loadComponent: () => import('./pages/login').then((m) => m.Login) },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/shell').then((m) => m.Shell),
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard').then((m) => m.Dashboard) },
      { path: 'veiculos', canActivate: [gestorGuard], loadComponent: () => import('./pages/veiculos').then((m) => m.Veiculos) },
      { path: 'colaboradores', loadComponent: () => import('./pages/colaboradores').then((m) => m.Colaboradores) },
      { path: 'clientes', loadComponent: () => import('./pages/clientes').then((m) => m.Clientes) },
      { path: 'rotas', loadComponent: () => import('./pages/rotas').then((m) => m.Rotas) },
      { path: 'relatorios', canActivate: [gestorGuard], loadComponent: () => import('./pages/relatorios').then((m) => m.Relatorios) },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
  { path: '**', redirectTo: '' },
];
