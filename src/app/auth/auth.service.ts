import { Injectable, InjectionToken, computed, inject, signal } from '@angular/core';
import { sha256 } from './sha256';

const SESSION_KEY = 'somos-colon-sesion';
const MAX_INTENTOS = 5;
const BLOQUEO_MS = 30_000;

/**
 * Huella SHA-256 de "usuario:clave" (usuario en minúsculas).
 * La clave no aparece en texto plano en ningún archivo del proyecto.
 * Usuario permitido: Yeraldin
 * (Es un token para que las pruebas usen una clave de prueba distinta.)
 */
export const CREDENCIAL_HASH = new InjectionToken<string>('CREDENCIAL_HASH', {
  factory: () => '51c522532aae93768a2d7559f3f8952070c2798ef1edac7ee81cc0f599b8bd14',
});
const NOMBRE_VISIBLE = 'Yeraldin';

export type LoginResultado = 'ok' | 'invalido' | 'bloqueado';

/**
 * Inicio de sesión de la tienda (un solo usuario).
 * Importante: es un login del lado del navegador, pensado para el proyecto
 * de clase. En un sistema real la validación debe hacerse en un servidor.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly credencialHash = inject(CREDENCIAL_HASH);
  private readonly usuarioSignal = signal<string | null>(this.leerSesion());
  private intentosFallidos = 0;
  private readonly bloqueadoHasta = signal(0);

  readonly usuario = this.usuarioSignal.asReadonly();
  readonly autenticado = computed(() => this.usuarioSignal() !== null);
  readonly inicial = computed(() => (this.usuarioSignal() ?? '?').charAt(0).toUpperCase());

  login(usuario: string, clave: string): LoginResultado {
    if (this.segundosDeBloqueo() > 0) {
      return 'bloqueado';
    }

    const huella = sha256(`${usuario.trim().toLowerCase()}:${clave}`);
    if (huella === this.credencialHash) {
      this.intentosFallidos = 0;
      this.usuarioSignal.set(NOMBRE_VISIBLE);
      this.guardarSesion(NOMBRE_VISIBLE);
      return 'ok';
    }

    this.intentosFallidos++;
    if (this.intentosFallidos >= MAX_INTENTOS) {
      this.intentosFallidos = 0;
      this.bloqueadoHasta.set(Date.now() + BLOQUEO_MS);
      return 'bloqueado';
    }
    return 'invalido';
  }

  logout(): void {
    this.usuarioSignal.set(null);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // sin almacenamiento: no hay nada que borrar
    }
  }

  /** Segundos que faltan para poder intentar de nuevo (0 = sin bloqueo) */
  segundosDeBloqueo(): number {
    return Math.max(0, Math.ceil((this.bloqueadoHasta() - Date.now()) / 1000));
  }

  intentosRestantes(): number {
    return MAX_INTENTOS - this.intentosFallidos;
  }

  private leerSesion(): string | null {
    try {
      return sessionStorage.getItem(SESSION_KEY);
    } catch {
      return null;
    }
  }

  private guardarSesion(usuario: string): void {
    try {
      sessionStorage.setItem(SESSION_KEY, usuario);
    } catch {
      // Si el navegador bloquea el almacenamiento, la sesión dura mientras la página esté abierta
    }
  }
}
