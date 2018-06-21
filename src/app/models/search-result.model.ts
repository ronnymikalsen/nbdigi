import * as firebase from 'firebase/app';
export class SuperSearchResult {
  totalElements = 0;
  selfLink: string;
  public books = new MediaTypeResults({
    mediaType: 'bøker'
  });
  public newspapers = new MediaTypeResults({
    mediaType: 'aviser'
  });
  public photos = new MediaTypeResults({
    mediaType: 'bilder'
  });
  public periodicals = new MediaTypeResults({
    mediaType: 'tidsskrift'
  });
  public maps = new MediaTypeResults({
    mediaType: 'kart'
  });
  public musicBooks = new MediaTypeResults({
    mediaType: 'noter'
  });
  public musicManuscripts = new MediaTypeResults({
    mediaType: 'musikkmanuskripter'
  });
  public posters = new MediaTypeResults({
    mediaType: 'plakater'
  });
  public privateArchives = new MediaTypeResults({
    mediaType: 'privatarkivmateriale'
  });
  public programReports = new MediaTypeResults({
    mediaType: 'programrapporter'
  });
  public others = new MediaTypeResults({
    mediaType: 'andre'
  });

  constructor(fields?: {
    selfLink?: string;
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
    }
  }
}

export class MediaTypeResults {
  public mediaType = null;
  public totalElements = 0;
  public counts = 0;
  public selfLink? = null;
  public nextLink? = null;
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
  public id: string = null;
  public mediaType: string = null;
  public title: string = null;
  public creator: string = null;
  public issued: string = null;
  public thumbnail: string = null;
  public manifestUri: string = null;
  public currentCanvasId = 0;
  public timestamp: firebase.firestore.Timestamp;
  public selfLink? = null;
  public urn: string = null;
  public oaiId: string = null;

  constructor(fields?: {
    id?: string;
    mediaType?: string;
    title?: string;
    creator?: string;
    issued?: string;
    thumbnail?: string;
    manifestUri?: string;
    currentCanvasId?: number;
    timestamp?: firebase.firestore.Timestamp;
    selfLink?: string;
    urn?: string;
    oaiId?: string;
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
