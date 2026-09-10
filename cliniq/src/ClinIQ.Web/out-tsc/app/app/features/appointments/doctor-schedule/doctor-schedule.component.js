import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "../../../core/services/api.service";
import * as i3 from "../../../core/services/notification.service";
import * as i4 from "@angular/common";
import * as i5 from "@angular/material/button";
import * as i6 from "@angular/material/icon";
import * as i7 from "@angular/material/input";
import * as i8 from "@angular/material/select";
import * as i9 from "../../../shared/components/page-header/page-header.component";
import * as i10 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "Appointments", route: "/appointments" });
const _c2 = () => ({ label: "Schedule" });
const _c3 = (a0, a1, a2) => [a0, a1, a2];
function DoctorScheduleComponent_mat_option_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 6);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const d_r1 = ctx.$implicit;
    i0.ɵɵproperty("value", d_r1.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Dr. ", d_r1.fullName, "");
} }
function DoctorScheduleComponent_div_8_div_2_mat_option_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 6);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const d_r5 = ctx.$implicit;
    const di_r6 = ctx.index;
    i0.ɵɵproperty("value", di_r6);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(d_r5);
} }
function DoctorScheduleComponent_div_8_div_2_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 13)(1, "div", 14)(2, "mat-form-field", 2)(3, "mat-label");
    i0.ɵɵtext(4, "Day");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "mat-select", 15);
    i0.ɵɵtemplate(6, DoctorScheduleComponent_div_8_div_2_mat_option_6_Template, 2, 2, "mat-option", 4);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "mat-form-field", 2)(8, "mat-label");
    i0.ɵɵtext(9, "Start Time");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(10, "input", 16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "mat-form-field", 2)(12, "mat-label");
    i0.ɵɵtext(13, "End Time");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(14, "input", 17);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(15, "mat-form-field", 2)(16, "mat-label");
    i0.ɵɵtext(17, "Slot Duration (min)");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(18, "input", 18);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "button", 19);
    i0.ɵɵlistener("click", function DoctorScheduleComponent_div_8_div_2_Template_button_click_19_listener() { const i_r7 = i0.ɵɵrestoreView(_r4).index; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.removeSlot(i_r7)); });
    i0.ɵɵelementStart(20, "mat-icon");
    i0.ɵɵtext(21, "delete");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const i_r7 = ctx.index;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("formGroupName", i_r7);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngForOf", ctx_r2.days);
} }
function DoctorScheduleComponent_div_8_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 7)(1, "form", 8);
    i0.ɵɵlistener("ngSubmit", function DoctorScheduleComponent_div_8_Template_form_ngSubmit_1_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.saveSchedule()); });
    i0.ɵɵtemplate(2, DoctorScheduleComponent_div_8_div_2_Template, 22, 2, "div", 9);
    i0.ɵɵelementStart(3, "button", 10);
    i0.ɵɵlistener("click", function DoctorScheduleComponent_div_8_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.addSlot()); });
    i0.ɵɵelementStart(4, "mat-icon");
    i0.ɵɵtext(5, "add");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(6, " Add Slot");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 11)(8, "button", 12);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("formGroup", ctx_r2.scheduleForm);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r2.slotsArray.controls);
    i0.ɵɵadvance(6);
    i0.ɵɵproperty("disabled", ctx_r2.saving);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r2.saving ? "Saving..." : "Save Schedule");
} }
export class DoctorScheduleComponent {
    constructor(fb, api, notification) {
        this.fb = fb;
        this.api = api;
        this.notification = notification;
        this.doctors = [];
        this.selectedDoctorId = null;
        this.saving = false;
        this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    }
    ngOnInit() {
        this.scheduleForm = this.fb.group({ slots: this.fb.array([]) });
        this.api.get('v1/doctors').subscribe(r => this.doctors = r);
    }
    get slotsArray() { return this.scheduleForm.get('slots'); }
    loadSchedule() {
        if (!this.selectedDoctorId)
            return;
        this.slotsArray.clear();
        this.api.get(`v1/doctors/${this.selectedDoctorId}/schedule`).subscribe(slots => {
            slots.forEach(s => this.slotsArray.push(this.fb.group({ dayOfWeek: s.dayOfWeek, startTime: s.startTime, endTime: s.endTime, slotDuration: s.slotDuration })));
        });
    }
    addSlot() { this.slotsArray.push(this.fb.group({ dayOfWeek: [1, Validators.required], startTime: ['09:00', Validators.required], endTime: ['17:00', Validators.required], slotDuration: [30, Validators.required] })); }
    removeSlot(i) { this.slotsArray.removeAt(i); }
    saveSchedule() {
        this.saving = true;
        this.api.put(`v1/doctors/${this.selectedDoctorId}/schedule`, '', this.slotsArray.value).subscribe({
            next: () => { this.notification.success('Schedule saved'); this.saving = false; },
            error: () => this.saving = false
        });
    }
    static { this.ɵfac = function DoctorScheduleComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DoctorScheduleComponent)(i0.ɵɵdirectiveInject(i1.FormBuilder), i0.ɵɵdirectiveInject(i2.ApiService), i0.ɵɵdirectiveInject(i3.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: DoctorScheduleComponent, selectors: [["app-doctor-schedule"]], standalone: false, decls: 9, vars: 11, consts: [["title", "Doctor Schedule", "subtitle", "Manage doctor availability", 3, "breadcrumbs"], [1, "card"], ["appearance", "outline"], [3, "valueChange", "selectionChange", "value"], [3, "value", 4, "ngFor", "ngForOf"], ["class", "schedule-form", 4, "ngIf"], [3, "value"], [1, "schedule-form"], [3, "ngSubmit", "formGroup"], ["formArrayName", "slots", 4, "ngFor", "ngForOf"], ["mat-stroked-button", "", "type", "button", 3, "click"], [1, "form-actions"], ["mat-raised-button", "", "color", "primary", "type", "submit", 3, "disabled"], ["formArrayName", "slots"], [1, "slot-row", 3, "formGroupName"], ["formControlName", "dayOfWeek"], ["matInput", "", "type", "time", "formControlName", "startTime"], ["matInput", "", "type", "time", "formControlName", "endTime"], ["matInput", "", "type", "number", "formControlName", "slotDuration"], ["mat-icon-button", "", "color", "warn", "type", "button", 3, "click"]], template: function DoctorScheduleComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 0);
            i0.ɵɵelementStart(2, "div", 1)(3, "mat-form-field", 2)(4, "mat-label");
            i0.ɵɵtext(5, "Select Doctor");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "mat-select", 3);
            i0.ɵɵtwoWayListener("valueChange", function DoctorScheduleComponent_Template_mat_select_valueChange_6_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.selectedDoctorId, $event) || (ctx.selectedDoctorId = $event); return $event; });
            i0.ɵɵlistener("selectionChange", function DoctorScheduleComponent_Template_mat_select_selectionChange_6_listener() { return ctx.loadSchedule(); });
            i0.ɵɵtemplate(7, DoctorScheduleComponent_mat_option_7_Template, 2, 2, "mat-option", 4);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(8, DoctorScheduleComponent_div_8_Template, 10, 4, "div", 5);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction3(7, _c3, i0.ɵɵpureFunction0(4, _c0), i0.ɵɵpureFunction0(5, _c1), i0.ɵɵpureFunction0(6, _c2)));
            i0.ɵɵadvance(5);
            i0.ɵɵtwoWayProperty("value", ctx.selectedDoctorId);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.doctors);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.selectedDoctorId);
        } }, dependencies: [i4.NgForOf, i4.NgIf, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, i1.FormGroupName, i1.FormArrayName, i5.MatButton, i5.MatIconButton, i6.MatIcon, i7.MatInput, i7.MatFormField, i7.MatLabel, i8.MatSelect, i8.MatOption, i9.PageHeaderComponent, i10.MainLayoutComponent], styles: [".card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; }\n    .slot-row[_ngcontent-%COMP%] { display: flex; gap: 1rem; align-items: center; margin-bottom: 0.5rem; } .slot-row[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] { flex: 1; }\n    .form-actions[_ngcontent-%COMP%] { margin-top: 1rem; display: flex; justify-content: flex-end; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DoctorScheduleComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-doctor-schedule', template: `
    <app-main-layout>
      <app-page-header title="Doctor Schedule" subtitle="Manage doctor availability"
        [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Appointments', route: '/appointments' }, { label: 'Schedule' }]">
      </app-page-header>

      <div class="card">
        <mat-form-field appearance="outline">
          <mat-label>Select Doctor</mat-label>
          <mat-select [(value)]="selectedDoctorId" (selectionChange)="loadSchedule()">
            <mat-option *ngFor="let d of doctors" [value]="d.id">Dr. {{ d.fullName }}</mat-option>
          </mat-select>
        </mat-form-field>

        <div *ngIf="selectedDoctorId" class="schedule-form">
          <form [formGroup]="scheduleForm" (ngSubmit)="saveSchedule()">
            <div formArrayName="slots" *ngFor="let slot of slotsArray.controls; let i = index">
              <div [formGroupName]="i" class="slot-row">
                <mat-form-field appearance="outline">
                  <mat-label>Day</mat-label>
                  <mat-select formControlName="dayOfWeek">
                    <mat-option *ngFor="let d of days; let di = index" [value]="di">{{ d }}</mat-option>
                  </mat-select>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Start Time</mat-label>
                  <input matInput type="time" formControlName="startTime">
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>End Time</mat-label>
                  <input matInput type="time" formControlName="endTime">
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Slot Duration (min)</mat-label>
                  <input matInput type="number" formControlName="slotDuration">
                </mat-form-field>
                <button mat-icon-button color="warn" type="button" (click)="removeSlot(i)"><mat-icon>delete</mat-icon></button>
              </div>
            </div>
            <button mat-stroked-button type="button" (click)="addSlot()"><mat-icon>add</mat-icon> Add Slot</button>
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="saving">{{ saving ? 'Saving...' : 'Save Schedule' }}</button>
            </div>
          </form>
        </div>
      </div>
    </app-main-layout>
  `, styles: [".card { background: white; padding: 1.5rem; border-radius: 8px; }\n    .slot-row { display: flex; gap: 1rem; align-items: center; margin-bottom: 0.5rem; } .slot-row mat-form-field { flex: 1; }\n    .form-actions { margin-top: 1rem; display: flex; justify-content: flex-end; }"] }]
    }], () => [{ type: i1.FormBuilder }, { type: i2.ApiService }, { type: i3.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(DoctorScheduleComponent, { className: "DoctorScheduleComponent", filePath: "app/features/appointments/doctor-schedule/doctor-schedule.component.ts", lineNumber: 61 }); })();
//# sourceMappingURL=doctor-schedule.component.js.map