import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "@angular/common";
import * as i3 from "@angular/forms";
import * as i4 from "@angular/material/button";
import * as i5 from "@angular/material/icon";
import * as i6 from "@angular/material/input";
import * as i7 from "@angular/material/select";
import * as i8 from "@angular/material/checkbox";
import * as i9 from "@angular/material/table";
import * as i10 from "@angular/material/tabs";
import * as i11 from "../../../shared/components/page-header/page-header.component";
import * as i12 from "../../../shared/components/status-badge/status-badge.component";
import * as i13 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "IPD", route: "/ipd" });
const _c1 = () => ({ label: "Nursing" });
const _c2 = (a0, a1) => [a0, a1];
function NursingStationComponent_mat_option_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 15);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r1 = ctx.$implicit;
    i0.ɵɵproperty("value", p_r1);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("", p_r1.patientName, " - Bed ", p_r1.bedNumber, "");
} }
function NursingStationComponent_table_15_th_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 27);
    i0.ɵɵtext(1, "Time");
    i0.ɵɵelementEnd();
} }
function NursingStationComponent_table_15_td_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 28);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "date");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const v_r2 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(2, 1, v_r2.recordedAt, "short"));
} }
function NursingStationComponent_table_15_th_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 27);
    i0.ɵɵtext(1, "BP");
    i0.ɵɵelementEnd();
} }
function NursingStationComponent_table_15_td_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 28);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const v_r3 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(v_r3.bloodPressure);
} }
function NursingStationComponent_table_15_th_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 27);
    i0.ɵɵtext(1, "Pulse");
    i0.ɵɵelementEnd();
} }
function NursingStationComponent_table_15_td_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 28);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const v_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(v_r4.pulse);
} }
function NursingStationComponent_table_15_th_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 27);
    i0.ɵɵtext(1, "Temp");
    i0.ɵɵelementEnd();
} }
function NursingStationComponent_table_15_td_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 28);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const v_r5 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", v_r5.temperature, "\u00B0F");
} }
function NursingStationComponent_table_15_th_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 27);
    i0.ɵɵtext(1, "SpO2");
    i0.ɵɵelementEnd();
} }
function NursingStationComponent_table_15_td_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 28);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const v_r6 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", v_r6.spO2, "%");
} }
function NursingStationComponent_table_15_th_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 27);
    i0.ɵɵtext(1, "Recorded By");
    i0.ɵɵelementEnd();
} }
function NursingStationComponent_table_15_td_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 28);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const v_r7 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(v_r7.recordedBy);
} }
function NursingStationComponent_table_15_tr_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 29);
} }
function NursingStationComponent_table_15_tr_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 30);
} }
function NursingStationComponent_table_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "table", 16);
    i0.ɵɵelementContainerStart(1, 17);
    i0.ɵɵtemplate(2, NursingStationComponent_table_15_th_2_Template, 2, 0, "th", 18)(3, NursingStationComponent_table_15_td_3_Template, 3, 4, "td", 19);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(4, 20);
    i0.ɵɵtemplate(5, NursingStationComponent_table_15_th_5_Template, 2, 0, "th", 18)(6, NursingStationComponent_table_15_td_6_Template, 2, 1, "td", 19);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(7, 21);
    i0.ɵɵtemplate(8, NursingStationComponent_table_15_th_8_Template, 2, 0, "th", 18)(9, NursingStationComponent_table_15_td_9_Template, 2, 1, "td", 19);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(10, 22);
    i0.ɵɵtemplate(11, NursingStationComponent_table_15_th_11_Template, 2, 0, "th", 18)(12, NursingStationComponent_table_15_td_12_Template, 2, 1, "td", 19);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(13, 23);
    i0.ɵɵtemplate(14, NursingStationComponent_table_15_th_14_Template, 2, 0, "th", 18)(15, NursingStationComponent_table_15_td_15_Template, 2, 1, "td", 19);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(16, 24);
    i0.ɵɵtemplate(17, NursingStationComponent_table_15_th_17_Template, 2, 0, "th", 18)(18, NursingStationComponent_table_15_td_18_Template, 2, 1, "td", 19);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵtemplate(19, NursingStationComponent_table_15_tr_19_Template, 1, 0, "tr", 25)(20, NursingStationComponent_table_15_tr_20_Template, 1, 0, "tr", 26);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r7 = i0.ɵɵnextContext();
    i0.ɵɵproperty("dataSource", ctx_r7.vitalsHistory);
    i0.ɵɵadvance(19);
    i0.ɵɵproperty("matHeaderRowDef", ctx_r7.vitalsColumns);
    i0.ɵɵadvance();
    i0.ɵɵproperty("matRowDefColumns", ctx_r7.vitalsColumns);
} }
function NursingStationComponent_div_19_div_3_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 33)(1, "mat-checkbox", 34);
    i0.ɵɵtwoWayListener("ngModelChange", function NursingStationComponent_div_19_div_3_Template_mat_checkbox_ngModelChange_1_listener($event) { const m_r10 = i0.ɵɵrestoreView(_r9).$implicit; i0.ɵɵtwoWayBindingSet(m_r10.given, $event) || (m_r10.given = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("change", function NursingStationComponent_div_19_div_3_Template_mat_checkbox_change_1_listener() { const m_r10 = i0.ɵɵrestoreView(_r9).$implicit; const ctx_r7 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r7.updateMedication(m_r10)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div", 35)(3, "strong");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const m_r10 = ctx.$implicit;
    i0.ɵɵclassProp("given", m_r10.given)("pending", !m_r10.given);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", m_r10.given);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(m_r10.patientName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", m_r10.medication, " - ", m_r10.dosage, "");
} }
function NursingStationComponent_div_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 31)(1, "h4");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(3, NursingStationComponent_div_19_div_3_Template, 7, 8, "div", 32);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const slot_r11 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(slot_r11.time);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", slot_r11.medications);
} }
function NursingStationComponent_div_23_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 36)(1, "mat-checkbox", 34);
    i0.ɵɵtwoWayListener("ngModelChange", function NursingStationComponent_div_23_Template_mat_checkbox_ngModelChange_1_listener($event) { const t_r13 = i0.ɵɵrestoreView(_r12).$implicit; i0.ɵɵtwoWayBindingSet(t_r13.completed, $event) || (t_r13.completed = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("change", function NursingStationComponent_div_23_Template_mat_checkbox_change_1_listener() { const t_r13 = i0.ɵɵrestoreView(_r12).$implicit; const ctx_r7 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r7.updateTask(t_r13)); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "div", 37)(3, "strong");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(7, "app-status-badge", 38);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const t_r13 = ctx.$implicit;
    i0.ɵɵclassProp("completed", t_r13.completed);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", t_r13.completed);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(t_r13.title);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", t_r13.patientName, " | ", t_r13.dueTime, "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("status", t_r13.priority);
} }
export class NursingStationComponent {
    constructor(api) {
        this.api = api;
        this.patients = [];
        this.selectedPatient = null;
        this.vitalsHistory = [];
        this.vitalsColumns = ['time', 'bp', 'pulse', 'temp', 'spo2', 'nurse'];
        this.medicationSchedule = [];
        this.tasks = [];
    }
    ngOnInit() {
        this.api.get('v1/ipd/admitted-patients').subscribe(r => this.patients = r);
        this.api.get('v1/nursing/medications').subscribe(r => this.medicationSchedule = r);
        this.api.get('v1/nursing/tasks').subscribe(r => this.tasks = r);
    }
    loadVitals() { if (this.selectedPatient)
        this.api.get(`v1/nursing/vitals/${this.selectedPatient.admissionId}`).subscribe(r => this.vitalsHistory = r); }
    openVitalsDialog() {
        if (!this.selectedPatient)
            return;
        const bp = prompt('Blood Pressure - Systolic (e.g. 120):');
        if (!bp)
            return;
        const bpDiastolic = prompt('Blood Pressure - Diastolic (e.g. 80):');
        const pulse = prompt('Pulse (bpm):');
        const temperature = prompt('Temperature (°C):');
        const spO2 = prompt('SpO2 (%):');
        const payload = {
            patientId: this.selectedPatient.patientId,
            admissionId: this.selectedPatient.admissionId || this.selectedPatient.id,
            systolicBP: parseInt(bp) || null,
            diastolicBP: parseInt(bpDiastolic || '0') || null,
            pulse: parseInt(pulse || '0') || null,
            temperature: parseFloat(temperature || '0') || null,
            spO2: parseInt(spO2 || '0') || null
        };
        this.api.post('v1/nursing/vitals', payload).subscribe({
            next: () => { this.loadVitals(); },
            error: () => { }
        });
    }
    updateMedication(m) { this.api.patch('v1/nursing/medications', m.id, { given: m.given }).subscribe(); }
    updateTask(t) { this.api.patch('v1/nursing/tasks', t.id, { completed: t.completed }).subscribe(); }
    static { this.ɵfac = function NursingStationComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || NursingStationComponent)(i0.ɵɵdirectiveInject(i1.ApiService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: NursingStationComponent, selectors: [["app-nursing-station"]], standalone: false, decls: 24, vars: 12, consts: [["title", "Nursing Station", 3, "breadcrumbs"], ["label", "Vitals"], [1, "tab-content"], [1, "patient-select"], ["appearance", "outline"], [3, "valueChange", "selectionChange", "value"], [3, "value", 4, "ngFor", "ngForOf"], ["mat-raised-button", "", "color", "primary", 3, "click", "disabled"], ["mat-table", "", 3, "dataSource", 4, "ngIf"], ["label", "Medications"], [1, "med-schedule"], ["class", "time-slot", 4, "ngFor", "ngForOf"], ["label", "Tasks"], [1, "task-list"], ["class", "task-item", 3, "completed", 4, "ngFor", "ngForOf"], [3, "value"], ["mat-table", "", 3, "dataSource"], ["matColumnDef", "time"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "bp"], ["matColumnDef", "pulse"], ["matColumnDef", "temp"], ["matColumnDef", "spo2"], ["matColumnDef", "nurse"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", ""], ["mat-cell", ""], ["mat-header-row", ""], ["mat-row", ""], [1, "time-slot"], ["class", "med-item", 3, "given", "pending", 4, "ngFor", "ngForOf"], [1, "med-item"], [3, "ngModelChange", "change", "ngModel"], [1, "med-info"], [1, "task-item"], [1, "task-info"], [3, "status"]], template: function NursingStationComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 0);
            i0.ɵɵelementStart(2, "mat-tab-group")(3, "mat-tab", 1)(4, "div", 2)(5, "div", 3)(6, "mat-form-field", 4)(7, "mat-label");
            i0.ɵɵtext(8, "Select Patient");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "mat-select", 5);
            i0.ɵɵtwoWayListener("valueChange", function NursingStationComponent_Template_mat_select_valueChange_9_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.selectedPatient, $event) || (ctx.selectedPatient = $event); return $event; });
            i0.ɵɵlistener("selectionChange", function NursingStationComponent_Template_mat_select_selectionChange_9_listener() { return ctx.loadVitals(); });
            i0.ɵɵtemplate(10, NursingStationComponent_mat_option_10_Template, 2, 3, "mat-option", 6);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(11, "button", 7);
            i0.ɵɵlistener("click", function NursingStationComponent_Template_button_click_11_listener() { return ctx.openVitalsDialog(); });
            i0.ɵɵelementStart(12, "mat-icon");
            i0.ɵɵtext(13, "add");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(14, " Record Vitals");
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(15, NursingStationComponent_table_15_Template, 21, 3, "table", 8);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(16, "mat-tab", 9)(17, "div", 2)(18, "div", 10);
            i0.ɵɵtemplate(19, NursingStationComponent_div_19_Template, 4, 2, "div", 11);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(20, "mat-tab", 12)(21, "div", 2)(22, "div", 13);
            i0.ɵɵtemplate(23, NursingStationComponent_div_23_Template, 8, 7, "div", 14);
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(9, _c2, i0.ɵɵpureFunction0(7, _c0), i0.ɵɵpureFunction0(8, _c1)));
            i0.ɵɵadvance(8);
            i0.ɵɵtwoWayProperty("value", ctx.selectedPatient);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.patients);
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", !ctx.selectedPatient);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("ngIf", ctx.selectedPatient);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("ngForOf", ctx.medicationSchedule);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("ngForOf", ctx.tasks);
        } }, dependencies: [i2.NgForOf, i2.NgIf, i3.NgControlStatus, i3.NgModel, i4.MatButton, i5.MatIcon, i6.MatFormField, i6.MatLabel, i7.MatSelect, i7.MatOption, i8.MatCheckbox, i9.MatTable, i9.MatHeaderCellDef, i9.MatHeaderRowDef, i9.MatColumnDef, i9.MatCellDef, i9.MatRowDef, i9.MatHeaderCell, i9.MatCell, i9.MatHeaderRow, i9.MatRow, i10.MatTab, i10.MatTabGroup, i11.PageHeaderComponent, i12.StatusBadgeComponent, i13.MainLayoutComponent, i2.DatePipe], styles: [".tab-content[_ngcontent-%COMP%] { padding: 1.5rem; }\n    .patient-select[_ngcontent-%COMP%] { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }\n    table[_ngcontent-%COMP%] { width: 100%; background: white; }\n    .med-schedule[_ngcontent-%COMP%] { display: flex; gap: 1.5rem; flex-wrap: wrap; }\n    .time-slot[_ngcontent-%COMP%] { background: white; padding: 1rem; border-radius: 8px; min-width: 250px; }\n    .time-slot[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] { margin: 0 0 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee; }\n    .med-item[_ngcontent-%COMP%], .task-item[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem; border-radius: 4px; margin-bottom: 0.5rem; }\n    .med-item.pending[_ngcontent-%COMP%] { background: #fff3e0; } .med-item.given[_ngcontent-%COMP%] { background: #e8f5e9; }\n    .task-item[_ngcontent-%COMP%] { background: #f5f5f5; } .task-item.completed[_ngcontent-%COMP%] { opacity: 0.6; text-decoration: line-through; }\n    .med-info[_ngcontent-%COMP%], .task-info[_ngcontent-%COMP%] { flex: 1; } .med-info[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], .task-info[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] { display: block; } .med-info[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], .task-info[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] { font-size: 0.875rem; color: #666; }\n    .task-list[_ngcontent-%COMP%] { background: white; padding: 1rem; border-radius: 8px; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NursingStationComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-nursing-station', template: `
    <app-main-layout>
      <app-page-header title="Nursing Station" [breadcrumbs]="[{ label: 'IPD', route: '/ipd' }, { label: 'Nursing' }]"></app-page-header>
      <mat-tab-group>
        <mat-tab label="Vitals">
          <div class="tab-content">
            <div class="patient-select">
              <mat-form-field appearance="outline"><mat-label>Select Patient</mat-label>
                <mat-select [(value)]="selectedPatient" (selectionChange)="loadVitals()"><mat-option *ngFor="let p of patients" [value]="p">{{ p.patientName }} - Bed {{ p.bedNumber }}</mat-option></mat-select>
              </mat-form-field>
              <button mat-raised-button color="primary" (click)="openVitalsDialog()" [disabled]="!selectedPatient"><mat-icon>add</mat-icon> Record Vitals</button>
            </div>
            <table mat-table [dataSource]="vitalsHistory" *ngIf="selectedPatient">
              <ng-container matColumnDef="time"><th mat-header-cell *matHeaderCellDef>Time</th><td mat-cell *matCellDef="let v">{{ v.recordedAt | date:'short' }}</td></ng-container>
              <ng-container matColumnDef="bp"><th mat-header-cell *matHeaderCellDef>BP</th><td mat-cell *matCellDef="let v">{{ v.bloodPressure }}</td></ng-container>
              <ng-container matColumnDef="pulse"><th mat-header-cell *matHeaderCellDef>Pulse</th><td mat-cell *matCellDef="let v">{{ v.pulse }}</td></ng-container>
              <ng-container matColumnDef="temp"><th mat-header-cell *matHeaderCellDef>Temp</th><td mat-cell *matCellDef="let v">{{ v.temperature }}°F</td></ng-container>
              <ng-container matColumnDef="spo2"><th mat-header-cell *matHeaderCellDef>SpO2</th><td mat-cell *matCellDef="let v">{{ v.spO2 }}%</td></ng-container>
              <ng-container matColumnDef="nurse"><th mat-header-cell *matHeaderCellDef>Recorded By</th><td mat-cell *matCellDef="let v">{{ v.recordedBy }}</td></ng-container>
              <tr mat-header-row *matHeaderRowDef="vitalsColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: vitalsColumns;"></tr>
            </table>
          </div>
        </mat-tab>
        <mat-tab label="Medications">
          <div class="tab-content">
            <div class="med-schedule">
              <div class="time-slot" *ngFor="let slot of medicationSchedule">
                <h4>{{ slot.time }}</h4>
                <div class="med-item" *ngFor="let m of slot.medications" [class.given]="m.given" [class.pending]="!m.given">
                  <mat-checkbox [(ngModel)]="m.given" (change)="updateMedication(m)"></mat-checkbox>
                  <div class="med-info"><strong>{{ m.patientName }}</strong><span>{{ m.medication }} - {{ m.dosage }}</span></div>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>
        <mat-tab label="Tasks">
          <div class="tab-content">
            <div class="task-list">
              <div class="task-item" *ngFor="let t of tasks" [class.completed]="t.completed">
                <mat-checkbox [(ngModel)]="t.completed" (change)="updateTask(t)"></mat-checkbox>
                <div class="task-info"><strong>{{ t.title }}</strong><span>{{ t.patientName }} | {{ t.dueTime }}</span></div>
                <app-status-badge [status]="t.priority"></app-status-badge>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </app-main-layout>
  `, styles: [".tab-content { padding: 1.5rem; }\n    .patient-select { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }\n    table { width: 100%; background: white; }\n    .med-schedule { display: flex; gap: 1.5rem; flex-wrap: wrap; }\n    .time-slot { background: white; padding: 1rem; border-radius: 8px; min-width: 250px; }\n    .time-slot h4 { margin: 0 0 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee; }\n    .med-item, .task-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem; border-radius: 4px; margin-bottom: 0.5rem; }\n    .med-item.pending { background: #fff3e0; } .med-item.given { background: #e8f5e9; }\n    .task-item { background: #f5f5f5; } .task-item.completed { opacity: 0.6; text-decoration: line-through; }\n    .med-info, .task-info { flex: 1; } .med-info strong, .task-info strong { display: block; } .med-info span, .task-info span { font-size: 0.875rem; color: #666; }\n    .task-list { background: white; padding: 1rem; border-radius: 8px; }"] }]
    }], () => [{ type: i1.ApiService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(NursingStationComponent, { className: "NursingStationComponent", filePath: "app/features/ipd/nursing-station/nursing-station.component.ts", lineNumber: 72 }); })();
//# sourceMappingURL=nursing-station.component.js.map