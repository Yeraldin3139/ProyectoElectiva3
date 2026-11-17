import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';

import { routes } from './app.routes';
import { SomosColonPreset, TRADUCCION_ES } from './theme';

// Fechas en formato colombiano (ej. "8 nov 2026")
registerLocaleData(localeEsCo);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // Vuelve arriba al cambiar de página y permite enlaces a secciones (#contacto)
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
    ),
    { provide: LOCALE_ID, useValue: 'es-CO' },

    // PrimeNG: tema Aura con los colores de Tejidos y Tradición, textos en español
    providePrimeNG({
      ripple: true,
      theme: {
        preset: SomosColonPreset,
        options: { darkModeSelector: '.modo-oscuro' },
      },
      translation: TRADUCCION_ES,
    }),
    // Notificaciones (p-toast) disponibles en toda la app
    MessageService,
  ],
};
