import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFavoriteListComponent } from './create-favorite-list.component';

describe('CreateFavoriteListComponent', () => {
  let component: CreateFavoriteListComponent;
  let fixture: ComponentFixture<CreateFavoriteListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreateFavoriteListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFavoriteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
