import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { SettingsComponent } from './settings.component';
import { UserListComponent } from './users/user-list.component';
import { UserFormComponent } from './users/user-form.component';
import { RoleListComponent } from './roles/role-list.component';
import { RoleFormComponent } from './roles/role-form.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    { path: '', component: SettingsComponent },
    { path: 'users', component: UserListComponent },
    { path: 'users/new', component: UserFormComponent },
    { path: 'users/edit/:id', component: UserFormComponent },
    { path: 'roles', component: RoleListComponent },
    { path: 'roles/new', component: RoleFormComponent },
    { path: 'roles/edit/:id', component: RoleFormComponent }
];
export class SettingsModule {
    static { this.ɵfac = function SettingsModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SettingsModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: SettingsModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule,
            FormsModule,
            SharedModule,
            LayoutModule,
            RouterModule.forChild(routes)] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SettingsModule, [{
        type: NgModule,
        args: [{
                declarations: [
                    SettingsComponent,
                    UserListComponent,
                    UserFormComponent,
                    RoleListComponent,
                    RoleFormComponent
                ],
                imports: [
                    CommonModule,
                    FormsModule,
                    SharedModule,
                    LayoutModule,
                    RouterModule.forChild(routes)
                ]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(SettingsModule, { declarations: [SettingsComponent,
        UserListComponent,
        UserFormComponent,
        RoleListComponent,
        RoleFormComponent], imports: [CommonModule,
        FormsModule,
        SharedModule,
        LayoutModule, i1.RouterModule] }); })();
//# sourceMappingURL=settings.module.js.map