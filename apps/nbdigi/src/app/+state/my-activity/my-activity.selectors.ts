import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MYACTIVITY_FEATURE_KEY, MyActivityState } from './my-activity.reducer';

// Lookup the 'MyActivity' feature state managed by NgRx
const getMyActivityState = createFeatureSelector<MyActivityState>(
  MYACTIVITY_FEATURE_KEY
);

const getLoaded = createSelector(
  getMyActivityState,
  (state: MyActivityState) => state.loaded
);
const getError = createSelector(
  getMyActivityState,
  (state: MyActivityState) => state.error
);

const getAllMyActivity = createSelector(
  getMyActivityState,
  getLoaded,
  (state: MyActivityState, isLoaded) => {
    return isLoaded ? state.list : [];
  }
);
const getSelectedId = createSelector(
  getMyActivityState,
  (state: MyActivityState) => state.selectedId
);
const getSelectedMyActivity = createSelector(
  getAllMyActivity,
  getSelectedId,
  (myActivity, id) => {
    const result = myActivity.find(it => it['id'] === id);
    return result ? Object.assign({}, result) : undefined;
  }
);

export const myActivityQuery = {
  getLoaded,
  getError,
  getAllMyActivity,
  getSelectedMyActivity
};
