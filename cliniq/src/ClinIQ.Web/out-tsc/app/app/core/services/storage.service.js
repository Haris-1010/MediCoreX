import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class StorageService {
    setItem(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        }
        catch (error) {
            console.error('Error saving to localStorage', error);
        }
    }
    getItem(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        }
        catch (error) {
            console.error('Error reading from localStorage', error);
            return null;
        }
    }
    removeItem(key) {
        try {
            localStorage.removeItem(key);
        }
        catch (error) {
            console.error('Error removing from localStorage', error);
        }
    }
    clear() {
        try {
            localStorage.clear();
        }
        catch (error) {
            console.error('Error clearing localStorage', error);
        }
    }
    setSessionItem(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            sessionStorage.setItem(key, serializedValue);
        }
        catch (error) {
            console.error('Error saving to sessionStorage', error);
        }
    }
    getSessionItem(key) {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        }
        catch (error) {
            console.error('Error reading from sessionStorage', error);
            return null;
        }
    }
    removeSessionItem(key) {
        try {
            sessionStorage.removeItem(key);
        }
        catch (error) {
            console.error('Error removing from sessionStorage', error);
        }
    }
    static { this.ɵfac = function StorageService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StorageService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: StorageService, factory: StorageService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StorageService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], null, null); })();
//# sourceMappingURL=storage.service.js.map