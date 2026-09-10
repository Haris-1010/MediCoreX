import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { FacilityDashboardComponent } from './facility-dashboard/facility-dashboard.component';
import { BuildingListComponent } from './building-list/building-list.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    { path: '', component: FacilityDashboardComponent },
    { path: 'buildings', component: BuildingListComponent }
];
export class FacilityModule {
    static { this.ɵfac = function FacilityModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || FacilityModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: FacilityModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule, FormsModule, SharedModule, LayoutModule, RouterModule.forChild(routes)] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(FacilityModule, [{
        type: NgModule,
        args: [{
                declarations: [FacilityDashboardComponent, BuildingListComponent],
                imports: [CommonModule, FormsModule, SharedModule, LayoutModule, RouterModule.forChild(routes)]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(FacilityModule, { declarations: [FacilityDashboardComponent, BuildingListComponent], imports: [CommonModule, FormsModule, SharedModule, LayoutModule, i1.RouterModule] }); })();
//# sourceMappingURL=facility.module.js.map