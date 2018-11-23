import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdCopyValueComponent } from './id-copy-value.component';

describe('IdCopyValueComponent', () => {
  let component: IdCopyValueComponent;
  let fixture: ComponentFixture<IdCopyValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IdCopyValueComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdCopyValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
