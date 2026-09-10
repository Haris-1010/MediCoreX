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
import * as i9 from "@angular/material/datepicker";
import * as i10 from "@angular/material/list";
import * as i11 from "@angular/material/chips";
import * as i12 from "../../../shared/components/page-header/page-header.component";
import * as i13 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "OPD", route: "/opd" });
const _c1 = () => ({ label: "Consultation" });
const _c2 = (a0, a1) => [a0, a1];
function ConsultationComponent_div_6_div_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 25)(1, "div", 26)(2, "span");
    i0.ɵɵtext(3, "BP");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "strong");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "div", 26)(7, "span");
    i0.ɵɵtext(8, "Pulse");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "strong");
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "div", 26)(12, "span");
    i0.ɵɵtext(13, "Temp");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "strong");
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "div", 26)(17, "span");
    i0.ɵɵtext(18, "SpO2");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "strong");
    i0.ɵɵtext(20);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(21, "div", 26)(22, "span");
    i0.ɵɵtext(23, "Weight");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "strong");
    i0.ɵɵtext(25);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.vitals.bloodPressure);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1("", ctx_r1.vitals.pulse, " bpm");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1("", ctx_r1.vitals.temperature, "\u00B0F");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1("", ctx_r1.vitals.spO2, "%");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1("", ctx_r1.vitals.weight, " kg");
} }
function ConsultationComponent_div_6_div_12_mat_chip_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-chip", 29);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const a_r3 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(a_r3);
} }
function ConsultationComponent_div_6_div_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 27)(1, "mat-chip-listbox");
    i0.ɵɵtemplate(2, ConsultationComponent_div_6_div_12_mat_chip_2_Template, 2, 1, "mat-chip", 28);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngForOf", ctx_r1.patient.allergies);
} }
function ConsultationComponent_div_6_div_33_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 30)(1, "div", 31)(2, "mat-form-field", 32)(3, "mat-label");
    i0.ɵɵtext(4, "Medicine");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(5, "input", 33);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "mat-form-field", 32)(7, "mat-label");
    i0.ɵɵtext(8, "Dosage");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(9, "input", 34);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "mat-form-field", 32)(11, "mat-label");
    i0.ɵɵtext(12, "Frequency");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(13, "input", 35);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "mat-form-field", 32)(15, "mat-label");
    i0.ɵɵtext(16, "Duration");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(17, "input", 36);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "button", 37);
    i0.ɵɵlistener("click", function ConsultationComponent_div_6_div_33_Template_button_click_18_listener() { const i_r5 = i0.ɵɵrestoreView(_r4).index; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.removeMedication(i_r5)); });
    i0.ɵɵelementStart(19, "mat-icon");
    i0.ɵɵtext(20, "delete");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const i_r5 = ctx.index;
    i0.ɵɵadvance();
    i0.ɵɵproperty("formGroupName", i_r5);
} }
function ConsultationComponent_div_6_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 4)(1, "div", 5)(2, "div", 6)(3, "div", 7);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div")(6, "h2");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "p");
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelement(10, "mat-divider");
    i0.ɵɵtemplate(11, ConsultationComponent_div_6_div_11_Template, 26, 5, "div", 8)(12, ConsultationComponent_div_6_div_12_Template, 3, 1, "div", 9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "div", 10)(14, "form", 11);
    i0.ɵɵlistener("ngSubmit", function ConsultationComponent_div_6_Template_form_ngSubmit_14_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.saveConsultation()); });
    i0.ɵɵelementStart(15, "mat-form-field", 12)(16, "mat-label");
    i0.ɵɵtext(17, "Chief Complaint");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(18, "textarea", 13);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "mat-form-field", 12)(20, "mat-label");
    i0.ɵɵtext(21, "History of Present Illness");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(22, "textarea", 14);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "mat-form-field", 12)(24, "mat-label");
    i0.ɵɵtext(25, "Examination Findings");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(26, "textarea", 15);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "mat-form-field", 12)(28, "mat-label");
    i0.ɵɵtext(29, "Diagnosis");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(30, "input", 16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "h4");
    i0.ɵɵtext(32, "Prescription");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(33, ConsultationComponent_div_6_div_33_Template, 21, 1, "div", 17);
    i0.ɵɵelementStart(34, "button", 18);
    i0.ɵɵlistener("click", function ConsultationComponent_div_6_Template_button_click_34_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.addMedication()); });
    i0.ɵɵelementStart(35, "mat-icon");
    i0.ɵɵtext(36, "add");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(37, " Add Medicine");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(38, "mat-form-field", 19)(39, "mat-label");
    i0.ɵɵtext(40, "Advice");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(41, "textarea", 20);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "mat-form-field", 12)(43, "mat-label");
    i0.ɵɵtext(44, "Follow-up Date");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(45, "input", 21)(46, "mat-datepicker-toggle", 22)(47, "mat-datepicker", null, 0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(49, "div", 23)(50, "button", 18);
    i0.ɵɵlistener("click", function ConsultationComponent_div_6_Template_button_click_50_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.orderLabs()); });
    i0.ɵɵelementStart(51, "mat-icon");
    i0.ɵɵtext(52, "science");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(53, " Order Labs");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(54, "button", 24);
    i0.ɵɵtext(55);
    i0.ɵɵelementEnd()()()()();
} if (rf & 2) {
    const picker_r6 = i0.ɵɵreference(48);
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.patient.initials);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.patient.fullName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate3("", ctx_r1.patient.age, " yrs, ", ctx_r1.patient.gender, " | Blood: ", ctx_r1.patient.bloodGroup, "");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", ctx_r1.vitals);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.patient.allergies == null ? null : ctx_r1.patient.allergies.length);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("formGroup", ctx_r1.form);
    i0.ɵɵadvance(19);
    i0.ɵɵproperty("ngForOf", ctx_r1.medicationsArray.controls);
    i0.ɵɵadvance(12);
    i0.ɵɵproperty("matDatepicker", picker_r6);
    i0.ɵɵadvance();
    i0.ɵɵproperty("for", picker_r6);
    i0.ɵɵadvance(8);
    i0.ɵɵproperty("disabled", ctx_r1.saving);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.saving ? "Saving..." : "Save & Complete");
} }
export class ConsultationComponent {
    constructor(fb, api, route, router, notification) {
        this.fb = fb;
        this.api = api;
        this.route = route;
        this.router = router;
        this.notification = notification;
        this.saving = false;
    }
    ngOnInit() {
        this.form = this.fb.group({
            chiefComplaint: ['', Validators.required], historyOfPresentIllness: [''], examinationFindings: [''],
            diagnosis: ['', Validators.required], medications: this.fb.array([]), advice: [''], followUpDate: ['']
        });
        const id = this.route.snapshot.paramMap.get('id');
        if (id)
            this.loadData(id);
    }
    get medicationsArray() { return this.form.get('medications'); }
    loadData(id) {
        this.api.get(`v1/opd/consultation/${id}`).subscribe(r => { this.patient = r.patient; this.vitals = r.vitals; });
    }
    addMedication() { this.medicationsArray.push(this.fb.group({ name: [''], dosage: [''], frequency: [''], duration: [''] })); }
    removeMedication(i) { this.medicationsArray.removeAt(i); }
    viewHistory() { this.router.navigate(['/patients', this.patient.id]); }
    orderLabs() { this.router.navigate(['/laboratory/order'], { queryParams: { patientId: this.patient.id } }); }
    saveConsultation() {
        if (this.form.invalid)
            return;
        this.saving = true;
        this.api.post(`v1/opd/consultation/${this.route.snapshot.paramMap.get('id')}/complete`, this.form.value).subscribe({
            next: () => { this.notification.success('Consultation saved'); this.router.navigate(['/opd/queue']); },
            error: () => this.saving = false
        });
    }
    static { this.ɵfac = function ConsultationComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ConsultationComponent)(i0.ɵɵdirectiveInject(i1.FormBuilder), i0.ɵɵdirectiveInject(i2.ApiService), i0.ɵɵdirectiveInject(i3.ActivatedRoute), i0.ɵɵdirectiveInject(i3.Router), i0.ɵɵdirectiveInject(i4.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ConsultationComponent, selectors: [["app-consultation"]], standalone: false, decls: 7, vars: 7, consts: [["picker", ""], ["title", "Consultation", 3, "breadcrumbs"], ["mat-stroked-button", "", 3, "click"], ["class", "consultation-grid", 4, "ngIf"], [1, "consultation-grid"], [1, "card", "patient-summary"], [1, "patient-header"], [1, "avatar"], ["class", "vitals", 4, "ngIf"], ["class", "alerts", 4, "ngIf"], [1, "card", "consultation-form"], [3, "ngSubmit", "formGroup"], ["appearance", "outline", 1, "full-width"], ["matInput", "", "formControlName", "chiefComplaint", "rows", "2"], ["matInput", "", "formControlName", "historyOfPresentIllness", "rows", "3"], ["matInput", "", "formControlName", "examinationFindings", "rows", "3"], ["matInput", "", "formControlName", "diagnosis"], ["formArrayName", "medications", 4, "ngFor", "ngForOf"], ["mat-stroked-button", "", "type", "button", 3, "click"], ["appearance", "outline", 1, "full-width", "mt-2"], ["matInput", "", "formControlName", "advice", "rows", "2"], ["matInput", "", "formControlName", "followUpDate", 3, "matDatepicker"], ["matIconSuffix", "", 3, "for"], [1, "form-actions"], ["mat-raised-button", "", "color", "primary", "type", "submit", 3, "disabled"], [1, "vitals"], [1, "vital"], [1, "alerts"], ["color", "warn", 4, "ngFor", "ngForOf"], ["color", "warn"], ["formArrayName", "medications"], [1, "med-row", 3, "formGroupName"], ["appearance", "outline"], ["matInput", "", "formControlName", "name"], ["matInput", "", "formControlName", "dosage"], ["matInput", "", "formControlName", "frequency"], ["matInput", "", "formControlName", "duration"], ["mat-icon-button", "", "color", "warn", "type", "button", 3, "click"]], template: function ConsultationComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout")(1, "app-page-header", 1)(2, "button", 2);
            i0.ɵɵlistener("click", function ConsultationComponent_Template_button_click_2_listener() { return ctx.viewHistory(); });
            i0.ɵɵelementStart(3, "mat-icon");
            i0.ɵɵtext(4, "history");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(5, " History");
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(6, ConsultationComponent_div_6_Template, 56, 13, "div", 3);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(4, _c2, i0.ɵɵpureFunction0(2, _c0), i0.ɵɵpureFunction0(3, _c1)));
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngIf", ctx.patient);
        } }, dependencies: [i5.NgForOf, i5.NgIf, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.FormGroupDirective, i1.FormControlName, i1.FormGroupName, i1.FormArrayName, i6.MatButton, i6.MatIconButton, i7.MatIcon, i8.MatInput, i8.MatFormField, i8.MatLabel, i8.MatSuffix, i9.MatDatepicker, i9.MatDatepickerInput, i9.MatDatepickerToggle, i10.MatDivider, i11.MatChip, i11.MatChipListbox, i12.PageHeaderComponent, i13.MainLayoutComponent], styles: [".consultation-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: 350px 1fr; gap: 1.5rem; }\n    .card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; }\n    .patient-header[_ngcontent-%COMP%] { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }\n    .avatar[_ngcontent-%COMP%] { width: 60px; height: 60px; border-radius: 50%; background: #3f51b5; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 600; }\n    .patient-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] { margin: 0; } .patient-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0; color: #666; font-size: 0.875rem; }\n    .vitals[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; padding: 1rem 0; }\n    .vital[_ngcontent-%COMP%] { text-align: center; } .vital[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] { display: block; font-size: 0.75rem; color: #666; } .vital[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] { font-size: 1rem; }\n    .alerts[_ngcontent-%COMP%] { padding-top: 1rem; }\n    .full-width[_ngcontent-%COMP%] { width: 100%; }\n    .med-row[_ngcontent-%COMP%] { display: flex; gap: 0.5rem; align-items: center; } .med-row[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%] { flex: 1; }\n    .form-actions[_ngcontent-%COMP%] { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ConsultationComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-consultation', template: `
    <app-main-layout>
      <app-page-header title="Consultation" [breadcrumbs]="[{ label: 'OPD', route: '/opd' }, { label: 'Consultation' }]">
        <button mat-stroked-button (click)="viewHistory()"><mat-icon>history</mat-icon> History</button>
      </app-page-header>

      <div class="consultation-grid" *ngIf="patient">
        <div class="card patient-summary">
          <div class="patient-header">
            <div class="avatar">{{ patient.initials }}</div>
            <div><h2>{{ patient.fullName }}</h2><p>{{ patient.age }} yrs, {{ patient.gender }} | Blood: {{ patient.bloodGroup }}</p></div>
          </div>
          <mat-divider></mat-divider>
          <div class="vitals" *ngIf="vitals">
            <div class="vital"><span>BP</span><strong>{{ vitals.bloodPressure }}</strong></div>
            <div class="vital"><span>Pulse</span><strong>{{ vitals.pulse }} bpm</strong></div>
            <div class="vital"><span>Temp</span><strong>{{ vitals.temperature }}°F</strong></div>
            <div class="vital"><span>SpO2</span><strong>{{ vitals.spO2 }}%</strong></div>
            <div class="vital"><span>Weight</span><strong>{{ vitals.weight }} kg</strong></div>
          </div>
          <div class="alerts" *ngIf="patient.allergies?.length">
            <mat-chip-listbox><mat-chip color="warn" *ngFor="let a of patient.allergies">{{ a }}</mat-chip></mat-chip-listbox>
          </div>
        </div>

        <div class="card consultation-form">
          <form [formGroup]="form" (ngSubmit)="saveConsultation()">
            <mat-form-field appearance="outline" class="full-width"><mat-label>Chief Complaint</mat-label><textarea matInput formControlName="chiefComplaint" rows="2"></textarea></mat-form-field>
            <mat-form-field appearance="outline" class="full-width"><mat-label>History of Present Illness</mat-label><textarea matInput formControlName="historyOfPresentIllness" rows="3"></textarea></mat-form-field>
            <mat-form-field appearance="outline" class="full-width"><mat-label>Examination Findings</mat-label><textarea matInput formControlName="examinationFindings" rows="3"></textarea></mat-form-field>
            <mat-form-field appearance="outline" class="full-width"><mat-label>Diagnosis</mat-label><input matInput formControlName="diagnosis"></mat-form-field>

            <h4>Prescription</h4>
            <div formArrayName="medications" *ngFor="let med of medicationsArray.controls; let i = index">
              <div [formGroupName]="i" class="med-row">
                <mat-form-field appearance="outline"><mat-label>Medicine</mat-label><input matInput formControlName="name"></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>Dosage</mat-label><input matInput formControlName="dosage"></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>Frequency</mat-label><input matInput formControlName="frequency"></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>Duration</mat-label><input matInput formControlName="duration"></mat-form-field>
                <button mat-icon-button color="warn" type="button" (click)="removeMedication(i)"><mat-icon>delete</mat-icon></button>
              </div>
            </div>
            <button mat-stroked-button type="button" (click)="addMedication()"><mat-icon>add</mat-icon> Add Medicine</button>

            <mat-form-field appearance="outline" class="full-width mt-2"><mat-label>Advice</mat-label><textarea matInput formControlName="advice" rows="2"></textarea></mat-form-field>
            <mat-form-field appearance="outline" class="full-width"><mat-label>Follow-up Date</mat-label><input matInput [matDatepicker]="picker" formControlName="followUpDate"><mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle><mat-datepicker #picker></mat-datepicker></mat-form-field>

            <div class="form-actions">
              <button mat-stroked-button type="button" (click)="orderLabs()"><mat-icon>science</mat-icon> Order Labs</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="saving">{{ saving ? 'Saving...' : 'Save & Complete' }}</button>
            </div>
          </form>
        </div>
      </div>
    </app-main-layout>
  `, styles: [".consultation-grid { display: grid; grid-template-columns: 350px 1fr; gap: 1.5rem; }\n    .card { background: white; padding: 1.5rem; border-radius: 8px; }\n    .patient-header { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }\n    .avatar { width: 60px; height: 60px; border-radius: 50%; background: #3f51b5; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 600; }\n    .patient-header h2 { margin: 0; } .patient-header p { margin: 0; color: #666; font-size: 0.875rem; }\n    .vitals { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; padding: 1rem 0; }\n    .vital { text-align: center; } .vital span { display: block; font-size: 0.75rem; color: #666; } .vital strong { font-size: 1rem; }\n    .alerts { padding-top: 1rem; }\n    .full-width { width: 100%; }\n    .med-row { display: flex; gap: 0.5rem; align-items: center; } .med-row mat-form-field { flex: 1; }\n    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }"] }]
    }], () => [{ type: i1.FormBuilder }, { type: i2.ApiService }, { type: i3.ActivatedRoute }, { type: i3.Router }, { type: i4.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ConsultationComponent, { className: "ConsultationComponent", filePath: "app/features/opd/consultation/consultation.component.ts", lineNumber: 78 }); })();
//# sourceMappingURL=consultation.component.js.map