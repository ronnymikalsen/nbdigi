import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';

import { NxModule } from '@nrwl/nx';
import { DataPersistence } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';

import { MyActivityEffects } from './my-activity.effects';
import { LoadMyActivity, MyActivityLoaded } from './my-activity.actions';

describe('MyActivityEffects', () => {
  let actions: Observable<any>;
  let effects: MyActivityEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        EffectsModule.forRoot([])
      ],
      providers: [
        MyActivityEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(MyActivityEffects);
  });

  describe('loadMyActivity$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: new LoadMyActivity() });
      expect(effects.loadMyActivity$).toBeObservable(
        hot('-a-|', { a: new MyActivityLoaded([]) })
      );
    });
  });
});
