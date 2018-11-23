import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';

import { NxModule } from '@nrwl/nx';
import { DataPersistence } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';

import { SessionEffects } from './session.effects';
import { LoadSession, SessionLoaded } from './session.actions';

describe('SessionEffects', () => {
  let actions: Observable<any>;
  let effects: SessionEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        EffectsModule.forRoot([])
      ],
      providers: [
        SessionEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(SessionEffects);
  });

  describe('loadSession$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: new LoadSession() });
      expect(effects.loadSession$).toBeObservable(
        hot('-a-|', { a: new SessionLoaded([]) })
      );
    });
  });
});
