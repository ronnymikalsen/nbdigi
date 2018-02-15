import { Hints, Hint } from './../../core/typeahead-service/hints.model';
import { SearchAction, SearchActionTypes } from './../actions/search.actions';
import {
  SuperSearchResult,
  MediaTypeResults
} from '../../models/search-result.model';

export interface State {
  q: string;
  mediaType: string;
  filters: Hint[];
  hints: Hints;
  searchResult: {
    books: MediaTypeResults;
    newspapers: MediaTypeResults;
    photos: MediaTypeResults;
    periodicals: MediaTypeResults;
    others: MediaTypeResults;
  };
}

export const initialState: State = {
  q: null,
  mediaType: null,
  filters: [],
  hints: null,
  searchResult: {
    books: new MediaTypeResults(),
    newspapers: new MediaTypeResults(),
    photos: new MediaTypeResults(),
    periodicals: new MediaTypeResults(),
    others: new MediaTypeResults()
  }
};

export function reducer(state = initialState, action: SearchAction): State {
  switch (action.type) {
    case SearchActionTypes.SetQuery: {
      return {
        ...state,
        q: action.payload,
        mediaType: null
      };
    }
    case SearchActionTypes.SetMediaType: {
      return {
        ...state,
        mediaType: action.payload
      };
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
        searchResult: {
          books: action.payload.books,
          newspapers: action.payload.newspapers,
          photos: action.payload.photos,
          periodicals: action.payload.periodicals,
          others: action.payload.others
        }
      };
    }
    case SearchActionTypes.ShowMoreSuccess: {
      console.log(action.payload);
      return {
        ...state,
        searchResult: {
          books: action.payload.books,
          newspapers: action.payload.newspapers,
          photos: action.payload.photos,
          periodicals: action.payload.periodicals,
          others: action.payload.others
        }
      };
    }
    default: {
      return state;
    }
  }
}

export const getBooks = (state: State) => state.searchResult.books;
export const getNewspapers = (state: State) => state.searchResult.newspapers;
export const getPhotos = (state: State) => state.searchResult.photos;
export const getPeriodicals = (state: State) => state.searchResult.periodicals;
export const getOthers = (state: State) => state.searchResult.others;
