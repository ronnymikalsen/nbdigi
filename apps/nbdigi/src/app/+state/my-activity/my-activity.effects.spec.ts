import { TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';

import { hot } from 'jasmine-marbles';

import { MyActivityEffects } from './my-activity.effects';
import { LoadMyActivity, MyActivityLoaded } from './my-activity.actions';

describe('MyActivityEffects', () => {
  let actions: Observable<any>;
  let effects: MyActivityEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), EffectsModule.forRoot([])],
      providers: [MyActivityEffects, provideMockActions(() => actions)],
    });

    effects = TestBed.inject(MyActivityEffects);
  });

  describe('loadMyActivity$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: new LoadMyActivity() });
      expect(effects.loadMyActivity$).toBeObservable(
        hot('-a-|', { a: new MyActivityLoaded([]) }),
      );
    });
  });
});
