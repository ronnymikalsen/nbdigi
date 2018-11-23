import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';

import { NxModule } from '@nrwl/nx';
import { DataPersistence } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';

import { HomeEffects } from './home.effects';
import { LoadHome, HomeLoaded } from './home.actions';

describe('HomeEffects', () => {
  let actions: Observable<any>;
  let effects: HomeEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        EffectsModule.forRoot([])
      ],
      providers: [
        HomeEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(HomeEffects);
  });

  describe('loadHome$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: new LoadHome() });
      expect(effects.loadHome$).toBeObservable(
        hot('-a-|', { a: new HomeLoaded([]) })
      );
    });
  });
});
