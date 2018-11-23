import { MediaTypeResults } from '@nbdigi/data-models';
import { HomeAction, HomeActionTypes } from './home.actions';

export const HOME_FEATURE_KEY = 'home';

export interface HomeState {
  books: MediaTypeResults;
  periodicals: MediaTypeResults;
  photos: MediaTypeResults;
  newspapers: MediaTypeResults;
  others: MediaTypeResults;
}

export interface HomePartialState {
  readonly [HOME_FEATURE_KEY]: HomeState;
}

export const initialState: HomeState = {
  books: null,
  periodicals: null,
  photos: null,
  newspapers: null,
  others: null
};

export function homeReducer(
  state: HomeState = initialState,
  action: HomeAction
): HomeState {
  switch (action.type) {
    case HomeActionTypes.LoadNewItemsSuccess: {
      state = {
        ...state,
        books: action.payload.books,
        periodicals: action.payload.periodicals,
        photos: action.payload.photos,
        newspapers: action.payload.newspapers,
        others: action.payload.others
      };
      break;
    }
  }
  return state;
}
