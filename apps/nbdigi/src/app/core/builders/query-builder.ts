export class QueryBuilder {
  private q: string | undefined;
  private filters: string[] = [];
  private aggs: string[] = [];
  private digitalAccessibleOnly = false;
  private mediaTypeOrder: string | undefined;
  private mediaTypeSize: number = 0;
  private mediaType: string | undefined;
  private size: number = 1;
  private sort: string | undefined;

  constructor() {}

  withQ(value: string | undefined): QueryBuilder {
    this.q = value;
    return this;
  }

  addFilter(value: string): QueryBuilder {
    if (!this.filters.includes(value)) {
      this.filters.push(value);
    }
    return this;
  }

  addAggs(value: string): QueryBuilder {
    if (!this.aggs.includes(value)) {
      this.aggs.push(value);
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

  withMediaType(value: string | undefined): QueryBuilder {
    this.mediaType = value !== 'alle' ? value : undefined;
    return this;
  }

  withSize(value: number | undefined): QueryBuilder {
    this.size = value ?? 1;
    return this;
  }

  withSort(value: string): QueryBuilder {
    this.sort = value;
    return this;
  }

  build(): string {
    const params = [];

    const qParam = this.q && this.q.length > 0 ? this.q : '-qwertyuiop';
    params.push(`q=${qParam}`);

    const filtersParams = this.filters.map(
      (f) => `filter=${encodeURIComponent(f)}`
    );
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

    if (this.mediaType) {
      params.push(`filter=mediatype:${this.mediaType}`);
    }

    if (this.sort) {
      params.push(`sort=${this.sort}`);
    }

    const aggsParams = this.aggs.map((a) => `aggs=${encodeURIComponent(a)}`);
    params.push(...aggsParams);

    return '?' + params.join('&');
  }
}
