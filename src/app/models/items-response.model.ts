export interface ItemsResponse {
  totalElements: number;
  _links: MediaTypeResultsLinksResponse;
  page: PageResponse;
  _embedded: EmbeddetResponse;
}

export interface MediaTypeResultsLinksResponse {
  self: LinkResponse;
  next: LinkResponse;
}

export interface PageResponse {
  totalElements: number;
}

export interface EmbeddetResponse {
  mediaTypeResults: MediaTypeResponse[];
  items: ItemResponse[];
  aggregations: AggregationResponse[];
}

export interface MediaTypeResponse {
  mediaType: string;
  result: ItemsResponse;
}

export interface ItemResponse {
  id: string;
  _links: ItemsLinksResponse;
  metadata: MetadataResponse;
}

export interface ItemsLinksResponse {
  self: LinkResponse;
  thumbnail_custom: LinkResponse;
  presentation: LinkResponse;
}

export interface LinkResponse {
  href: string;
}

export interface MetadataResponse {
  title: string;
  creators: string[];
  originInfo: OriginInfoResponse;
  identifiers: IdentifiersResponse;
}

export interface OriginInfoResponse {
  issued: string;
}

export interface AggregationResponse {
  name: string;
  buckets: BucketResponse[];
}

export interface BucketResponse {
  key: string;
  count: number;
}

export interface IdentifiersResponse {
  sesamId: string;
  oaiId: string;
  urn: string;
}
