import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameFavoriteDialogComponent } from './rename-favorite-dialog.component';

describe('RenameFavoriteDialogComponent', () => {
  let component: RenameFavoriteDialogComponent;
  let fixture: ComponentFixture<RenameFavoriteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RenameFavoriteDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameFavoriteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
