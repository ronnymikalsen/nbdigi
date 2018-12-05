import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchActivityComponent } from './search-activity.component';

describe('SearchActivityComponent', () => {
  let component: SearchActivityComponent;
  let fixture: ComponentFixture<SearchActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchActivityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
