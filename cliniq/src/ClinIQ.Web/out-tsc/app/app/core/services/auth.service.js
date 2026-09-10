import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "@angular/router";
import * as i3 from "./storage.service";
import * as i4 from "./signalr.service";
export class AuthService {
    constructor(http, router, storage, signalR) {
        this.http = http;
        this.router = router;
        this.storage = storage;
        this.signalR = signalR;
        this.baseUrl = `${environment.apiUrl}/v1/auth`;
        this.currentUserSubject = new BehaviorSubject(null);
        this.isAuthenticatedSubject = new BehaviorSubject(false);
        this.currentUser$ = this.currentUserSubject.asObservable();
        this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
        this.loadStoredUser();
    }
    loadStoredUser() {
        const token = this.storage.getItem(environment.tokenKey);
        const user = this.storage.getItem(environment.userKey);
        if (token && user) {
            if (!this.isTokenExpired(token)) {
                this.currentUserSubject.next(user);
                this.isAuthenticatedSubject.next(true);
                this.signalR.startConnection(token);
            }
            else {
                this.refreshToken().subscribe();
            }
        }
    }
    login(request) {
        return this.http.post(`${this.baseUrl}/login`, request)
            .pipe(map(response => response.data), tap(response => this.handleAuthentication(response)), catchError(error => throwError(() => error)));
    }
    register(request) {
        return this.http.post(`${this.baseUrl}/register`, request);
    }
    logout() {
        const refreshToken = this.storage.getItem(environment.refreshTokenKey);
        if (refreshToken) {
            this.http.post(`${this.baseUrl}/logout`, { refreshToken }).subscribe();
        }
        this.clearAuth();
        this.router.navigate(['/auth/login']);
    }
    refreshToken() {
        const refreshToken = this.storage.getItem(environment.refreshTokenKey);
        const accessToken = this.storage.getItem(environment.tokenKey);
        if (!refreshToken || !accessToken) {
            this.clearAuth();
            return throwError(() => new Error('No refresh token available'));
        }
        return this.http.post(`${this.baseUrl}/refresh-token`, {
            accessToken,
            refreshToken
        }).pipe(map(response => response.data), tap(response => this.handleAuthentication(response)), catchError(error => {
            this.clearAuth();
            return throwError(() => error);
        }));
    }
    forgotPassword(email) {
        return this.http.post(`${this.baseUrl}/forgot-password`, { email });
    }
    resetPassword(token, email, password, confirmPassword) {
        return this.http.post(`${this.baseUrl}/reset-password`, {
            token,
            email,
            password,
            confirmPassword
        });
    }
    changePassword(currentPassword, newPassword, confirmNewPassword) {
        return this.http.post(`${this.baseUrl}/change-password`, {
            currentPassword,
            newPassword,
            confirmNewPassword
        });
    }
    getToken() {
        return this.storage.getItem(environment.tokenKey);
    }
    getCurrentUser() {
        return this.currentUserSubject.value;
    }
    normalizeValue(value) {
        return String(value ?? '').trim().toLowerCase();
    }
    getNormalizedPermissions(user) {
        if (!user)
            return [];
        const directPermissions = [
            ...(Array.isArray(user.permissions) ? user.permissions : []),
            ...(Array.isArray(user.roles) ? user.roles : [])
        ];
        const tenantPermissions = (user.tenants ?? []).flatMap(t => t.roles ?? []);
        return [...directPermissions, ...tenantPermissions]
            .map(value => this.normalizeValue(value))
            .filter(Boolean);
    }
    hasPermission(permission) {
        const user = this.currentUserSubject.value;
        if (!user)
            return false;
        if (user.isSuperAdmin)
            return true;
        const requiredPermission = this.normalizeValue(permission);
        const permissions = this.getNormalizedPermissions(user);
        return permissions.includes(requiredPermission);
    }
    hasAnyPermission(permissions) {
        const user = this.currentUserSubject.value;
        if (!user)
            return false;
        if (user.isSuperAdmin)
            return true;
        const normalized = permissions.map(p => this.normalizeValue(p));
        const availablePermissions = this.getNormalizedPermissions(user);
        return normalized.some(p => availablePermissions.includes(p));
    }
    hasRole(role) {
        const user = this.currentUserSubject.value;
        if (!user)
            return false;
        if (user.isSuperAdmin)
            return true;
        const requiredRole = this.normalizeValue(role);
        const tenantRoles = (user.tenants ?? []).flatMap(t => t.roles ?? []);
        const allRoles = [...tenantRoles, ...(user.roles ?? [])].map(r => this.normalizeValue(r));
        return allRoles.includes(requiredRole);
    }
    hasAnyRole(roles) {
        const user = this.currentUserSubject.value;
        if (!user)
            return false;
        if (user.isSuperAdmin)
            return true;
        const requiredRoles = roles.map(r => this.normalizeValue(r));
        const tenantRoles = (user.tenants ?? []).flatMap(t => t.roles ?? []);
        const allRoles = [...tenantRoles, ...(user.roles ?? [])].map(r => this.normalizeValue(r));
        return requiredRoles.some(r => allRoles.includes(r));
    }
    switchBranch(branchId) {
        return this.http.post(`${this.baseUrl}/switch-branch`, { branchId })
            .pipe(map(response => response.data), tap(response => this.handleAuthentication(response)));
    }
    handleAuthentication(response) {
        this.storage.setItem(environment.tokenKey, response.accessToken);
        this.storage.setItem(environment.refreshTokenKey, response.refreshToken);
        this.storage.setItem(environment.userKey, response.user);
        // Store first tenant/branch if available
        const firstTenant = response.user.tenants?.[0];
        if (firstTenant) {
            this.storage.setItem(environment.tenantKey, firstTenant.tenantId);
            const primaryBranch = firstTenant.branches?.find(b => b.isPrimary) || firstTenant.branches?.[0];
            if (primaryBranch) {
                this.storage.setItem(environment.branchKey, primaryBranch.branchId);
            }
        }
        this.currentUserSubject.next(response.user);
        this.isAuthenticatedSubject.next(true);
        this.signalR.startConnection(response.accessToken);
    }
    clearAuth() {
        this.storage.removeItem(environment.tokenKey);
        this.storage.removeItem(environment.refreshTokenKey);
        this.storage.removeItem(environment.userKey);
        this.storage.removeItem(environment.tenantKey);
        this.storage.removeItem(environment.branchKey);
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        this.signalR.stopConnection();
    }
    isTokenExpired(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp * 1000;
            return Date.now() >= expiry;
        }
        catch {
            return true;
        }
    }
    static { this.ɵfac = function AuthService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AuthService)(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.Router), i0.ɵɵinject(i3.StorageService), i0.ɵɵinject(i4.SignalRService)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: AuthService, factory: AuthService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AuthService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: i1.HttpClient }, { type: i2.Router }, { type: i3.StorageService }, { type: i4.SignalRService }], null); })();
//# sourceMappingURL=auth.service.js.map