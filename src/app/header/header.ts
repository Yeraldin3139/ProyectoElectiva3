<<<<<<< HEAD
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService } from 'primeng/api';
import { AuthService } from '../auth/auth.service';

/**
 * Encabezado de la tienda.
 * Book Angular · Clase 3: interpolación ({{ marca }}), property binding ([src], [value]),
 * eventos ((input), (submit), (keydown.escape), (click)), signals y *ngFor.
 */
@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive, ButtonModule, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly router = inject(Router);
  private readonly messages = inject(MessageService);
  readonly auth = inject(AuthService);

  readonly marca = 'Somos Colón';
  readonly logo = 'logo-somos-colon.png';
  readonly enlaces = [
    { texto: 'Inicio', ruta: '/' },
    { texto: 'Catálogo', ruta: '/catalogo' },
    { texto: 'Diseña tu sombrero', ruta: '/disena' },
  ];

  readonly busqueda = signal('');
  readonly menuAbierto = signal(false);

  constructor() {
    // La caja de búsqueda muestra el texto de ?q= en el catálogo y se limpia fuera de él
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e) => {
        const url = this.router.parseUrl(e.urlAfterRedirects);
        this.busqueda.set(this.enCatalogo() ? (url.queryParams['q'] ?? '') : '');
      });
  }

  // Evento (input): en el catálogo filtra mientras se escribe
  onInputBusqueda(event: Event) {
    const texto = (event.target as HTMLInputElement).value;
    this.busqueda.set(texto);
    if (this.enCatalogo()) {
      this.router.navigate(['/catalogo'], {
        queryParams: { q: texto.trim() || null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }
  }

  private enCatalogo() {
    return this.router.url.startsWith('/catalogo');
  }

  buscar(event: Event) {
    event.preventDefault();
    const texto = this.busqueda().trim();
    // Evento (submit / Enter): lleva al catálogo con la búsqueda
    this.router.navigate(['/catalogo'], { queryParams: texto ? { q: texto } : {} });
    this.cerrarMenu();
  }

  limpiarBusqueda() {
    this.busqueda.set('');
    if (this.enCatalogo()) {
      this.router.navigate(['/catalogo'], { queryParams: { q: null }, queryParamsHandling: 'merge', replaceUrl: true });
    }
  }

  cerrarMenu() {
    this.menuAbierto.set(false);
  }

  /** Baja hasta el pie de página sin salir de la página actual */
  irAContacto(event: Event) {
    event.preventDefault();
    this.cerrarMenu();
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  }

  salir() {
    this.auth.logout();
    this.cerrarMenu();
    this.messages.add({ severity: 'info', summary: 'Sesión cerrada', detail: '¡Hasta pronto!', life: 2500 });
    if (this.router.url.startsWith('/tareas') || this.router.url.startsWith('/pendientes')) {
      this.router.navigate(['/']);
    }
  }
}
=======
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
>>>>>>> 970751d771931d307a8d7d739c9e5eca2fce287a
