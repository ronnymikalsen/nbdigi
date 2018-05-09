import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../models/user.model';
import { take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return Observable.create(observer => {
      this.afAuth.authState.subscribe(
        res => {
          if (res) {
            const userRef = this.afs.doc<User>(`users/${res.uid}`);
            userRef
              .valueChanges()
              .pipe(take(1))
              .subscribe(u => {
                observer.next(true);
              });
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
