import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { OpdDashboardComponent } from './opd-dashboard/opd-dashboard.component';
import { QueueManagementComponent } from './queue-management/queue-management.component';
import { ConsultationComponent } from './consultation/consultation.component';
import { TokenDisplayComponent } from './token-display/token-display.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    { path: '', component: OpdDashboardComponent },
    { path: 'queue', component: QueueManagementComponent },
    { path: 'consultation/:id', component: ConsultationComponent },
    { path: 'display', component: TokenDisplayComponent }
];
export class OpdModule {
    static { this.ɵfac = function OpdModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || OpdModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: OpdModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(OpdModule, [{
        type: NgModule,
        args: [{
                declarations: [OpdDashboardComponent, QueueManagementComponent, ConsultationComponent, TokenDisplayComponent],
                imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(OpdModule, { declarations: [OpdDashboardComponent, QueueManagementComponent, ConsultationComponent, TokenDisplayComponent], imports: [CommonModule, SharedModule, LayoutModule, i1.RouterModule] }); })();
//# sourceMappingURL=opd.module.js.map