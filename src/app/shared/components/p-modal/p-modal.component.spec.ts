import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PModalComponent } from './p-modal.component';

describe('PModalComponent', () => {
  let component: PModalComponent;
  let fixture: ComponentFixture<PModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
