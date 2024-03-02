import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PBackgroundComponent } from './p-background.component';

describe('AnimatedBackgroundComponent', () => {
  let component: PBackgroundComponent;
  let fixture: ComponentFixture<PBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PBackgroundComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
