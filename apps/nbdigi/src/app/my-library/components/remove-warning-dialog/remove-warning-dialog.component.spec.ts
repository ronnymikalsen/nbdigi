import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveWarningDialogComponent } from './remove-warning-dialog.component';

describe('RemoveWarningDialogComponent', () => {
  let component: RemoveWarningDialogComponent;
  let fixture: ComponentFixture<RemoveWarningDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RemoveWarningDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
