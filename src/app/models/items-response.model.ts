export interface ItemsResponse {
    _embedded: EmbeddetResponse;
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
    metadata: MetadataResponse;
}

export interface MetadataResponse {
    title: string;
}
