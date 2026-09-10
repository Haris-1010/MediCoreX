import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { EmergencyDashboardComponent } from './emergency-dashboard/emergency-dashboard.component';
import { TriageComponent } from './triage/triage.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    { path: '', component: EmergencyDashboardComponent },
    { path: 'triage', component: TriageComponent }
];
export class EmergencyModule {
    static { this.ɵfac = function EmergencyModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || EmergencyModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: EmergencyModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(EmergencyModule, [{
        type: NgModule,
        args: [{
                declarations: [EmergencyDashboardComponent, TriageComponent],
                imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(EmergencyModule, { declarations: [EmergencyDashboardComponent, TriageComponent], imports: [CommonModule, SharedModule, LayoutModule, i1.RouterModule] }); })();
//# sourceMappingURL=emergency.module.js.map