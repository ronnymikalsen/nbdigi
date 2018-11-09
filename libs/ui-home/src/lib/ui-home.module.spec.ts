import { async, TestBed } from '@angular/core/testing';
import { UiHomeModule } from './ui-home.module';

describe('UiHomeModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiHomeModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(UiHomeModule).toBeDefined();
  });
});
