import { async, TestBed } from '@angular/core/testing';
import { AuthenticationStateModule } from './authentication-state.module';

describe('AuthenticationStateModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AuthenticationStateModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(AuthenticationStateModule).toBeDefined();
  });
});
