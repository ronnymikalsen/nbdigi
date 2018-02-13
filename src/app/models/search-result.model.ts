export class SuperSearchResult {
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
  public others = new MediaTypeResults({
    mediaType: 'andre'
  });

  constructor(fields?: {
    books?: MediaTypeResults;
    newspapers?: MediaTypeResults;
    photos?: MediaTypeResults;
    periodicals?: MediaTypeResults;
    others?: MediaTypeResults;
  }) {
    if (fields) {
      this.books = fields.books || this.books;
      this.newspapers = fields.newspapers || this.newspapers;
      this.photos = fields.photos || this.photos;
      this.periodicals = fields.periodicals || this.periodicals;
      this.others = fields.others || this.others;
    }
  }
}

export class MediaTypeResults {
  public mediaType = null;
  public totalElements = 0;
  public items: Item[] = [];

  constructor(fields?: { mediaType?: string, totalElements?: number }) {
    if (fields) {
      this.mediaType = fields.mediaType || this.mediaType;
      this.totalElements = fields.totalElements || this.totalElements;
    }
  }

  public addItem(item: Item) {
    this.items.push(item);
  }
}

export class Item {
  public title: string;
  public creator: string;
  public issued: string;
  public thumbnail: string;
  public manifestUri: string;


  constructor(fields?: {
    title?: string;
    creator?: string;
    issued?: string;
    thumbnail?: string;
    manifestUri?: string;
  }) {
    if (fields) {
      this.title = fields.title || this.title;
      this.creator = fields.creator || this.creator;
      this.issued = fields.issued || this.issued;
      this.thumbnail = fields.thumbnail || this.thumbnail;
      this.manifestUri = fields.manifestUri || this.manifestUri;
    }
  }
}
