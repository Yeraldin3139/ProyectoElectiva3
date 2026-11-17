
import { Component, computed, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { ProductService } from '../services/product.service';
import { HatStyle, HatTone } from '../models/product.model';

export interface FiltrosCatalogo {
  estilo: HatStyle | null;
  tono: HatTone | null;
  texto: string;
}

/**
 * Barra de filtros del catálogo (componente hijo).
 * Recibe los filtros con input() y avisa al padre con output().
 */
@Component({
  selector: 'app-filter-bar',
  imports: [FormsModule, SelectButtonModule, SelectModule, ButtonModule, ChipModule],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.scss',
})
export class FilterBar {
  private readonly productService = inject(ProductService);

  filtros = input<FiltrosCatalogo>({ estilo: null, tono: null, texto: '' });
  filterChanged = output<FiltrosCatalogo>();

  readonly opcionesEstilo = [{ id: null, label: 'Todos' }, ...this.productService.categories];
  readonly opcionesTono = this.productService.tones;

  readonly hayFiltros = computed(() => {
    const f = this.filtros();
    return !!(f.estilo || f.tono || f.texto);
  });

  cambiarEstilo(estilo: HatStyle | null) {
    this.filterChanged.emit({ ...this.filtros(), estilo });
  }

  cambiarTono(tono: HatTone | null) {
    this.filterChanged.emit({ ...this.filtros(), tono });
  }

  quitarTexto() {
    this.filterChanged.emit({ ...this.filtros(), texto: '' });
  }

  resetFilters() {
    this.filterChanged.emit({ estilo: null, tono: null, texto: '' });
  }
}
