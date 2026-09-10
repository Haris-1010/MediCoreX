import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "../services/notification.service";
export class ErrorInterceptor {
    constructor(router, notification) {
        this.router = router;
        this.notification = notification;
    }
    intercept(request, next) {
        return next.handle(request).pipe(catchError((error) => {
            let errorMessage = 'An unknown error occurred';
            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = error.error.message;
            }
            else {
                // Server-side error
                switch (error.status) {
                    case 0:
                        errorMessage = 'Unable to connect to server. Please check your internet connection.';
                        break;
                    case 400:
                        errorMessage = error.error?.message || 'Bad request';
                        if (error.error?.errors?.length) {
                            errorMessage = error.error.errors.join(', ');
                        }
                        break;
                    case 401:
                        // Handled by auth interceptor
                        return throwError(() => error);
                    case 403:
                        errorMessage = 'You do not have permission to perform this action';
                        this.notification.error(errorMessage);
                        break;
                    case 404:
                        errorMessage = error.error?.message || 'Resource not found';
                        break;
                    case 409:
                        errorMessage = error.error?.message || 'Conflict occurred';
                        break;
                    case 422:
                        errorMessage = error.error?.message || 'Validation failed';
                        if (error.error?.errors?.length) {
                            errorMessage = error.error.errors.join(', ');
                        }
                        break;
                    case 429:
                        errorMessage = 'Too many requests. Please wait and try again.';
                        break;
                    case 500:
                        errorMessage = 'Internal server error. Please try again later.';
                        break;
                    case 502:
                    case 503:
                    case 504:
                        errorMessage = 'Service temporarily unavailable. Please try again later.';
                        break;
                    default:
                        errorMessage = error.error?.message || `Error: ${error.status}`;
                }
            }
            // Don't show notification for 401 errors (handled by auth interceptor)
            if (error.status !== 401) {
                this.notification.error(errorMessage);
            }
            return throwError(() => new Error(errorMessage));
        }));
    }
    static { this.ɵfac = function ErrorInterceptor_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ErrorInterceptor)(i0.ɵɵinject(i1.Router), i0.ɵɵinject(i2.NotificationService)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ErrorInterceptor, factory: ErrorInterceptor.ɵfac }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ErrorInterceptor, [{
        type: Injectable
    }], () => [{ type: i1.Router }, { type: i2.NotificationService }], null); })();
//# sourceMappingURL=error.interceptor.js.map