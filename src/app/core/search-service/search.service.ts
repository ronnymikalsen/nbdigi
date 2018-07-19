import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  BucketResponse,
  ItemResponse,
  ItemsResponse,
  MediaTypeResponse
} from '../../models/items-response.model';
import { MediaTypeCount } from '../../models/media-types-count';
import { SearchCriteria } from '../../models/search-criteria.model';
import {
  Item,
  MediaTypeResults,
  SuperSearchResult
} from '../../models/search-result.model';
import { YearCount } from '../../models/year-count';
import { QueryBuilder } from '../builders/query-builder';

@Injectable()
export class SearchService {
  constructor(private http: HttpClient) {}

  super(sc: SearchCriteria, aggs?: string[]): Observable<SuperSearchResult> {
    let builder = new QueryBuilder()
      .withQ(sc.q)
      .withSize(sc.size)
      .withDigitalAccessibleOnly(true)
      .withMediaTypeOrder('bøker,aviser,bilder,tidsskrift,other')
      .withMediaTypeSize(5)
      .withSort(sc.sort.value);

    if (aggs) {
      aggs.forEach(a => {
        builder = builder.addAggs(a);
      });
    }

    sc.filters.forEach(f => {
      builder = builder.addFilter(f);
    });

    return this.http
      .get<ItemsResponse>(
        `${environment.nb.apiURL}/catalog/v1/search${builder.build()}`
      )
      .pipe(
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

          const photos = this.findMediatypeResponse(
            'bilder',
            mediaTypeResponses
          );
          if (photos) {
            searchResult.photos = this.extractMediaTypeResponse(photos);
          }

          const periodicals = this.findMediatypeResponse(
            'tidsskrift',
            mediaTypeResponses
          );
          if (periodicals) {
            searchResult.periodicals = this.extractMediaTypeResponse(
              periodicals
            );
          }

          const others = this.findMediatypeResponse(
            'other',
            mediaTypeResponses
          );
          if (others) {
            searchResult.others = this.extractMediaTypeResponse(others);
          }

          this.extractCounts(resp, searchResult);
          searchResult.totalElements = resp.totalElements;
          searchResult.selfLink = resp._links.self.href;
          return searchResult;
        })
      );
  }

  search(sc: SearchCriteria, aggs?: string[]): Observable<SuperSearchResult> {
    let builder = new QueryBuilder()
      .withQ(sc.q)
      .withSize(sc.size)
      .addAggs('mediatype')
      .withDigitalAccessibleOnly(true)
      .withMediaType(sc.mediaType)
      .withSort(sc.sort.value);

    if (aggs) {
      aggs.forEach(a => {
        builder = builder.addAggs(a);
      });
    }

    sc.filters.forEach(f => {
      builder = builder.addFilter(f);
    });

    return this.http
      .get<ItemsResponse>(
        `${environment.nb.apiURL}/catalog/v1/items${builder.build()}`
      )
      .pipe(
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

    mediaTypeResults.selfLink = resp._links.self ? resp._links.self.href : null;
    mediaTypeResults.nextLink = resp._links.next ? resp._links.next.href : null;
    mediaTypeResults.totalElements = resp.page.totalElements;
    if (resp._embedded.items) {
      resp._embedded.items.forEach(i => {
        mediaTypeResults.items.push(this.extractItem(i));
      });
    }

    return mediaTypeResults;
  }

  private extractItemsSearch(
    mediaType: string,
    resp: ItemsResponse
  ): SuperSearchResult {
    const searchResult = new SuperSearchResult();
    const mediaTypeResult = this.extractItemsResponse(resp);
    mediaTypeResult.mediaType = mediaType;
    searchResult.totalElements = mediaTypeResult.totalElements;

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
      id: i.id,
      mediaType:
        i.metadata.mediaTypes && i.metadata.mediaTypes.length > 0
          ? i.metadata.mediaTypes[0]
          : null,
      title: i.metadata.title,
      creator: i.metadata.creators ? i.metadata.creators[0] : null,
      issued: i.metadata.originInfo ? i.metadata.originInfo.issued : null,
      thumbnail: i._links.thumbnail_custom
        ? i._links.thumbnail_custom.href
            .replace('{width}', '245')
            .replace('{height}', '245')
        : null,
      manifestUri: i._links.presentation ? i._links.presentation.href : null,
      selfLink: i._links.self ? i._links.self.href : null,
      urn: i.metadata.identifiers ? i.metadata.identifiers.urn : null,
      oaiId: i.metadata.identifiers ? i.metadata.identifiers.oaiId : null
    });
  }

  private extractCounts(resp: ItemsResponse, searchResult: SuperSearchResult) {
    const aggregations = resp._embedded.aggregations;

    if (!aggregations) {
      return;
    }

    const mediatypes = aggregations.find(a => a.name === 'mediatype');
    if (mediatypes) {
      const mediatypeBuckets = mediatypes.buckets;
      searchResult.books.counts = this.extractCount(
        mediatypeBuckets,
        searchResult.books.mediaType
      );
      searchResult.newspapers.counts = this.extractCount(
        mediatypeBuckets,
        searchResult.newspapers.mediaType
      );
      searchResult.photos.counts = this.extractCount(
        mediatypeBuckets,
        searchResult.photos.mediaType
      );
      searchResult.periodicals.counts = this.extractCount(
        mediatypeBuckets,
        searchResult.periodicals.mediaType
      );
      searchResult.maps.counts = this.extractCount(
        mediatypeBuckets,
        searchResult.maps.mediaType
      );
      searchResult.musicBooks.counts = this.extractCount(
        mediatypeBuckets,
        searchResult.musicBooks.mediaType
      );
      searchResult.musicManuscripts.counts = this.extractCount(
        mediatypeBuckets,
        searchResult.musicManuscripts.mediaType
      );
      searchResult.posters.counts = this.extractCount(
        mediatypeBuckets,
        searchResult.posters.mediaType
      );
      searchResult.privateArchives.counts = this.extractCount(
        mediatypeBuckets,
        searchResult.privateArchives.mediaType
      );
      searchResult.programReports.counts = this.extractCount(
        mediatypeBuckets,
        searchResult.programReports.mediaType
      );
    }

    if (aggregations) {
      const yearBuckets = aggregations.find(a => a.name === 'year');
      if (yearBuckets) {
        searchResult.years = this.extractYears(yearBuckets.buckets);
      }
      const monthBuckets = aggregations.find(a => a.name === 'month');
      if (monthBuckets) {
        searchResult.years = this.extractYears(monthBuckets.buckets);
      }
    }
  }

  private extractCount(buckets: BucketResponse[], mediaType: string): number {
    if (!buckets) {
      return 0;
    }

    const bucket = buckets.find(b => b.key === mediaType);
    return bucket ? bucket.count : 0;
  }

  private extractYears(years: BucketResponse[]): YearCount[] {
    if (!years) {
      return [];
    }

    const bucket = [];
    years.forEach(year => {
      bucket.push(
        new YearCount({
          year: year.key,
          count: year.count
        })
      );
    });

    const sortedArray: YearCount[] = bucket.sort(
      (n1, n2) => Number(n1.year) - Number(n2.year)
    );
    return sortedArray;
  }
}
