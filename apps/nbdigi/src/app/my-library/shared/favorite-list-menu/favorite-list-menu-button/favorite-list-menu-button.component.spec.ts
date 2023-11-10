import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteListMenuButtonComponent } from './favorite-list-menu-button.component';

describe('FavoriteListMenuButtonComponent', () => {
  let component: FavoriteListMenuButtonComponent;
  let fixture: ComponentFixture<FavoriteListMenuButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FavoriteListMenuButtonComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteListMenuButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
