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
import * as i9 from "@angular/material/progress-spinner";
import * as i10 from "../../../shared/components/page-header/page-header.component";
import * as i11 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Wards", route: "/wards" });
const _c1 = () => ({ label: "New" });
const _c2 = (a0, a1) => [a0, a1];
function WardFormComponent_mat_spinner_59_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "mat-spinner", 28);
} }
export class WardFormComponent {
    constructor(fb, api, router, route, notification) {
        this.fb = fb;
        this.api = api;
        this.router = router;
        this.route = route;
        this.notification = notification;
        this.saving = false;
    }
    ngOnInit() {
        this.form = this.fb.group({
            name: ['', Validators.required],
            code: ['', Validators.required],
            wardType: ['General'],
            totalBeds: [10, [Validators.required, Validators.min(1)]],
            dailyRate: [0],
            genderRestriction: [''],
            description: ['']
        });
    }
    onSubmit() {
        if (this.form.invalid || this.saving)
            return;
        this.saving = true;
        const payload = this.form.getRawValue();
        this.api.post('v1/wards', payload).subscribe({
            next: () => { this.notification.success('Ward created'); this.router.navigate(['/wards']); },
            error: () => { this.saving = false; this.notification.error('Failed to create ward'); }
        });
    }
    cancel() { this.router.navigate(['/wards']); }
    static { this.ɵfac = function WardFormComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || WardFormComponent)(i0.ɵɵdirectiveInject(i1.FormBuilder), i0.ɵɵdirectiveInject(i2.ApiService), i0.ɵɵdirectiveInject(i3.Router), i0.ɵɵdirectiveInject(i3.ActivatedRoute), i0.ɵɵdirectiveInject(i4.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: WardFormComponent, selectors: [["app-ward-form"]], standalone: false, decls: 61, vars: 9, consts: [["title", "New Ward", 3, "breadcrumbs"], [1, "form-card"], [3, "ngSubmit", "formGroup"], [1, "form-grid"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "formControlName", "name", "placeholder", "e.g. ICU Ward A"], ["appearance", "outline"], ["matInput", "", "formControlName", "code", "placeholder", "e.g. ICU-A"], ["formControlName", "wardType"], ["value", "General"], ["value", "ICU"], ["value", "NICU"], ["value", "PICU"], ["value", "Surgical"], ["value", "Maternity"], ["value", "Isolation"], ["value", "Emergency"], ["matInput", "", "type", "number", "formControlName", "totalBeds", "min", "1"], ["matInput", "", "type", "number", "formControlName", "dailyRate", "min", "0"], ["formControlName", "genderRestriction"], ["value", ""], ["value", "Male"], ["value", "Female"], ["matInput", "", "formControlName", "description", "rows", "2"], [1, "form-actions"], ["mat-stroked-button", "", "type", "button", 3, "click"], ["mat-raised-button", "", "color", "primary", "type", "submit", 3, "disabled"], ["diameter", "20", 4, "ngIf"], ["diameter", "20"]], template: function WardFormComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 0);
            i0.ɵɵelementStart(2, "div", 1)(3, "form", 2);
            i0.ɵɵlistener("ngSubmit", function WardFormComponent_Template_form_ngSubmit_3_listener() { return ctx.onSubmit(); });
            i0.ɵɵelementStart(4, "div", 3)(5, "mat-form-field", 4)(6, "mat-label");
            i0.ɵɵtext(7, "Ward Name *");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(8, "input", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "mat-form-field", 6)(10, "mat-label");
            i0.ɵɵtext(11, "Code *");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(12, "input", 7);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "mat-form-field", 6)(14, "mat-label");
            i0.ɵɵtext(15, "Ward Type");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "mat-select", 8)(17, "mat-option", 9);
            i0.ɵɵtext(18, "General");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "mat-option", 10);
            i0.ɵɵtext(20, "ICU");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "mat-option", 11);
            i0.ɵɵtext(22, "NICU");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "mat-option", 12);
            i0.ɵɵtext(24, "PICU");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(25, "mat-option", 13);
            i0.ɵɵtext(26, "Surgical");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(27, "mat-option", 14);
            i0.ɵɵtext(28, "Maternity");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "mat-option", 15);
            i0.ɵɵtext(30, "Isolation");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(31, "mat-option", 16);
            i0.ɵɵtext(32, "Emergency");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(33, "mat-form-field", 6)(34, "mat-label");
            i0.ɵɵtext(35, "Total Beds *");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(36, "input", 17);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(37, "mat-form-field", 6)(38, "mat-label");
            i0.ɵɵtext(39, "Daily Rate");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(40, "input", 18);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(41, "mat-form-field", 6)(42, "mat-label");
            i0.ɵɵtext(43, "Gender Restriction");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(44, "mat-select", 19)(45, "mat-option", 20);
            i0.ɵɵtext(46, "None");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(47, "mat-option", 21);
            i0.ɵɵtext(48, "Male Only");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(49, "mat-option", 22);
            i0.ɵɵtext(50, "Female Only");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(51, "mat-form-field", 4)(52, "mat-label");
            i0.ɵɵtext(53, "Description");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(54, "textarea", 23);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(55, "div", 24)(56, "button", 25);
            i0.ɵɵlistener("click", function WardFormComponent_Template_button_click_56_listener() { return ctx.cancel(); });
            i0.ɵɵtext(57, "Cancel");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(58, "button", 26);
            i0.ɵɵtemplate(59, WardFormComponent_mat_spinner_59_Template, 1, 0, "mat-spinner", 27);
            i0.ɵɵtext(60, " Create Ward ");
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(6, _c2, i0.ɵɵpureFunction0(4, _c0), i0.ɵɵpureFunction0(5, _c1)));
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("formGroup", ctx.form);
            i0.ɵɵadvance(55);
            i0.ɵɵproperty("disabled", ctx.form.invalid || ctx.saving);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.saving);
        } }, dependencies: [i5.NgIf, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NumberValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.MinValidator, i1.FormGroupDirective, i1.FormControlName, i6.MatButton, i7.MatInput, i7.MatFormField, i7.MatLabel, i8.MatSelect, i8.MatOption, i9.MatProgressSpinner, i10.PageHeaderComponent, i11.MainLayoutComponent], styles: [".form-card[_ngcontent-%COMP%] { background: white; padding: 2rem; border-radius: 8px; max-width: 700px; }\n    .form-grid[_ngcontent-%COMP%] { display: flex; flex-wrap: wrap; gap: 0.5rem; }\n    .form-grid[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] { flex: 1; min-width: 200px; }\n    .full-width[_ngcontent-%COMP%] { flex-basis: 100% !important; }\n    .form-actions[_ngcontent-%COMP%] { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #eee; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(WardFormComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-ward-form', template: `
    <app-main-layout>
      <app-page-header title="New Ward" [breadcrumbs]="[{ label: 'Wards', route: '/wards' }, { label: 'New' }]"></app-page-header>
      <div class="form-card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Ward Name *</mat-label>
              <input matInput formControlName="name" placeholder="e.g. ICU Ward A">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Code *</mat-label>
              <input matInput formControlName="code" placeholder="e.g. ICU-A">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Ward Type</mat-label>
              <mat-select formControlName="wardType">
                <mat-option value="General">General</mat-option>
                <mat-option value="ICU">ICU</mat-option>
                <mat-option value="NICU">NICU</mat-option>
                <mat-option value="PICU">PICU</mat-option>
                <mat-option value="Surgical">Surgical</mat-option>
                <mat-option value="Maternity">Maternity</mat-option>
                <mat-option value="Isolation">Isolation</mat-option>
                <mat-option value="Emergency">Emergency</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Total Beds *</mat-label>
              <input matInput type="number" formControlName="totalBeds" min="1">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Daily Rate</mat-label>
              <input matInput type="number" formControlName="dailyRate" min="0">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Gender Restriction</mat-label>
              <mat-select formControlName="genderRestriction">
                <mat-option value="">None</mat-option>
                <mat-option value="Male">Male Only</mat-option>
                <mat-option value="Female">Female Only</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="2"></textarea>
            </mat-form-field>
          </div>
          <div class="form-actions">
            <button mat-stroked-button type="button" (click)="cancel()">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">
              <mat-spinner *ngIf="saving" diameter="20"></mat-spinner>
              Create Ward
            </button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `, styles: ["\n    .form-card { background: white; padding: 2rem; border-radius: 8px; max-width: 700px; }\n    .form-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; }\n    .form-grid mat-form-field { flex: 1; min-width: 200px; }\n    .full-width { flex-basis: 100% !important; }\n    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #eee; }\n  "] }]
    }], () => [{ type: i1.FormBuilder }, { type: i2.ApiService }, { type: i3.Router }, { type: i3.ActivatedRoute }, { type: i4.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(WardFormComponent, { className: "WardFormComponent", filePath: "app/features/wards/ward-form/ward-form.component.ts", lineNumber: 77 }); })();
//# sourceMappingURL=ward-form.component.js.map