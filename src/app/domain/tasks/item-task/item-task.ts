import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { PRIORITY_LABELS, TodoPriority, isOverdue, priorityClass } from '../../../models/todo.model';

let nextItemId = 0;

/**
 * Componente hijo: una tarjeta de tarea.
 * Book Angular:
 *  - Clase 6: creación de componentes, recibe datos con @Input
 *  - Clase 6b: comunicación de componentes, avisa al padre con @Output
 */
@Component({
  selector: 'app-item-task',
  imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule, TagModule],
  templateUrl: './item-task.html',
  styleUrl: './item-task.scss',
})
export class ItemTask {
  // Datos que envía el padre (TaskList)
  @Input({ required: true }) title: string = '';
  @Input({ required: false }) description: string = '';
  @Input() priority: TodoPriority = 'medium';
  @Input() category: string = '';
  @Input() dueDate: string = '';
  @Input() completed: boolean = false;

  // Eventos que el hijo emite hacia el padre
  @Output() eliminarTarea = new EventEmitter<string>();
  @Output() editarTarea = new EventEmitter<string>();
  @Output() cambiarEstado = new EventEmitter<boolean>();

  /** id único para enlazar el checkbox con su label */
  readonly checkboxId = `item-task-${nextItemId++}`;
  readonly priorityLabels = PRIORITY_LABELS;

  get vencida(): boolean {
    return isOverdue(this.dueDate, this.completed);
  }

  get priorityClass(): string {
    return priorityClass(this.priority);
  }

  eliminar() {
    this.eliminarTarea.emit(this.title);
  }

  editar() {
    this.editarTarea.emit(this.title);
  }

  onCheck(event: CheckboxChangeEvent) {
    this.cambiarEstado.emit(!!event.checked);
  }
}
