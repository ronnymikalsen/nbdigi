import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  SEARCH_FEATURE_KEY,
  SearchState,
  initialState,
} from './search.reducer';

const getSearchState = createFeatureSelector<SearchState>(SEARCH_FEATURE_KEY);

const getQ = createSelector(
  getSearchState,
  (state: SearchState) => state.criteria.q
);
const getCriteria = createSelector(
  getSearchState,
  (state: SearchState) => state.criteria
);
const getBooks = createSelector(
  getSearchState,
  (state: SearchState) => state.searchResult.books
);
const getNewspapers = createSelector(
  getSearchState,
  (state: SearchState) => state.searchResult.newspapers
);
const getPhotos = createSelector(
  getSearchState,
  (state: SearchState) => state.searchResult.photos
);
const getPeriodicals = createSelector(
  getSearchState,
  (state: SearchState) => state.searchResult.periodicals
);
const getMaps = createSelector(
  getSearchState,
  (state: SearchState) => state.searchResult.maps
);
const getMusicBooks = createSelector(
  getSearchState,
  (state: SearchState) => state.searchResult.musicBooks
);
const getMusicManuscripts = createSelector(
  getSearchState,
  (state: SearchState) => state.searchResult.musicManuscripts
);
const getPosters = createSelector(
  getSearchState,
  (state: SearchState) => state.searchResult.posters
);
const getPrivateArchives = createSelector(
  getSearchState,
  (state: SearchState) => state.searchResult.privateArchives
);
const getProgramReports = createSelector(
  getSearchState,
  (state: SearchState) => state.searchResult.programReports
);
const getOthers = createSelector(
  getSearchState,
  (state: SearchState) => state.searchResult.others
);

const getMoreUrl = createSelector(getSearchState, (state: SearchState) => {
  let url: string | null | undefined = '';
  if (state.criteria.mediaType === 'bøker') {
    url = state.searchResult.books.nextLink;
  } else if (state.criteria.mediaType === 'bilder') {
    url = state.searchResult.photos.nextLink;
  } else if (state.criteria.mediaType === 'aviser') {
    url = state.searchResult.newspapers.nextLink;
  } else if (state.criteria.mediaType === 'tidsskrift') {
    url = state.searchResult.periodicals.nextLink;
  } else if (state.criteria.mediaType === 'kart') {
    url = state.searchResult.maps.nextLink;
  } else if (state.criteria.mediaType === 'noter') {
    url = state.searchResult.musicBooks.nextLink;
  } else if (state.criteria.mediaType === 'musikkmanuskripter') {
    url = state.searchResult.musicManuscripts.nextLink;
  } else if (state.criteria.mediaType === 'plakater') {
    url = state.searchResult.posters.nextLink;
  } else if (state.criteria.mediaType === 'privatarkivmateriale') {
    url = state.searchResult.privateArchives.nextLink;
  } else if (state.criteria.mediaType === 'programrapporter') {
    url = state.searchResult.programReports.nextLink;
  } else if (state.criteria.mediaType === 'others') {
    url = state.searchResult.others.nextLink;
  }

  return url;
});

const getCurrentMediaTypeCount = createSelector(
  getSearchState,
  (state: SearchState) => {
    let counts: number = 0;
    if (state.criteria.mediaType === 'alle') {
      counts = state.searchResult.totalElements;
    } else if (state.criteria.mediaType === 'bøker') {
      counts = state.searchResult.books.counts;
    } else if (state.criteria.mediaType === 'bilder') {
      counts = state.searchResult.photos.counts;
    } else if (state.criteria.mediaType === 'aviser') {
      counts = state.searchResult.newspapers.counts;
    } else if (state.criteria.mediaType === 'tidsskrift') {
      counts = state.searchResult.periodicals.counts;
    } else if (state.criteria.mediaType === 'kart') {
      counts = state.searchResult.maps.counts;
    } else if (state.criteria.mediaType === 'noter') {
      counts = state.searchResult.musicBooks.counts;
    } else if (state.criteria.mediaType === 'musikkmanuskripter') {
      counts = state.searchResult.musicManuscripts.counts;
    } else if (state.criteria.mediaType === 'plakater') {
      counts = state.searchResult.posters.counts;
    } else if (state.criteria.mediaType === 'privatarkivmateriale') {
      counts = state.searchResult.privateArchives.counts;
    } else if (state.criteria.mediaType === 'programrapporter') {
      counts = state.searchResult.programReports.counts;
    } else if (state.criteria.mediaType === 'others') {
      counts = state.searchResult.others.counts;
    }

    return counts;
  }
);

const getYears = createSelector(
  getSearchState,
  (state: SearchState) => state.searchResult.years
);

const getMonths = createSelector(
  getSearchState,
  (state: SearchState) => state.searchResult.months
);

const pristine = createSelector(getSearchState, (state: SearchState) => {
  return (
    state.criteria.q === initialState.criteria.q &&
    state.criteria.mediaType === initialState.criteria.mediaType &&
    state.criteria.filters === initialState.criteria.filters &&
    state.criteria.genre === initialState.criteria.genre &&
    state.criteria.date === initialState.criteria.date &&
    state.criteria.sort === initialState.criteria.sort
  );
});

export const searchQuery = {
  getSearchState,
  getQ,
  getCriteria,
  getBooks,
  getNewspapers,
  getPhotos,
  getPeriodicals,
  getMaps,
  getMusicBooks,
  getMusicManuscripts,
  getPosters,
  getPrivateArchives,
  getProgramReports,
  getOthers,
  getMoreUrl,
  getCurrentMediaTypeCount,
  getYears,
  getMonths,
  pristine,
};
