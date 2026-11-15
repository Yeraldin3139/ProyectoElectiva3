import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../auth/auth.service';

/**
 * Inicio de sesión (formulario reactivo con FormBuilder, Clase 5b).
 * Único usuario: Yeraldin.
 */
@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly messages = inject(MessageService);
  readonly auth = inject(AuthService);

  readonly error = signal('');

  form = this.fb.nonNullable.group({
    usuario: ['', Validators.required],
    clave: ['', Validators.required],
  });

  ingresar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { usuario, clave } = this.form.getRawValue();
    const resultado = this.auth.login(usuario, clave);

    if (resultado === 'ok') {
      this.error.set('');
      this.messages.add({
        severity: 'success',
        summary: `¡Bienvenida, ${this.auth.usuario()}!`,
        detail: 'Sesión iniciada',
        life: 3000,
      });
      this.router.navigateByUrl(this.destino());
      return;
    }

    this.form.controls.clave.reset();
    if (resultado === 'bloqueado') {
      this.error.set(`Demasiados intentos. Espera ${this.auth.segundosDeBloqueo()} segundos e inténtalo de nuevo.`);
    } else {
      const restantes = this.auth.intentosRestantes();
      this.error.set(`Usuario o clave incorrectos. Te quedan ${restantes} ${restantes === 1 ? 'intento' : 'intentos'}.`);
    }
  }

  salir() {
    this.auth.logout();
    this.messages.add({ severity: 'info', summary: 'Sesión cerrada', life: 2500 });
  }

  invalido(control: 'usuario' | 'clave') {
    const ctrl = this.form.controls[control];
    return ctrl.touched && ctrl.invalid;
  }

  /** Solo permite volver a rutas internas (evita redirecciones a otros sitios) */
  private destino(): string {
    const volver = this.route.snapshot.queryParamMap.get('volver') ?? '';
    return volver.startsWith('/') && !volver.startsWith('//') ? volver : '/tareas';
  }
}
