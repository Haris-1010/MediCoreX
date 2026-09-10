import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../services/auth.service";
import * as i2 from "@angular/router";
export class AuthGuard {
    constructor(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    canActivate(route, state) {
        return this.checkAuth(state.url);
    }
    canActivateChild(childRoute, state) {
        return this.checkAuth(state.url);
    }
    canLoad(route, segments) {
        const fullPath = segments.map(s => s.path).join('/');
        return this.checkAuth(fullPath);
    }
    checkAuth(url) {
        return this.authService.isAuthenticated$.pipe(take(1), map(isAuthenticated => {
            if (isAuthenticated) {
                return true;
            }
            // Store the attempted URL for redirecting after login
            return this.router.createUrlTree(['/auth/login'], {
                queryParams: { returnUrl: url }
            });
        }));
    }
    static { this.ɵfac = function AuthGuard_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AuthGuard)(i0.ɵɵinject(i1.AuthService), i0.ɵɵinject(i2.Router)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: AuthGuard, factory: AuthGuard.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AuthGuard, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: i1.AuthService }, { type: i2.Router }], null); })();
//# sourceMappingURL=auth.guard.js.map