import { MessageService } from 'primeng/api';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TaskList } from './task-list';

describe('TaskList', () => {
  let component: TaskList;
  let fixture: ComponentFixture<TaskList>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [TaskList],
      providers: [provideRouter([]), MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render one app-item-task per task', () => {
    const items = (fixture.nativeElement as HTMLElement).querySelectorAll('app-item-task');
    expect(items.length).toBe(component.total());
  });

  it('should delete a task when the child emits eliminarTarea', async () => {
    const before = component.total();
    const deleteButton = (fixture.nativeElement as HTMLElement).querySelector(
      'app-item-task button[aria-label^="Eliminar"]',
    ) as HTMLButtonElement;
    deleteButton.click();
    await fixture.whenStable();
    expect(component.total()).toBe(before - 1);
    expect(component.mensajes()[0].texto).toContain('Eliminada');
  });
});
