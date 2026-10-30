import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToFavoriteListDialogComponent } from './add-to-favorite-list-dialog.component';

describe('AddToFavoriteListDialogComponent', () => {
  let component: AddToFavoriteListDialogComponent;
  let fixture: ComponentFixture<AddToFavoriteListDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddToFavoriteListDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToFavoriteListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
