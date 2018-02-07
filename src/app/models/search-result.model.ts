export class SuperSearchResult {
  public books = new MediaTypeResults();

  constructor(fields?: { books?: MediaTypeResults }) {
    if (fields) {
      this.books = fields.books || this.books;
    }
  }
}

export class MediaTypeResults {
  public totalElements = 0;
  public items: Item[] = [];

  constructor(fields?: { totalElements?: number }) {
    if (fields) {
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

  constructor(fields?: { title?: string; creator?: string, issued?: string, thumbnail?: string }) {
    if (fields) {
      this.title = fields.title || this.title;
      this.creator = fields.creator || this.creator;
      this.issued = fields.issued || this.issued;
      this.thumbnail = fields.thumbnail || this.thumbnail;
    }
  }
}
