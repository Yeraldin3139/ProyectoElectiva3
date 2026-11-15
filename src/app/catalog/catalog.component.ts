import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { FilterBar, FiltrosCatalogo } from '../filter-bar/filter-bar';
import { ProductGrid } from '../product-grid/product-grid';
import { HatStyle, HatTone } from '../models/product.model';

/**
 * Catálogo: los filtros viven en la URL (?estilo=vaquero&tono=blanco&q=cinta),
 * así los enlaces del pie de página y la búsqueda del encabezado llegan ya filtrados.
 */
@Component({
  selector: 'app-catalog',
  imports: [CommonModule, FilterBar, ProductGrid],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly filtros = toSignal(
    this.route.queryParamMap.pipe(
      map(
        (params): FiltrosCatalogo => ({
          estilo: (params.get('estilo') as HatStyle | null) ?? null,
          tono: (params.get('tono') as HatTone | null) ?? null,
          texto: params.get('q') ?? '',
        }),
      ),
    ),
    { initialValue: { estilo: null, tono: null, texto: '' } as FiltrosCatalogo },
  );

  readonly hayFiltros = computed(() => {
    const f = this.filtros();
    return !!(f.estilo || f.tono || f.texto);
  });

  onFilterChanged(filtros: FiltrosCatalogo) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        estilo: filtros.estilo || null,
        tono: filtros.tono || null,
        q: filtros.texto || null,
      },
      replaceUrl: true,
    });
  }

  limpiarFiltros() {
    this.onFilterChanged({ estilo: null, tono: null, texto: '' });
  }
}
