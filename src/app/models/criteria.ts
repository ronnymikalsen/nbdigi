import { filter } from 'rxjs/operators';
import { Md5 } from 'ts-md5/dist/md5';

import { Hint } from './../core/typeahead-service/hints.model';
import { Sort, SortOptions } from './sort-options';

export class Criteria {
  q? = '';
  mediaType?: string = null;
  filters?: Hint[] = [];
  sort?: Sort = new SortOptions().relevance;
  timestamp?: Date;
  hash?: string = null;

  constructor(fields?: {
    q?: string;
    mediaType?: string;
    filters?: Hint[];
    sort?: Sort;
    timestamp?: Date;
    hash?: string;
  }) {
    if (fields) {
      this.q = fields.q || this.q;
      this.mediaType = fields.mediaType || this.mediaType;
      this.filters =
        fields.filters !== undefined ? fields.filters : this.filters;
      this.sort = fields.sort || this.sort;
      this.timestamp = fields.timestamp || this.timestamp;

      this.hash = <string>Md5.hashStr(
        this.q + this.sort.value + this.mediaType + this.filters.join()
      );
    }
  }
}
