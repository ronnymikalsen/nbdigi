import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { DataPersistence } from '@nrwl/nx';
import { readAll, hot } from '@nrwl/nx/testing';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs';

import { SearchEffects } from './search.effects';
import { TypeaheadService } from './../../core/typeahead-service/typeahead.service';
import { Hint } from './../../core/typeahead-service/hints.model';

describe('SearchpEffects', () => {
  let actions;
  let effects: SearchEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        SearchEffects,
        DataPersistence,
        provideMockActions(() => actions),
        { provide: TypeaheadService, useClass: TypeaheadServiceStub }
      ]
    });

    effects = TestBed.get(SearchEffects);
  });

  describe('someEffect', () => {
    it('should work', async () => {
      actions = hot('-a-|', { a: { type: 'LOAD_HINTS' } });
      expect(await readAll(effects.loadHints)).toEqual([
        {
          type: 'HINTS_LOADED',
          payload: new Hints({
            creators: [],
            places: []
          })
        }
      ]);
    });
  });
});

class TypeaheadServiceStub {
  public creators(q: string): Observable<Hint[]> {
    return Observable.of([]);
  }

  public places(q: string): Observable<Hint[]> {
    return Observable.of([]);
  }
}
