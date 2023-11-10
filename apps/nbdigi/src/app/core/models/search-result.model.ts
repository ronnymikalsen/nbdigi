import firebase from 'firebase/app';
import { YearCount } from './year-count';
import { Timestamp } from 'firebase/firestore';
export class SuperSearchResult {
  totalElements = 0;
  selfLink: string = '';
  public books = new MediaTypeResults({
    mediaType: 'bøker',
  });
  public newspapers = new MediaTypeResults({
    mediaType: 'aviser',
  });
  public photos = new MediaTypeResults({
    mediaType: 'bilder',
  });
  public periodicals = new MediaTypeResults({
    mediaType: 'tidsskrift',
  });
  public maps = new MediaTypeResults({
    mediaType: 'kart',
  });
  public musicBooks = new MediaTypeResults({
    mediaType: 'noter',
  });
  public musicManuscripts = new MediaTypeResults({
    mediaType: 'musikkmanuskripter',
  });
  public posters = new MediaTypeResults({
    mediaType: 'plakater',
  });
  public privateArchives = new MediaTypeResults({
    mediaType: 'privatarkivmateriale',
  });
  public programReports = new MediaTypeResults({
    mediaType: 'programrapporter',
  });
  public others = new MediaTypeResults({
    mediaType: 'andre',
  });

  public years: YearCount[] = [];
  public months: YearCount[] = [];

  constructor(fields?: {
    selfLink?: null | string;
    books?: MediaTypeResults;
    newspapers?: MediaTypeResults;
    photos?: MediaTypeResults;
    periodicals?: MediaTypeResults;
    maps?: MediaTypeResults;
    musicBooks?: MediaTypeResults;
    musicManuscripts?: MediaTypeResults;
    posters?: MediaTypeResults;
    privateArchives?: MediaTypeResults;
    programReports?: MediaTypeResults;
    others?: MediaTypeResults;
    years?: YearCount[];
    months?: YearCount[];
  }) {
    if (fields) {
      this.selfLink = fields.selfLink || this.selfLink;
      this.books = fields.books || this.books;
      this.newspapers = fields.newspapers || this.newspapers;
      this.photos = fields.photos || this.photos;
      this.periodicals = fields.periodicals || this.periodicals;
      this.maps = fields.maps || this.maps;
      this.musicBooks = fields.musicBooks || this.musicBooks;
      this.musicManuscripts = fields.musicManuscripts || this.musicManuscripts;
      this.posters = fields.posters || this.posters;
      this.privateArchives = fields.privateArchives || this.privateArchives;
      this.programReports = fields.programReports || this.programReports;
      this.others = fields.others || this.others;
      this.years = fields.years || this.years;
      this.months = fields.months || this.months;
    }
  }
}

export class MediaTypeResults {
  public mediaType: null | string | undefined = null;
  public totalElements = 0;
  public counts = 0;
  public selfLink?: null | string | undefined = null;
  public nextLink?: null | string = null;
  public items: Item[] = [];

  constructor(fields?: {
    mediaType?: string;
    totalElements?: number;
    counts?: number;
    selfLink?: string;
    nextLink?: string;
    items?: Item[];
  }) {
    if (fields) {
      this.mediaType = fields.mediaType || this.mediaType;
      this.totalElements = fields.totalElements || this.totalElements;
      this.counts = fields.counts || this.counts;
      this.selfLink = fields.selfLink || this.selfLink;
      this.nextLink = fields.nextLink || this.nextLink;
      this.items = fields.items || this.items;
    }
  }
}

export class Item {
  public id: null | string = null;
  public mediaType: null | string = null;
  public title: string = '';
  public creator: string = '';
  public issued: string = '';
  public thumbnail: string = '';
  public manifestUri: null | string = null;
  public currentCanvasId = 0;
  public timestamp: Timestamp | null = null;
  public selfLink?: null | string = null;
  public urn: null | string = null;
  public oaiId: null | string = null;

  constructor(fields?: {
    id?: string;
    mediaType?: string | null;
    title?: string;
    creator?: string | null;
    issued?: string | null;
    thumbnail?: string | null;
    manifestUri?: string | null;
    currentCanvasId?: number;
    timestamp?: Timestamp;
    selfLink?: null | string;
    urn?: string | null;
    oaiId?: string | null;
  }) {
    if (fields) {
      this.id = fields.id || this.id;
      this.mediaType = fields.mediaType || this.mediaType;
      this.title = fields.title || this.title;
      this.creator = fields.creator || this.creator;
      this.issued = fields.issued || this.issued;
      this.thumbnail = fields.thumbnail || this.thumbnail;
      this.manifestUri = fields.manifestUri || this.manifestUri;
      this.currentCanvasId = fields.currentCanvasId || this.currentCanvasId;
      this.timestamp = fields.timestamp || this.timestamp;
      this.selfLink = fields.selfLink || this.selfLink;
      this.urn = fields.urn || this.urn;
      this.oaiId = fields.oaiId || this.oaiId;
    }
  }
}
