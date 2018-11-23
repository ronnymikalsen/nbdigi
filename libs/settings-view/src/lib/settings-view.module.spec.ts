import { async, TestBed } from '@angular/core/testing';
import { SettingsViewModule } from './settings-view.module';

describe('SettingsViewModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SettingsViewModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SettingsViewModule).toBeDefined();
  });
});
