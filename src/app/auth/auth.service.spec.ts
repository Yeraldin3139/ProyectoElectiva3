import { TestBed } from '@angular/core/testing';
import { AuthService, CREDENCIAL_HASH } from './auth.service';
import { sha256 } from './sha256';

describe('sha256', () => {
  it('should match the standard test vectors', () => {
    expect(sha256('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    expect(sha256('ñandú çé 🎩')).toBe('51464baecfbccf74c9feb304a5362d0850028a48a541e01f9b6b8cb494e12871');
  });
});

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({ providers: [{ provide: CREDENCIAL_HASH, useValue: sha256('yeraldin:ClaveDePrueba1*') }] });
    service = TestBed.inject(AuthService);
  });

  it('should start without a session', () => {
    expect(service.autenticado()).toBe(false);
  });

  it('should accept Yeraldin with the right password (user is not case sensitive)', () => {
    expect(service.login('yeraldin', 'ClaveDePrueba1*')).toBe('ok');
    expect(service.autenticado()).toBe(true);
    expect(service.usuario()).toBe('Yeraldin');
    expect(sessionStorage.getItem('somos-colon-sesion')).toBe('Yeraldin');
  });

  it('should reject a wrong password (password is case sensitive)', () => {
    expect(service.login('Yeraldin', 'clavedeprueba1*')).toBe('invalido');
    expect(service.login('Otro', 'ClaveDePrueba1*')).toBe('invalido');
    expect(service.autenticado()).toBe(false);
  });

  it('should block for a while after 5 failed attempts', () => {
    for (let i = 0; i < 4; i++) {
      expect(service.login('Yeraldin', 'mala')).toBe('invalido');
    }
    expect(service.login('Yeraldin', 'mala')).toBe('bloqueado');
    expect(service.login('Yeraldin', 'ClaveDePrueba1*')).toBe('bloqueado');
    expect(service.segundosDeBloqueo()).toBeGreaterThan(0);
  });

  it('should log out', () => {
    service.login('Yeraldin', 'ClaveDePrueba1*');
    service.logout();
    expect(service.autenticado()).toBe(false);
    expect(sessionStorage.getItem('somos-colon-sesion')).toBeNull();
  });
});
