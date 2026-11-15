<<<<<<< HEAD
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { ProductDetail } from './product-detail';

describe('ProductDetail', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'producto/:id', component: ProductDetail }])],
    });
  });

  it('should show the hat, its photos and no price', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/producto/2', ProductDetail);
    const html = harness.routeNativeElement as HTMLElement;
    expect(html.querySelector('h1')?.textContent).toContain('Vueltiao tricolor Colombia');
    expect(html.querySelector('p-galleria')).toBeTruthy();
    expect(html.textContent).not.toContain('$');
  });

  it('should show a message when the hat does not exist', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/producto/999', ProductDetail);
    expect((harness.routeNativeElement as HTMLElement).textContent).toContain('Sombrero no encontrado');
=======
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetail } from './product-detail';

describe('ProductDetail', () => {
  let component: ProductDetail;
  let fixture: ComponentFixture<ProductDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
>>>>>>> 970751d771931d307a8d7d739c9e5eca2fce287a
  });
});
