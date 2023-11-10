import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Manifest } from '../models/manifest';

@Injectable({
  providedIn: 'root',
})
export class PresentationService {
  constructor(private http: HttpClient) {}

  public getManifest(
    urlToManifest: string,
    fields?: string[],
  ): Observable<Manifest> {
    const url = fields
      ? `${urlToManifest}?fields=${fields.join(',')}`
      : urlToManifest;
    return this.http.get<Manifest>(url);
  }
}
