import { map } from 'rxjs/operators/map';

import { HomeAction, HomeActionTypes } from './../actions/home.actions';
import { MediaTypeResults } from '../../models/search-result.model';

export interface State {
  books: MediaTypeResults;
  periodicals: MediaTypeResults;
  photos: MediaTypeResults;
}

export const initialState: State = {
  books: null,
  periodicals: null,
  photos: null
};

export function reducer(state = initialState, action: HomeAction): State {
  switch (action.type) {
    case HomeActionTypes.LoadNewBooksSuccess: {
      return {
        ...state,
        books: action.payload
      };
    }
    case HomeActionTypes.LoadNewPeriodicalsSuccess: {
      return {
        ...state,
        periodicals: action.payload
      };
    }
    case HomeActionTypes.LoadNewPhotosSuccess: {
      return {
        ...state,
        photos: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

export const getNewBooks = (state: State) => state.books;
export const getNewPeriodicals = (state: State) => state.periodicals;
export const getNewPhotos = (state: State) => state.photos;
