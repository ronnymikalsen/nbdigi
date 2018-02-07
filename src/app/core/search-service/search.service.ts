import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { SearchCriteria } from './../../models/search-criteria.model';
import { ItemsResponse } from './../../models/items-response.model';
import { SearchResult } from './../../models/search-result.model';
import { QueryBuilder } from './query-builder';

@Injectable()
export class SearchService {

  constructor(private http: HttpClient) {}

  super(sc: SearchCriteria): Observable<SearchResult> {
    let builder = new QueryBuilder(environment.nb.apiURL)
      .withQ(sc.q)
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
        return null;
      })
    );
  }

  search(sc: SearchCriteria): Observable<SearchResult> {
    let builder = new QueryBuilder(environment.nb.apiURL)
      .withQ(sc.q)
      .addFilter('contentClasses:jp2')
      .addFilter('mediatype:aviser OR mediatype:bilder OR mediatype:bøker')
      .withDigitalAccessibleOnly(true)
      .withMediaType(sc.mediaType)
      .withSize(sc.size);

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
