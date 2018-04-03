import { Sort } from './sort-options';

export class SearchCriteria {
  q?: string;
  mediaType?: string;
  size?: number;
  filters?: string[] = [];
  sort: Sort;
}
