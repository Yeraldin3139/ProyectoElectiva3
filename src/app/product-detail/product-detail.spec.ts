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
  });
});
