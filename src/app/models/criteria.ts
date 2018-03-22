import { filter } from 'rxjs/operators';
import { Hint } from './../core/typeahead-service/hints.model';

export class Criteria {
  q? = '';
  mediaType?: string;
  filters?: Hint[] = [];
  sort?: string;
  timestamp?: Date;

  constructor(fields?: {
    q?: string;
    mediaType?: string;
    filters?: Hint[];
    sort?: string;
    timestamp?: Date;
  }) {
    if (fields) {
      this.q = fields.q || this.q;
      this.mediaType = fields.mediaType || this.mediaType;
      this.filters =
        fields.filters !== undefined ? fields.filters : this.filters;
      this.sort = fields.sort || this.sort;
      this.timestamp = fields.timestamp || this.timestamp;
    }
  }
}
