import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentlocationComponent } from './contentlocation.component';

describe('ContentlocationComponent', () => {
  let component: ContentlocationComponent;
  let fixture: ComponentFixture<ContentlocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentlocationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContentlocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
