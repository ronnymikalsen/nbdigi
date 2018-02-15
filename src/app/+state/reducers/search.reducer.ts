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
    case SearchActionTypes.LoadMoreSuccess: {
      let books;
      let newspapers;
      let photos;
      let periodicals;
      let others;
      if (state.mediaType === 'bøker') {
        const items = [
          ...state.searchResult.books.items,
          ...action.payload.books.items
        ];
        books = { ...state.searchResult.books, items: items };
      } else if (state.mediaType === 'aviser') {
        const items = [
          ...state.searchResult.newspapers.items,
          ...action.payload.newspapers.items
        ];
        newspapers = { ...state.searchResult.newspapers, items: items };
      } else if (state.mediaType === 'bilder') {
        const items = [
          ...state.searchResult.photos.items,
          ...action.payload.photos.items
        ];
        photos = { ...state.searchResult.photos, items: items };
      } else if (state.mediaType === 'tidsskrift') {
        const items = [
          ...state.searchResult.periodicals.items,
          ...action.payload.periodicals.items
        ];
        periodicals = { ...state.searchResult.periodicals, items: items };
      } else if (state.mediaType === 'others') {
        const items = [
          ...state.searchResult.others.items,
          ...action.payload.others.items
        ];
        others = { ...state.searchResult.others, items: items };
      }

      return {
        ...state,
        searchResult: {
          ...state.searchResult,
          books: books,
          newspapers: newspapers,
          photos: photos,
          periodicals: periodicals,
          others: others
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
