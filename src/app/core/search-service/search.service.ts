import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { SearchCriteria } from './../../models/search-criteria.model';
import { ItemsResponse, ItemResponse, MediaTypeResponse } from './../../models/items-response.model';
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

        const books = this.extractMediatypeResponse('bøker', mediaTypeResponses);
        if (books) {
          searchResult.books.totalElements = books.result.page.totalElements;
          books.result._embedded.items.forEach(i => {
            searchResult.books.addItem(this.extractItem(i));
          });
        }

        const newspapers = this.extractMediatypeResponse('aviser', mediaTypeResponses);
        if (newspapers) {
          searchResult.newspapers.totalElements = newspapers.result.page.totalElements;
          newspapers.result._embedded.items.forEach(i => {
            searchResult.newspapers.addItem(this.extractItem(i));
          });
        }

        const photos = this.extractMediatypeResponse('bilder', mediaTypeResponses);
        if (photos) {
          searchResult.photos.totalElements = photos.result.page.totalElements;
          photos.result._embedded.items.forEach(i => {
            searchResult.photos.addItem(this.extractItem(i));
          });
        }

        const periodical = this.extractMediatypeResponse('tidsskrift', mediaTypeResponses);
        if (periodical) {
          searchResult.periodicals.totalElements = periodical.result.page.totalElements;
          periodical.result._embedded.items.forEach(i => {
            searchResult.periodicals.addItem(this.extractItem(i));
          });
        }

        const others = this.extractMediatypeResponse('other', mediaTypeResponses);
        if (others) {
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
    let builder = new QueryBuilder(environment.nb.apiURL)
      .withQ(sc.q)
      .withSize(sc.size)
      .addFilter('contentClasses:jp2')
      .addFilter('mediatype:aviser OR mediatype:bilder OR mediatype:bøker')
      .withDigitalAccessibleOnly(true)
      .withMediaType(sc.mediaType);

    sc.filters.forEach(f => {
      builder = builder.addFilter(f);
    });

    return this.http.get<ItemsResponse>(builder.build()).pipe(
      map(resp => {
        return null;
      })
    );
  }

  private extractMediatypeResponse(mediaType: string, mediaTypeResponses: MediaTypeResponse[]): MediaTypeResponse {
    return mediaTypeResponses
      .find(m => m.mediaType === mediaType);
  }

  private extractItem(i: ItemResponse): Item {
    return new Item({
      title: i.metadata.title,
      creator: i.metadata.creators ? i.metadata.creators[0] : null,
      issued: i.metadata.originInfo ? i.metadata.originInfo.issued : null,
      thumbnail: i._links.thumbnail_custom ? i._links.thumbnail_custom.href.replace('{width}', '400').replace('{height}', '400') : null
    });
  }

}
