import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { User } from '@nbdigi/data-models';
import { Observable } from 'rxjs';
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
