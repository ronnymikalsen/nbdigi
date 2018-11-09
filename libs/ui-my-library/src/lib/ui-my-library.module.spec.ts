import { async, TestBed } from '@angular/core/testing';
import { UiMyLibraryModule } from './ui-my-library.module';

describe('UiMyLibraryModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiMyLibraryModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(UiMyLibraryModule).toBeDefined();
  });
});
