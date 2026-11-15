import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { Translation } from 'primeng/api';

/**
 * Tema de PrimeNG con la paleta marrón de Somos Colón.
 * Parte del tema Aura y solo cambia el color principal.
 */
export const SomosColonPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#faf3eb',
      100: '#f0dcc6',
      200: '#dfbb93',
      300: '#c58d5a',
      400: '#a8642d',
      500: '#8b4513',
      600: '#6f370f',
      700: '#5b2d0c',
      800: '#4a250a',
      900: '#3a1d08',
      950: '#241205',
    },
  },
});

/** Textos de los componentes de PrimeNG en español */
export const TRADUCCION_ES: Translation = {
  dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  monthNames: [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ],
  monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  today: 'Hoy',
  clear: 'Limpiar',
  firstDayOfWeek: 1,
  dateFormat: 'dd/mm/yy',
  weekHeader: 'Sem',
  weak: 'Débil',
  medium: 'Media',
  strong: 'Fuerte',
  passwordPrompt: 'Escribe la clave',
  emptyMessage: 'Sin opciones',
  emptyFilterMessage: 'Sin resultados',
  accept: 'Sí',
  reject: 'No',
  choose: 'Elegir',
  cancel: 'Cancelar',
};
