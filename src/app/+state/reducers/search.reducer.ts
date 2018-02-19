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
    books: new MediaTypeResults(),
    newspapers: new MediaTypeResults(),
    photos: new MediaTypeResults(),
    periodicals: new MediaTypeResults(),
    maps: new MediaTypeResults(),
    musicBooks: new MediaTypeResults(),
    musicManuscripts: new MediaTypeResults(),
    posters: new MediaTypeResults(),
    privateArchives: new MediaTypeResults(),
    programReports: new MediaTypeResults(),
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
    case SearchActionTypes.LoadMore: {
      return {
        ...state,
        isLoadingMore: true
      };
    }
    case SearchActionTypes.LoadMoreSuccess: {
      let books;
      let newspapers;
      let photos;
      let periodicals;
      let maps;
      let musicBooks;
      let musicManuscripts;
      let posters;
      let privateArchives;
      let programReports;
      let others;
      if (state.mediaType === 'bøker') {
        const items = [
          ...state.searchResult.books.items,
          ...action.payload.books.items
        ];
        books = {
          ...state.searchResult.books,
          items: items,
          nextLink: action.payload.books.nextLink
        };
      } else if (state.mediaType === 'aviser') {
        const items = [
          ...state.searchResult.newspapers.items,
          ...action.payload.newspapers.items
        ];
        newspapers = {
          ...state.searchResult.newspapers,
          items: items,
          nextLink: action.payload.newspapers.nextLink
        };
      } else if (state.mediaType === 'bilder') {
        const items = [
          ...state.searchResult.photos.items,
          ...action.payload.photos.items
        ];
        photos = {
          ...state.searchResult.photos,
          items: items,
          nextLink: action.payload.photos.nextLink
        };
      } else if (state.mediaType === 'tidsskrift') {
        const items = [
          ...state.searchResult.periodicals.items,
          ...action.payload.periodicals.items
        ];
        periodicals = {
          ...state.searchResult.periodicals,
          items: items,
          nextLink: action.payload.periodicals.nextLink
        };
      } else if (state.mediaType === 'kart') {
        const items = [
          ...state.searchResult.maps.items,
          ...action.payload.maps.items
        ];
        maps = {
          ...state.searchResult.maps,
          items: items,
          nextLink: action.payload.maps.nextLink
        };
      } else if (state.mediaType === 'noter') {
        const items = [
          ...state.searchResult.musicBooks.items,
          ...action.payload.musicBooks.items
        ];
        musicBooks = {
          ...state.searchResult.musicBooks,
          items: items,
          nextLink: action.payload.musicBooks.nextLink
        };
      } else if (state.mediaType === 'musikkmanuskripter') {
        const items = [
          ...state.searchResult.musicManuscripts.items,
          ...action.payload.musicManuscripts.items
        ];
        musicManuscripts = {
          ...state.searchResult.musicManuscripts,
          items: items,
          nextLink: action.payload.musicManuscripts.nextLink
        };
      } else if (state.mediaType === 'plakater') {
        const items = [
          ...state.searchResult.posters.items,
          ...action.payload.posters.items
        ];
        posters = {
          ...state.searchResult.posters,
          items: items,
          nextLink: action.payload.posters.nextLink
        };
      } else if (state.mediaType === 'privatarkivmateriale') {
        const items = [
          ...state.searchResult.privateArchives.items,
          ...action.payload.privateArchives.items
        ];
        privateArchives = {
          ...state.searchResult.privateArchives,
          items: items,
          nextLink: action.payload.privateArchives.nextLink
        };
      } else if (state.mediaType === 'programrapporter') {
        const items = [
          ...state.searchResult.programReports.items,
          ...action.payload.programReports.items
        ];
        programReports = {
          ...state.searchResult.programReports,
          items: items,
          nextLink: action.payload.programReports.nextLink
        };
      } else if (state.mediaType === 'others') {
        const items = [
          ...state.searchResult.others.items,
          ...action.payload.others.items
        ];
        others = {
          ...state.searchResult.others,
          items: items,
          nextLink: action.payload.others.nextLink
        };
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
