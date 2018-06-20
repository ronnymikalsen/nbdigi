import { map } from 'rxjs/operators';

import { Criteria } from './../../models/criteria';
import { MediaTypeCount } from './../../models/media-types-count';
import { Hints, Hint } from './../../core/typeahead-service/hints.model';
import {
  SearchAction,
  SearchActionTypes,
  SearchError
} from './../actions/search.actions';
import {
  SuperSearchResult,
  MediaTypeResults
} from '../../models/search-result.model';
import { LinkResponse } from '../../models/items-response.model';

export interface State {
  criteria: Criteria;
  hints: Hints;
  searchResult: {
    selfLink: string;
    totalElements: number;
    books: MediaTypeResults;
    newspapers: MediaTypeResults;
    photos: MediaTypeResults;
    periodicals: MediaTypeResults;
    maps: MediaTypeResults;
    musicBooks: MediaTypeResults;
    musicManuscripts: MediaTypeResults;
    posters: MediaTypeResults;
    privateArchives: MediaTypeResults;
    programReports: MediaTypeResults;
    others: MediaTypeResults;
  };
  isLoading: boolean;
  isLoadingMore: boolean;
  hasError: boolean;
}

export const initialState: State = {
  criteria: new Criteria(),
  hints: null,
  searchResult: {
    selfLink: null,
    totalElements: 0,
    books: new MediaTypeResults({ mediaType: 'bøker' }),
    newspapers: new MediaTypeResults({ mediaType: 'bilder' }),
    photos: new MediaTypeResults({ mediaType: 'aviser' }),
    periodicals: new MediaTypeResults({ mediaType: 'tidsskrift' }),
    maps: new MediaTypeResults({ mediaType: 'kart' }),
    musicBooks: new MediaTypeResults({ mediaType: 'noter' }),
    musicManuscripts: new MediaTypeResults({ mediaType: 'musikkmanuskripter' }),
    posters: new MediaTypeResults({ mediaType: 'plakater' }),
    privateArchives: new MediaTypeResults({
      mediaType: 'privatarkivmateriale'
    }),
    programReports: new MediaTypeResults({ mediaType: 'programrapporter' }),
    others: new MediaTypeResults()
  },
  isLoading: false,
  isLoadingMore: false,
  hasError: false
};

