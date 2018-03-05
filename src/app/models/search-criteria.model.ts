export class SearchCriteria {
  q?: string;
  mediaType?: string;
  size?: number;
  filters?: string[] = [];
  sort: string;
}
