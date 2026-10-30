import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriaListItemComponent } from './criteria-list-item.component';

describe('CriteriaListItemComponent', () => {
  let component: CriteriaListItemComponent;
  let fixture: ComponentFixture<CriteriaListItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CriteriaListItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriteriaListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
