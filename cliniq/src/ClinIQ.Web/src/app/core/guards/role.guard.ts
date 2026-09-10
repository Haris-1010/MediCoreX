import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const requiredRole = route.data['role'] as string;
    const requiredRoles = route.data['roles'] as string[];

    // No role required
    if (!requiredRole && !requiredRoles) {
      return true;
    }

    // Single role check
    if (requiredRole && this.authService.hasRole(requiredRole)) {
      return true;
    }

    // Multiple roles check (any)
    if (requiredRoles?.length && this.authService.hasAnyRole(requiredRoles)) {
      return true;
    }

    // Role check failed
    this.notification.error('You do not have the required role to access this page');
    return this.router.createUrlTree(['/dashboard']);
  }
}
