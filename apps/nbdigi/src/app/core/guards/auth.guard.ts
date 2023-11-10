import { Injectable, NgZone } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthFacade } from '../../+state/auth/auth.facade';

@Injectable()
export class AuthGuard {
  constructor(
    public afAuth: Auth,
    private ngZone: NgZone,
    private afs: Firestore,
    private router: Router,
    private authFacade: AuthFacade,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    return Observable.create((observer: any) => {
      this.authFacade.state$.pipe().subscribe(
        (authState) => {
          if (authState.user) {
            observer.next(true);
          } else if (authState.error) {
            observer.next(
              this.ngZone.run(() => this.router.navigate(['/auth'])),
            );
          }
        },
        (err) => {
          observer.next(false);
        },
      );
    });
  }
}
