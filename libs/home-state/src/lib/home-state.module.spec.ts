import { async, TestBed } from '@angular/core/testing';
import { HomeStateModule } from './home-state.module';

describe('HomeStateModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HomeStateModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(HomeStateModule).toBeDefined();
  });
});
