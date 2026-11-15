import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormTasks } from './form-tasks';
import { TodoFormValue } from '../../../models/todo.model';

describe('FormTasks', () => {
  let component: FormTasks;
  let fixture: ComponentFixture<FormTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTasks],
    }).compileComponents();

    fixture = TestBed.createComponent(FormTasks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not emit when the form is invalid', () => {
    let emitido = false;
    component.guardarTarea.subscribe(() => (emitido = true));
    component.guardar();
    expect(emitido).toBe(false);
  });

  it('should emit guardarTarea with the form data', () => {
    let recibido: TodoFormValue | undefined;
    component.guardarTarea.subscribe((valor: TodoFormValue) => (recibido = valor));
    component.form.patchValue({ title: 'Coser correas', priority: 'high', category: 'Taller' });
    component.guardar();
    expect(recibido?.title).toBe('Coser correas');
    expect(recibido?.priority).toBe('high');
  });

  it('should load the task received by @Input for editing', async () => {
    fixture.componentRef.setInput('tareaEnEdicion', {
      id: 9,
      title: 'Tejer sombrero',
      description: '',
      dueDate: '2026-11-30',
      category: 'Taller',
      priority: 'medium',
    });
    await fixture.whenStable();
    expect(component.form.controls.title.value).toBe('Tejer sombrero');
    expect(component.form.controls.dueDate.value?.getDate()).toBe(30);
  });
});
