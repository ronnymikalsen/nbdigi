import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaTypeOptionComponent } from './media-type-option.component';

describe('MediaTypeOptionComponent', () => {
  let component: MediaTypeOptionComponent;
  let fixture: ComponentFixture<MediaTypeOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MediaTypeOptionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaTypeOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
