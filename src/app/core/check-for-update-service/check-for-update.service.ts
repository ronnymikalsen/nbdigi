import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar, MatIconRegistry } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { interval } from 'rxjs/observable/interval';
import { startWith } from 'rxjs/operators';

@Injectable()
export class CheckForUpdateService {
  constructor(updates: SwUpdate, private snackBar: MatSnackBar) {
    if (updates.isEnabled) {
      interval(10 * 60 * 60 * 1000).subscribe(() => {
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
