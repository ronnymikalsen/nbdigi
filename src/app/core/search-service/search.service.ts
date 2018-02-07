import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { SearchCriteria } from './../../models/search-criteria.model';
import { ItemsResponse } from './../../models/items-response.model';
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
      .addFilter('mediatype:aviser OR mediatype:bilder OR mediatype:bøker')
      .withDigitalAccessibleOnly(true)
      .withMediaTypeOrder('bøker,aviser,bilder')
      .withMediaTypeSize(3);

    sc.filters.forEach(f => {
      builder = builder.addFilter(f);
    });

    return this.http.get<ItemsResponse>(builder.build()).pipe(
      map(resp => {
        const searchResult = new SuperSearchResult();
        const mediaTypeResults = resp._embedded.mediaTypeResults;

        const books = mediaTypeResults
          .find(m => m.mediaType === 'bøker');
        if (books) {
          searchResult.books.totalElements = books.result.page.totalElements;
          books.result._embedded.items.forEach(i => {
            searchResult.books.addItem(new Item({
              title: i.metadata.title,
              creator: i.metadata.creators ? i.metadata.creators[0] : null,
              issued: i.metadata.originInfo ? i.metadata.originInfo.issued : null,
              thumbnail: i._links.thumbnail_custom.href.replace('width', '400').replace('height', '400')
            }));
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
}
