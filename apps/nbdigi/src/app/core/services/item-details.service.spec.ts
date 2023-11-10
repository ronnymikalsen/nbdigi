import { TestBed, inject } from '@angular/core/testing';

import { ItemDetailsService } from './item-details.service';

describe('ItemDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemDetailsService],
    });
  });

  it('should be created', inject(
    [ItemDetailsService],
    (service: ItemDetailsService) => {
      expect(service).toBeTruthy();
    },
  ));
});
