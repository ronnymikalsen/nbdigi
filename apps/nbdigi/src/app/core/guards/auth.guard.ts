import { Injectable } from '@angular/core';
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
    private afs: AngularFirestore,
    private router: Router,
    private authFacade: AuthFacade
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return Observable.create(observer => {
      this.afAuth.authState.subscribe(
        res => {
          console.log('AuthGuard', res);

        });
      this.authFacade.currentUser$.pipe(take(1)).subscribe(
        user => {
          console.log('AuthGuard', user);
          if (user) {
            observer.next(true);
          } else {
            observer.next(this.router.navigate(['/login']));
          }
        },
        err => {
          observer.next(false);
        }
      );
    });
  }
}
