import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/nx/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/nx';

import { SessionEffects } from './session.effects';
import { SessionFacade } from './session.facade';

import { sessionQuery } from './session.selectors';
import { LoadSession, SessionLoaded } from './session.actions';
import {
  SessionState,
  Entity,
  initialState,
  sessionReducer
} from './session.reducer';

interface TestSchema {
  session: SessionState;
}

describe('SessionFacade', () => {
  let facade: SessionFacade;
  let store: Store<TestSchema>;
  let createSession;

  beforeEach(() => {
    createSession = (id: string, name = ''): Entity => ({
      id,
      name: name || `name-${id}`
    });
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature('session', sessionReducer, { initialState }),
          EffectsModule.forFeature([SessionEffects])
        ],
        providers: [SessionFacade]
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
      facade = TestBed.get(SessionFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async done => {
      try {
        let list = await readFirst(facade.allSession$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        facade.loadAll();

        list = await readFirst(facade.allSession$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    /**
     * Use `SessionLoaded` to manually submit list for state management
     */
    it('allSession$ should return the loaded list; and loaded flag == true', async done => {
      try {
        let list = await readFirst(facade.allSession$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        store.dispatch(
          new SessionLoaded([createSession('AAA'), createSession('BBB')])
        );

        list = await readFirst(facade.allSession$);
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
