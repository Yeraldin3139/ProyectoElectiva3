import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import {
  PRIORITY_OPTIONS,
  TODO_CATEGORIES,
  Todo,
  TodoFormValue,
  TodoPriority,
  fromDateKey,
  toDateKey,
} from '../../../models/todo.model';

/**
 * Componente hijo: formulario de tareas.
 * Book Angular:
 *  - Clase 5b: FormBuilder con validaciones
 *  - Clase 5c: manejo de componentes (domain/tasks/form-tasks)
 *  - Clase 6b: comunicación padre ↔ hijo
 *      @Input  tareaEnEdicion → el padre le pasa la tarea a editar
 *      @Output guardarTarea   → el hijo entrega los datos al padre
 *      @Output cancelarEdicion
 */
@Component({
  selector: 'app-form-tasks',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, SelectModule, DatePickerModule],
  templateUrl: './form-tasks.html',
  styleUrl: './form-tasks.scss',
})
export class FormTasks implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() tareaEnEdicion: Todo | null = null;

  @Output() guardarTarea = new EventEmitter<TodoFormValue>();
  @Output() cancelarEdicion = new EventEmitter<void>();

  readonly categories = TODO_CATEGORIES;
  readonly priorityOptions = PRIORITY_OPTIONS;

  form = this.fb.group({
    title: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3)]),
    priority: this.fb.control<TodoPriority | null>(null, Validators.required),
    category: this.fb.nonNullable.control(TODO_CATEGORIES[0], Validators.required),
    dueDate: this.fb.control<Date | null>(null),
    description: this.fb.nonNullable.control(''),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tareaEnEdicion']) {
      const tarea = this.tareaEnEdicion;
      if (tarea) {
        this.form.setValue({
          title: tarea.title,
          priority: tarea.priority,
          category: tarea.category,
          dueDate: fromDateKey(tarea.dueDate),
          description: tarea.description,
        });
      } else {
        this.form.reset();
      }
    }
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.guardarTarea.emit({
      title: value.title.trim(),
      description: value.description.trim(),
      dueDate: toDateKey(value.dueDate),
      category: value.category,
      priority: value.priority as TodoPriority,
    });
    this.form.reset();
  }

  cancelar() {
    this.form.reset();
    this.cancelarEdicion.emit();
  }

  hasError(control: 'title' | 'priority', error: string) {
    const ctrl = this.form.controls[control];
    return ctrl.touched && ctrl.hasError(error);
  }
}
