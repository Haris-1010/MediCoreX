import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { PatientSearchComponent } from './components/patient-search/patient-search.component';
import { PatientCardComponent } from './components/patient-card/patient-card.component';
import { MedicalHistoryComponent } from './components/medical-history/medical-history.component';
import { VisitHistoryComponent } from './components/visit-history/visit-history.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    { path: '', component: PatientListComponent },
    { path: 'new', component: PatientFormComponent },
    { path: ':id', component: PatientDetailComponent },
    { path: ':id/edit', component: PatientFormComponent }
];
export class PatientsModule {
    static { this.ɵfac = function PatientsModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PatientsModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: PatientsModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule,
            SharedModule,
            LayoutModule,
            RouterModule.forChild(routes)] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PatientsModule, [{
        type: NgModule,
        args: [{
                declarations: [
                    PatientListComponent,
                    PatientDetailComponent,
                    PatientFormComponent,
                    PatientSearchComponent,
                    PatientCardComponent,
                    MedicalHistoryComponent,
                    VisitHistoryComponent
                ],
                imports: [
                    CommonModule,
                    SharedModule,
                    LayoutModule,
                    RouterModule.forChild(routes)
                ]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(PatientsModule, { declarations: [PatientListComponent,
        PatientDetailComponent,
        PatientFormComponent,
        PatientSearchComponent,
        PatientCardComponent,
        MedicalHistoryComponent,
        VisitHistoryComponent], imports: [CommonModule,
        SharedModule,
        LayoutModule, i1.RouterModule] }); })();
//# sourceMappingURL=patients.module.js.map