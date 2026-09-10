import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import * as i0 from "@angular/core";
import * as i1 from "./api.service";
import * as i2 from "./storage.service";
export class TenantService {
    constructor(api, storage) {
        this.api = api;
        this.storage = storage;
        this.currentTenantSubject = new BehaviorSubject(null);
        this.currentBranchSubject = new BehaviorSubject(null);
        this.branchesSubject = new BehaviorSubject([]);
        this.currentTenant$ = this.currentTenantSubject.asObservable();
        this.currentBranch$ = this.currentBranchSubject.asObservable();
        this.branches$ = this.branchesSubject.asObservable();
    }
    loadTenant() {
        return this.api.get('v1/tenants/current').pipe(tap(tenant => this.currentTenantSubject.next(tenant)));
    }
    loadBranches() {
        return this.api.get('v1/branches').pipe(tap(branches => this.branchesSubject.next(branches)));
    }
    setCurrentBranch(branch) {
        this.currentBranchSubject.next(branch);
        this.storage.setItem(environment.branchKey, branch.id);
    }
    getCurrentTenant() {
        return this.currentTenantSubject.value;
    }
    getCurrentBranch() {
        return this.currentBranchSubject.value;
    }
    hasFeature(feature) {
        const tenant = this.currentTenantSubject.value;
        return tenant?.settings.features.includes(feature) ?? false;
    }
    getSetting(key) {
        const tenant = this.currentTenantSubject.value;
        return tenant?.settings[key] ?? null;
    }
    formatDate(date) {
        const format = this.getSetting('dateFormat') || 'dd/MM/yyyy';
        return this.formatDateWithPattern(date, format);
    }
    formatTime(date) {
        const format = this.getSetting('timeFormat') || 'HH:mm';
        return this.formatTimeWithPattern(date, format);
    }
    formatCurrency(amount) {
        const currency = this.getSetting('currency') || 'USD';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }
    formatDateWithPattern(date, pattern) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return pattern
            .replace('dd', day)
            .replace('MM', month)
            .replace('yyyy', year);
    }
    formatTimeWithPattern(date, pattern) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return pattern
            .replace('HH', hours)
            .replace('mm', minutes);
    }
    static { this.ɵfac = function TenantService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TenantService)(i0.ɵɵinject(i1.ApiService), i0.ɵɵinject(i2.StorageService)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: TenantService, factory: TenantService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TenantService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: i1.ApiService }, { type: i2.StorageService }], null); })();
//# sourceMappingURL=tenant.service.js.map