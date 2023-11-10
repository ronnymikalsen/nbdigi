import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultItemCardComponent } from './default-item-card.component';

describe('DefaultItemCardComponent', () => {
  let component: DefaultItemCardComponent;
  let fixture: ComponentFixture<DefaultItemCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultItemCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultItemCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
