export interface ItemsResponse {
  page: PageResponse;
  _embedded: EmbeddetResponse;
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
  _links: LinksResponse;
  metadata: MetadataResponse;
}

export interface LinksResponse {
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
