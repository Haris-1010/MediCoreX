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
import * as i9 from "@angular/material/datepicker";
import * as i10 from "@angular/material/autocomplete";
import * as i11 from "../../../shared/components/page-header/page-header.component";
import * as i12 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "Appointments", route: "/appointments" });
const _c2 = a0 => ({ label: a0 });
const _c3 = (a0, a1, a2) => [a0, a1, a2];
function AppointmentFormComponent_mat_option_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 25);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r2 = ctx.$implicit;
    i0.ɵɵproperty("value", p_r2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("", p_r2.fullName, " (", p_r2.mrn, ")");
} }
function AppointmentFormComponent_mat_option_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 25);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const d_r3 = ctx.$implicit;
    i0.ɵɵproperty("value", d_r3.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("Dr. ", d_r3.fullName, " - ", d_r3.specialization, "");
} }
function AppointmentFormComponent_mat_option_42_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 25);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const slot_r4 = ctx.$implicit;
    i0.ɵɵproperty("value", slot_r4);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("", slot_r4.startTime, " - ", slot_r4.endTime, "");
} }
export class AppointmentFormComponent {
    constructor(fb, api, router, route, notification) {
        this.fb = fb;
        this.api = api;
        this.router = router;
        this.route = route;
        this.notification = notification;
        this.isEditMode = false;
        this.saving = false;
        this.minDate = new Date();
        this.doctors = [];
        this.filteredPatients = [];
        this.availableSlots = [];
    }
    normalizeList(value) {
        if (Array.isArray(value))
            return value;
        if (!value || typeof value !== 'object')
            return [];
        if (Array.isArray(value.items))
            return value.items;
        if (Array.isArray(value.data))
            return value.data;
        if (Array.isArray(value.results))
            return value.results;
        if (Array.isArray(value.patients))
            return value.patients;
        if (Array.isArray(value.slots))
            return value.slots;
        return [];
    }
    ngOnInit() {
        this.form = this.fb.group({
            patientId: ['', Validators.required], patientSearch: [''], doctorId: ['', Validators.required],
            appointmentType: ['Consultation', Validators.required], appointmentDate: ['', Validators.required],
            timeSlot: ['', Validators.required], reason: [''], notes: ['']
        });
        this.loadDoctors();
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.loadAppointment(id);
        }
        const patientId = this.route.snapshot.queryParamMap.get('patientId');
        if (patientId)
            this.loadPatient(patientId);
        this.form.get('patientSearch')?.valueChanges.subscribe(val => {
            if (typeof val === 'string' && val.length >= 2) {
                this.api.get('v1/patients/search', { term: val }).subscribe(r => this.filteredPatients = this.normalizeList(r));
            }
            else {
                this.filteredPatients = [];
            }
        });
    }
    loadDoctors() {
        this.api.get('v1/doctors').subscribe(r => this.doctors = this.normalizeList(r));
    }
    loadPatient(id) { this.api.getById('v1/patients', id).subscribe(p => { this.form.patchValue({ patientId: p.id, patientSearch: p }); }); }
    loadAppointment(id) { this.api.getById('v1/appointments', id).subscribe(a => this.form.patchValue(a)); }
    loadAvailableSlots() {
        const { doctorId, appointmentDate } = this.form.value;
        if (doctorId && appointmentDate) {
            const dateValue = appointmentDate instanceof Date ? appointmentDate : new Date(appointmentDate);
            this.api.get(`v1/doctors/${doctorId}/available-slots`, { date: dateValue.toISOString() }).subscribe(r => this.availableSlots = this.normalizeList(r));
        }
        else {
            this.availableSlots = [];
        }
    }
    displayPatient(p) { return p ? `${p.fullName || p.firstName + ' ' + p.lastName || 'Patient'} (${p.mrn || p.id || ''})` : ''; }
    onPatientSelected(e) { this.form.patchValue({ patientId: e.option.value.id }); }
    onSubmit() {
        if (this.form.invalid)
            return;
        this.saving = true;
        const data = { ...this.form.value, startTime: this.form.value.timeSlot?.startTime, endTime: this.form.value.timeSlot?.endTime };
        const req = this.isEditMode ? this.api.put('v1/appointments', this.route.snapshot.paramMap.get('id'), data) : this.api.post('v1/appointments', data);
        req.subscribe({ next: () => { this.notification.success('Appointment saved'); this.router.navigate(['/appointments']); }, error: () => this.saving = false });
    }
    static { this.ɵfac = function AppointmentFormComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppointmentFormComponent)(i0.ɵɵdirectiveInject(i1.FormBuilder), i0.ɵɵdirectiveInject(i2.ApiService), i0.ɵɵdirectiveInject(i3.Router), i0.ɵɵdirectiveInject(i3.ActivatedRoute), i0.ɵɵdirectiveInject(i4.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AppointmentFormComponent, selectors: [["app-appointment-form"]], standalone: false, decls: 56, vars: 21, consts: [["patientAuto", "matAutocomplete"], ["picker", ""], [3, "title", "breadcrumbs"], [1, "card"], [3, "ngSubmit", "formGroup"], [1, "form-row"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "formControlName", "patientSearch", "placeholder", "Search patient...", 3, "matAutocomplete"], [3, "optionSelected", "displayWith"], [3, "value", 4, "ngFor", "ngForOf"], ["appearance", "outline"], ["formControlName", "doctorId", 3, "selectionChange"], ["formControlName", "appointmentType"], ["value", "Consultation"], ["value", "FollowUp"], ["value", "Procedure"], ["value", "Emergency"], ["matInput", "", "formControlName", "appointmentDate", 3, "dateChange", "matDatepicker", "min"], ["matIconSuffix", "", 3, "for"], ["formControlName", "timeSlot"], ["matInput", "", "formControlName", "reason", "rows", "3"], ["matInput", "", "formControlName", "notes", "rows", "2"], [1, "form-actions"], ["mat-stroked-button", "", "type", "button", "routerLink", "/appointments"], ["mat-raised-button", "", "color", "primary", "type", "submit", 3, "disabled"], [3, "value"]], template: function AppointmentFormComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 2);
            i0.ɵɵelementStart(2, "div", 3)(3, "form", 4);
            i0.ɵɵlistener("ngSubmit", function AppointmentFormComponent_Template_form_ngSubmit_3_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onSubmit()); });
            i0.ɵɵelementStart(4, "div", 5)(5, "mat-form-field", 6)(6, "mat-label");
            i0.ɵɵtext(7, "Patient");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(8, "input", 7);
            i0.ɵɵelementStart(9, "mat-autocomplete", 8, 0);
            i0.ɵɵlistener("optionSelected", function AppointmentFormComponent_Template_mat_autocomplete_optionSelected_9_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onPatientSelected($event)); });
            i0.ɵɵtemplate(11, AppointmentFormComponent_mat_option_11_Template, 2, 3, "mat-option", 9);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(12, "div", 5)(13, "mat-form-field", 10)(14, "mat-label");
            i0.ɵɵtext(15, "Doctor");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "mat-select", 11);
            i0.ɵɵlistener("selectionChange", function AppointmentFormComponent_Template_mat_select_selectionChange_16_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.loadAvailableSlots()); });
            i0.ɵɵtemplate(17, AppointmentFormComponent_mat_option_17_Template, 2, 3, "mat-option", 9);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(18, "mat-form-field", 10)(19, "mat-label");
            i0.ɵɵtext(20, "Appointment Type");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "mat-select", 12)(22, "mat-option", 13);
            i0.ɵɵtext(23, "Consultation");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "mat-option", 14);
            i0.ɵɵtext(25, "Follow Up");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "mat-option", 15);
            i0.ɵɵtext(27, "Procedure");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "mat-option", 16);
            i0.ɵɵtext(29, "Emergency");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(30, "div", 5)(31, "mat-form-field", 10)(32, "mat-label");
            i0.ɵɵtext(33, "Date");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(34, "input", 17);
            i0.ɵɵlistener("dateChange", function AppointmentFormComponent_Template_input_dateChange_34_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.loadAvailableSlots()); });
            i0.ɵɵelementEnd();
            i0.ɵɵelement(35, "mat-datepicker-toggle", 18)(36, "mat-datepicker", null, 1);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(38, "mat-form-field", 10)(39, "mat-label");
            i0.ɵɵtext(40, "Time Slot");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(41, "mat-select", 19);
            i0.ɵɵtemplate(42, AppointmentFormComponent_mat_option_42_Template, 2, 3, "mat-option", 9);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(43, "mat-form-field", 6)(44, "mat-label");
            i0.ɵɵtext(45, "Reason for Visit");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(46, "textarea", 20);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(47, "mat-form-field", 6)(48, "mat-label");
            i0.ɵɵtext(49, "Notes");
            i0.ɵɵelementEnd();
            i0.ɵɵelement(50, "textarea", 21);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(51, "div", 22)(52, "button", 23);
            i0.ɵɵtext(53, "Cancel");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(54, "button", 24);
            i0.ɵɵtext(55);
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            const patientAuto_r5 = i0.ɵɵreference(10);
            const picker_r6 = i0.ɵɵreference(37);
            i0.ɵɵadvance();
            i0.ɵɵproperty("title", ctx.isEditMode ? "Edit Appointment" : "New Appointment")("breadcrumbs", i0.ɵɵpureFunction3(17, _c3, i0.ɵɵpureFunction0(13, _c0), i0.ɵɵpureFunction0(14, _c1), i0.ɵɵpureFunction1(15, _c2, ctx.isEditMode ? "Edit" : "New")));
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("formGroup", ctx.form);
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("matAutocomplete", patientAuto_r5);
            i0.ɵɵadvance();
            i0.ɵɵproperty("displayWith", ctx.displayPatient);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngForOf", ctx.filteredPatients);
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("ngForOf", ctx.doctors);
            i0.ɵɵadvance(17);
            i0.ɵɵproperty("matDatepicker", picker_r6)("min", ctx.minDate);
            i0.ɵɵadvance();
            i0.ɵɵproperty("for", picker_r6);
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("ngForOf", ctx.availableSlots);
            i0.ɵɵadvance(12);
            i0.ɵɵproperty("disabled", ctx.form.invalid || ctx.saving);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.saving ? "Saving..." : ctx.isEditMode ? "Update" : "Book", " Appointment ");
        } }, dependencies: [i5.NgForOf, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, i3.RouterLink, i6.MatButton, i7.MatInput, i7.MatFormField, i7.MatLabel, i7.MatSuffix, i8.MatSelect, i8.MatOption, i9.MatDatepicker, i9.MatDatepickerInput, i9.MatDatepickerToggle, i10.MatAutocomplete, i10.MatAutocompleteTrigger, i11.PageHeaderComponent, i12.MainLayoutComponent], styles: [".card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }\n    .form-row[_ngcontent-%COMP%] { display: flex; gap: 1rem; } .form-row[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] { flex: 1; } .full-width[_ngcontent-%COMP%] { width: 100%; }\n    .form-actions[_ngcontent-%COMP%] { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppointmentFormComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-appointment-form', template: `
    <app-main-layout>
      <app-page-header [title]="isEditMode ? 'Edit Appointment' : 'New Appointment'"
        [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Appointments', route: '/appointments' }, { label: isEditMode ? 'Edit' : 'New' }]">
      </app-page-header>

      <div class="card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Patient</mat-label>
              <input matInput [matAutocomplete]="patientAuto" formControlName="patientSearch" placeholder="Search patient...">
              <mat-autocomplete #patientAuto="matAutocomplete" [displayWith]="displayPatient" (optionSelected)="onPatientSelected($event)">
                <mat-option *ngFor="let p of filteredPatients" [value]="p">{{ p.fullName }} ({{ p.mrn }})</mat-option>
              </mat-autocomplete>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Doctor</mat-label>
              <mat-select formControlName="doctorId" (selectionChange)="loadAvailableSlots()">
                <mat-option *ngFor="let d of doctors" [value]="d.id">Dr. {{ d.fullName }} - {{ d.specialization }}</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Appointment Type</mat-label>
              <mat-select formControlName="appointmentType">
                <mat-option value="Consultation">Consultation</mat-option>
                <mat-option value="FollowUp">Follow Up</mat-option>
                <mat-option value="Procedure">Procedure</mat-option>
                <mat-option value="Emergency">Emergency</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="appointmentDate" [min]="minDate" (dateChange)="loadAvailableSlots()">
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Time Slot</mat-label>
              <mat-select formControlName="timeSlot">
                <mat-option *ngFor="let slot of availableSlots" [value]="slot">{{ slot.startTime }} - {{ slot.endTime }}</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Reason for Visit</mat-label>
            <textarea matInput formControlName="reason" rows="3"></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Notes</mat-label>
            <textarea matInput formControlName="notes" rows="2"></textarea>
          </mat-form-field>

          <div class="form-actions">
            <button mat-stroked-button type="button" routerLink="/appointments">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">
              {{ saving ? 'Saving...' : (isEditMode ? 'Update' : 'Book') }} Appointment
            </button>
          </div>
        </form>
      </div>
    </app-main-layout>
  `, styles: [".card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }\n    .form-row { display: flex; gap: 1rem; } .form-row mat-form-field { flex: 1; } .full-width { width: 100%; }\n    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }"] }]
    }], () => [{ type: i1.FormBuilder }, { type: i2.ApiService }, { type: i3.Router }, { type: i3.ActivatedRoute }, { type: i4.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AppointmentFormComponent, { className: "AppointmentFormComponent", filePath: "app/features/appointments/appointment-form/appointment-form.component.ts", lineNumber: 85 }); })();
//# sourceMappingURL=appointment-form.component.js.map