import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { LabDashboardComponent } from './lab-dashboard/lab-dashboard.component';
import { LabOrdersComponent } from './lab-orders/lab-orders.component';
import { ResultEntryComponent } from './result-entry/result-entry.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    { path: '', component: LabDashboardComponent },
    { path: 'orders', component: LabOrdersComponent },
    { path: 'results/:id', component: ResultEntryComponent }
];
export class LaboratoryModule {
    static { this.ɵfac = function LaboratoryModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LaboratoryModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: LaboratoryModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LaboratoryModule, [{
        type: NgModule,
        args: [{
                declarations: [LabDashboardComponent, LabOrdersComponent, ResultEntryComponent],
                imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(LaboratoryModule, { declarations: [LabDashboardComponent, LabOrdersComponent, ResultEntryComponent], imports: [CommonModule, SharedModule, LayoutModule, i1.RouterModule] }); })();
//# sourceMappingURL=laboratory.module.js.map