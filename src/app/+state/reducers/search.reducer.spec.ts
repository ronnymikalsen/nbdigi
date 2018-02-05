import { Hints } from './../../../../../libs/typeahead/src/hints.model';
import { HintsLoaded } from './../actions/search.actions';
import { reducer } from './search.reducer';
import * as fromSearch from './search.reducer';

describe('searchReducer', () => {
  it('should work', () => {
    const state: fromSearch.State = {
      q: null,
      filters: [],
      hints: null
    };
    const hints = new Hints();
    const action: HintsLoaded = { type: 'HINTS_LOADED', payload: hints };
    const actual = reducer(state, action);
    expect(actual.hints).toEqual(hints);
  });
});
