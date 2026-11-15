import { MessageService } from 'primeng/api';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TodoList } from './todo-list';

describe('TodoList', () => {
  let component: TodoList;
  let fixture: ComponentFixture<TodoList>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [TodoList],
      providers: [provideRouter([]), MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not add a task when the form is invalid', () => {
    const before = component.total();
    component.submitTodoForm();
    expect(component.total()).toBe(before);
    expect(component.todoForm.controls.title.touched).toBe(true);
  });

  it('should add a task from the FormBuilder form', () => {
    const before = component.total();
    component.todoForm.patchValue({ title: 'Coser cinta del vueltiao', priority: 'medium' });
    component.submitTodoForm();
    expect(component.total()).toBe(before + 1);
  });

  it('should filter completed tasks', () => {
    component.filter.set('completed');
    expect(component.filteredTodos().every((t) => t.isCompleted)).toBe(true);
  });

  it('should return the CSS class for each priority (ngClass)', () => {
    expect(component.setColorPriority('high')).toBe('priority-high');
    expect(component.setColorPriority('low')).toBe('priority-low');
  });
});
