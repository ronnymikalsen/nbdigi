import * as firebase from 'firebase/app';
import { Md5 } from 'ts-md5';
import { Hint } from './hints.model';
import { DateOption, DateOptions } from './date-options';
import { Genre } from './genre-options.model';
import { Sort, SortOptions } from './sort-options';

export class Criteria {
  q? = '';
  mediaType? = 'alle';
  filters?: Hint[] = [];
  genre?: Genre;
  date? = new DateOptions().anytime;
  sort?: Sort = new SortOptions().relevance;
  timestamp?: firebase.firestore.FieldValue;
  hash?: string = null;

  constructor(fields?: {
    q?: string;
    mediaType?: string;
    filters?: Hint[];
    genre?: Genre;
    date?: DateOption;
    sort?: Sort;
    timestamp?: firebase.firestore.FieldValue;
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
            this.filters.join()
        )
      );
    }
  }
}
