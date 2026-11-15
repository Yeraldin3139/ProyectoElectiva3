import { Injectable, computed, signal } from '@angular/core';
import { Todo, TodoFormValue } from '../models/todo.model';

// v2: lista solo de sombreros (no se mezclan tareas guardadas por la versión anterior)
const STORAGE_KEY = 'somos-colon-tareas-v2';

const INITIAL_TODOS: Todo[] = [
  {
    id: 1,
    title: 'Fotografiar los vaqueros con hebilla dorada',
    description: 'Tomar fotos con fondo claro de los nuevos vaqueros blancos para agregarlos al catálogo.',
    dueDate: '2026-11-18',
    category: 'Tienda',
    priority: 'high',
    isCompleted: false,
  },
  {
    id: 2,
    title: 'Contar vueltiaos en bodega',
    description: 'Revisar cuántos vueltiao tradicionales y tricolor quedan disponibles.',
    dueDate: '2026-11-17',
    category: 'Inventario',
    priority: 'medium',
    isCompleted: false,
  },
  {
    id: 3,
    title: 'Empacar pedido para Pasto',
    description: '2 vaqueros blancos con correa de cuero y 1 bosalino corto tejido brisa. Incluir tarjeta de agradecimiento.',
    dueDate: '2026-11-12',
    category: 'Envíos',
    priority: 'high',
    isCompleted: false,
  },
  {
    id: 4,
    title: 'Ajustar cintas de los bicolor',
    description: 'Reponer las cintas rojas y negras de los vaqueros bicolor que llegaron sueltas.',
    dueDate: '2026-11-20',
    category: 'Taller',
    priority: 'medium',
    isCompleted: false,
  },
  {
    id: 5,
    title: 'Publicar la colección tejido brisa',
    description: 'Subir a Instagram y TikTok las fotos del bosalino corto en sus tonos crema, arena y miel.',
    dueDate: '2026-11-25',
    category: 'Redes sociales',
    priority: 'low',
    isCompleted: false,
  },
  {
    id: 6,
    title: 'Preparar exhibición de vaqueros mostaza',
    description: 'Armar la vitrina con los vaqueros mostaza y El Charro natural.',
    dueDate: '2026-11-28',
    category: 'Taller',
    priority: 'low',
    isCompleted: false,
  },
  {
    id: 7,
    title: 'Etiquetar los sombreros El Charro',
    description: 'Verificar que cada El Charro tenga su etiqueta y talla.',
    dueDate: '2026-11-10',
    category: 'Inventario',
    priority: 'low',
    isCompleted: true,
  },
  {
    id: 8,
    title: 'Subir las fotos nuevas al catálogo',
    description: 'Cargar las fotos de vueltiaos y vaqueros en la página web.',
    dueDate: '2026-11-14',
    category: 'Tienda',
    priority: 'medium',
    isCompleted: true,
  },
];

/**
 * Estado compartido de las tareas (Book Angular · Clases 4a y 4b).
 * Usa signals para la lista y guarda los cambios en localStorage,
 * así la información se conserva al recargar la página.
 * Lo usan TodoList (/pendientes) y TaskList (/tareas).
 */
@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly todosSignal = signal<Todo[]>(this.load());

  readonly todos = this.todosSignal.asReadonly();
  readonly total = computed(() => this.todosSignal().length);
  readonly completedCount = computed(() => this.todosSignal().filter((t) => t.isCompleted).length);
  readonly pendingCount = computed(() => this.total() - this.completedCount());

  add(data: TodoFormValue): Todo {
    const nextId = Math.max(0, ...this.todosSignal().map((t) => t.id)) + 1;
    const newTodo: Todo = { ...data, id: nextId, isCompleted: false };
    console.log('.:: Nueva tarea:', newTodo);
    this.todosSignal.update((todos) => [...todos, newTodo]);
    this.save();
    return newTodo;
  }

  update(id: number, changes: Partial<TodoFormValue>): void {
    this.todosSignal.update((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, ...changes } : todo)),
    );
    this.save();
  }

  setCompleted(id: number, isCompleted: boolean): void {
    this.todosSignal.update((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, isCompleted } : todo)),
    );
    this.save();
  }

  delete(id: number): void {
    this.todosSignal.update((todos) => todos.filter((todo) => todo.id !== id));
    this.save();
  }

  /** Vuelve a la lista de ejemplo. */
  reset(): void {
    this.todosSignal.set(structuredClone(INITIAL_TODOS));
    this.save();
  }

  private load(): Todo[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed as Todo[];
        }
      }
    } catch {
      // localStorage no disponible o con datos dañados: se usa la lista inicial
    }
    return structuredClone(INITIAL_TODOS);
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todosSignal()));
    } catch {
      // Si el navegador bloquea el almacenamiento, la app sigue funcionando en memoria
    }
  }
}
