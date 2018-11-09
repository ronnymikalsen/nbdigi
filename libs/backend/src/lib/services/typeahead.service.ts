import { HttpClient } from '@angular/common/http';
import { Injectable, Optional } from '@angular/core';
import { Hint, SearchCriteria, TypeaheadResponse } from '@nbdigi/data-models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueryBuilder } from '../builders/query-builder';
import { ApiConfig } from './api-config';

@Injectable()
export class TypeaheadService {
  constructor(
    @Optional() private apiConfig: ApiConfig,
    private http: HttpClient
  ) {}

  public creators(sc: SearchCriteria): Observable<Hint[]> {
    return this.http
      .get<TypeaheadResponse>(
        `${
          this.apiConfig.rootUrl
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
          this.apiConfig.rootUrl
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
