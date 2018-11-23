import { async, TestBed } from '@angular/core/testing';
import { HomeViewModule } from './home-view.module';

describe('HomeViewModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HomeViewModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(HomeViewModule).toBeDefined();
  });
});
