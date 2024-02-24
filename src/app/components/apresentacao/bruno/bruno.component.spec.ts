import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrunoComponent } from './bruno.component';

describe('BrunoComponent', () => {
  let component: BrunoComponent;
  let fixture: ComponentFixture<BrunoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrunoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BrunoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
