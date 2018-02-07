import { Hints, Hint } from "./../../core/typeahead-service/hints.model";
import { SearchAction, SearchActionTypes } from "./../actions/search.actions";
import { SuperSearchResult } from "../../models/search-result.model";

export interface State {
  q: string;
  filters: Hint[];
  hints: Hints;
  searchResult: SuperSearchResult;
}

export const initialState: State = {
  q: null,
  filters: [],
  hints: null,
  searchResult: new SuperSearchResult()
};

export function reducer(state = initialState, action: SearchAction): State {
  switch (action.type) {
    case SearchActionTypes.SetQuery: {
      return { ...state, q: action.payload };
    }
    case SearchActionTypes.HintsLoaded: {
      return { ...state, hints: action.payload };
    }
    case SearchActionTypes.AddFilter: {
      return { ...state, filters: [...state.filters, action.payload] };
    }
    case SearchActionTypes.RemoveFilter: {
      return {
        ...state,
        filters: state.filters.filter(f => f !== action.payload)
      };
    }
    case SearchActionTypes.ToggleFilter: {
      const index = state.filters.findIndex(f => f === action.payload);
      return {
        ...state,
        filters: state.filters.map((f, i) => {
          return i !== index ? f : { ...f, enabled: !f.enabled };
        })
      };
    }
    case SearchActionTypes.SearchSuccess: {
      return {
        ...state,
        searchResult: action.payload
      };
    }
    default: {
      return state;
    }
  }
}
