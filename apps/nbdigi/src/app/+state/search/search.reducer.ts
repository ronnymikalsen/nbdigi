import {
  Criteria,
  Hints,
  MediaTypeResults,
  YearCount,
} from '../../core/models';
import { SearchAction, SearchActionTypes } from './search.actions';

export const SEARCH_FEATURE_KEY = 'search';

export interface SearchState {
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
    years: YearCount[];
    months: YearCount[];
  };
  isLoading: boolean;
  isLoadingMore: boolean;
  hasError: boolean;
  currentChartRange: string;
}

export interface SearchPartialState {
  readonly [SEARCH_FEATURE_KEY]: SearchState;
}

export const initialState: SearchState = {
  criteria: new Criteria(),
  hints: new Hints(),
  searchResult: {
    selfLink: '',
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
      mediaType: 'privatarkivmateriale',
    }),
    programReports: new MediaTypeResults({ mediaType: 'programrapporter' }),
    others: new MediaTypeResults(),
    years: [],
    months: [],
  },
  isLoading: false,
  isLoadingMore: false,
  hasError: false,
  currentChartRange: '',
};

export function searchReducer(
  state: SearchState = initialState,
  action: SearchAction,
): SearchState {
  switch (action.type) {
    case SearchActionTypes.ClearAll: {
      state = {
        ...initialState,
      };
      break;
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
      if (action.payload.date) {
        newCriteria.date = action.payload.date;
      }
      if (action.payload.filters) {
        newCriteria.filters = [...action.payload.filters];
      }

      state = {
        ...state,
        criteria: new Criteria({
          q: newCriteria.q,
          mediaType: newCriteria.mediaType,
          sort: newCriteria.sort,
          genre: newCriteria.genre,
          date: newCriteria.date,
          filters: newCriteria.filters,
        }),
      };
      break;
    }
    case SearchActionTypes.SetCriteria: {
      state = {
        ...state,
        criteria: new Criteria({
          q: action.payload.q,
          mediaType: action.payload.mediaType,
          sort: action.payload.sort,
          genre: action.payload.genre,
          date: action.payload.date,
          filters: action.payload.filters,
        }),
      };
      break;
    }
    case SearchActionTypes.SetDateCriteriaConfirmed: {
      state = {
        ...state,
        criteria: {
          ...state.criteria,
          date: action.payload,
        },
      };
      break;
    }
    case SearchActionTypes.Search: {
      state = {
        ...state,
        isLoading: true,
      };
      break;
    }
    case SearchActionTypes.HintsLoaded: {
      state = { ...state, hints: action.payload };
      break;
    }
    case SearchActionTypes.AddFilter: {
      state = {
        ...state,
        criteria: {
          ...state.criteria,
          filters: [...state.criteria.filters, action.payload],
        },
        isLoading: true,
      };
      break;
    }
    case SearchActionTypes.RemoveFilter: {
      state = {
        ...state,
        criteria: {
          ...state.criteria,
          filters: state.criteria.filters.filter((f) => f !== action.payload),
        },
        isLoading: true,
      };
      break;
    }
    case SearchActionTypes.ToggleFilter: {
      const index = state.criteria.filters.findIndex(
        (f) => f === action.payload,
      );
      state = {
        ...state,
        criteria: {
          ...state.criteria,
          filters: state.criteria.filters.map((f, i) => {
            return i !== index ? f : { ...f, enabled: !f.enabled };
          }),
        },
        isLoading: true,
      };
      break;
    }
    case SearchActionTypes.SearchSuccess: {
      state = {
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
          others: action.payload.others,
          years: action.payload.years,
          months: action.payload.months,
        },
        hasError: false,
        isLoading: false,
      };
      break;
    }
    case SearchActionTypes.SearchError: {
      state = {
        ...state,
        hasError: true,
        isLoading: false,
        isLoadingMore: false,
      };
      break;
    }
    case SearchActionTypes.SearchAggsSuccess: {
      const years =
        state.criteria.mediaType === 'alle'
          ? [...action.payload.years]
          : [...state.searchResult.years];
      const months =
        state.criteria.mediaType === 'alle'
          ? [...action.payload.months]
          : [...state.searchResult.months];
      state = {
        ...state,
        searchResult: {
          selfLink: state.searchResult.selfLink,
          totalElements: action.payload.totalElements,
          books: {
            ...state.searchResult.books,
            counts: action.payload.books.counts,
          },
          newspapers: {
            ...state.searchResult.newspapers,
            counts: action.payload.newspapers.counts,
          },
          photos: {
            ...state.searchResult.photos,
            counts: action.payload.photos.counts,
          },
          periodicals: {
            ...state.searchResult.periodicals,
            counts: action.payload.periodicals.counts,
          },
          maps: {
            ...state.searchResult.maps,
            counts: action.payload.maps.counts,
          },
          musicBooks: {
            ...state.searchResult.musicBooks,
            counts: action.payload.musicBooks.counts,
          },
          musicManuscripts: {
            ...state.searchResult.musicManuscripts,
            counts: action.payload.musicManuscripts.counts,
          },
          posters: {
            ...state.searchResult.posters,
            counts: action.payload.posters.counts,
          },
          privateArchives: {
            ...state.searchResult.privateArchives,
            counts: action.payload.privateArchives.counts,
          },
          programReports: {
            ...state.searchResult.programReports,
            counts: action.payload.programReports.counts,
          },
          others: { ...state.searchResult.others },
          years: years,
          months: months,
        },
      };
      break;
    }
    case SearchActionTypes.LoadMore: {
      state = {
        ...state,
        isLoadingMore: true,
      };
      break;
    }
    case SearchActionTypes.ToChartRange: {
      state = {
        ...state,
        currentChartRange: action.payload.to,
      };
      break;
    }
    case SearchActionTypes.SetCurrentChartRange: {
      state = {
        ...state,
        currentChartRange: action.payload,
      };
      break;
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
      const years = [...state.searchResult.years];
      const months = [...state.searchResult.months];
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
          ...action.payload.periodicals.items,
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
          ...action.payload.musicManuscripts.items,
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
          ...action.payload.privateArchives.items,
        ];
        privateArchives.items = items;
        privateArchives.nextLink = action.payload.privateArchives.nextLink;
      } else if (state.criteria.mediaType === 'programrapporter') {
        const items = [
          ...programReports.items,
          ...action.payload.programReports.items,
        ];
        programReports.items = items;
        programReports.nextLink = action.payload.programReports.nextLink;
      } else if (state.criteria.mediaType === 'others') {
        const items = [...others.items, ...action.payload.others.items];
        others.items = items;
        others.nextLink = action.payload.others.nextLink;
      }

      state = {
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
          others: others,
          years: years,
          months: months,
        },
        isLoadingMore: false,
        hasError: false,
      };
      break;
    }
  }
  return state;
}
