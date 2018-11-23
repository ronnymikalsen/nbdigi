import { async, TestBed } from '@angular/core/testing';
import { SessionStateModule } from './session-state.module';

describe('SessionStateModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SessionStateModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SessionStateModule).toBeDefined();
  });
});
