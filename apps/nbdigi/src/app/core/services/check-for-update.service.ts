import { Injectable, NgZone } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';
import { interval } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { SwUpdateMessageComponent } from '../sw-update-message/sw-update-message.component';

@Injectable()
export class CheckForUpdateService {
  constructor(
    private ngZone: NgZone,
    private updates: SwUpdate,
    private snackBar: MatSnackBar
  ) {}

  public init() {
    if (this.updates.isEnabled) {
      this.ngZone.runOutsideAngular(() => {
        interval(10 * 60 * 1000)
          .pipe(startWith(0))
          .subscribe(() => {
            this.updates.checkForUpdate();
          });
      });
      this.updates.available.subscribe(event => {
        const ref = this.snackBar.openFromComponent(SwUpdateMessageComponent);

        ref.instance.onAction.subscribe((action: string) => {
          if (action === 'UPDATE') {
            this.updates
              .activateUpdate()
              .then(() => document.location.reload());
          } else {
            ref.dismiss();
          }
        });
      });
    }
  }
}
