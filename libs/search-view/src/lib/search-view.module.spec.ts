import { async, TestBed } from '@angular/core/testing';
import { SearchViewModule } from './search-view.module';

describe('SearchViewModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SearchViewModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SearchViewModule).toBeDefined();
  });
});
