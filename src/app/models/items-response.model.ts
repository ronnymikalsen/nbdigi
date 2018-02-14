export interface ItemsResponse {
  _links: MediaTypeResultsLinksResponse;
  page: PageResponse;
  _embedded: EmbeddetResponse;
}

export interface MediaTypeResultsLinksResponse {
  next: LinkResponse;
}

export interface PageResponse {
  totalElements: number;
}

export interface EmbeddetResponse {
  mediaTypeResults: MediaTypeResponse[];
  items: ItemResponse[];
}

export interface MediaTypeResponse {
  mediaType: string;
  result: ItemsResponse;
}

export interface ItemResponse {
  _links: ItemsLinksResponse;
  metadata: MetadataResponse;
}

export interface ItemsLinksResponse {
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
}

export interface OriginInfoResponse {
  issued: string;
}
