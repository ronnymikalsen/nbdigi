import { FavoriteListMenuModule } from './favorite-list-menu.module';

describe('FavoriteListMenuModule', () => {
  let favoriteListMenuModule: FavoriteListMenuModule;

  beforeEach(() => {
    favoriteListMenuModule = new FavoriteListMenuModule();
  });

  it('should create an instance', () => {
    expect(favoriteListMenuModule).toBeTruthy();
  });
});
