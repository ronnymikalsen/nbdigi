import { map } from 'rxjs/operators/map';
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

export interface State {
  q: string;
  mediaType: string;
  filters: Hint[];
  hints: Hints;
  searchResult: {
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
  q: null,
  mediaType: null,
  filters: [],
  hints: null,
  searchResult: {
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
    case SearchActionTypes.SetQuery: {
      return {
        ...state,
        q: action.payload,
        mediaType: null
      };
    }
    case SearchActionTypes.Search: {
      return {
        ...state,
        isLoading: true
      };
    }
    case SearchActionTypes.SetMediaType: {
      return {
        ...state,
        mediaType: action.payload,
        isLoading: true
      };
    }
    case SearchActionTypes.HintsLoaded: {
      return { ...state, hints: action.payload };
    }
    case SearchActionTypes.AddFilter: {
      return {
        ...state,
        filters: [...state.filters, action.payload],
        isLoading: true
      };
    }
    case SearchActionTypes.RemoveFilter: {
      return {
        ...state,
        filters: state.filters.filter(f => f !== action.payload),
        isLoading: true
      };
    }
    case SearchActionTypes.ToggleFilter: {
      const index = state.filters.findIndex(f => f === action.payload);
      return {
        ...state,
        filters: state.filters.map((f, i) => {
          return i !== index ? f : { ...f, enabled: !f.enabled };
        }),
        isLoading: true
      };
    }
    case SearchActionTypes.SearchSuccess: {
      return {
        ...state,
        searchResult: {
          totalElements: action.payload.totalElements,
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
          totalElements: state.searchResult.totalElements,
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
      if (state.mediaType === 'bøker') {
        const items = [...books.items, ...action.payload.books.items];
        books.items = items;
        books.nextLink = action.payload.books.nextLink;
      } else if (state.mediaType === 'aviser') {
        const items = [...newspapers.items, ...action.payload.newspapers.items];
        newspapers.items = items;
        newspapers.nextLink = action.payload.newspapers.nextLink;
      } else if (state.mediaType === 'bilder') {
        const items = [...photos.items, ...action.payload.photos.items];
        photos.items = items;
        photos.nextLink = action.payload.photos.nextLink;
      } else if (state.mediaType === 'tidsskrift') {
        const items = [
          ...periodicals.items,
          ...action.payload.periodicals.items
        ];
        periodicals.items = items;
        periodicals.nextLink = action.payload.periodicals.nextLink;
      } else if (state.mediaType === 'kart') {
        const items = [...maps.items, ...action.payload.maps.items];
        maps.items = items;
        maps.nextLink = action.payload.maps.nextLink;
      } else if (state.mediaType === 'noter') {
        const items = [...musicBooks.items, ...action.payload.musicBooks.items];
        musicBooks.items = items;
        musicBooks.nextLink = action.payload.musicBooks.nextLink;
      } else if (state.mediaType === 'musikkmanuskripter') {
        const items = [
          ...musicManuscripts.items,
          ...action.payload.musicManuscripts.items
        ];
        musicManuscripts.items = items;
        musicManuscripts.nextLink = action.payload.musicManuscripts.nextLink;
      } else if (state.mediaType === 'plakater') {
        const items = [...posters.items, ...action.payload.posters.items];
        posters.items = items;
        posters.nextLink = action.payload.posters.nextLink;
      } else if (state.mediaType === 'privatarkivmateriale') {
        const items = [
          ...privateArchives.items,
          ...action.payload.privateArchives.items
        ];
        privateArchives.items = items;
        privateArchives.nextLink = action.payload.privateArchives.nextLink;
      } else if (state.mediaType === 'programrapporter') {
        const items = [
          ...programReports.items,
          ...action.payload.programReports.items
        ];
        programReports.items = items;
        programReports.nextLink = action.payload.programReports.nextLink;
      } else if (state.mediaType === 'others') {
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
  if (state.mediaType === 'bøker') {
    url = state.searchResult.books.nextLink;
  } else if (state.mediaType === 'bilder') {
    url = state.searchResult.photos.nextLink;
  } else if (state.mediaType === 'aviser') {
    url = state.searchResult.newspapers.nextLink;
  } else if (state.mediaType === 'tidsskrift') {
    url = state.searchResult.periodicals.nextLink;
  } else if (state.mediaType === 'kart') {
    url = state.searchResult.maps.nextLink;
  } else if (state.mediaType === 'noter') {
    url = state.searchResult.musicBooks.nextLink;
  } else if (state.mediaType === 'musikkmanuskripter') {
    url = state.searchResult.musicManuscripts.nextLink;
  } else if (state.mediaType === 'plakater') {
    url = state.searchResult.posters.nextLink;
  } else if (state.mediaType === 'privatarkivmateriale') {
    url = state.searchResult.privateArchives.nextLink;
  } else if (state.mediaType === 'programrapporter') {
    url = state.searchResult.programReports.nextLink;
  } else if (state.mediaType === 'others') {
    url = state.searchResult.others.nextLink;
  }

  return url;
};

export const pristine = (state: State) => {
  return (
    state.q === initialState.q &&
    state.mediaType === initialState.mediaType &&
    state.filters === initialState.filters
  );
};
