export class QueryBuilder {
  private apiURL: string;
  private q: string;
  private filters: string[] = [];
  private digitalAccessibleOnly = false;
  private mediaTypeOrder: string;
  private mediaTypeSize: number;
  private mediaType: string;
  private size = 1;

  constructor(apiURL: string) {
    this.apiURL = `${apiURL}/catalog/v1/`;
  }

  withQ(value: string): QueryBuilder {
    this.q = value;
    return this;
  }

  addFilter(value: string): QueryBuilder {
    if (!this.filters.includes(value)) {
      this.filters.push(value);
    }
    return this;
  }

  withDigitalAccessibleOnly(value: boolean): QueryBuilder {
    this.digitalAccessibleOnly = value;
    return this;
  }

  withMediaTypeOrder(value: string): QueryBuilder {
    this.mediaTypeOrder = value;
    return this;
  }

  withMediaTypeSize(value: number): QueryBuilder {
    this.mediaTypeSize = value;
    return this;
  }

  withMediaType(value: string): QueryBuilder {
    this.mediaType = value;
    return this;
  }

  withSize(value: number): QueryBuilder {
    this.size = value;
    return this;
  }

  build(): string {
    const params = [];

    const qParam = this.q && this.q.length >  0 ? this.q : '-qwertyuiop';
    params.push(`q=${qParam}`);

    const filtersParams = this.filters.map(f => `filter=${encodeURIComponent(f)}`);
    params.push(...filtersParams);

    params.push(`digitalAccessibleOnly=${this.digitalAccessibleOnly}`);

    if (this.mediaTypeOrder) {
      params.push(`mediaTypeOrder=${encodeURIComponent(this.mediaTypeOrder)}`);
    }

    if (this.mediaTypeSize > 0) {
      params.push(`mediaTypeSize=${this.mediaTypeSize}`);
    }

    if (this.size > 0) {
      params.push(`size=${this.size}`);
    }

    return this.apiURL +
      (this.mediaType ? 'items' : 'search') +
      '?' +
      params.join('&');
  }
}
