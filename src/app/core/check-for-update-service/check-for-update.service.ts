import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar, MatIconRegistry } from '@angular/material';
import { interval } from 'rxjs/observable/interval';
import { startWith } from 'rxjs/operators';

@Injectable()
export class CheckForUpdateService {
  constructor(updates: SwUpdate, private snackBar: MatSnackBar) {
    if (updates) {
      interval(6 * 60 * 60)
        .pipe(startWith(0))
        .subscribe(() => {
          updates.checkForUpdate();
        });

      updates.available.subscribe(event => {
        const snackBarRef = this.snackBar.open(
          'En ny oppdatering av NBDigi er tilgjengelig',
          'Oppdater nå',
          { duration: 10000 }
        );
        snackBarRef.onAction().subscribe(() => {
          updates.activateUpdate().then(() => document.location.reload());
        });
      });
    }
  }
}
