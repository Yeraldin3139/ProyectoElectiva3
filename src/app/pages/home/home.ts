import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProductService } from '../../services/product.service';
import { Product, thumbUrl } from '../../models/product.model';

/**
 * Inicio de la tienda.
 * Book Angular · Clase 3: *ngFor, interpolación y property binding ([src], [routerLink]).
 */
@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, ButtonModule, TagModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly productService = inject(ProductService);

  readonly destacados = this.productService.featured;
  readonly totalModelos = computed(() => this.productService.getProducts()().length);

  /** Un estilo por tarjeta, con su cantidad de modelos y una foto de portada */
  readonly estilos = computed(() =>
    this.productService.categories.map((categoria) => {
      const portada = this.productService.getProducts()().find((p) => p.style === categoria.id);
      return {
        ...categoria,
        cantidad: this.productService.countByStyle(categoria.id),
        foto: portada ? thumbUrl(portada.images[0]) : '',
      };
    }),
  );

  readonly razones = [
    { icono: 'pi pi-flag', titulo: 'Tradición colombiana', texto: 'Vueltiaos y vaqueros con el sello de nuestra tierra.' },
    { icono: 'pi pi-palette', titulo: 'Blancos, tierra y color', texto: 'Modelos clásicos y otros para destacar.' },
    { icono: 'pi pi-pencil', titulo: 'Hazlo tuyo', texto: 'Elige la cinta, el ala y el grabado en el diseñador.' },
  ];

  foto(product: Product) {
    return thumbUrl(product.images[0]);
  }

  estiloLabel(product: Product) {
    return this.productService.getCategoryLabel(product.style);
  }
}
