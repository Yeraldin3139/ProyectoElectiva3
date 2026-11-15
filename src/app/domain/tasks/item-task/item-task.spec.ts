import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemTask } from './item-task';

describe('ItemTask', () => {
  let component: ItemTask;
  let fixture: ComponentFixture<ItemTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemTask],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemTask);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Ajustar cinta del vaquero');
    fixture.componentRef.setInput('description', 'Cinta roja y negra');
    await fixture.whenStable();
  });

  it('should show the title received by @Input', () => {
    expect((fixture.nativeElement as HTMLElement).querySelector('.task-title')?.textContent).toContain(
      'Ajustar cinta del vaquero',
    );
  });

  it('should emit eliminarTarea with the title (@Output)', () => {
    let recibido = '';
    component.eliminarTarea.subscribe((valor: string) => (recibido = valor));
    component.eliminar();
    expect(recibido).toBe('Ajustar cinta del vaquero');
  });

  it('should emit cambiarEstado when the checkbox changes', () => {
    let estado: boolean | undefined;
    component.cambiarEstado.subscribe((valor: boolean) => (estado = valor));
    const checkbox = (fixture.nativeElement as HTMLElement).querySelector('p-checkbox input') as HTMLInputElement;
    checkbox.click();
    expect(estado).toBe(true);
  });
});