export function reducer(state = initialState, action: SearchAction): State {
  switch (action.type) {
    case SearchActionTypes.ClearAll: {
      return {
        ...initialState
      };
    }
    case SearchActionTypes.UpdateCriteria: {
      const newCriteria = { ...state.criteria };
      if (action.payload.q) {
        newCriteria.q = action.payload.q;
      }
      if (action.payload.mediaType) {
        newCriteria.mediaType = action.payload.mediaType;
      }
      if (action.payload.sort) {
        newCriteria.sort = action.payload.sort;
      }
      if (action.payload.genre) {
        newCriteria.genre = action.payload.genre;
      }
      if (action.payload.filters) {
        newCriteria.filters = [...action.payload.filters];
      }

      return {
        ...state,
        criteria: new Criteria({
          q: newCriteria.q,
          mediaType: newCriteria.mediaType,
          sort: newCriteria.sort,
          genre: newCriteria.genre,
          filters: newCriteria.filters
        })
      };
    }
    case SearchActionTypes.SetCriteria: {
      return {
        ...state,
        criteria: new Criteria({
          q: action.payload.q,
          mediaType: action.payload.mediaType,
          sort: action.payload.sort,
          genre: action.payload.genre,
          filters: action.payload.filters
        })
      };
    }
    case SearchActionTypes.Search: {
      return {
        ...state,
        isLoading: true
      };
    }
    case SearchActionTypes.HintsLoaded: {
      return { ...state, hints: action.payload };
    }
    case SearchActionTypes.AddFilter: {
      return {
        ...state,
        criteria: new Criteria({
          ...state.criteria,
          filters: [...state.criteria.filters, action.payload]
        }),
        isLoading: true
      };
    }
    case SearchActionTypes.RemoveFilter: {
      return {
        ...state,
        criteria: new Criteria({
          ...state.criteria,
          filters: state.criteria.filters.filter(f => f !== action.payload)
        }),
        isLoading: true
      };
    }
    case SearchActionTypes.ToggleFilter: {
      const index = state.criteria.filters.findIndex(f => f === action.payload);
      return {
        ...state,
        criteria: new Criteria({
          ...state.criteria,
          filters: state.criteria.filters.map((f, i) => {
            return i !== index ? f : { ...f, enabled: !f.enabled };
          })
        }),
        isLoading: true
      };
    }
    case SearchActionTypes.SearchSuccess: {
      return {
        ...state,
        searchResult: {
          selfLink: action.payload.selfLink,
          totalElements: state.searchResult.totalElements,
          books: action.payload.books,
          newspapers: action.payload.newspapers,
          photos: action.payload.photos,
          periodicals: action.payload.periodicals,
          maps: action.payload.maps,
          musicBooks: action.payload.musicBooks,
          musicManuscripts: action.payload.musicManuscripts,
          posters: action.payload.posters,
          privateArchives: action.payload.privateArchives,
          programReports: action.payload.programReports,
          others: action.payload.others
        },
        hasError: false,
        isLoading: false
      };
    }
    case SearchActionTypes.SearchError: {
      console.log(action.payload);
      return {
        ...state,
        hasError: true,
        isLoading: false,
        isLoadingMore: false
      };
    }
    case SearchActionTypes.SearchAggsSuccess: {
      return {
        ...state,
        searchResult: {
          selfLink: state.searchResult.selfLink,
          totalElements: action.payload.totalElements,
          books: {
            ...state.searchResult.books,
            counts: action.payload.books.counts
          },
          newspapers: {
            ...state.searchResult.newspapers,
            counts: action.payload.newspapers.counts
          },
          photos: {
            ...state.searchResult.photos,
            counts: action.payload.photos.counts
          },
          periodicals: {
            ...state.searchResult.periodicals,
            counts: action.payload.periodicals.counts
          },
          maps: {
            ...state.searchResult.maps,
            counts: action.payload.maps.counts
          },
          musicBooks: {
            ...state.searchResult.musicBooks,
            counts: action.payload.musicBooks.counts
          },
          musicManuscripts: {
            ...state.searchResult.musicManuscripts,
            counts: action.payload.musicManuscripts.counts
          },
          posters: {
            ...state.searchResult.posters,
            counts: action.payload.posters.counts
          },
          privateArchives: {
            ...state.searchResult.privateArchives,
            counts: action.payload.privateArchives.counts
          },
          programReports: {
            ...state.searchResult.programReports,
            counts: action.payload.programReports.counts
          },
          others: { ...state.searchResult.others }
        }
      };
    }
    case SearchActionTypes.LoadMore: {
      return {
        ...state,
        isLoadingMore: true
      };
    }
    case SearchActionTypes.LoadMoreSuccess: {
      const books = { ...state.searchResult.books };
      const newspapers = { ...state.searchResult.newspapers };
      const photos = { ...state.searchResult.photos };
      const periodicals = { ...state.searchResult.periodicals };
      const maps = { ...state.searchResult.maps };
      const musicBooks = { ...state.searchResult.musicBooks };
      const musicManuscripts = { ...state.searchResult.musicManuscripts };
      const posters = { ...state.searchResult.posters };
      const privateArchives = { ...state.searchResult.privateArchives };
      const programReports = { ...state.searchResult.programReports };
      const others = { ...state.searchResult.others };
      if (state.criteria.mediaType === 'bøker') {
        const items = [...books.items, ...action.payload.books.items];
        books.items = items;
        books.nextLink = action.payload.books.nextLink;
      } else if (state.criteria.mediaType === 'aviser') {
        const items = [...newspapers.items, ...action.payload.newspapers.items];
        newspapers.items = items;
        newspapers.nextLink = action.payload.newspapers.nextLink;
      } else if (state.criteria.mediaType === 'bilder') {
        const items = [...photos.items, ...action.payload.photos.items];
        photos.items = items;
        photos.nextLink = action.payload.photos.nextLink;
      } else if (state.criteria.mediaType === 'tidsskrift') {
        const items = [
          ...periodicals.items,
          ...action.payload.periodicals.items
        ];
        periodicals.items = items;
        periodicals.nextLink = action.payload.periodicals.nextLink;
      } else if (state.criteria.mediaType === 'kart') {
        const items = [...maps.items, ...action.payload.maps.items];
        maps.items = items;
        maps.nextLink = action.payload.maps.nextLink;
      } else if (state.criteria.mediaType === 'noter') {
        const items = [...musicBooks.items, ...action.payload.musicBooks.items];
        musicBooks.items = items;
        musicBooks.nextLink = action.payload.musicBooks.nextLink;
      } else if (state.criteria.mediaType === 'musikkmanuskripter') {
        const items = [
          ...musicManuscripts.items,
          ...action.payload.musicManuscripts.items
        ];
        musicManuscripts.items = items;
        musicManuscripts.nextLink = action.payload.musicManuscripts.nextLink;
      } else if (state.criteria.mediaType === 'plakater') {
        const items = [...posters.items, ...action.payload.posters.items];
        posters.items = items;
        posters.nextLink = action.payload.posters.nextLink;
      } else if (state.criteria.mediaType === 'privatarkivmateriale') {
        const items = [
          ...privateArchives.items,
          ...action.payload.privateArchives.items
        ];
        privateArchives.items = items;
        privateArchives.nextLink = action.payload.privateArchives.nextLink;
      } else if (state.criteria.mediaType === 'programrapporter') {
        const items = [
          ...programReports.items,
          ...action.payload.programReports.items
        ];
        programReports.items = items;
        programReports.nextLink = action.payload.programReports.nextLink;
      } else if (state.criteria.mediaType === 'others') {
        const items = [...others.items, ...action.payload.others.items];
        others.items = items;
        others.nextLink = action.payload.others.nextLink;
      }

      return {
        ...state,
        searchResult: {
          ...state.searchResult,
          books: books,
          newspapers: newspapers,
          photos: photos,
          periodicals: periodicals,
          maps: maps,
          musicBooks: musicBooks,
          musicManuscripts: musicManuscripts,
          posters: posters,
          privateArchives: privateArchives,
          programReports: programReports,
          others: others
        },
        isLoadingMore: false,
        hasError: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getQ = (state: State) => state.criteria.q;
export const getCriteria = (state: State) => state.criteria;
export const getBooks = (state: State) => state.searchResult.books;
export const getNewspapers = (state: State) => state.searchResult.newspapers;
export const getPhotos = (state: State) => state.searchResult.photos;
export const getPeriodicals = (state: State) => state.searchResult.periodicals;
export const getMaps = (state: State) => state.searchResult.maps;
export const getMusicBooks = (state: State) => state.searchResult.musicBooks;
export const getMusicManuscripts = (state: State) =>
  state.searchResult.musicManuscripts;
export const getPosters = (state: State) => state.searchResult.posters;
export const getPrivateArchives = (state: State) =>
  state.searchResult.privateArchives;
export const getProgramReports = (state: State) =>
  state.searchResult.programReports;
export const getOthers = (state: State) => state.searchResult.others;

export const getMoreUrl = (state: State) => {
  let url: string;
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
};

export const getCurrentMediaTypeCount = (state: State) => {
  let counts: number;
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
};

export const pristine = (state: State) => {
  return (
    state.criteria.q === initialState.criteria.q &&
    state.criteria.mediaType === initialState.criteria.mediaType &&
    state.criteria.filters === initialState.criteria.filters &&
    state.criteria.genre === initialState.criteria.genre &&
    state.criteria.sort === initialState.criteria.sort
  );
};
