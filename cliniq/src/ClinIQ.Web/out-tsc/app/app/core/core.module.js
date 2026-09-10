import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { StorageService } from './services/storage.service';
import { NotificationService } from './services/notification.service';
import { SignalRService } from './services/signalr.service';
import { TenantService } from './services/tenant.service';
import * as i0 from "@angular/core";
export class CoreModule {
    constructor(parentModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the AppModule only.');
        }
    }
    static { this.ɵfac = function CoreModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || CoreModule)(i0.ɵɵinject(CoreModule, 12)); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: CoreModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ providers: [
            AuthService,
            ApiService,
            StorageService,
            NotificationService,
            SignalRService,
            TenantService
        ], imports: [CommonModule,
            HttpClientModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CoreModule, [{
        type: NgModule,
        args: [{
                imports: [
                    CommonModule,
                    HttpClientModule
                ],
                providers: [
                    AuthService,
                    ApiService,
                    StorageService,
                    NotificationService,
                    SignalRService,
                    TenantService
                ]
            }]
    }], () => [{ type: CoreModule, decorators: [{
                type: Optional
            }, {
                type: SkipSelf
            }] }], null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(CoreModule, { imports: [CommonModule,
        HttpClientModule] }); })();
//# sourceMappingURL=core.module.js.map