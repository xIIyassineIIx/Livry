import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouteColisComponent } from './ajoute-colis.component';

describe('AjouteColisComponent', () => {
  let component: AjouteColisComponent;
  let fixture: ComponentFixture<AjouteColisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouteColisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouteColisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
