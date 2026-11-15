import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HatDesigner } from './hat-designer';

describe('HatDesigner', () => {
  let component: HatDesigner;
  let fixture: ComponentFixture<HatDesigner>;

  async function crear(queryParams: Record<string, string> = {}) {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [HatDesigner],
      providers: [
        provideRouter([]),
        MessageService,
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap(queryParams) } } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(HatDesigner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  }

  it('should validate the engraving FormControl (Clase 5a)', async () => {
    await crear();
    component.nameCtrl.setValue('ab');
    expect(component.nameCtrl.valid).toBe(false);
    component.nameCtrl.setValue('Yeraldin');
    expect(component.nameCtrl.valid).toBe(true);
  });

  it('should paint the band with the selected color', async () => {
    await crear();
    component.elegirColor('#1f4e8c');
    await fixture.whenStable();
    const banda = (fixture.nativeElement as HTMLElement).querySelectorAll('svg.hat rect')[1];
    expect(banda.getAttribute('fill')).toBe('#1f4e8c');
  });

  it('should save a design in "Mis diseños"', async () => {
    await crear();
    component.nameCtrl.setValue('Yeraldin');
    component.verForm();
    expect(component.disenos().length).toBe(1);
    expect(component.disenos()[0].grabado).toBe('Yeraldin');
  });

  it('should preselect the model from ?modelo=', async () => {
    await crear({ modelo: '4' });
    expect(component.modelo()?.name).toContain('Vaquero blanco');
    expect(component.tono().nombre).toBe('Blanco');
  });
});
