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
import * as i9 from "@angular/material/autocomplete";
import * as i10 from "../../../shared/components/page-header/page-header.component";
import * as i11 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "IPD", route: "/ipd" });
const _c1 = () => ({ label: "Admit" });
const _c2 = (a0, a1) => [a0, a1];
function AdmissionFormComponent_mat_option_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 22);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r2 = ctx.$implicit;
    i0.ɵɵproperty("value", p_r2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("", p_r2.fullName, " (", p_r2.mrn, ")");
} }
function AdmissionFormComponent_mat_option_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 22);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const d_r3 = ctx.$implicit;
    i0.ɵɵproperty("value", d_r3.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Dr. ", d_r3.fullName, "");
} }
function AdmissionFormComponent_mat_option_38_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 22);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const w_r4 = ctx.$implicit;
    i0.ɵɵproperty("value", w_r4.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(w_r4.name);
} }
function AdmissionFormComponent_mat_option_43_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 22);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const b_r5 = ctx.$implicit;
    i0.ɵɵproperty("value", b_r5.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("", b_r5.bedNumber, " - ", b_r5.bedType, "");
} }
export class AdmissionFormComponent {
    constructor(fb, api, router, notification) {
        this.fb = fb;
        this.api = api;
        this.router = router;
        this.notification = notification;
        this.saving = false;
        this.filteredPatients = [];
        this.doctors = [];
        this.wards = [];
        this.availableBeds = [];
    }
    ngOnInit() {
        this.form = this.fb.group({
            patientId: ['', Validators.required], patientSearch: [''], admissionType: ['Elective', Validators.required],
            doctorId: ['', Validators.required], wardId: ['', Validators.required], bedId: ['', Validators.required],
            admissionReason: ['', Validators.required], provisionalDiagnosis: ['']
        });
        this.api.get('v1/doctors').subscribe(r => this.doctors = r);
        this.api.get('v1/wards').subscribe(r => this.wards = r);
        this.form.get('patientSearch')?.valueChanges.subscribe(val => {
            if (typeof val === 'string' && val.length >= 2)
                this.api.get('v1/patients/search', { term: val }).subscribe(r => this.filteredPatients = r);
        });
    }
    displayPatient(p) { return p ? `${p.fullName} (${p.mrn})` : ''; }
    onPatientSelected(e) { this.form.patchValue({ patientId: e.option.value.id }); }
    loadBeds() { const wardId = this.form.value.wardId; if (wardId)
        this.api.get(`v1/wards/${wardId}/available-beds`).subscribe(r => this.availableBeds = r); }
    submit() {
        if (this.form.invalid)
            return;
        this.saving = true;
        this.api.post('v1/admissions', this.form.value).subscribe({
            next: () => { this.notification.success('Patient admitted successfully'); this.router.navigate(['/ipd/admissions']); },
            error: () => this.saving = false
        });
    }
    static { this.ɵfac = function AdmissionFormComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AdmissionFormComponent)(i0.ɵɵdirectiveInject(i1.FormBuilder), i0.ɵɵdirectiveInject(i2.ApiService), i0.ɵɵdirectiveInject(i3.Router), i0.ɵɵdirectiveInject(i4.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AdmissionFormComponent, selectors: [["app-admission-form"]], standalone: false, decls: 57, vars: 15, consts: [["patientAuto", "matAutocomplete"], ["title", "New Admission", 3, "breadcrumbs"], [1, "card"], [3, "ngSubmit", "formGroup"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "formControlName", "patientSearch", 3, "matAutocomplete"], [3, "optionSelected", "displayWith"], [3, "value", 4, "ngFor", "ngForOf"], [1, "form-row"], ["appearance", "outline"], ["formControlName", "admissionType"], ["value", "Elective"], ["value", "Emergency"], ["value", "Transfer"], ["formControlName", "doctorId"], ["formControlName", "wardId", 3, "selectionChange"], ["formControlName", "bedId"], ["matInput", "", "formControlName", "admissionReason", "rows", "3"], ["matInput", "", "formControlName", "provisionalDiagnosis"], [1, "form-actions"], ["mat-stroked-button", "", "type", "button", "routerLink", "/ipd"], ["mat-raised-button", "", "color", "primary", "type", "submit", 3, "disabled"], [3, "value"]], template: function AdmissionFormComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 1);
            i0.ɵɵelementStart(2, "div", 2)(3, "form", 3);
            i0.ɵɵlistener("ngSubmit", function AdmissionFormComponent_Template_form_ngSubmit_3_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.submit()); });
            i0.ɵɵelementStart(4, "h3");
            i0.ɵɵtext(5, "Patient Information");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "mat-form-field", 4)(7, "mat-label");
            i0.ɵɵtext(8, "Search Patient");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(9, "input", 5);
            i0.ɵɵelementStart(10, "mat-autocomplete", 6, 0);
            i0.ɵɵlistener("optionSelected", function AdmissionFormComponent_Template_mat_autocomplete_optionSelected_10_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onPatientSelected($event)); });
            i0.ɵɵtemplate(12, AdmissionFormComponent_mat_option_12_Template, 2, 3, "mat-option", 7);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(13, "h3");
            i0.ɵɵtext(14, "Admission Details");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "div", 8)(16, "mat-form-field", 9)(17, "mat-label");
            i0.ɵɵtext(18, "Admission Type");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "mat-select", 10)(20, "mat-option", 11);
            i0.ɵɵtext(21, "Elective");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "mat-option", 12);
            i0.ɵɵtext(23, "Emergency");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "mat-option", 13);
            i0.ɵɵtext(25, "Transfer");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(26, "mat-form-field", 9)(27, "mat-label");
            i0.ɵɵtext(28, "Attending Doctor");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "mat-select", 14);
            i0.ɵɵtemplate(30, AdmissionFormComponent_mat_option_30_Template, 2, 2, "mat-option", 7);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(31, "h3");
            i0.ɵɵtext(32, "Bed Allocation");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(33, "div", 8)(34, "mat-form-field", 9)(35, "mat-label");
            i0.ɵɵtext(36, "Ward");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(37, "mat-select", 15);
            i0.ɵɵlistener("selectionChange", function AdmissionFormComponent_Template_mat_select_selectionChange_37_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.loadBeds()); });
            i0.ɵɵtemplate(38, AdmissionFormComponent_mat_option_38_Template, 2, 2, "mat-option", 7);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(39, "mat-form-field", 9)(40, "mat-label");
            i0.ɵɵtext(41, "Bed");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(42, "mat-select", 16);
            i0.ɵɵtemplate(43, AdmissionFormComponent_mat_option_43_Template, 2, 3, "mat-option", 7);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(44, "mat-form-field", 4)(45, "mat-label");
            i0.ɵɵtext(46, "Reason for Admission");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(47, "textarea", 17);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(48, "mat-form-field", 4)(49, "mat-label");
            i0.ɵɵtext(50, "Provisional Diagnosis");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(51, "input", 18);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(52, "div", 19)(53, "button", 20);
            i0.ɵɵtext(54, "Cancel");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(55, "button", 21);
            i0.ɵɵtext(56);
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            const patientAuto_r6 = i0.ɵɵreference(11);
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(12, _c2, i0.ɵɵpureFunction0(10, _c0), i0.ɵɵpureFunction0(11, _c1)));
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("formGroup", ctx.form);
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("matAutocomplete", patientAuto_r6);
            i0.ɵɵadvance();
            i0.ɵɵproperty("displayWith", ctx.displayPatient);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngForOf", ctx.filteredPatients);
            i0.ɵɵadvance(18);
            i0.ɵɵproperty("ngForOf", ctx.doctors);
            i0.ɵɵadvance(8);
            i0.ɵɵproperty("ngForOf", ctx.wards);
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngForOf", ctx.availableBeds);
            i0.ɵɵadvance(12);
            i0.ɵɵproperty("disabled", ctx.form.invalid || ctx.saving);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate(ctx.saving ? "Saving..." : "Admit Patient");
        } }, dependencies: [i5.NgForOf, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, i3.RouterLink, i6.MatButton, i7.MatInput, i7.MatFormField, i7.MatLabel, i8.MatSelect, i8.MatOption, i9.MatAutocomplete, i9.MatAutocompleteTrigger, i10.PageHeaderComponent, i11.MainLayoutComponent], styles: [".card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; } h3[_ngcontent-%COMP%] { margin: 1.5rem 0 1rem; } h3[_ngcontent-%COMP%]:first-child { margin-top: 0; }\n    .form-row[_ngcontent-%COMP%] { display: flex; gap: 1rem; } .form-row[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] { flex: 1; } .full-width[_ngcontent-%COMP%] { width: 100%; }\n    .form-actions[_ngcontent-%COMP%] { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AdmissionFormComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-admission-form', template: `
    <app-main-layout>
      <app-page-header title="New Admission" [breadcrumbs]="[{ label: 'IPD', route: '/ipd' }, { label: 'Admit' }]"></app-page-header>
      <div class="card">
        <form [formGroup]="form" (ngSubmit)="submit()">
          <h3>Patient Information</h3>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Search Patient</mat-label>
            <input matInput [matAutocomplete]="patientAuto" formControlName="patientSearch">
            <mat-autocomplete #patientAuto="matAutocomplete" [displayWith]="displayPatient" (optionSelected)="onPatientSelected($event)">
              <mat-option *ngFor="let p of filteredPatients" [value]="p">{{ p.fullName }} ({{ p.mrn }})</mat-option>
            </mat-autocomplete>
          </mat-form-field>

          <h3>Admission Details</h3>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Admission Type</mat-label>
              <mat-select formControlName="admissionType"><mat-option value="Elective">Elective</mat-option><mat-option value="Emergency">Emergency</mat-option><mat-option value="Transfer">Transfer</mat-option></mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Attending Doctor</mat-label>
              <mat-select formControlName="doctorId"><mat-option *ngFor="let d of doctors" [value]="d.id">Dr. {{ d.fullName }}</mat-option></mat-select>
            </mat-form-field>
          </div>

          <h3>Bed Allocation</h3>
          <div class="form-row">
            <mat-form-field appearance="outline"><mat-label>Ward</mat-label>
              <mat-select formControlName="wardId" (selectionChange)="loadBeds()"><mat-option *ngFor="let w of wards" [value]="w.id">{{ w.name }}</mat-option></mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Bed</mat-label>
              <mat-select formControlName="bedId"><mat-option *ngFor="let b of availableBeds" [value]="b.id">{{ b.bedNumber }} - {{ b.bedType }}</mat-option></mat-select>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width"><mat-label>Reason for Admission</mat-label><textarea matInput formControlName="admissionReason" rows="3"></textarea></mat-form-field>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Provisional Diagnosis</mat-label><input matInput formControlName="provisionalDiagnosis"></mat-form-field>

          <div class="form-actions">
            <button mat-stroked-button type="button" routerLink="/ipd">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">{{ saving ? 'Saving...' : 'Admit Patient' }}</button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `, styles: [".card { background: white; padding: 1.5rem; border-radius: 8px; } h3 { margin: 1.5rem 0 1rem; } h3:first-child { margin-top: 0; }\n    .form-row { display: flex; gap: 1rem; } .form-row mat-form-field { flex: 1; } .full-width { width: 100%; }\n    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }"] }]
    }], () => [{ type: i1.FormBuilder }, { type: i2.ApiService }, { type: i3.Router }, { type: i4.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AdmissionFormComponent, { className: "AdmissionFormComponent", filePath: "app/features/ipd/admission-form/admission-form.component.ts", lineNumber: 58 }); })();
//# sourceMappingURL=admission-form.component.js.map