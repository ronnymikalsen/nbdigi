import { Md5 } from 'ts-md5';
import { DateOption, DateOptions } from './date-options';
import { Genre } from './genre-options.model';
import { Hint } from './hints.model';
import { Sort, SortOptions } from './sort-options';

export class Criteria {
  q: string = '';
  mediaType: string = 'alle';
  filters: Hint[] = [];
  genre?: Genre = new Genre();
  date = new DateOptions().anytime;
  sort: Sort = new SortOptions().relevance;
  timestamp: any;
  hash: string | null = null;

  constructor(fields?: {
    q?: string;
    mediaType?: string | null;
    filters?: Hint[];
    genre?: Genre;
    date?: DateOption;
    sort?: Sort;
    timestamp?: any;
    hash?: string;
  }) {
    if (fields) {
      this.q = fields.q || this.q;
      this.mediaType = fields.mediaType || this.mediaType;
      this.filters =
        fields.filters !== undefined ? fields.filters : this.filters;
      this.genre = fields.genre || this.genre;
      this.date = fields.date || this.date;
      this.sort = fields.sort || this.sort;
      this.timestamp = fields.timestamp || this.timestamp;

      this.hash = <string>(
        Md5.hashStr(
          this.q +
            this.sort.value +
            this.date.value +
            this.mediaType +
            this.filters?.join()
        )
      );
    }
  }
}
