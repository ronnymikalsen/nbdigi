import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Hint } from './hints.model';
import { TypeaheadResponse } from './typeahead.response';
import { environment } from '../../../environments/environment';
import { QueryBuilder } from './../../builders/query-builder';
import { SearchCriteria } from '../../models/search-criteria.model';

@Injectable()
export class TypeaheadService {
  constructor(private http: HttpClient) {}

  public creators(sc: SearchCriteria): Observable<Hint[]> {
    return this.http
      .get<TypeaheadResponse>(
        `${
          environment.nb.apiURL
        }/catalog/v1/typeahead/namecreators${this.buildQuery(sc)}`
      )
      .pipe(
        map(resp => {
          const creators: Hint[] = [];
          const items = resp._embedded.items;
          if (items) {
            for (const item of items) {
              creators.push(
                new Hint({
                  type: 'person',
                  label: item.label,
                  value: `namecreators:"${item.value}"`
                })
              );
            }
          }
          return creators;
        })
      );
  }

  public places(sc: SearchCriteria): Observable<Hint[]> {
    return this.http
      .get<TypeaheadResponse>(
        `${
          environment.nb.apiURL
        }/catalog/v1/typeahead/subjectgeographic${this.buildQuery(sc)}`
      )
      .pipe(
        map(resp => {
          const creators: Hint[] = [];
          const items = resp._embedded.items;
          if (items) {
            for (const item of items) {
              creators.push(
                new Hint({
                  type: 'place',
                  label: item.label,
                  value: `subjectgeographic:"${item.value}"`
                })
              );
            }
          }
          return creators;
        })
      );
  }

  private buildQuery(sc: SearchCriteria): string {
    let builder = new QueryBuilder()
      .withQ(sc.q)
      .withSize(3)
      .withDigitalAccessibleOnly(true)
      .withMediaType(sc.mediaType);

    sc.filters.forEach(f => {
      builder = builder.addFilter(f);
    });

    return builder.build();
  }
}
