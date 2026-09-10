import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "../../../core/services/api.service";
import * as i3 from "@angular/router";
import * as i4 from "../../../core/services/notification.service";
import * as i5 from "@angular/common";
import * as i6 from "@angular/material/button";
import * as i7 from "@angular/material/icon";
import * as i8 from "@angular/material/input";
import * as i9 from "@angular/material/progress-spinner";
import * as i10 from "../../../shared/components/page-header/page-header.component";
import * as i11 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "Departments", route: "/departments" });
const _c2 = a0 => ({ label: a0 });
const _c3 = (a0, a1, a2) => [a0, a1, a2];
function DepartmentFormComponent_mat_error_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Name is required");
    i0.ɵɵelementEnd();
} }
function DepartmentFormComponent_mat_error_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-error");
    i0.ɵɵtext(1, "Code is required");
    i0.ɵɵelementEnd();
} }
function DepartmentFormComponent_mat_icon_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-icon");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.isEditMode ? "save" : "add");
} }
function DepartmentFormComponent_mat_spinner_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "mat-spinner", 14);
} }
export class DepartmentFormComponent {
    constructor(fb, api, router, route, notification) {
        this.fb = fb;
        this.api = api;
        this.router = router;
        this.route = route;
        this.notification = notification;
        this.isEditMode = false;
        this.saving = false;
        this.departmentId = null;
    }
    ngOnInit() {
        this.form = this.fb.group({
            name: ['', Validators.required],
            code: ['', Validators.required],
            description: ['']
        });
        this.departmentId = this.route.snapshot.paramMap.get('id');
        if (this.departmentId) {
            this.isEditMode = true;
            this.loadDepartment();
        }
    }
    loadDepartment() {
        this.api.get(`v1/departments/${this.departmentId}`).subscribe({
            next: (dept) => {
                this.form.patchValue({
                    name: dept.name,
                    code: dept.code,
                    description: dept.description
                });
            },
            error: () => {
                this.notification.error('Failed to load department');
                this.router.navigate(['/departments']);
            }
        });
    }
    onSubmit() {
        if (this.form.invalid || this.saving)
            return;
        this.saving = true;
        const payload = this.form.getRawValue();
        const request = this.isEditMode
            ? this.api.put('v1/departments', this.departmentId, payload)
            : this.api.post('v1/departments', payload);
        request.subscribe({
            next: () => {
                this.notification.success(this.isEditMode ? 'Department updated successfully' : 'Department created successfully');
                this.router.navigate(['/departments']);
            },
            error: () => {
                this.saving = false;
                this.notification.error('Failed to save department');
            }
        });
    }
    cancel() {
        this.router.navigate(['/departments']);
    }
    static { this.ɵfac = function DepartmentFormComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DepartmentFormComponent)(i0.ɵɵdirectiveInject(i1.FormBuilder), i0.ɵɵdirectiveInject(i2.ApiService), i0.ɵɵdirectiveInject(i3.Router), i0.ɵɵdirectiveInject(i3.ActivatedRoute), i0.ɵɵdirectiveInject(i4.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: DepartmentFormComponent, selectors: [["app-department-form"]], standalone: false, decls: 26, vars: 17, consts: [[3, "title", "breadcrumbs"], [1, "form-card"], [3, "ngSubmit", "formGroup"], [1, "form-grid"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "formControlName", "name", "placeholder", "e.g. Cardiology"], [4, "ngIf"], ["appearance", "outline"], ["matInput", "", "formControlName", "code", "placeholder", "e.g. CARD"], ["matInput", "", "formControlName", "description", "rows", "3", "placeholder", "Brief description of the department"], [1, "form-actions"], ["mat-stroked-button", "", "type", "button", 3, "click"], ["mat-raised-button", "", "color", "primary", "type", "submit", 3, "disabled"], ["diameter", "20", 4, "ngIf"], ["diameter", "20"]], template: function DepartmentFormComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 0);
            i0.ɵɵelementStart(2, "div", 1)(3, "form", 2);
            i0.ɵɵlistener("ngSubmit", function DepartmentFormComponent_Template_form_ngSubmit_3_listener() { return ctx.onSubmit(); });
            i0.ɵɵelementStart(4, "div", 3)(5, "mat-form-field", 4)(6, "mat-label");
            i0.ɵɵtext(7, "Department Name *");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(8, "input", 5);
            i0.ɵɵtemplate(9, DepartmentFormComponent_mat_error_9_Template, 2, 0, "mat-error", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "mat-form-field", 7)(11, "mat-label");
            i0.ɵɵtext(12, "Department Code *");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(13, "input", 8);
            i0.ɵɵtemplate(14, DepartmentFormComponent_mat_error_14_Template, 2, 0, "mat-error", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "mat-form-field", 4)(16, "mat-label");
            i0.ɵɵtext(17, "Description");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(18, "textarea", 9);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(19, "div", 10)(20, "button", 11);
            i0.ɵɵlistener("click", function DepartmentFormComponent_Template_button_click_20_listener() { return ctx.cancel(); });
            i0.ɵɵtext(21, "Cancel");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "button", 12);
            i0.ɵɵtemplate(23, DepartmentFormComponent_mat_icon_23_Template, 2, 1, "mat-icon", 6)(24, DepartmentFormComponent_mat_spinner_24_Template, 1, 0, "mat-spinner", 13);
            i0.ɵɵtext(25);
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            let tmp_3_0;
            let tmp_4_0;
            i0.ɵɵadvance();
            i0.ɵɵproperty("title", ctx.isEditMode ? "Edit Department" : "New Department")("breadcrumbs", i0.ɵɵpureFunction3(13, _c3, i0.ɵɵpureFunction0(9, _c0), i0.ɵɵpureFunction0(10, _c1), i0.ɵɵpureFunction1(11, _c2, ctx.isEditMode ? "Edit" : "New")));
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("formGroup", ctx.form);
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("ngIf", (tmp_3_0 = ctx.form.get("name")) == null ? null : tmp_3_0.hasError("required"));
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngIf", (tmp_4_0 = ctx.form.get("code")) == null ? null : tmp_4_0.hasError("required"));
            i0.ɵɵadvance(8);
            i0.ɵɵproperty("disabled", ctx.form.invalid || ctx.saving);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.saving);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.saving);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.isEditMode ? "Update Department" : "Create Department", " ");
        } }, dependencies: [i5.NgIf, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, i6.MatButton, i7.MatIcon, i8.MatInput, i8.MatFormField, i8.MatLabel, i8.MatError, i9.MatProgressSpinner, i10.PageHeaderComponent, i11.MainLayoutComponent], styles: [".form-card[_ngcontent-%COMP%] {\n      background: white;\n      padding: 2rem;\n      border-radius: 8px;\n      max-width: 700px;\n    }\n    .form-grid[_ngcontent-%COMP%] {\n      display: flex;\n      flex-direction: column;\n      gap: 0.5rem;\n    }\n    .full-width[_ngcontent-%COMP%] {\n      width: 100%;\n    }\n    .form-actions[_ngcontent-%COMP%] {\n      display: flex;\n      justify-content: flex-end;\n      gap: 1rem;\n      margin-top: 1.5rem;\n      padding-top: 1.5rem;\n      border-top: 1px solid #eee;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DepartmentFormComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-department-form', template: `
    <app-main-layout>
      <app-page-header
        [title]="isEditMode ? 'Edit Department' : 'New Department'"
        [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Departments', route: '/departments' }, { label: isEditMode ? 'Edit' : 'New' }]">
      </app-page-header>

      <div class="form-card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Department Name *</mat-label>
              <input matInput formControlName="name" placeholder="e.g. Cardiology">
              <mat-error *ngIf="form.get('name')?.hasError('required')">Name is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Department Code *</mat-label>
              <input matInput formControlName="code" placeholder="e.g. CARD">
              <mat-error *ngIf="form.get('code')?.hasError('required')">Code is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="3" placeholder="Brief description of the department"></textarea>
            </mat-form-field>
          </div>

          <div class="form-actions">
            <button mat-stroked-button type="button" (click)="cancel()">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">
              <mat-icon *ngIf="!saving">{{ isEditMode ? 'save' : 'add' }}</mat-icon>
              <mat-spinner *ngIf="saving" diameter="20"></mat-spinner>
              {{ isEditMode ? 'Update Department' : 'Create Department' }}
            </button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `, styles: ["\n    .form-card {\n      background: white;\n      padding: 2rem;\n      border-radius: 8px;\n      max-width: 700px;\n    }\n    .form-grid {\n      display: flex;\n      flex-direction: column;\n      gap: 0.5rem;\n    }\n    .full-width {\n      width: 100%;\n    }\n    .form-actions {\n      display: flex;\n      justify-content: flex-end;\n      gap: 1rem;\n      margin-top: 1.5rem;\n      padding-top: 1.5rem;\n      border-top: 1px solid #eee;\n    }\n  "] }]
    }], () => [{ type: i1.FormBuilder }, { type: i2.ApiService }, { type: i3.Router }, { type: i3.ActivatedRoute }, { type: i4.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(DepartmentFormComponent, { className: "DepartmentFormComponent", filePath: "app/features/departments/department-form/department-form.component.ts", lineNumber: 75 }); })();
//# sourceMappingURL=department-form.component.js.map