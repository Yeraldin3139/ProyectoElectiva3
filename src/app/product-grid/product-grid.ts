<<<<<<< HEAD
import { Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProductService } from '../services/product.service';
import { Product, thumbUrl } from '../models/product.model';
import { FiltrosCatalogo } from '../filter-bar/filter-bar';

@Component({
  selector: 'app-product-grid',
  imports: [CommonModule, RouterLink, ButtonModule, TagModule],
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.scss',
})
export class ProductGrid {
  private readonly productService = inject(ProductService);

  filterCriteria = input<FiltrosCatalogo>();
  /** Avisa al padre que el usuario quiere quitar los filtros */
  limpiar = output<void>();

  // Se recalcula solo cuando cambian los filtros
  filteredProducts = computed(() => {
    const f = this.filterCriteria();
    return this.productService.filterProducts(f?.estilo, f?.tono, f?.texto);
  });

  foto(product: Product) {
    return thumbUrl(product.images[0]);
  }

  getCategoryLabel(product: Product): string {
    return this.productService.getCategoryLabel(product.style);
  }
}
=======
import { Component } from '@angular/core';

@Component({
  selector: 'app-product-grid',
  imports: [],
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.scss',
})
export class ProductGrid {}
>>>>>>> 970751d771931d307a8d7d739c9e5eca2fce287a
