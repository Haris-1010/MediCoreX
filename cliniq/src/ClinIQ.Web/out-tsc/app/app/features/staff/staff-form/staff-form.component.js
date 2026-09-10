import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@angular/router";
import * as i3 from "../../../core/services/api.service";
import * as i4 from "../../../core/services/notification.service";
import * as i5 from "@angular/common";
import * as i6 from "@angular/material/button";
import * as i7 from "@angular/material/icon";
import * as i8 from "@angular/material/input";
import * as i9 from "@angular/material/select";
import * as i10 from "@angular/material/progress-spinner";
import * as i11 from "../../../shared/components/page-header/page-header.component";
import * as i12 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "Staff", route: "/staff" });
const _c2 = a0 => ({ label: a0 });
const _c3 = (a0, a1, a2) => [a0, a1, a2];
function StaffFormComponent_mat_form_field_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-form-field", 4)(1, "mat-label");
    i0.ɵɵtext(2, "Password");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(3, "input", 19);
    i0.ɵɵelementStart(4, "mat-icon", 8);
    i0.ɵɵtext(5, "lock");
    i0.ɵɵelementEnd()();
} }
function StaffFormComponent_mat_option_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 20);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const r_r1 = ctx.$implicit;
    i0.ɵɵproperty("value", r_r1.name);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(r_r1.name);
} }
function StaffFormComponent_mat_spinner_47_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "mat-spinner", 21);
} }
function StaffFormComponent_span_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span")(1, "mat-icon");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.isEditMode ? "save" : "person_add");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.isEditMode ? "Update Staff" : "Add Staff", " ");
} }
export class StaffFormComponent {
    constructor(fb, route, router, api, notification) {
        this.fb = fb;
        this.route = route;
        this.router = router;
        this.api = api;
        this.notification = notification;
        this.isEditMode = false;
        this.staffId = null;
        this.saving = false;
        this.roles = [];
    }
    ngOnInit() {
        this.initForm();
        this.staffId = this.route.snapshot.paramMap.get('id');
        this.loadRoles();
        if (this.staffId) {
            this.isEditMode = true;
            this.loadStaff(this.staffId);
        }
    }
    initForm() {
        this.staffForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['ChangeMe@123'],
            phone: [''],
            role: ['']
        });
    }
    loadRoles() {
        this.api.get('v1/roles').subscribe({
            next: (r) => { this.roles = r; },
            error: () => { this.roles = []; }
        });
    }
    loadStaff(id) {
        this.api.getById('v1/staff', id).subscribe({
            next: (staff) => {
                this.staffForm.patchValue({
                    firstName: staff.firstName || staff.fullName?.split(' ')[0],
                    lastName: staff.lastName || staff.fullName?.split(' ').slice(1).join(' '),
                    email: staff.email,
                    phone: staff.phoneNumber,
                    role: staff.role
                });
            }
        });
    }
    goBack() {
        this.router.navigate(['/staff']);
    }
    onSubmit() {
        if (this.staffForm.invalid || this.saving)
            return;
        this.saving = true;
        this.staffForm.disable();
        const formValue = this.staffForm.getRawValue();
        const payload = {
            firstName: formValue.firstName,
            lastName: formValue.lastName,
            email: formValue.email,
            password: formValue.password || 'ChangeMe@123',
            phone: formValue.phone || null,
            role: formValue.role || null
        };
        const request = this.isEditMode
            ? this.api.put('v1/staff', this.staffId, payload)
            : this.api.post('v1/staff', payload);
        request.subscribe({
            next: () => {
                this.notification.success(this.isEditMode ? 'Staff updated successfully' : 'Staff member added successfully');
                this.router.navigate(['/staff']);
            },
            error: () => {
                this.saving = false;
                this.staffForm.enable();
            },
            complete: () => {
                this.saving = false;
            }
        });
    }
    static { this.ɵfac = function StaffFormComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StaffFormComponent)(i0.ɵɵdirectiveInject(i1.FormBuilder), i0.ɵɵdirectiveInject(i2.ActivatedRoute), i0.ɵɵdirectiveInject(i2.Router), i0.ɵɵdirectiveInject(i3.ApiService), i0.ɵɵdirectiveInject(i4.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StaffFormComponent, selectors: [["app-staff-form"]], standalone: false, decls: 49, vars: 17, consts: [[3, "title", "subtitle", "breadcrumbs"], [1, "card"], [3, "ngSubmit", "formGroup"], [1, "form-row"], ["appearance", "outline"], ["matInput", "", "formControlName", "firstName"], ["matInput", "", "formControlName", "lastName"], ["matInput", "", "type", "email", "formControlName", "email"], ["matPrefix", ""], ["appearance", "outline", 4, "ngIf"], ["matInput", "", "formControlName", "phone"], ["formControlName", "role"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], [1, "action-buttons"], ["mat-stroked-button", "", "type", "button", 3, "click"], ["mat-raised-button", "", "color", "primary", "type", "submit", 3, "disabled"], ["diameter", "20", 4, "ngIf"], [4, "ngIf"], ["matInput", "", "type", "password", "formControlName", "password"], [3, "value"], ["diameter", "20"]], template: function StaffFormComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 0);
            i0.ɵɵelementStart(2, "div", 1)(3, "form", 2);
            i0.ɵɵlistener("ngSubmit", function StaffFormComponent_Template_form_ngSubmit_3_listener() { return ctx.onSubmit(); });
            i0.ɵɵelementStart(4, "div", 3)(5, "mat-form-field", 4)(6, "mat-label");
            i0.ɵɵtext(7, "First Name");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(8, "input", 5);
            i0.ɵɵelementStart(9, "mat-error");
            i0.ɵɵtext(10, "First name is required");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(11, "mat-form-field", 4)(12, "mat-label");
            i0.ɵɵtext(13, "Last Name");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(14, "input", 6);
            i0.ɵɵelementStart(15, "mat-error");
            i0.ɵɵtext(16, "Last name is required");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(17, "div", 3)(18, "mat-form-field", 4)(19, "mat-label");
            i0.ɵɵtext(20, "Email");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(21, "input", 7);
            i0.ɵɵelementStart(22, "mat-icon", 8);
            i0.ɵɵtext(23, "email");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "mat-error");
            i0.ɵɵtext(25, "Email is required");
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(26, StaffFormComponent_mat_form_field_26_Template, 6, 0, "mat-form-field", 9);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(27, "div", 3)(28, "mat-form-field", 4)(29, "mat-label");
            i0.ɵɵtext(30, "Phone");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(31, "input", 10);
            i0.ɵɵelementStart(32, "mat-icon", 8);
            i0.ɵɵtext(33, "phone");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(34, "mat-form-field", 4)(35, "mat-label");
            i0.ɵɵtext(36, "Role");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(37, "mat-select", 11)(38, "mat-option", 12);
            i0.ɵɵtext(39, "Select role");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(40, StaffFormComponent_mat_option_40_Template, 2, 2, "mat-option", 13);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(41, "div", 14)(42, "button", 15);
            i0.ɵɵlistener("click", function StaffFormComponent_Template_button_click_42_listener() { return ctx.goBack(); });
            i0.ɵɵelementStart(43, "mat-icon");
            i0.ɵɵtext(44, "arrow_back");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(45, " Cancel ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(46, "button", 16);
            i0.ɵɵtemplate(47, StaffFormComponent_mat_spinner_47_Template, 1, 0, "mat-spinner", 17)(48, StaffFormComponent_span_48_Template, 4, 2, "span", 18);
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("title", ctx.isEditMode ? "Edit Staff Member" : "Add Staff Member")("subtitle", ctx.isEditMode ? "Update staff information" : "Register a new staff member")("breadcrumbs", i0.ɵɵpureFunction3(13, _c3, i0.ɵɵpureFunction0(9, _c0), i0.ɵɵpureFunction0(10, _c1), i0.ɵɵpureFunction1(11, _c2, ctx.isEditMode ? "Edit" : "New")));
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("formGroup", ctx.staffForm);
            i0.ɵɵadvance(23);
            i0.ɵɵproperty("ngIf", !ctx.isEditMode);
            i0.ɵɵadvance(14);
            i0.ɵɵproperty("ngForOf", ctx.roles);
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("disabled", ctx.saving || ctx.staffForm.invalid);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.saving);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.saving);
        } }, dependencies: [i5.NgForOf, i5.NgIf, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, i6.MatButton, i7.MatIcon, i8.MatInput, i8.MatFormField, i8.MatLabel, i8.MatError, i8.MatPrefix, i9.MatSelect, i9.MatOption, i10.MatProgressSpinner, i11.PageHeaderComponent, i12.MainLayoutComponent], styles: [".card[_ngcontent-%COMP%] {\n      background: white;\n      border-radius: 8px;\n      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n      padding: 1.5rem;\n    }\n\n    .form-row[_ngcontent-%COMP%] {\n      display: flex;\n      gap: 1rem;\n    }\n\n    .form-row[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] {\n      flex: 1;\n    }\n\n    .action-buttons[_ngcontent-%COMP%] {\n      display: flex;\n      justify-content: flex-end;\n      gap: 1rem;\n      margin-top: 1.5rem;\n      padding-top: 1.5rem;\n      border-top: 1px solid #eee;\n    }\n\n    .action-buttons[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 0.5rem;\n    }\n\n    @media (max-width: 768px) {\n      .form-row[_ngcontent-%COMP%] {\n        flex-direction: column;\n      }\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StaffFormComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-staff-form', template: `
    <app-main-layout>
      <app-page-header
        [title]="isEditMode ? 'Edit Staff Member' : 'Add Staff Member'"
        [subtitle]="isEditMode ? 'Update staff information' : 'Register a new staff member'"
        [breadcrumbs]="[
          { label: 'Dashboard', route: '/dashboard' },
          { label: 'Staff', route: '/staff' },
          { label: isEditMode ? 'Edit' : 'New' }
        ]">
      </app-page-header>

      <div class="card">
        <form [formGroup]="staffForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="firstName">
              <mat-error>First name is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastName">
              <mat-error>Last name is required</mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email">
              <mat-icon matPrefix>email</mat-icon>
              <mat-error>Email is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" *ngIf="!isEditMode">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password">
              <mat-icon matPrefix>lock</mat-icon>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Phone</mat-label>
              <input matInput formControlName="phone">
              <mat-icon matPrefix>phone</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Role</mat-label>
              <mat-select formControlName="role">
                <mat-option value="">Select role</mat-option>
                <mat-option *ngFor="let r of roles" [value]="r.name">{{ r.name }}</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="action-buttons">
            <button mat-stroked-button type="button" (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
              Cancel
            </button>
            <button mat-raised-button color="primary" type="submit" [disabled]="saving || staffForm.invalid">
              <mat-spinner diameter="20" *ngIf="saving"></mat-spinner>
              <span *ngIf="!saving">
                <mat-icon>{{ isEditMode ? 'save' : 'person_add' }}</mat-icon>
                {{ isEditMode ? 'Update Staff' : 'Add Staff' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `, styles: ["\n    .card {\n      background: white;\n      border-radius: 8px;\n      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n      padding: 1.5rem;\n    }\n\n    .form-row {\n      display: flex;\n      gap: 1rem;\n    }\n\n    .form-row mat-form-field {\n      flex: 1;\n    }\n\n    .action-buttons {\n      display: flex;\n      justify-content: flex-end;\n      gap: 1rem;\n      margin-top: 1.5rem;\n      padding-top: 1.5rem;\n      border-top: 1px solid #eee;\n    }\n\n    .action-buttons button {\n      display: flex;\n      align-items: center;\n      gap: 0.5rem;\n    }\n\n    @media (max-width: 768px) {\n      .form-row {\n        flex-direction: column;\n      }\n    }\n  "] }]
    }], () => [{ type: i1.FormBuilder }, { type: i2.ActivatedRoute }, { type: i2.Router }, { type: i3.ApiService }, { type: i4.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StaffFormComponent, { className: "StaffFormComponent", filePath: "app/features/staff/staff-form/staff-form.component.ts", lineNumber: 125 }); })();
//# sourceMappingURL=staff-form.component.js.map