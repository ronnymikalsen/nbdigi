import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMenuButtonComponent } from './item-menu-button.component';

describe('ItemMenuButtonComponent', () => {
  let component: ItemMenuButtonComponent;
  let fixture: ComponentFixture<ItemMenuButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemMenuButtonComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMenuButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
