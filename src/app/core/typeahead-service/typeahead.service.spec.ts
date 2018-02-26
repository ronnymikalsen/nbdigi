import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { TypeaheadService } from './typeahead.service';

describe('TypeaheadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TypeaheadService]
    });
  });

  it(
    'should be created',
    inject([TypeaheadService], (service: TypeaheadService) => {
      expect(service).toBeTruthy();
    })
  );
});
