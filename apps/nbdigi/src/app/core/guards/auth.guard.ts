import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthFacade } from '../../+state/auth/auth.facade';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    public afAuth: AngularFireAuth,
    private ngZone: NgZone,
    private afs: AngularFirestore,
    private router: Router,
    private authFacade: AuthFacade
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return Observable.create(observer => {
      this.authFacade.state$.pipe().subscribe(
        authState => {
          if (authState.user) {
            observer.next(true);
          } else if (authState.error) {
            observer.next(this.ngZone.run(() =>this.router.navigate(['/auth'])));
          }
        },
        err => {
          observer.next(false);
        }
      );
    });
  }
}
