import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { authGuard } from './auth.guard';
import { AuthService, CREDENCIAL_HASH } from './auth.service';
import { sha256 } from './sha256';

@Component({ template: 'panel' })
class PanelFalso {}

@Component({ template: 'login' })
class LoginFalso {}

describe('authGuard', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        { provide: CREDENCIAL_HASH, useValue: sha256('yeraldin:ClaveDePrueba1*') },
        provideRouter([
          { path: 'tareas', component: PanelFalso, canActivate: [authGuard] },
          { path: 'login', component: LoginFalso },
        ]),
      ],
    });
  });

  it('should send visitors without a session to the login', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/tareas');
    expect(TestBed.inject(Router).url).toBe('/login?volver=%2Ftareas');
  });

  it('should let Yeraldin in after logging in', async () => {
    TestBed.inject(AuthService).login('Yeraldin', 'ClaveDePrueba1*');
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/tareas');
    expect(TestBed.inject(Router).url).toBe('/tareas');
  });
});
