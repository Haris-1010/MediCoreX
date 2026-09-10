import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/material/icon";
import * as i3 from "../../../../shared/components/loading-spinner/loading-spinner.component";
import * as i4 from "../../../../shared/components/status-badge/status-badge.component";
function AppointmentWidgetComponent_app_loading_spinner_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-loading-spinner");
} }
function AppointmentWidgetComponent_div_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 4)(1, "mat-icon");
    i0.ɵɵtext(2, "event_busy");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4, "No appointments scheduled for today");
    i0.ɵɵelementEnd()();
} }
function AppointmentWidgetComponent_div_3_div_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 7)(1, "div", 8);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 9)(4, "div", 10);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 11)(7, "mat-icon");
    i0.ɵɵtext(8, "person");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "div", 12)(11, "span", 13);
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(13, "app-status-badge", 14);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const appointment_r1 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", appointment_r1.time, " ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(appointment_r1.patientName);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", appointment_r1.doctorName, " ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(appointment_r1.type);
    i0.ɵɵadvance();
    i0.ɵɵproperty("status", appointment_r1.status);
} }
function AppointmentWidgetComponent_div_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 5);
    i0.ɵɵtemplate(1, AppointmentWidgetComponent_div_3_div_1_Template, 14, 5, "div", 6);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.appointments);
} }
export class AppointmentWidgetComponent {
    constructor() {
        this.appointments = [];
        this.loading = false;
    }
    static { this.ɵfac = function AppointmentWidgetComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppointmentWidgetComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AppointmentWidgetComponent, selectors: [["app-appointment-widget"]], inputs: { appointments: "appointments", loading: "loading" }, standalone: false, decls: 4, vars: 3, consts: [[1, "appointment-widget"], [4, "ngIf"], ["class", "empty-state", 4, "ngIf"], ["class", "appointment-list", 4, "ngIf"], [1, "empty-state"], [1, "appointment-list"], ["class", "appointment-item", 4, "ngFor", "ngForOf"], [1, "appointment-item"], [1, "appointment-time"], [1, "appointment-details"], [1, "patient-name"], [1, "doctor-name"], [1, "appointment-meta"], [1, "appointment-type"], [3, "status"]], template: function AppointmentWidgetComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵtemplate(1, AppointmentWidgetComponent_app_loading_spinner_1_Template, 1, 0, "app-loading-spinner", 1)(2, AppointmentWidgetComponent_div_2_Template, 5, 0, "div", 2)(3, AppointmentWidgetComponent_div_3_Template, 2, 1, "div", 3);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading && ctx.appointments.length === 0);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading && ctx.appointments.length > 0);
        } }, dependencies: [i1.NgForOf, i1.NgIf, i2.MatIcon, i3.LoadingSpinnerComponent, i4.StatusBadgeComponent], styles: [".appointment-widget[_ngcontent-%COMP%] {\n      min-height: 200px;\n    }\n\n    .empty-state[_ngcontent-%COMP%] {\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: center;\n      padding: 2rem;\n      color: #666;\n    }\n\n    .empty-state[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n      font-size: 48px;\n      width: 48px;\n      height: 48px;\n      color: #ccc;\n      margin-bottom: 0.5rem;\n    }\n\n    .appointment-list[_ngcontent-%COMP%] {\n      display: flex;\n      flex-direction: column;\n      gap: 0.75rem;\n    }\n\n    .appointment-item[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 1rem;\n      padding: 0.75rem;\n      border-radius: 8px;\n      background: #f5f5f5;\n    }\n\n    .appointment-time[_ngcontent-%COMP%] {\n      font-size: 0.875rem;\n      font-weight: 600;\n      color: #3f51b5;\n      min-width: 60px;\n    }\n\n    .appointment-details[_ngcontent-%COMP%] {\n      flex: 1;\n    }\n\n    .patient-name[_ngcontent-%COMP%] {\n      font-weight: 500;\n    }\n\n    .doctor-name[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 0.25rem;\n      font-size: 0.75rem;\n      color: #666;\n    }\n\n    .doctor-name[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n      font-size: 14px;\n      width: 14px;\n      height: 14px;\n    }\n\n    .appointment-meta[_ngcontent-%COMP%] {\n      display: flex;\n      flex-direction: column;\n      align-items: flex-end;\n      gap: 0.25rem;\n    }\n\n    .appointment-type[_ngcontent-%COMP%] {\n      font-size: 0.75rem;\n      color: #666;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppointmentWidgetComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-appointment-widget', template: `
    <div class="appointment-widget">
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <div *ngIf="!loading && appointments.length === 0" class="empty-state">
        <mat-icon>event_busy</mat-icon>
        <span>No appointments scheduled for today</span>
      </div>

      <div class="appointment-list" *ngIf="!loading && appointments.length > 0">
        <div class="appointment-item" *ngFor="let appointment of appointments">
          <div class="appointment-time">
            {{ appointment.time }}
          </div>
          <div class="appointment-details">
            <div class="patient-name">{{ appointment.patientName }}</div>
            <div class="doctor-name">
              <mat-icon>person</mat-icon>
              {{ appointment.doctorName }}
            </div>
          </div>
          <div class="appointment-meta">
            <span class="appointment-type">{{ appointment.type }}</span>
            <app-status-badge [status]="appointment.status"></app-status-badge>
          </div>
        </div>
      </div>
    </div>
  `, styles: ["\n    .appointment-widget {\n      min-height: 200px;\n    }\n\n    .empty-state {\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: center;\n      padding: 2rem;\n      color: #666;\n    }\n\n    .empty-state mat-icon {\n      font-size: 48px;\n      width: 48px;\n      height: 48px;\n      color: #ccc;\n      margin-bottom: 0.5rem;\n    }\n\n    .appointment-list {\n      display: flex;\n      flex-direction: column;\n      gap: 0.75rem;\n    }\n\n    .appointment-item {\n      display: flex;\n      align-items: center;\n      gap: 1rem;\n      padding: 0.75rem;\n      border-radius: 8px;\n      background: #f5f5f5;\n    }\n\n    .appointment-time {\n      font-size: 0.875rem;\n      font-weight: 600;\n      color: #3f51b5;\n      min-width: 60px;\n    }\n\n    .appointment-details {\n      flex: 1;\n    }\n\n    .patient-name {\n      font-weight: 500;\n    }\n\n    .doctor-name {\n      display: flex;\n      align-items: center;\n      gap: 0.25rem;\n      font-size: 0.75rem;\n      color: #666;\n    }\n\n    .doctor-name mat-icon {\n      font-size: 14px;\n      width: 14px;\n      height: 14px;\n    }\n\n    .appointment-meta {\n      display: flex;\n      flex-direction: column;\n      align-items: flex-end;\n      gap: 0.25rem;\n    }\n\n    .appointment-type {\n      font-size: 0.75rem;\n      color: #666;\n    }\n  "] }]
    }], null, { appointments: [{
            type: Input
        }], loading: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AppointmentWidgetComponent, { className: "AppointmentWidgetComponent", filePath: "app/features/dashboard/components/appointment-widget/appointment-widget.component.ts", lineNumber: 123 }); })();
//# sourceMappingURL=appointment-widget.component.js.map