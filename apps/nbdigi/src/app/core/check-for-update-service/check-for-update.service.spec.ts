import { TestBed, inject } from '@angular/core/testing';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';

import { CheckForUpdateService } from './check-for-update.service';

describe('CheckForUpdateService', () => {
  const matSnackBarSpy = jasmine.createSpy('MatSnackBar');
  const swUpdateSpy = jasmine.createSpy('SwUpdate');
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CheckForUpdateService,
        { provide: SwUpdate, useValue: swUpdateSpy },
        { provide: MatSnackBar, useClass: matSnackBarSpy }
      ]
    });
  });

  it('should be created', inject(
    [CheckForUpdateService],
    (service: CheckForUpdateService) => {
      expect(service).toBeTruthy();
    }
  ));
});
