import { async, TestBed } from '@angular/core/testing';
import { UiExploreModule } from './ui-explore.module';

describe('UiExploreModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiExploreModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(UiExploreModule).toBeDefined();
  });
});
