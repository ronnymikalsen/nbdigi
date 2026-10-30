import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { SearchEffects } from './search.effects';
import { SearchFacade } from './search.facade';

import { searchQuery } from './search.selectors';
import { LoadSearch, SearchLoaded } from './search.actions';
import {
  SearchState,
  Entity,
  initialState,
  searchReducer,
} from './search.reducer';

interface TestSchema {
  search: SearchState;
}

describe('SearchFacade', () => {
  let facade: SearchFacade;
  let store: Store<TestSchema>;
  let createSearch;

  beforeEach(() => {
    createSearch = (id: string, name = ''): Entity => ({
      id,
      name: name || `name-${id}`,
    });
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature('search', searchReducer, { initialState }),
          EffectsModule.forFeature([SearchEffects]),
        ],
        providers: [SearchFacade],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule,
        ],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.inject(Store);
      facade = TestBed.inject(SearchFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await firstValueFrom(facade.allSearch$);
      let isLoaded = await firstValueFrom(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.loadAll();

      list = await firstValueFrom(facade.allSearch$);
      isLoaded = await firstValueFrom(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `SearchLoaded` to manually submit list for state management
     */
    it('allSearch$ should return the loaded list; and loaded flag == true', async () => {
      let list = await firstValueFrom(facade.allSearch$);
      let isLoaded = await firstValueFrom(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        new SearchLoaded([createSearch('AAA'), createSearch('BBB')]),
      );

      list = await firstValueFrom(facade.allSearch$);
      isLoaded = await firstValueFrom(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
