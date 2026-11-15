import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ItemTask } from '../../domain/tasks/item-task/item-task';
import { FormTasks } from '../../domain/tasks/form-tasks/form-tasks';
import { Todo, TodoFilter, TodoFormValue } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';

interface MensajeHijo {
  hora: string;
  texto: string;
}

/**
 * Componente padre: Tareas del taller (versión por componentes). Requiere iniciar sesión.
 * Book Angular:
 *  - Clase 5c: manejo de componentes (pages / domain)
 *  - Clase 6:  usa los hijos <app-item-task> y <app-form-tasks> enviándoles datos con @Input
 *  - Clase 6b: escucha los eventos @Output de los hijos
 */
@Component({
  selector: 'app-task-list',
  imports: [CommonModule, RouterLink, ButtonModule, ItemTask, FormTasks],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  private readonly todoService = inject(TodoService);
  private readonly messages = inject(MessageService);

  readonly todos = this.todoService.todos;
  readonly total = this.todoService.total;
  readonly pendingCount = this.todoService.pendingCount;
  readonly completedCount = this.todoService.completedCount;

  readonly filter = signal<TodoFilter>('all');
  readonly tareasFiltradas = computed(() => {
    const todos = this.todos();
    if (this.filter() === 'pending') return todos.filter((t) => !t.isCompleted);
    if (this.filter() === 'completed') return todos.filter((t) => t.isCompleted);
    return todos;
  });

  /** Tarea que el padre le pasa al formulario hijo para editarla */
  readonly tareaEnEdicion = signal<Todo | null>(null);

  /** Actividad reciente: se llena con los eventos @Output que envían los hijos */
  readonly mensajes = signal<MensajeHijo[]>([]);

  // ---- Eventos que llegan desde <app-form-tasks> ----
  onGuardarTarea(data: TodoFormValue) {
    const editando = this.tareaEnEdicion();
    if (editando) {
      this.todoService.update(editando.id, data);
      this.registrar(`Editada: "${data.title}"`);
      this.messages.add({ severity: 'success', summary: 'Tarea actualizada', detail: data.title, life: 2500 });
      this.tareaEnEdicion.set(null);
    } else {
      this.todoService.add(data);
      this.registrar(`Nueva tarea: "${data.title}"`);
      this.messages.add({ severity: 'success', summary: 'Tarea agregada', detail: data.title, life: 2500 });
    }
  }

  onCancelarEdicion() {
    this.tareaEnEdicion.set(null);
    this.registrar('Edición cancelada');
  }

  // ---- Eventos que llegan desde <app-item-task> ----
  delete(todo: Todo, mensajeHijo: string) {
    console.log('.:: Esto envía el hijo: ' + mensajeHijo);
    if (this.tareaEnEdicion()?.id === todo.id) {
      this.tareaEnEdicion.set(null);
    }
    this.todoService.delete(todo.id);
    this.registrar(`Eliminada: "${mensajeHijo}"`);
    this.messages.add({ severity: 'info', summary: 'Tarea eliminada', detail: mensajeHijo, life: 2500 });
  }

  editar(todo: Todo) {
    this.tareaEnEdicion.set(todo);
    this.registrar(`Editando: "${todo.title}"`);
  }

  cambiarEstado(todo: Todo, completada: boolean) {
    this.todoService.setCompleted(todo.id, completada);
    this.registrar(`"${todo.title}" marcada como ${completada ? 'completada' : 'pendiente'}`);
  }

  trackById(_index: number, todo: Todo) {
    return todo.id;
  }

  private registrar(texto: string) {
    const hora = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.mensajes.update((lista) => [{ hora, texto }, ...lista].slice(0, 5));
  }
}
