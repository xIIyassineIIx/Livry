import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChauffeurMenuComponent } from './chauffeur-menu.component';

describe('ChauffeurMenuComponent', () => {
  let component: ChauffeurMenuComponent;
  let fixture: ComponentFixture<ChauffeurMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChauffeurMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChauffeurMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
