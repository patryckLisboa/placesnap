import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PMessageComponent } from './p-message.component';

describe('PMessageComponent', () => {
  let component: PMessageComponent;
  let fixture: ComponentFixture<PMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
