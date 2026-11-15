import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Login } from './login';
import { AuthService, CREDENCIAL_HASH } from '../../auth/auth.service';
import { sha256 } from '../../auth/sha256';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let router: Router;

  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), MessageService, { provide: CREDENCIAL_HASH, useValue: sha256('yeraldin:ClaveDePrueba1*') }],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    await fixture.whenStable();
  });

  it('should require user and password', () => {
    component.ingresar();
    expect(component.form.controls.usuario.touched).toBe(true);
    expect(TestBed.inject(AuthService).autenticado()).toBe(false);
  });

  it('should show an error with wrong credentials', () => {
    component.form.setValue({ usuario: 'Yeraldin', clave: 'otra' });
    component.ingresar();
    expect(component.error()).toContain('incorrectos');
  });

  it('should log in and go to the panel', () => {
    const navigate = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    component.form.setValue({ usuario: 'Yeraldin', clave: 'ClaveDePrueba1*' });
    component.ingresar();
    expect(TestBed.inject(AuthService).autenticado()).toBe(true);
    expect(navigate).toHaveBeenCalledWith('/tareas');
  });
});
