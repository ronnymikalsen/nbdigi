import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable()
export class AuthGuard {
  constructor(
    private auth: Auth,
    private router: Router,
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return authState(this.auth).pipe(
      take(1),
      map((user) => (user ? true : this.router.createUrlTree(['/auth']))),
    );
  }
}
