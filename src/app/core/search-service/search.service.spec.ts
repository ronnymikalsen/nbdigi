import { TestBed, inject } from '@angular/core/testing';

import { NbService } from './nb.service';

describe('NbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NbService]
    });
  });

  it('should be created', inject([NbService], (service: NbService) => {
    expect(service).toBeTruthy();
  }));
});
