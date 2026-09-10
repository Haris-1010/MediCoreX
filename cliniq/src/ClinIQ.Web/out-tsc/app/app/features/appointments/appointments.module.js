import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component';
import { DoctorScheduleComponent } from './doctor-schedule/doctor-schedule.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    { path: '', component: AppointmentListComponent },
    { path: 'calendar', component: AppointmentCalendarComponent },
    { path: 'new', component: AppointmentFormComponent },
    { path: ':id/edit', component: AppointmentFormComponent },
    { path: 'schedule', component: DoctorScheduleComponent }
];
export class AppointmentsModule {
    static { this.ɵfac = function AppointmentsModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppointmentsModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: AppointmentsModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppointmentsModule, [{
        type: NgModule,
        args: [{
                declarations: [AppointmentListComponent, AppointmentFormComponent, AppointmentCalendarComponent, DoctorScheduleComponent],
                imports: [CommonModule, SharedModule, LayoutModule, RouterModule.forChild(routes)]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(AppointmentsModule, { declarations: [AppointmentListComponent, AppointmentFormComponent, AppointmentCalendarComponent, DoctorScheduleComponent], imports: [CommonModule, SharedModule, LayoutModule, i1.RouterModule] }); })();
//# sourceMappingURL=appointments.module.js.map