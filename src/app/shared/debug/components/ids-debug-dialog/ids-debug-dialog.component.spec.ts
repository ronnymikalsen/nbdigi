import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdsDebugDialogComponent } from './ids-debug-dialog.component';

describe('IdsDebugDialogComponent', () => {
  let component: IdsDebugDialogComponent;
  let fixture: ComponentFixture<IdsDebugDialogComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [IdsDebugDialogComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(IdsDebugDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
