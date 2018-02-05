import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { SearchCriteria } from './../../models/search-criteria.model';
import { ItemsResponse } from './../../models/items-response.model';
import { SearchResult } from './../../models/search-result.model';

@Injectable()
export class SearchService {

  constructor(private http: HttpClient) {}

  search(sc: SearchCriteria): Observable<SearchResult> {
    return this.http.get<ItemsResponse>(`${environment.nb.apiURL}/catalog/v1/items?q=${sc.q}`).pipe(
      map(resp => {
        return null;
      })
    );
  }
}
