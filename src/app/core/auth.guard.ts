import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public afAuth: AngularFireAuth, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return Observable.create(observer => {
      this.afAuth.authState.subscribe(
        res => {
          if (res) {
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
