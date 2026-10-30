import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriaListComponent } from './criteria-list.component';

describe('CriteriaListComponent', () => {
  let component: CriteriaListComponent;
  let fixture: ComponentFixture<CriteriaListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CriteriaListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriteriaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
