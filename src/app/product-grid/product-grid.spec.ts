<<<<<<< HEAD
import { provideRouter } from '@angular/router';
=======
>>>>>>> 970751d771931d307a8d7d739c9e5eca2fce287a
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGrid } from './product-grid';

describe('ProductGrid', () => {
  let component: ProductGrid;
  let fixture: ComponentFixture<ProductGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductGrid],
<<<<<<< HEAD
      providers: [provideRouter([])],
=======
>>>>>>> 970751d771931d307a8d7d739c9e5eca2fce287a
    }).compileComponents();

    fixture = TestBed.createComponent(ProductGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
