import { async, TestBed } from '@angular/core/testing';
import { UiSearchModule } from './ui-search.module';

describe('UiSearchModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiSearchModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(UiSearchModule).toBeDefined();
  });
});
