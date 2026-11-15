import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../services/product.service';
import { HatTone, thumbUrl } from '../../models/product.model';

interface TonoSombrero {
  nombre: string;
  copa: string;
  ala: string;
}

interface Diseno {
  id: number;
  modelo: string;
  grabado: string;
  cinta: string;
  tono: string;
  ala: number;
}

const STORAGE_KEY = 'somos-colon-disenos';

/**
 * Diseña tu sombrero.
 * Book Angular:
 *  - Clase 5a: formularios reactivos con FormControl (grabado, color de cinta, ancho del ala)
 *  - Clase 3: eventos (click), property binding ([attr.fill], [style.width.px], [src]), signals y *ngFor
 */
@Component({
  selector: 'app-hat-designer',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonModule, InputTextModule, SelectModule, SliderModule, TagModule],
  templateUrl: './hat-designer.html',
  styleUrl: './hat-designer.scss',
})
export class HatDesigner {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly messages = inject(MessageService);

  readonly modelos = this.productService.getProducts();

  readonly coloresCinta = [
    { nombre: 'Marrón', valor: '#8b4513' },
    { nombre: 'Rojo', valor: '#b3261e' },
    { nombre: 'Negro', valor: '#1f1f1f' },
    { nombre: 'Dorado', valor: '#c9a227' },
    { nombre: 'Azul', valor: '#1f4e8c' },
    { nombre: 'Verde', valor: '#2c5f2d' },
  ];

  readonly tonos: TonoSombrero[] = [
    { nombre: 'Natural', copa: '#ead3a2', ala: '#e2c48f' },
    { nombre: 'Blanco', copa: '#f7f2e8', ala: '#efe6d6' },
    { nombre: 'Mostaza', copa: '#d9a441', ala: '#cc9634' },
    { nombre: 'Marrón', copa: '#7a4a2a', ala: '#6b3f22' },
    { nombre: 'Negro', copa: '#3a3330', ala: '#2c2624' },
  ];

  // ---------- Formularios reactivos con FormControl (Clase 5a) ----------
  modeloCtrl = new FormControl<number | null>(null);
  nameCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3), Validators.maxLength(14)],
  });
  colorCtrl = new FormControl('#8b4513', { nonNullable: true });
  widthCtrl = new FormControl(110, { nonNullable: true });
  tonoCtrl = new FormControl('Natural', { nonNullable: true });

  // Valores de los controles como signals, para que la vista previa se actualice sola
  readonly modeloId = toSignal(this.modeloCtrl.valueChanges, { initialValue: null });
  readonly tonoNombre = toSignal(this.tonoCtrl.valueChanges, { initialValue: 'Natural' });
  readonly colorCinta = toSignal(this.colorCtrl.valueChanges, { initialValue: this.colorCtrl.value });
  readonly anchoAla = toSignal(this.widthCtrl.valueChanges, { initialValue: this.widthCtrl.value });
  readonly grabado = toSignal(this.nameCtrl.valueChanges, { initialValue: this.nameCtrl.value });

  readonly modelo = computed(() => {
    const id = this.modeloId();
    return id ? this.productService.getProductById(id) : undefined;
  });
  readonly fotoModelo = computed(() => {
    const m = this.modelo();
    return m ? thumbUrl(m.images[0]) : '';
  });
  readonly tono = computed(() => this.tonos.find((t) => t.nombre === this.tonoNombre()) ?? this.tonos[0]);

  readonly disenos = signal<Diseno[]>(this.cargarDisenos());

  constructor() {
    // Si llega ?modelo=ID desde el catálogo o el detalle, se preselecciona
    const modelo = Number(this.route.snapshot.queryParamMap.get('modelo'));
    if (modelo && this.productService.getProductById(modelo)) {
      this.modeloCtrl.setValue(modelo);
    }

    // Al elegir un modelo, se sugiere un tono parecido
    this.modeloCtrl.valueChanges.pipe(takeUntilDestroyed()).subscribe((id) => {
      const producto = id ? this.productService.getProductById(id) : undefined;
      if (producto) {
        this.tonoCtrl.setValue(TONO_SUGERIDO[producto.tone]);
      }
    });

    this.colorCtrl.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      console.log('Color de cinta seleccionado: ', value);
    });

    const inicial = this.modelo();
    if (inicial) {
      this.tonoCtrl.setValue(TONO_SUGERIDO[inicial.tone]);
    }
  }

  // ---------- Eventos ----------
  elegirColor(valor: string) {
    this.colorCtrl.setValue(valor);
  }

  elegirTono(nombre: string) {
    this.tonoCtrl.setValue(nombre);
  }

  /** Antes "verForm()" en Book Angular: valida y guarda el diseño */
  verForm() {
    console.log('Es valido: ', this.nameCtrl.valid);
    console.log('Valor: ', this.nameCtrl.value);

    if (this.nameCtrl.invalid) {
      this.nameCtrl.markAsTouched();
      this.messages.add({ severity: 'warn', summary: 'Revisa el grabado', detail: 'Escribe entre 3 y 14 caracteres.', life: 3000 });
      return;
    }

    const diseno: Diseno = {
      id: Date.now(),
      modelo: this.modelo()?.name ?? 'Diseño libre',
      grabado: this.nameCtrl.value.trim(),
      cinta: this.colorCtrl.value,
      tono: this.tonoCtrl.value,
      ala: this.widthCtrl.value,
    };
    this.disenos.update((lista) => [diseno, ...lista].slice(0, 6));
    this.guardarDisenos();
    this.messages.add({ severity: 'success', summary: 'Diseño guardado', detail: `"${diseno.grabado}" quedó en Mis diseños.`, life: 3000 });
  }

  reiniciar() {
    this.nameCtrl.reset();
    this.colorCtrl.reset();
    this.widthCtrl.reset();
    this.tonoCtrl.reset();
    this.modeloCtrl.reset();
  }

  cargar(diseno: Diseno) {
    this.nameCtrl.setValue(diseno.grabado);
    this.colorCtrl.setValue(diseno.cinta);
    this.widthCtrl.setValue(diseno.ala);
    this.tonoCtrl.setValue(diseno.tono);
  }

  eliminar(diseno: Diseno) {
    this.disenos.update((lista) => lista.filter((d) => d.id !== diseno.id));
    this.guardarDisenos();
  }

  colorDeTono(nombre: string) {
    return this.tonos.find((t) => t.nombre === nombre)?.copa ?? '#ead3a2';
  }

  private cargarDisenos(): Diseno[] {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      const lista = guardado ? JSON.parse(guardado) : [];
      return Array.isArray(lista) ? lista : [];
    } catch {
      return [];
    }
  }

  private guardarDisenos() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.disenos()));
    } catch {
      // Sin almacenamiento: los diseños duran mientras la página esté abierta
    }
  }
}

const TONO_SUGERIDO: Record<HatTone, string> = {
  blanco: 'Blanco',
  tierra: 'Natural',
  oscuro: 'Negro',
  color: 'Natural',
};
