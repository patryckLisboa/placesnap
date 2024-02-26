import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PSnackBarComponent } from './p-snack-bar.component';

describe('PSnackBarComponent', () => {
  let component: PSnackBarComponent;
  let fixture: ComponentFixture<PSnackBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PSnackBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
