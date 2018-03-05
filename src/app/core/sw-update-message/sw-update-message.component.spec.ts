import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwUpdateMessageComponent } from './sw-update-message.component';

describe('SwUpdateMessageComponent', () => {
  let component: SwUpdateMessageComponent;
  let fixture: ComponentFixture<SwUpdateMessageComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [SwUpdateMessageComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SwUpdateMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
