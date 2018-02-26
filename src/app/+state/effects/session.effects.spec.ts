import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { DataPersistence } from '@nrwl/nx';
import { readAll, hot } from '@nrwl/nx/testing';
import { SessionEffects } from './session.effects';
import { of } from 'rxjs/observable/of';

describe('SessionEffects', () => {
  let actions;
  let effects: SessionEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        SessionEffects,
        DataPersistence,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(SessionEffects);
  });

  describe('someEffect', () => {
    it('should work', async () => {
      actions = hot('-a-|', { a: { type: 'LOAD_DATA' } });
      //expect(await readAll(effects.loadData)).toEqual([{ type: 'DATA_LOADED', payload: {} }]);
    });
  });
});
