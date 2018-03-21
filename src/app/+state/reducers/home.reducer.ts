import { map } from 'rxjs/operators/map';

import { HomeAction, HomeActionTypes } from './../actions/home.actions';
import { MediaTypeResults } from '../../models/search-result.model';

export interface State {
  books: MediaTypeResults;
  periodicals: MediaTypeResults;
  photos: MediaTypeResults;
  newspapers: MediaTypeResults;
}

export const initialState: State = {
  books: null,
  periodicals: null,
  photos: null,
  newspapers: null
};

export function reducer(state = initialState, action: HomeAction): State {
  switch (action.type) {
    case HomeActionTypes.LoadNewItemsSuccess: {
      return {
        ...state,
        books: action.payload.books,
        periodicals: action.payload.periodicals,
        photos: action.payload.photos,
        newspapers: action.payload.newspapers
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
export const getNewNewspapers = (state: State) => state.newspapers;
