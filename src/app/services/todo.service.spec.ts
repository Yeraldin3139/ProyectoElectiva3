import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoService);
  });

  it('should start with the example tasks', () => {
    expect(service.total()).toBeGreaterThan(0);
    expect(service.pendingCount() + service.completedCount()).toBe(service.total());
  });

  it('should add a task with a new id and save it', () => {
    const before = service.total();
    const todo = service.add({ title: 'Ajustar cinta', description: '', dueDate: '', category: 'Taller', priority: 'low' });
    expect(service.total()).toBe(before + 1);
    expect(todo.isCompleted).toBe(false);
    expect(JSON.parse(localStorage.getItem('somos-colon-tareas-v2')!).length).toBe(before + 1);
  });

  it('should mark a task as completed and delete it', () => {
    const todo = service.add({ title: 'Empacar pedido', description: '', dueDate: '', category: 'Envíos', priority: 'high' });
    service.setCompleted(todo.id, true);
    expect(service.todos().find((t) => t.id === todo.id)?.isCompleted).toBe(true);

    service.delete(todo.id);
    expect(service.todos().some((t) => t.id === todo.id)).toBe(false);
  });
});
