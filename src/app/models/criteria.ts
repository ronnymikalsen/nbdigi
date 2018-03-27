import { filter } from 'rxjs/operators';
import { Md5 } from 'ts-md5/dist/md5';

import { Hint } from './../core/typeahead-service/hints.model';

export class Criteria {
  q? = '';
  mediaType?: string = null;
  filters?: Hint[] = [];
  sort?: string = null;
  timestamp?: Date;
  hash?: string = null;

  constructor(fields?: {
    q?: string;
    mediaType?: string;
    filters?: Hint[];
    sort?: string;
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
        this.q + this.sort + this.mediaType + this.filters.join()
      );
    }
  }
}
