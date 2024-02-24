import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AndressaComponent } from './andressa.component';

describe('AndressaComponent', () => {
  let component: AndressaComponent;
  let fixture: ComponentFixture<AndressaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AndressaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AndressaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
