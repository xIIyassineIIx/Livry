import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicMenuComponent } from './mechanic-menu.component';

describe('MechanicMenuComponent', () => {
  let component: MechanicMenuComponent;
  let fixture: ComponentFixture<MechanicMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MechanicMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MechanicMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

