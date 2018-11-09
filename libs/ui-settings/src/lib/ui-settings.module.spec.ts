import { async, TestBed } from '@angular/core/testing';
import { UiSettingsModule } from './ui-settings.module';

describe('UiSettingsModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiSettingsModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(UiSettingsModule).toBeDefined();
  });
});
