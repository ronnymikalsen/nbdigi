import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/angular/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/angular';

import { MyActivityEffects } from './my-activity.effects';
import { MyActivityFacade } from './my-activity.facade';

import { myActivityQuery } from './my-activity.selectors';
import { LoadMyActivity, MyActivityLoaded } from './my-activity.actions';
import {
  MyActivityState,
  Entity,
  initialState,
  myActivityReducer
} from './my-activity.reducer';

interface TestSchema {
  myActivity: MyActivityState;
}

describe('MyActivityFacade', () => {
  let facade: MyActivityFacade;
  let store: Store<TestSchema>;
  let createMyActivity;

  beforeEach(() => {
    createMyActivity = (id: string, name = ''): Entity => ({
      id,
      name: name || `name-${id}`
    });
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature('myActivity', myActivityReducer, {
            initialState
          }),
          EffectsModule.forFeature([MyActivityEffects])
        ],
        providers: [MyActivityFacade]
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          NxModule.forRoot(),
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule
        ]
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.get(Store);
      facade = TestBed.get(MyActivityFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async done => {
      try {
        let list = await readFirst(facade.allMyActivity$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        facade.loadAll();

        list = await readFirst(facade.allMyActivity$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    /**
     * Use `MyActivityLoaded` to manually submit list for state management
     */
    it('allMyActivity$ should return the loaded list; and loaded flag == true', async done => {
      try {
        let list = await readFirst(facade.allMyActivity$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        store.dispatch(
          new MyActivityLoaded([
            createMyActivity('AAA'),
            createMyActivity('BBB')
          ])
        );

        list = await readFirst(facade.allMyActivity$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(2);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });
  });
});
