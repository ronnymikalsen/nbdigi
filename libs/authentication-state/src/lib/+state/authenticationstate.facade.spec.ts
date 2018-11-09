import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/nx/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/nx';

import { AuthenticationstateEffects } from './authenticationstate.effects';
import { AuthenticationstateFacade } from './authenticationstate.facade';

import { authenticationstateQuery } from './authenticationstate.selectors';
import {
  LoadAuthenticationstate,
  AuthenticationstateLoaded
} from './authenticationstate.actions';
import {
  AuthenticationstateState,
  Entity,
  initialState,
  authenticationstateReducer
} from './authenticationstate.reducer';

interface TestSchema {
  authenticationstate: AuthenticationstateState;
}

describe('AuthenticationstateFacade', () => {
  let facade: AuthenticationstateFacade;
  let store: Store<TestSchema>;
  let createAuthenticationstate;

  beforeEach(() => {
    createAuthenticationstate = (id: string, name = ''): Entity => ({
      id,
      name: name || `name-${id}`
    });
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(
            'authenticationstate',
            authenticationstateReducer,
            { initialState }
          ),
          EffectsModule.forFeature([AuthenticationstateEffects])
        ],
        providers: [AuthenticationstateFacade]
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
      facade = TestBed.get(AuthenticationstateFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async done => {
      try {
        let list = await readFirst(facade.allAuthenticationstate$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        facade.loadAll();

        list = await readFirst(facade.allAuthenticationstate$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    /**
     * Use `AuthenticationstateLoaded` to manually submit list for state management
     */
    it('allAuthenticationstate$ should return the loaded list; and loaded flag == true', async done => {
      try {
        let list = await readFirst(facade.allAuthenticationstate$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        store.dispatch(
          new AuthenticationstateLoaded([
            createAuthenticationstate('AAA'),
            createAuthenticationstate('BBB')
          ])
        );

        list = await readFirst(facade.allAuthenticationstate$);
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
