import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import {
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
  TODO_CATEGORIES,
  Todo,
  TodoFilter,
  TodoPriority,
  fromDateKey,
  isOverdue,
  priorityClass,
  toDateKey,
} from '../models/todo.model';
import { TodoService } from '../services/todo.service';

/**
 * Pendientes de la sombrerería · versión en UN solo componente.
 * Book Angular:
 *  - Clase 3: diseño de la lista, *ngFor, eventos y propiedades
 *  - Clase 4a: implementación de Todos (signals + localStorage)
 *  - Clase 4b: evento check y [ngClass]
 *  - Clase 5b: formulario agrupado con FormBuilder
 */
@Component({
  selector: 'app-todo-list',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    CheckboxModule,
    TagModule,
  ],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList {
  private readonly todoService = inject(TodoService);
  private readonly fb = inject(FormBuilder);
  private readonly messages = inject(MessageService);

  readonly categories = TODO_CATEGORIES;
  readonly priorityOptions = PRIORITY_OPTIONS;
  readonly priorityLabels = PRIORITY_LABELS;

  // Lista de tareas (signal compartida desde el servicio)
  readonly todos = this.todoService.todos;
  readonly total = this.todoService.total;
  readonly pendingCount = this.todoService.pendingCount;
  readonly completedCount = this.todoService.completedCount;

  // Filtro activo: Todas / Pendientes / Completadas
  readonly filter = signal<TodoFilter>('all');
  readonly filteredTodos = computed(() => {
    const todos = this.todos();
    switch (this.filter()) {
      case 'pending':
        return todos.filter((t) => !t.isCompleted);
      case 'completed':
        return todos.filter((t) => t.isCompleted);
      default:
        return todos;
    }
  });

  // Tarea que se está editando (null = creando una nueva)
  readonly editingId = signal<number | null>(null);

  // Construcción del formulario con FormBuilder (Clase 5b)
  todoForm = this.fb.group({
    title: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    priority: this.fb.control<TodoPriority | null>(null, Validators.required),
    category: this.fb.nonNullable.control(TODO_CATEGORIES[0], Validators.required),
    dueDate: this.fb.control<Date | null>(null),
    description: this.fb.nonNullable.control(''),
  });

  submitTodoForm() {
    console.log('.:: Formulario enviado:', this.todoForm.value);

    if (this.todoForm.invalid) {
      this.todoForm.markAllAsTouched();
      return;
    }

    const value = this.todoForm.getRawValue();
    const data = {
      title: value.title.trim(),
      description: value.description.trim(),
      dueDate: toDateKey(value.dueDate),
      category: value.category,
      priority: value.priority as TodoPriority,
    };

    const editingId = this.editingId();
    if (editingId !== null) {
      this.todoService.update(editingId, data);
      this.messages.add({ severity: 'success', summary: 'Tarea actualizada', detail: data.title, life: 2500 });
    } else {
      this.todoService.add(data);
      this.messages.add({ severity: 'success', summary: 'Tarea agregada', detail: data.title, life: 2500 });
    }
    this.resetForm();
  }

  editTodo(todo: Todo) {
    this.editingId.set(todo.id);
    this.todoForm.setValue({
      title: todo.title,
      priority: todo.priority,
      category: todo.category,
      dueDate: fromDateKey(todo.dueDate),
      description: todo.description,
    });
  }

  resetForm() {
    this.editingId.set(null);
    this.todoForm.reset();
  }

  // Evento check (Clase 4b)
  onChangeCompleted(event: CheckboxChangeEvent, todo: Todo) {
    const isChecked = !!event.checked;
    console.log(`Tarea "${todo.title}" completada: ${isChecked}`);
    this.todoService.setCompleted(todo.id, isChecked);
  }

  deleteTodo(todo: Todo) {
    if (this.editingId() === todo.id) {
      this.resetForm();
    }
    this.todoService.delete(todo.id);
    this.messages.add({ severity: 'info', summary: 'Tarea eliminada', detail: todo.title, life: 2500 });
  }

  restoreExamples() {
    this.resetForm();
    this.todoService.reset();
  }

  // Clase CSS según la prioridad, usada con [ngClass] (Clase 4b)
  setColorPriority(priority: string) {
    return priorityClass(priority);
  }

  isOverdue(todo: Todo) {
    return isOverdue(todo.dueDate, todo.isCompleted);
  }

  hasError(control: 'title' | 'priority', error: string) {
    const ctrl = this.todoForm.controls[control];
    return ctrl.touched && ctrl.hasError(error);
  }

  trackById(_index: number, todo: Todo) {
    return todo.id;
  }
}
