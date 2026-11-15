import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { authGuard } from './auth/auth.guard';

// Las páginas se cargan bajo demanda (loadComponent) para que la tienda abra más rápido
export const routes: Routes = [
  { path: '', component: Home, title: 'Somos Colón · Sombreros artesanales' },
  {
    path: 'catalogo',
    loadComponent: () => import('./catalog/catalog.component').then((m) => m.CatalogComponent),
    title: 'Catálogo de sombreros · Somos Colón',
  },
  {
    path: 'producto/:id',
    loadComponent: () => import('./product-detail/product-detail').then((m) => m.ProductDetail),
    title: 'Sombrero · Somos Colón',
  },
  {
    path: 'disena',
    loadComponent: () => import('./pages/hat-designer/hat-designer').then((m) => m.HatDesigner),
    title: 'Diseña tu sombrero · Somos Colón',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
    title: 'Ingresar · Somos Colón',
  },

  // Panel de gestión (requiere iniciar sesión)
  {
    path: 'tareas',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/task-list/task-list').then((m) => m.TaskList),
    title: 'Tareas del taller · Somos Colón',
  },
  {
    path: 'pendientes',
    canActivate: [authGuard],
    loadComponent: () => import('./todo-list/todo-list').then((m) => m.TodoList),
    title: 'Pendientes · Somos Colón',
  },

  { path: 'labs', redirectTo: 'disena' },
  { path: '**', redirectTo: '' },
];
