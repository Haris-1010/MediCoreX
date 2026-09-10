import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { WardListComponent } from './ward-list/ward-list.component';
import { WardFormComponent } from './ward-form/ward-form.component';
import { WardBedsComponent } from './ward-beds/ward-beds.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    { path: '', component: WardListComponent },
    { path: 'new', component: WardFormComponent },
    { path: ':id/beds', component: WardBedsComponent }
];
export class WardsModule {
    static { this.ɵfac = function WardsModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || WardsModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: WardsModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, LayoutModule,
            RouterModule.forChild(routes)] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(WardsModule, [{
        type: NgModule,
        args: [{
                declarations: [WardListComponent, WardFormComponent, WardBedsComponent],
                imports: [
                    CommonModule, FormsModule, ReactiveFormsModule, SharedModule, LayoutModule,
                    RouterModule.forChild(routes)
                ]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(WardsModule, { declarations: [WardListComponent, WardFormComponent, WardBedsComponent], imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, LayoutModule, i1.RouterModule] }); })();
//# sourceMappingURL=wards.module.js.map