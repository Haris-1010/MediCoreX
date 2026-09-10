import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "../../../core/services/api.service";
import * as i3 from "@angular/router";
import * as i4 from "../../../core/services/notification.service";
import * as i5 from "@angular/common";
import * as i6 from "@angular/material/button";
import * as i7 from "@angular/material/input";
import * as i8 from "@angular/material/select";
import * as i9 from "../../../shared/components/page-header/page-header.component";
import * as i10 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Doctors", route: "/doctors" });
const _c1 = a0 => ({ label: a0 });
const _c2 = (a0, a1) => [a0, a1];
function DoctorFormComponent_mat_option_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 31);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const d_r1 = ctx.$implicit;
    i0.ɵɵproperty("value", d_r1.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(d_r1.name);
} }
export class DoctorFormComponent {
    constructor(fb, api, route, router, notification) {
        this.fb = fb;
        this.api = api;
        this.route = route;
        this.router = router;
        this.notification = notification;
        this.isEdit = false;
        this.saving = false;
        this.departments = [];
    }
    ngOnInit() {
        this.form = this.fb.group({
            firstName: ['', Validators.required], lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]], phoneNumber: ['', Validators.required],
            specialization: ['', Validators.required], departmentId: ['', Validators.required],
            licenseNumber: ['', Validators.required], consultationFee: [0],
            consultationStartTime: ['09:00', Validators.required],
            consultationEndTime: ['17:00', Validators.required],
            slotDuration: [30, [Validators.required, Validators.min(10)]],
            workingDays: [['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']],
            qualifications: [''], bio: ['']
        });
        this.api.get('v1/departments').subscribe(r => this.departments = Array.isArray(r) ? r : (Array.isArray(r?.items) ? r.items : []));
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEdit = true;
            this.api.getById('v1/doctors', id).subscribe(d => {
                this.form.patchValue({
                    ...d,
                    consultationStartTime: d.consultationStartTime || '09:00',
                    consultationEndTime: d.consultationEndTime || '17:00',
                    slotDuration: d.slotDuration || 30,
                    consultationFee: d.consultationFee || 0,
                    workingDays: Array.isArray(d.workingDays) ? d.workingDays : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
                });
            });
            // load saved per-day schedules and patch form fields
            this.api.get(`v1/doctors/${id}/schedule`).subscribe(schedules => {
                if (!schedules || schedules.length === 0)
                    return;
                const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const workingDays = schedules.map(s => dayNames[s.dayOfWeek]).filter(Boolean);
                const first = schedules[0];
                this.form.patchValue({
                    consultationStartTime: first.startTime || '09:00',
                    consultationEndTime: first.endTime || '17:00',
                    slotDuration: first.slotDuration || 30,
                    consultationFee: first.consultationFee ?? 0,
                    workingDays
                });
            });
        }
    }
    submit() {
        if (this.form.invalid)
            return;
        this.saving = true;
        const req = this.isEdit ? this.api.put('v1/doctors', this.route.snapshot.paramMap.get('id'), this.form.value) : this.api.post('v1/doctors', this.form.value);
        req.subscribe({ next: () => { this.notification.success('Doctor saved'); this.router.navigate(['/doctors']); }, error: () => this.saving = false });
    }
    static { this.ɵfac = function DoctorFormComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DoctorFormComponent)(i0.ɵɵdirectiveInject(i1.FormBuilder), i0.ɵɵdirectiveInject(i2.ApiService), i0.ɵɵdirectiveInject(i3.ActivatedRoute), i0.ɵɵdirectiveInject(i3.Router), i0.ɵɵdirectiveInject(i4.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: DoctorFormComponent, selectors: [["app-doctor-form"]], standalone: false, decls: 90, vars: 12, consts: [[3, "title", "breadcrumbs"], [1, "card"], [3, "ngSubmit", "formGroup"], [1, "form-row"], ["appearance", "outline"], ["matInput", "", "formControlName", "firstName"], ["matInput", "", "formControlName", "lastName"], ["matInput", "", "type", "email", "formControlName", "email"], ["matInput", "", "formControlName", "phoneNumber"], ["matInput", "", "formControlName", "specialization"], ["formControlName", "departmentId"], [3, "value", 4, "ngFor", "ngForOf"], ["matInput", "", "formControlName", "licenseNumber"], ["matInput", "", "type", "number", "formControlName", "consultationFee"], ["matInput", "", "type", "time", "formControlName", "consultationStartTime"], ["matInput", "", "type", "time", "formControlName", "consultationEndTime"], ["matInput", "", "type", "number", "min", "10", "max", "180", "formControlName", "slotDuration"], ["formControlName", "workingDays", "multiple", ""], ["value", "Monday"], ["value", "Tuesday"], ["value", "Wednesday"], ["value", "Thursday"], ["value", "Friday"], ["value", "Saturday"], ["value", "Sunday"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "formControlName", "qualifications", "placeholder", "e.g., MBBS, MD, MS"], ["matInput", "", "formControlName", "bio", "rows", "3"], [1, "form-actions"], ["mat-stroked-button", "", "type", "button", "routerLink", "/doctors"], ["mat-raised-button", "", "color", "primary", "type", "submit", 3, "disabled"], [3, "value"]], template: function DoctorFormComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 0);
            i0.ɵɵelementStart(2, "div", 1)(3, "form", 2);
            i0.ɵɵlistener("ngSubmit", function DoctorFormComponent_Template_form_ngSubmit_3_listener() { return ctx.submit(); });
            i0.ɵɵelementStart(4, "h3");
            i0.ɵɵtext(5, "Personal Information");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "div", 3)(7, "mat-form-field", 4)(8, "mat-label");
            i0.ɵɵtext(9, "First Name");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(10, "input", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "mat-form-field", 4)(12, "mat-label");
            i0.ɵɵtext(13, "Last Name");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(14, "input", 6);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(15, "div", 3)(16, "mat-form-field", 4)(17, "mat-label");
            i0.ɵɵtext(18, "Email");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(19, "input", 7);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "mat-form-field", 4)(21, "mat-label");
            i0.ɵɵtext(22, "Phone");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(23, "input", 8);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(24, "h3");
            i0.ɵɵtext(25, "Professional Information");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "div", 3)(27, "mat-form-field", 4)(28, "mat-label");
            i0.ɵɵtext(29, "Specialization");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(30, "input", 9);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(31, "mat-form-field", 4)(32, "mat-label");
            i0.ɵɵtext(33, "Department");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(34, "mat-select", 10);
            i0.ɵɵtemplate(35, DoctorFormComponent_mat_option_35_Template, 2, 2, "mat-option", 11);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(36, "div", 3)(37, "mat-form-field", 4)(38, "mat-label");
            i0.ɵɵtext(39, "License Number");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(40, "input", 12);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(41, "mat-form-field", 4)(42, "mat-label");
            i0.ɵɵtext(43, "Consultation Fee");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(44, "input", 13);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(45, "div", 3)(46, "mat-form-field", 4)(47, "mat-label");
            i0.ɵɵtext(48, "Consultation Start");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(49, "input", 14);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(50, "mat-form-field", 4)(51, "mat-label");
            i0.ɵɵtext(52, "Consultation End");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(53, "input", 15);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(54, "div", 3)(55, "mat-form-field", 4)(56, "mat-label");
            i0.ɵɵtext(57, "Slot Duration (minutes)");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(58, "input", 16);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(59, "mat-form-field", 4)(60, "mat-label");
            i0.ɵɵtext(61, "Working Days");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(62, "mat-select", 17)(63, "mat-option", 18);
            i0.ɵɵtext(64, "Monday");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(65, "mat-option", 19);
            i0.ɵɵtext(66, "Tuesday");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(67, "mat-option", 20);
            i0.ɵɵtext(68, "Wednesday");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(69, "mat-option", 21);
            i0.ɵɵtext(70, "Thursday");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(71, "mat-option", 22);
            i0.ɵɵtext(72, "Friday");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(73, "mat-option", 23);
            i0.ɵɵtext(74, "Saturday");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(75, "mat-option", 24);
            i0.ɵɵtext(76, "Sunday");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(77, "mat-form-field", 25)(78, "mat-label");
            i0.ɵɵtext(79, "Qualifications");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(80, "input", 26);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(81, "mat-form-field", 25)(82, "mat-label");
            i0.ɵɵtext(83, "Bio");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(84, "textarea", 27);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(85, "div", 28)(86, "button", 29);
            i0.ɵɵtext(87, "Cancel");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(88, "button", 30);
            i0.ɵɵtext(89);
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("title", ctx.isEdit ? "Edit Doctor" : "Add Doctor")("breadcrumbs", i0.ɵɵpureFunction2(9, _c2, i0.ɵɵpureFunction0(6, _c0), i0.ɵɵpureFunction1(7, _c1, ctx.isEdit ? "Edit" : "Add")));
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("formGroup", ctx.form);
            i0.ɵɵadvance(32);
            i0.ɵɵproperty("ngForOf", ctx.departments);
            i0.ɵɵadvance(53);
            i0.ɵɵproperty("disabled", ctx.form.invalid || ctx.saving);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate(ctx.saving ? "Saving..." : "Save Doctor");
        } }, dependencies: [i5.NgForOf, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.MinValidator, i1.MaxValidator, i1.FormGroupDirective, i1.FormControlName, i3.RouterLink, i6.MatButton, i7.MatInput, i7.MatFormField, i7.MatLabel, i8.MatSelect, i8.MatOption, i9.PageHeaderComponent, i10.MainLayoutComponent], styles: [".card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; max-width: 800px; } h3[_ngcontent-%COMP%] { margin: 1.5rem 0 1rem; } h3[_ngcontent-%COMP%]:first-child { margin-top: 0; }\n    .form-row[_ngcontent-%COMP%] { display: flex; gap: 1rem; } .form-row[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] { flex: 1; } .full-width[_ngcontent-%COMP%] { width: 100%; }\n    .form-actions[_ngcontent-%COMP%] { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DoctorFormComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-doctor-form', template: `
    <app-main-layout>
      <app-page-header [title]="isEdit ? 'Edit Doctor' : 'Add Doctor'" [breadcrumbs]="[{ label: 'Doctors', route: '/doctors' }, { label: isEdit ? 'Edit' : 'Add' }]"></app-page-header>
      <div class="card">
        <form [formGroup]="form" (ngSubmit)="submit()">
          <h3>Personal Information</h3>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>First Name</mat-label><input matInput formControlName="firstName"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Last Name</mat-label><input matInput formControlName="lastName"></mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Email</mat-label><input matInput type="email" formControlName="email"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Phone</mat-label><input matInput formControlName="phoneNumber"></mat-form-field>
          </div>

          <h3>Professional Information</h3>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Specialization</mat-label><input matInput formControlName="specialization"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Department</mat-label><mat-select formControlName="departmentId"><mat-option *ngFor="let d of departments" [value]="d.id">{{ d.name }}</mat-option></mat-select></mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>License Number</mat-label><input matInput formControlName="licenseNumber"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Consultation Fee</mat-label><input matInput type="number" formControlName="consultationFee"></mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Consultation Start</mat-label><input matInput type="time" formControlName="consultationStartTime"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Consultation End</mat-label><input matInput type="time" formControlName="consultationEndTime"></mat-form-field>
          </div>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Slot Duration (minutes)</mat-label><input matInput type="number" min="10" max="180" formControlName="slotDuration"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Working Days</mat-label><mat-select formControlName="workingDays" multiple>
              <mat-option value="Monday">Monday</mat-option>
              <mat-option value="Tuesday">Tuesday</mat-option>
              <mat-option value="Wednesday">Wednesday</mat-option>
              <mat-option value="Thursday">Thursday</mat-option>
              <mat-option value="Friday">Friday</mat-option>
              <mat-option value="Saturday">Saturday</mat-option>
              <mat-option value="Sunday">Sunday</mat-option>
            </mat-select></mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Qualifications</mat-label><input matInput formControlName="qualifications" placeholder="e.g., MBBS, MD, MS"></mat-form-field>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Bio</mat-label><textarea matInput formControlName="bio" rows="3"></textarea></mat-form-field>

          <div class="form-actions">
            <button mat-stroked-button type="button" routerLink="/doctors">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">{{ saving ? 'Saving...' : 'Save Doctor' }}</button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `, styles: [".card { background: white; padding: 1.5rem; border-radius: 8px; max-width: 800px; } h3 { margin: 1.5rem 0 1rem; } h3:first-child { margin-top: 0; }\n    .form-row { display: flex; gap: 1rem; } .form-row mat-form-field { flex: 1; } .full-width { width: 100%; }\n    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem; }"] }]
    }], () => [{ type: i1.FormBuilder }, { type: i2.ApiService }, { type: i3.ActivatedRoute }, { type: i3.Router }, { type: i4.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(DoctorFormComponent, { className: "DoctorFormComponent", filePath: "app/features/doctors/doctor-form/doctor-form.component.ts", lineNumber: 65 }); })();
//# sourceMappingURL=doctor-form.component.js.map