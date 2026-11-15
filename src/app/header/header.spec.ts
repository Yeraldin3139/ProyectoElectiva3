<<<<<<< HEAD
import { MessageService } from 'primeng/api';
import { provideRouter } from '@angular/router';
=======
>>>>>>> 970751d771931d307a8d7d739c9e5eca2fce287a
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
<<<<<<< HEAD
      providers: [provideRouter([]), MessageService],
=======
>>>>>>> 970751d771931d307a8d7d739c9e5eca2fce287a
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
