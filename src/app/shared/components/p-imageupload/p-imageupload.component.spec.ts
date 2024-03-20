import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PImageuploadComponent } from './p-imageupload.component';

describe('PImageuploadComponent', () => {
  let component: PImageuploadComponent;
  let fixture: ComponentFixture<PImageuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PImageuploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PImageuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
