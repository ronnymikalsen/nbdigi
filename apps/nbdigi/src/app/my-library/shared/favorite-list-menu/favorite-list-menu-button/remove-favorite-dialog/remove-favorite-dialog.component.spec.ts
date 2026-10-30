import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveFavoriteDialogComponent } from './remove-favorite-dialog.component';

describe('RemoveFavoriteDialogComponent', () => {
  let component: RemoveFavoriteDialogComponent;
  let fixture: ComponentFixture<RemoveFavoriteDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RemoveFavoriteDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveFavoriteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
