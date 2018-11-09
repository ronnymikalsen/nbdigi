import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';

import { NxModule } from '@nrwl/nx';
import { DataPersistence } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';

import { AuthenticationstateEffects } from './authenticationstate.effects';
import {
  LoadAuthenticationstate,
  AuthenticationstateLoaded
} from './authenticationstate.actions';

describe('AuthenticationstateEffects', () => {
  let actions: Observable<any>;
  let effects: AuthenticationstateEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        EffectsModule.forRoot([])
      ],
      providers: [
        AuthenticationstateEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(AuthenticationstateEffects);
  });

  describe('loadAuthenticationstate$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: new LoadAuthenticationstate() });
      expect(effects.loadAuthenticationstate$).toBeObservable(
        hot('-a-|', { a: new AuthenticationstateLoaded([]) })
      );
    });
  });
});
