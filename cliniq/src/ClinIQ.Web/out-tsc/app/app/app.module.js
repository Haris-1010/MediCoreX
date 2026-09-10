import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './layout/layout.module';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import * as i0 from "@angular/core";
export class AppModule {
    static { this.ɵfac = function AppModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: AppModule, bootstrap: [AppComponent] }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ providers: [
            provideHttpClient(withInterceptorsFromDi()),
            { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
            { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
        ], imports: [BrowserModule,
            BrowserAnimationsModule,
            AppRoutingModule,
            CoreModule,
            SharedModule,
            LayoutModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppModule, [{
        type: NgModule,
        args: [{
                declarations: [
                    AppComponent
                ],
                imports: [
                    BrowserModule,
                    BrowserAnimationsModule,
                    AppRoutingModule,
                    CoreModule,
                    SharedModule,
                    LayoutModule
                ],
                providers: [
                    provideHttpClient(withInterceptorsFromDi()),
                    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
                    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
                ],
                bootstrap: [AppComponent]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(AppModule, { declarations: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        CoreModule,
        SharedModule,
        LayoutModule] }); })();
//# sourceMappingURL=app.module.js.map