import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { retry, delay } from 'rxjs/operators';

@Injectable()
export class CustomHttp extends HttpClient {
  constructor(handler: HttpHandler) {
    super(handler);
  }

  get<T>(url: string, options?: any): Observable<any> {
    return super.get<T>(url, options).pipe(
      retry(2),
      delay(100)
    );
  }
}
