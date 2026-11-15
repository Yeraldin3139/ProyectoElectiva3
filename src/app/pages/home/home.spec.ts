import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show one card per style with its photo (*ngFor + [src])', () => {
    const cards = (fixture.nativeElement as HTMLElement).querySelectorAll('.style-card img');
    expect(cards.length).toBe(3);
    expect(cards[0].getAttribute('src')).toContain('sombreros/');
  });

  it('should show the featured hats and nothing about coffee', () => {
    const html = fixture.nativeElement as HTMLElement;
    expect(html.querySelectorAll('.hat-card').length).toBe(component.destacados().length);
    expect(html.textContent?.toLowerCase()).not.toContain('café');
  });
});
