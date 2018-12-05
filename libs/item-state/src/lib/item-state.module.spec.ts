import { async, TestBed } from '@angular/core/testing';
import { ItemStateModule } from './item-state.module';

describe('ItemStateModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ItemStateModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ItemStateModule).toBeDefined();
  });
});
