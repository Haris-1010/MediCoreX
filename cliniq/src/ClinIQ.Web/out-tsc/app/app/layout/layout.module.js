import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import * as i0 from "@angular/core";
export class LayoutModule {
    static { this.ɵfac = function LayoutModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LayoutModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: LayoutModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule,
            RouterModule,
            SharedModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LayoutModule, [{
        type: NgModule,
        args: [{
                declarations: [
                    MainLayoutComponent,
                    HeaderComponent,
                    SidebarComponent,
                    FooterComponent
                ],
                imports: [
                    CommonModule,
                    RouterModule,
                    SharedModule
                ],
                exports: [
                    MainLayoutComponent,
                    HeaderComponent,
                    SidebarComponent,
                    FooterComponent
                ]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(LayoutModule, { declarations: [MainLayoutComponent,
        HeaderComponent,
        SidebarComponent,
        FooterComponent], imports: [CommonModule,
        RouterModule,
        SharedModule], exports: [MainLayoutComponent,
        HeaderComponent,
        SidebarComponent,
        FooterComponent] }); })();
//# sourceMappingURL=layout.module.js.map