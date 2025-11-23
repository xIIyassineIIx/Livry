import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicInterventionsComponent } from './interventions.component';

describe('MechanicInterventionsComponent', () => {
  let component: MechanicInterventionsComponent;
  let fixture: ComponentFixture<MechanicInterventionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MechanicInterventionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MechanicInterventionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

