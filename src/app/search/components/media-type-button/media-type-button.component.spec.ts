import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaTypeButtonComponent } from './media-type-button.component';

describe('MediaTypeButtonComponent', () => {
  let component: MediaTypeButtonComponent;
  let fixture: ComponentFixture<MediaTypeButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaTypeButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaTypeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
