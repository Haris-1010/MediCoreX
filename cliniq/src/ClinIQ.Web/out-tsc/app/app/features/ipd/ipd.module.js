import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { IpdDashboardComponent } from './ipd-dashboard/ipd-dashboard.component';
import { AdmissionListComponent } from './admission-list/admission-list.component';
import { AdmissionFormComponent } from './admission-form/admission-form.component';
import { BedManagementComponent } from './bed-management/bed-management.component';
import { DischargeComponent } from './discharge/discharge.component';
import { NursingStationComponent } from './nursing-station/nursing-station.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    { path: '', component: IpdDashboardComponent },
    { path: 'admissions', component: AdmissionListComponent },
    { path: 'admit', component: AdmissionFormComponent },
    { path: 'beds', component: BedManagementComponent },
    { path: 'discharge/:id', component: DischargeComponent },
    { path: 'nursing', component: NursingStationComponent }
];
export class IpdModule {
    static { this.ɵfac = function IpdModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IpdModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: IpdModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IpdModule, [{
        type: NgModule,
        args: [{
                declarations: [IpdDashboardComponent, AdmissionListComponent, AdmissionFormComponent, BedManagementComponent, DischargeComponent, NursingStationComponent],
                imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(IpdModule, { declarations: [IpdDashboardComponent, AdmissionListComponent, AdmissionFormComponent, BedManagementComponent, DischargeComponent, NursingStationComponent], imports: [CommonModule, SharedModule, LayoutModule, i1.RouterModule] }); })();
//# sourceMappingURL=ipd.module.js.map