// Modelo de tareas (Book Angular · Clase 3)
// Se usa en el panel de gestión de la sombrerería (Tareas y Pendientes).

export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
  id: number;
  title: string;
  description: string;
  /** Fecha de entrega en formato AAAA-MM-DD ('' si no tiene) */
  dueDate: string;
  category: string;
  priority: TodoPriority;
  isCompleted?: boolean;
}

/** Datos que llegan desde un formulario de tareas (sin id ni estado). */
export type TodoFormValue = Omit<Todo, 'id' | 'isCompleted'>;

export type TodoFilter = 'all' | 'pending' | 'completed';

export const TODO_CATEGORIES: string[] = ['Taller', 'Inventario', 'Envíos', 'Tienda', 'Redes sociales'];

export const PRIORITY_LABELS: Record<TodoPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
};

export const PRIORITY_OPTIONS = (Object.keys(PRIORITY_LABELS) as TodoPriority[]).map((value) => ({
  value,
  label: PRIORITY_LABELS[value],
}));

/** Clase CSS según la prioridad (se usa con [ngClass], Clase 4b). */
export function priorityClass(priority: string): string {
  switch (priority) {
    case 'low':
      return 'priority-low';
    case 'medium':
      return 'priority-medium';
    case 'high':
      return 'priority-high';
    default:
      return '';
  }
}

/** Date → 'AAAA-MM-DD' (o '' si no hay fecha) */
export function toDateKey(date: Date | null | undefined): string {
  if (!date) {
    return '';
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** 'AAAA-MM-DD' → Date (o null) */
export function fromDateKey(key: string): Date | null {
  if (!key) {
    return null;
  }
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** true si la fecha de entrega ya pasó (comparando solo el día). */
export function isOverdue(dueDate: string, isCompleted = false): boolean {
  if (!dueDate || isCompleted) {
    return false;
  }
  return dueDate < toDateKey(new Date());
}
