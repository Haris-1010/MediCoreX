import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { DepartmentListComponent } from './department-list/department-list.component';
import { DepartmentFormComponent } from './department-form/department-form.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    { path: '', component: DepartmentListComponent },
    { path: 'new', component: DepartmentFormComponent },
    { path: 'edit/:id', component: DepartmentFormComponent }
];
export class DepartmentsModule {
    static { this.ɵfac = function DepartmentsModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DepartmentsModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: DepartmentsModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            SharedModule,
            LayoutModule,
            RouterModule.forChild(routes)] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DepartmentsModule, [{
        type: NgModule,
        args: [{
                declarations: [
                    DepartmentListComponent,
                    DepartmentFormComponent
                ],
                imports: [
                    CommonModule,
                    FormsModule,
                    ReactiveFormsModule,
                    SharedModule,
                    LayoutModule,
                    RouterModule.forChild(routes)
                ]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(DepartmentsModule, { declarations: [DepartmentListComponent,
        DepartmentFormComponent], imports: [CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        LayoutModule, i1.RouterModule] }); })();
//# sourceMappingURL=departments.module.js.map