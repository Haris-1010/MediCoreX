import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class PlatformGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.auth.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        const user = this.auth.getCurrentUser();
        if (isAuthenticated && user?.isSuperAdmin) return true;
        return this.router.createUrlTree(['/platform/login']);
      })
    );
  }
}
