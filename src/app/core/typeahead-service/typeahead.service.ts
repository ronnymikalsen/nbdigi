import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import { Hint } from './hints.model';
import { TypeaheadResponse } from './typeahead.response';
import { environment } from '../../../environments/environment';

@Injectable()
export class TypeaheadService {

  constructor(private http: HttpClient) {}

  public creators(q: string): Observable<Hint[]> {
    return this.http.get<TypeaheadResponse>(`${environment.nb.apiURL}/catalog/v1/typeahead/namecreators?q=${q}&size=3`).pipe(
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

  public places(q: string): Observable<Hint[]> {
    return this.http.get<TypeaheadResponse>(`${environment.nb.apiURL}/catalog/v1/typeahead/subjectgeographic?q=${q}&size=3`).pipe(
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
}
