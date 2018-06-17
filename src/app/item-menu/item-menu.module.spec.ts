import { ItemMenuModule } from './item-menu.module';

describe('ItemMenuModule', () => {
  let itemMenuModule: ItemMenuModule;

  beforeEach(() => {
    itemMenuModule = new ItemMenuModule();
  });

  it('should create an instance', () => {
    expect(itemMenuModule).toBeTruthy();
  });
});
