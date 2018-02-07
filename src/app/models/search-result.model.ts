export class SuperSearchResult {
  public books = new MediaTypeResults();

  constructor(fields?: { books?: MediaTypeResults }) {
    if (fields) {
      this.books = fields.books || this.books;
    }
  }
}

export class MediaTypeResults {
  public items: Item[] = [];

  public addItem(item: Item) {
    this.items.push(item);
  }
}

export class Item {
  public title: string;

  constructor(fields?: { title?: string }) {
    if (fields) {
      this.title = fields.title || this.title;
    }
  }
}
