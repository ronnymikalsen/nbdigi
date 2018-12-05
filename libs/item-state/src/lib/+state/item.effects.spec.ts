import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';

import { NxModule } from '@nrwl/nx';
import { DataPersistence } from '@nrwl/nx';
import { hot } from '@nrwl/nx/testing';

import { ItemEffects } from './item.effects';
import { LoadItem, ItemLoaded } from './item.actions';

describe('ItemEffects', () => {
  let actions: Observable<any>;
  let effects: ItemEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        EffectsModule.forRoot([])
      ],
      providers: [
        ItemEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(ItemEffects);
  });

  describe('loadItem$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: new LoadItem() });
      expect(effects.loadItem$).toBeObservable(
        hot('-a-|', { a: new ItemLoaded([]) })
      );
    });
  });
});
