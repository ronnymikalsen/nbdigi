import { async, TestBed } from '@angular/core/testing';
import { ExploreViewModule } from './explore-view.module';

describe('ExploreViewModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ExploreViewModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ExploreViewModule).toBeDefined();
  });
});
