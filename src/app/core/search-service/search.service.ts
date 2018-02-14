import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { SearchCriteria } from './../../models/search-criteria.model';
import {
  ItemsResponse,
  ItemResponse,
  MediaTypeResponse
} from './../../models/items-response.model';
import { SuperSearchResult, Item } from './../../models/search-result.model';
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

        const books = this.extractMediatypeResponse(
          'bøker',
          mediaTypeResponses
        );
        if (books) {
          searchResult.books.nextLink = books.result._links.next
            ? books.result._links.next.href : null;
          searchResult.books.totalElements = books.result.page.totalElements;
          books.result._embedded.items.forEach(i => {
            searchResult.books.addItem(this.extractItem(i));
          });
        }

        const newspapers = this.extractMediatypeResponse(
          'aviser',
          mediaTypeResponses
        );
        if (newspapers) {
          searchResult.newspapers.nextLink = newspapers.result._links.next
            ? newspapers.result._links.next.href : null;
          searchResult.newspapers.totalElements =
            newspapers.result.page.totalElements;
          newspapers.result._embedded.items.forEach(i => {
            searchResult.newspapers.addItem(this.extractItem(i));
          });
        }

        const photos = this.extractMediatypeResponse(
          'bilder',
          mediaTypeResponses
        );
        if (photos) {
          searchResult.photos.nextLink = photos.result._links.next
            ? photos.result._links.next.href : null;
          searchResult.photos.totalElements = photos.result.page.totalElements;
          photos.result._embedded.items.forEach(i => {
            searchResult.photos.addItem(this.extractItem(i));
          });
        }

        const periodical = this.extractMediatypeResponse(
          'tidsskrift',
          mediaTypeResponses
        );
        if (periodical) {
          searchResult.periodicals.nextLink = periodical.result._links.next
            ? periodical.result._links.next.href : null;
          searchResult.periodicals.totalElements =
            periodical.result.page.totalElements;
          periodical.result._embedded.items.forEach(i => {
            searchResult.periodicals.addItem(this.extractItem(i));
          });
        }

        const others = this.extractMediatypeResponse(
          'other',
          mediaTypeResponses
        );
        if (others) {
          searchResult.others.nextLink = others.result._links.next
            ? others.result._links.next.href : null;
          searchResult.others.totalElements = others.result.page.totalElements;
          others.result._embedded.items.forEach(i => {
            searchResult.others.addItem(this.extractItem(i));
          });
        }

        return searchResult;
      })
    );
  }

  search(sc: SearchCriteria): Observable<SuperSearchResult> {
    console.log(sc.size);
    let builder = new QueryBuilder(environment.nb.apiURL)
      .withQ(sc.q)
      .withSize(sc.size)
      .addFilter('contentClasses:jp2')
      .withDigitalAccessibleOnly(true)
      .withMediaType(sc.mediaType);

    sc.filters.forEach(f => {
      builder = builder.addFilter(f);
    });

    return this.http.get<ItemsResponse>(builder.build()).pipe(
      map(resp => {
        const searchResult = new SuperSearchResult();
        const embedded = resp;
        if ('bøker' === sc.mediaType) {
          searchResult.books.nextLink = resp._links.next
            ? resp._links.next.href : null;
          searchResult.books.totalElements = resp.page.totalElements;
          resp._embedded.items.forEach(i => {
            searchResult.books.addItem(this.extractItem(i));
          });

        } else if ('bilder' === sc.mediaType) {
        } else if ('aviser' === sc.mediaType) {
        } else if ('tidsskrift' === sc.mediaType) {
        } else if ('others' === sc.mediaType) {
        }
        return searchResult;
      })
    );
  }

  searchByUrl(mediaType: string, url: string): Observable<SuperSearchResult> {
    return this.http.get<ItemsResponse>(url).pipe(
      map(resp => {
        const searchResult = new SuperSearchResult();
        const embedded = resp;
        if ('bøker' === mediaType) {
          searchResult.books.nextLink = resp._links.next
            ? resp._links.next.href : null;
          searchResult.books.totalElements = resp.page.totalElements;
          resp._embedded.items.forEach(i => {
            searchResult.books.addItem(this.extractItem(i));
          });

        } else if ('bilder' === mediaType) {
        } else if ('aviser' === mediaType) {
        } else if ('tidsskrift' === mediaType) {
        } else if ('others' === mediaType) {
        }
        return searchResult;
      })
    );
  }

  private extractMediatypeResponse(
    mediaType: string,
    mediaTypeResponses: MediaTypeResponse[]
  ): MediaTypeResponse {
    return mediaTypeResponses.find(m => m.mediaType === mediaType);
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
}
