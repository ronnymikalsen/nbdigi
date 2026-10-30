import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsSectionComponent } from './items-section.component';

describe('ItemsSectionComponent', () => {
  let component: ItemsSectionComponent;
  let fixture: ComponentFixture<ItemsSectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ItemsSectionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
