import { MyActivityAction, MyActivityActionTypes } from './my-activity.actions';

export const MYACTIVITY_FEATURE_KEY = 'myActivity';

/**
 * Interface for the 'MyActivity' data used in
 *  - MyActivityState, and
 *  - myActivityReducer
 *
 *  Note: replace if already defined in another module
 */

/* tslint:disable:no-empty-interface */
export interface Entity {}

export interface MyActivityState {
  list: Entity[]; // list of MyActivity; analogous to a sql normalized table
  selectedId?: string | number; // which MyActivity record has been selected
  loaded: boolean; // has the MyActivity list been loaded
  error?: any; // last none error (if any)
}

export interface MyActivityPartialState {
  readonly [MYACTIVITY_FEATURE_KEY]: MyActivityState;
}

export const initialState: MyActivityState = {
  list: [],
  loaded: false
};

export function myActivityReducer(
  state: MyActivityState = initialState,
  action: MyActivityAction
): MyActivityState {
  switch (action.type) {
    case MyActivityActionTypes.MyActivityLoaded: {
      state = {
        ...state,
        list: action.payload,
        loaded: true
      };
      break;
    }
  }
  return state;
}
