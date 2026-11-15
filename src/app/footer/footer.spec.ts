<<<<<<< HEAD
import { provideRouter } from '@angular/router';
=======
>>>>>>> 970751d771931d307a8d7d739c9e5eca2fce287a
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Footer } from './footer';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
<<<<<<< HEAD
      providers: [provideRouter([])],
=======
>>>>>>> 970751d771931d307a8d7d739c9e5eca2fce287a
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
