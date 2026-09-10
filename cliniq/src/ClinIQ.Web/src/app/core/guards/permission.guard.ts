import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { PermissionService } from '../services/permission.service';

/**
 * Route data contract:
 *
 *   {
 *     path: 'ipd/admissions',
 *     canActivate: [authGuard, permissionGuard],
 *     data: { module: 'ipd', permission: 'admissions.view' }
 *   }
 *
 * `module` gates on the organization's entitlements; `permission` gates on the
 * user. Supply both for a module-gated route — a route declaring only a permission
 * stays reachable for organizations that don't have the feature enabled.
 */
export const permissionGuard: CanActivateFn = (route) => {
  const permissions = inject(PermissionService);
  const router = inject(Router);

  const required: string | string[] | undefined = route.data?.['permission'];
  const requiredAny: string[] | undefined = route.data?.['anyPermission'];
  const module: string | undefined = route.data?.['module'];

  const decide = () => {
    if (module && !permissions.hasModule(module)) {
      // Not a permission failure — the organization does not have the feature.
      return router.createUrlTree(['/upgrade'], { queryParams: { module } });
    }

    if (requiredAny?.length && !permissions.hasAny(requiredAny)) {
      return router.createUrlTree(['/forbidden']);
    }

    if (required) {
      const list = Array.isArray(required) ? required : [required];
      if (!permissions.hasAll(list)) {
        return router.createUrlTree(['/forbidden']);
      }
    }

    return true;
  };

  // On a hard refresh the context may not be loaded yet.
  if (!permissions.isLoaded()) {
    return permissions.load().pipe(map(() => decide()));
  }

  return decide();
};

/** Module-only variant, for the parent route of a lazily loaded feature area. */
export const entitlementGuard: CanActivateFn = (route) => {
  const permissions = inject(PermissionService);
  const router = inject(Router);
  const module: string | undefined = route.data?.['module'];

  const decide = () =>
    !module || permissions.hasModule(module)
      ? true
      : router.createUrlTree(['/upgrade'], { queryParams: { module } });

  if (!permissions.isLoaded()) {
    return permissions.load().pipe(map(() => decide()));
  }
  return decide();
};
