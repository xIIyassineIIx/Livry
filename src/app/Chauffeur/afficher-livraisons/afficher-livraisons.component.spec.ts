import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficherLivraisonsComponent } from './afficher-livraisons.component';

describe('AfficherLivraisonsComponent', () => {
  let component: AfficherLivraisonsComponent;
  let fixture: ComponentFixture<AfficherLivraisonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfficherLivraisonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfficherLivraisonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
