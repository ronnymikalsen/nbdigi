import { Injectable, Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar, MatIconRegistry } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { interval } from 'rxjs/observable/interval';
import { startWith } from 'rxjs/operators';

import { SwUpdateMessageComponent } from '../sw-update-message/sw-update-message.component';

@Injectable()
export class CheckForUpdateService {
  constructor(updates: SwUpdate, private snackBar: MatSnackBar) {
    if (updates.isEnabled) {
      interval(10 * 60 * 1000)
        .pipe(startWith(0))
        .subscribe(() => {
          updates.checkForUpdate();
        });

      updates.available.subscribe(event => {
        const ref = this.snackBar.openFromComponent(SwUpdateMessageComponent);

        ref.instance.onAction.subscribe((action: string) => {
          if (action === 'UPDATE') {
            updates.activateUpdate().then(() => document.location.reload());
          } else {
            ref.dismiss();
          }
        });
      });
    }
  }
}
