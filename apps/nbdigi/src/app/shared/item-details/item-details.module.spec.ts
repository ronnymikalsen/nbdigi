import { ItemDetailsModule } from './item-details.module';

describe('ItemDetailsModule', () => {
  let itemDetailsModule: ItemDetailsModule;

  beforeEach(() => {
    itemDetailsModule = new ItemDetailsModule();
  });

  it('should create an instance', () => {
    expect(itemDetailsModule).toBeTruthy();
  });
});
