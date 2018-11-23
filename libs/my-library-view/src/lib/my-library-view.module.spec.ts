import { async, TestBed } from '@angular/core/testing';
import { MyLibraryViewModule } from './my-library-view.module';

describe('UiMyLibraryModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MyLibraryViewModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(MyLibraryViewModule).toBeDefined();
  });
});
