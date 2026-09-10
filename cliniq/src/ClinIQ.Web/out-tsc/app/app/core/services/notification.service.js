import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/snack-bar";
export class NotificationService {
    constructor(snackBar) {
        this.snackBar = snackBar;
        this.defaultConfig = {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
        };
    }
    success(message, action = 'Close') {
        this.show(message, action, 'success');
    }
    error(message, action = 'Close') {
        this.show(message, action, 'error');
    }
    warning(message, action = 'Close') {
        this.show(message, action, 'warning');
    }
    info(message, action = 'Close') {
        this.show(message, action, 'info');
    }
    show(message, action, type) {
        const config = {
            ...this.defaultConfig,
            panelClass: [`snackbar-${type}`]
        };
        this.snackBar.open(message, action, config);
    }
    static { this.ɵfac = function NotificationService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || NotificationService)(i0.ɵɵinject(i1.MatSnackBar)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: NotificationService, factory: NotificationService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NotificationService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: i1.MatSnackBar }], null); })();
//# sourceMappingURL=notification.service.js.map