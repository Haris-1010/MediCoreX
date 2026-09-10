import { Injectable, computed, signal } from '@angular/core';
import { shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
/**
 * Client-side permission state.
 *
 * Everything here is UX only. Hiding a button is a courtesy, not a control —
 * the API rejects the call regardless. Never treat a check in this service as a
 * security boundary.
 */
export class PermissionService {
    constructor(http) {
        this.http = http;
        this.context = signal(null);
        this.current = this.context.asReadonly();
        this.isLoaded = computed(() => this.context() !== null);
        this.isSuperAdmin = computed(() => this.context()?.isSuperAdmin ?? false);
        this.mustChangePassword = computed(() => this.context()?.mustChangePassword ?? false);
        this.permissionSet = computed(() => new Set(this.context()?.permissions ?? []));
        this.moduleSet = computed(() => new Set(this.context()?.enabledModules ?? []));
    }
    /** Called by the app initializer, and again after login or a branch switch. */
    load(force = false) {
        if (!force && this.inflight$) {
            return this.inflight$;
        }
        this.inflight$ = this.http
            .get(`${environment.apiUrl}/auth/me`)
            .pipe(tap((ctx) => this.context.set(ctx)), shareReplay({ bufferSize: 1, refCount: false }));
        return this.inflight$;
    }
    clear() {
        this.context.set(null);
        this.inflight$ = undefined;
    }
    /** Exact permission check, e.g. 'patients.create'. */
    has(permission) {
        if (this.isSuperAdmin()) {
            return true;
        }
        return this.permissionSet().has(permission);
    }
    hasAny(permissions) {
        return permissions.some((p) => this.has(p));
    }
    hasAll(permissions) {
        return permissions.every((p) => this.has(p));
    }
    /** Subscription-level feature check, independent of the user's permissions. */
    hasModule(module) {
        return this.isSuperAdmin() || this.moduleSet().has(module);
    }
    /**
     * The check that actually decides whether a feature is usable: the
     * organization's package AND the user's grant must both pass.
     */
    canUse(module, permission) {
        return this.hasModule(module) && this.has(permission);
    }
    get tenantId() {
        return this.context()?.tenantId ?? null;
    }
    get branchId() {
        return this.context()?.branchId ?? null;
    }
    static { this.ɵfac = function PermissionService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PermissionService)(i0.ɵɵinject(i1.HttpClient)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: PermissionService, factory: PermissionService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PermissionService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], () => [{ type: i1.HttpClient }], null); })();
//# sourceMappingURL=permission.service.js.map