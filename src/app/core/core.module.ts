import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient, HttpHandler } from '@angular/common/http';

import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth-service/auth.service';
import { TypeaheadService } from './typeahead-service/typeahead.service';
import { SearchService } from './search-service/search.service';
import { CustomHttp } from './custom-http';

export function httpFactory(handler: HttpHandler) {
  return new CustomHttp(handler);
}

@NgModule({
  imports: [HttpClientModule],
  declarations: [],
  providers: [
    { provide: HttpClient, useFactory: httpFactory, deps: [HttpHandler] },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthService,
    SearchService,
    TypeaheadService
  ]
})
export class CoreModule { }
