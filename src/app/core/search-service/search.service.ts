import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { SearchCriteria } from './../../models/search-criteria.model';
import {
  ItemsResponse,
  ItemResponse,
  MediaTypeResponse,
  BucketResponse
} from './../../models/items-response.model';
import {
  SuperSearchResult,
  Item,
  MediaTypeResults
} from './../../models/search-result.model';
import { QueryBuilder } from './query-builder';

@Injectable()
export class SearchService {
  constructor(private http: HttpClient) {}

  super(sc: SearchCriteria): Observable<SuperSearchResult> {
    let builder = new QueryBuilder(environment.nb.apiURL)
      .withQ(sc.q)
      .withSize(sc.size)
      .addFilter('contentClasses:jp2')
      .withDigitalAccessibleOnly(true)
      .withMediaTypeOrder('bøker,aviser,bilder,tidsskrift,other')
      .withMediaTypeSize(5);

    sc.filters.forEach(f => {
      builder = builder.addFilter(f);
    });

    return this.http.get<ItemsResponse>(builder.build()).pipe(
      map(resp => {
        const searchResult = new SuperSearchResult();
        const mediaTypeResponses = resp._embedded.mediaTypeResults;

        const books = this.findMediatypeResponse('bøker', mediaTypeResponses);
        if (books) {
          searchResult.books = this.extractMediaTypeResponse(books);
        }

        const newspapers = this.findMediatypeResponse(
          'aviser',
          mediaTypeResponses
        );
        if (newspapers) {
          searchResult.newspapers = this.extractMediaTypeResponse(newspapers);
        }

        const photos = this.findMediatypeResponse('bilder', mediaTypeResponses);
        if (photos) {
          searchResult.photos = this.extractMediaTypeResponse(photos);
        }

        const periodicals = this.findMediatypeResponse(
          'tidsskrift',
          mediaTypeResponses
        );
        if (periodicals) {
          searchResult.periodicals = this.extractMediaTypeResponse(periodicals);
        }

        const others = this.findMediatypeResponse('other', mediaTypeResponses);
        if (others) {
          searchResult.others = this.extractMediaTypeResponse(others);
        }

        this.extractCounts(resp, searchResult);

        return searchResult;
      })
    );
  }

  search(sc: SearchCriteria): Observable<SuperSearchResult> {
    let builder = new QueryBuilder(environment.nb.apiURL)
      .withQ(sc.q)
      .withSize(sc.size)
      .addFilter('contentClasses:jp2')
      .addAggs('mediatype')
      .withDigitalAccessibleOnly(true)
      .withMediaType(sc.mediaType);

    sc.filters.forEach(f => {
      builder = builder.addFilter(f);
    });

    return this.http.get<ItemsResponse>(builder.build()).pipe(
      map(resp => {
        return this.extractItemsSearch(sc.mediaType, resp);
      })
    );
  }

  searchByUrl(mediaType: string, url: string): Observable<SuperSearchResult> {
    return this.http.get<ItemsResponse>(url).pipe(
      map(resp => {
        return this.extractItemsSearch(mediaType, resp);
      })
    );
  }

  private findMediatypeResponse(
    mediaType: string,
    mediaTypeResponses: MediaTypeResponse[]
  ): MediaTypeResponse {
    return mediaTypeResponses.find(m => m.mediaType === mediaType);
  }

  private extractMediaTypeResponse(resp: MediaTypeResponse) {
    const mediaTypeResults = this.extractItemsResponse(resp.result);
    mediaTypeResults.mediaType = resp.mediaType;

    return mediaTypeResults;
  }

  private extractItemsResponse(resp: ItemsResponse): MediaTypeResults {
    const mediaTypeResults = new MediaTypeResults();

    mediaTypeResults.nextLink = resp._links.next ? resp._links.next.href : null;
    mediaTypeResults.totalElements = resp.page.totalElements;
    resp._embedded.items.forEach(i => {
      mediaTypeResults.addItem(this.extractItem(i));
    });

    return mediaTypeResults;
  }

  private extractItemsSearch(
    mediaType: string,
    resp: ItemsResponse
  ): SuperSearchResult {
    const searchResult = new SuperSearchResult();
    const mediaTypeResult = this.extractItemsResponse(resp);
    mediaTypeResult.mediaType = mediaType;

    if ('bøker' === mediaType) {
      searchResult.books = mediaTypeResult;
    } else if ('bilder' === mediaType) {
      searchResult.photos = mediaTypeResult;
    } else if ('aviser' === mediaType) {
      searchResult.newspapers = mediaTypeResult;
    } else if ('tidsskrift' === mediaType) {
      searchResult.periodicals = mediaTypeResult;
    } else if ('kart' === mediaType) {
      searchResult.maps = mediaTypeResult;
    } else if ('noter' === mediaType) {
      searchResult.musicBooks = mediaTypeResult;
    } else if ('musikkmanuskripter' === mediaType) {
      searchResult.musicManuscripts = mediaTypeResult;
    } else if ('plakater' === mediaType) {
      searchResult.posters = mediaTypeResult;
    } else if ('privatarkivmateriale' === mediaType) {
      searchResult.privateArchives = mediaTypeResult;
    } else if ('programrapporter' === mediaType) {
      searchResult.programReports = mediaTypeResult;
    } else if ('others' === mediaType) {
      searchResult.others = mediaTypeResult;
    }

    this.extractCounts(resp, searchResult);

    return searchResult;
  }

  private extractItem(i: ItemResponse): Item {
    return new Item({
      title: i.metadata.title,
      creator: i.metadata.creators ? i.metadata.creators[0] : null,
      issued: i.metadata.originInfo ? i.metadata.originInfo.issued : null,
      thumbnail: i._links.thumbnail_custom
        ? i._links.thumbnail_custom.href
            .replace('{width}', '400')
            .replace('{height}', '400')
        : null,
      manifestUri: i._links.presentation ? i._links.presentation.href : null
    });
  }

  private extractCount(buckets: BucketResponse[], mediaType: string): number {
    if (buckets === null) {
      return 0;
    }

    const bucket = buckets.find(b => b.key === mediaType);
    return bucket ? bucket.count : 0;
  }

  private extractCounts(resp: ItemsResponse, searchResult: SuperSearchResult) {
    const aggregations = resp._embedded.aggregations;
    const mediatypeBuckets = aggregations.find(a => a.name === 'mediatype')
      .buckets;
    searchResult.books.counts = this.extractCount(mediatypeBuckets, searchResult.books.mediaType);
    searchResult.newspapers.counts = this.extractCount(mediatypeBuckets, searchResult.newspapers.mediaType);
    searchResult.photos.counts = this.extractCount(mediatypeBuckets, searchResult.photos.mediaType);
    searchResult.periodicals.counts = this.extractCount(mediatypeBuckets, searchResult.periodicals.mediaType);
    searchResult.maps.counts = this.extractCount(mediatypeBuckets, searchResult.maps.mediaType);
    searchResult.musicBooks.counts = this.extractCount(mediatypeBuckets, searchResult.musicBooks.mediaType);
    searchResult.musicManuscripts.counts = this.extractCount(mediatypeBuckets, searchResult.musicManuscripts.mediaType);
    searchResult.posters.counts = this.extractCount(mediatypeBuckets, searchResult.posters.mediaType);
    searchResult.privateArchives.counts = this.extractCount(mediatypeBuckets, searchResult.privateArchives.mediaType);
    searchResult.programReports.counts = this.extractCount(mediatypeBuckets, searchResult.programReports.mediaType);
  }

}
