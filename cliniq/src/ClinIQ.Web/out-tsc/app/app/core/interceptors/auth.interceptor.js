import { Injectable } from '@angular/core';
import { throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "../services/auth.service";
import * as i2 from "../services/storage.service";
export class AuthInterceptor {
    constructor(authService, storage) {
        this.authService = authService;
        this.storage = storage;
        this.isRefreshing = false;
        this.refreshTokenSubject = new BehaviorSubject(null);
    }
    intercept(request, next) {
        const token = this.storage.getItem(environment.tokenKey);
        const tenantId = this.storage.getItem(environment.tenantKey);
        const branchId = this.storage.getItem(environment.branchKey);
        let authRequest = request;
        if (token) {
            authRequest = this.addToken(request, token);
        }
        if (tenantId) {
            authRequest = authRequest.clone({
                setHeaders: { 'X-Tenant-Id': tenantId }
            });
        }
        if (branchId) {
            authRequest = authRequest.clone({
                setHeaders: { 'X-Branch-Id': branchId }
            });
        }
        return next.handle(authRequest).pipe(catchError((error) => {
            if (error.status === 401 && !request.url.includes('/auth/')) {
                return this.handle401Error(authRequest, next);
            }
            return throwError(() => error);
        }));
    }
    addToken(request, token) {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    handle401Error(request, next) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            return this.authService.refreshToken().pipe(switchMap(response => {
                this.isRefreshing = false;
                this.refreshTokenSubject.next(response.accessToken);
                return next.handle(this.addToken(request, response.accessToken));
            }), catchError(error => {
                this.isRefreshing = false;
                this.authService.logout();
                return throwError(() => error);
            }));
        }
        return this.refreshTokenSubject.pipe(filter(token => token !== null), take(1), switchMap(token => next.handle(this.addToken(request, token))));
    }
    static { this.ɵfac = function AuthInterceptor_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AuthInterceptor)(i0.ɵɵinject(i1.AuthService), i0.ɵɵinject(i2.StorageService)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: AuthInterceptor, factory: AuthInterceptor.ɵfac }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AuthInterceptor, [{
        type: Injectable
    }], () => [{ type: i1.AuthService }, { type: i2.StorageService }], null); })();
//# sourceMappingURL=auth.interceptor.js.map