import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductService);
  });

  it('should only have hats with photos and no prices', () => {
    const productos = service.getProducts()();
    expect(productos.length).toBeGreaterThan(0);
    for (const p of productos) {
      expect(['vueltiao', 'vaquero', 'casual']).toContain(p.style);
      expect(p.images.length).toBeGreaterThan(0);
      expect('price' in p).toBe(false);
    }
  });

  it('should filter by style and tone', () => {
    const vueltiaos = service.filterProducts('vueltiao');
    expect(vueltiaos.length).toBe(2);
    expect(service.filterProducts('vaquero', 'blanco').every((p) => p.tone === 'blanco')).toBe(true);
  });

  it('should search ignoring accents and capital letters', () => {
    expect(service.filterProducts(null, null, 'VUELTIÁO').length).toBe(2);
    expect(service.filterProducts(null, null, 'hebilla dorada')[0].slug).toBe('vaquero-hebilla-dorada');
  });
});
