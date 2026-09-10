import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../../core/services/api.service";
import * as i2 from "@angular/common";
import * as i3 from "@angular/material/icon";
import * as i4 from "@angular/material/expansion";
import * as i5 from "../../../../shared/components/loading-spinner/loading-spinner.component";
function MedicalHistoryComponent_app_loading_spinner_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-loading-spinner");
} }
function MedicalHistoryComponent_div_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 3)(1, "mat-icon");
    i0.ɵɵtext(2, "history");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4, "No medical history recorded");
    i0.ɵɵelementEnd()();
} }
function MedicalHistoryComponent_mat_accordion_3_mat_expansion_panel_1_div_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 6)(1, "h5");
    i0.ɵɵtext(2, "Prescription");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const record_r1 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(record_r1.prescription);
} }
function MedicalHistoryComponent_mat_accordion_3_mat_expansion_panel_1_div_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 6)(1, "h5");
    i0.ɵɵtext(2, "Notes");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const record_r1 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(record_r1.notes);
} }
function MedicalHistoryComponent_mat_accordion_3_mat_expansion_panel_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-expansion-panel")(1, "mat-expansion-panel-header")(2, "mat-panel-title");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "mat-panel-description");
    i0.ɵɵtext(5);
    i0.ɵɵpipe(6, "date");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "div", 5)(8, "div", 6)(9, "h5");
    i0.ɵɵtext(10, "Chief Complaint");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "p");
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(13, "div", 6)(14, "h5");
    i0.ɵɵtext(15, "Treatment");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "p");
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(18, MedicalHistoryComponent_mat_accordion_3_mat_expansion_panel_1_div_18_Template, 5, 1, "div", 7)(19, MedicalHistoryComponent_mat_accordion_3_mat_expansion_panel_1_div_19_Template, 5, 1, "div", 7);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const record_r1 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(record_r1.diagnosis);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", i0.ɵɵpipeBind2(6, 7, record_r1.date, "mediumDate"), " - Dr. ", record_r1.doctorName, "");
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(record_r1.chiefComplaint);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(record_r1.treatment);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", record_r1.prescription);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", record_r1.notes);
} }
function MedicalHistoryComponent_mat_accordion_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-accordion");
    i0.ɵɵtemplate(1, MedicalHistoryComponent_mat_accordion_3_mat_expansion_panel_1_Template, 20, 10, "mat-expansion-panel", 4);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.history);
} }
export class MedicalHistoryComponent {
    constructor(api) {
        this.api = api;
        this.history = [];
        this.loading = true;
    }
    ngOnInit() {
        this.api.get(`v1/patients/${this.patientId}/medical-history`).subscribe({
            next: (data) => { this.history = data; this.loading = false; },
            error: () => this.loading = false
        });
    }
    static { this.ɵfac = function MedicalHistoryComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || MedicalHistoryComponent)(i0.ɵɵdirectiveInject(i1.ApiService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: MedicalHistoryComponent, selectors: [["app-medical-history"]], inputs: { patientId: "patientId" }, standalone: false, decls: 4, vars: 3, consts: [[1, "medical-history"], [4, "ngIf"], ["class", "empty", 4, "ngIf"], [1, "empty"], [4, "ngFor", "ngForOf"], [1, "record-content"], [1, "section"], ["class", "section", 4, "ngIf"]], template: function MedicalHistoryComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵtemplate(1, MedicalHistoryComponent_app_loading_spinner_1_Template, 1, 0, "app-loading-spinner", 1)(2, MedicalHistoryComponent_div_2_Template, 5, 0, "div", 2)(3, MedicalHistoryComponent_mat_accordion_3_Template, 2, 1, "mat-accordion", 1);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading && ctx.history.length === 0);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading && ctx.history.length > 0);
        } }, dependencies: [i2.NgForOf, i2.NgIf, i3.MatIcon, i4.MatAccordion, i4.MatExpansionPanel, i4.MatExpansionPanelHeader, i4.MatExpansionPanelTitle, i4.MatExpansionPanelDescription, i5.LoadingSpinnerComponent, i2.DatePipe], styles: [".medical-history[_ngcontent-%COMP%] { padding: 1rem 0; }\n    .empty[_ngcontent-%COMP%] { text-align: center; padding: 2rem; color: #666; }\n    .empty[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] { font-size: 48px; width: 48px; height: 48px; color: #ccc; }\n    .record-content[_ngcontent-%COMP%] { padding: 1rem 0; }\n    .section[_ngcontent-%COMP%] { margin-bottom: 1rem; }\n    .section[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%] { margin: 0 0 0.25rem; color: #666; font-size: 0.75rem; text-transform: uppercase; }\n    .section[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MedicalHistoryComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-medical-history', template: `
    <div class="medical-history">
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>
      <div *ngIf="!loading && history.length === 0" class="empty">
        <mat-icon>history</mat-icon>
        <p>No medical history recorded</p>
      </div>
      <mat-accordion *ngIf="!loading && history.length > 0">
        <mat-expansion-panel *ngFor="let record of history">
          <mat-expansion-panel-header>
            <mat-panel-title>{{ record.diagnosis }}</mat-panel-title>
            <mat-panel-description>{{ record.date | date:'mediumDate' }} - Dr. {{ record.doctorName }}</mat-panel-description>
          </mat-expansion-panel-header>
          <div class="record-content">
            <div class="section"><h5>Chief Complaint</h5><p>{{ record.chiefComplaint }}</p></div>
            <div class="section"><h5>Treatment</h5><p>{{ record.treatment }}</p></div>
            <div class="section" *ngIf="record.prescription"><h5>Prescription</h5><p>{{ record.prescription }}</p></div>
            <div class="section" *ngIf="record.notes"><h5>Notes</h5><p>{{ record.notes }}</p></div>
          </div>
        </mat-expansion-panel>
      </mat-accordion>
    </div>
  `, styles: ["\n    .medical-history { padding: 1rem 0; }\n    .empty { text-align: center; padding: 2rem; color: #666; }\n    .empty mat-icon { font-size: 48px; width: 48px; height: 48px; color: #ccc; }\n    .record-content { padding: 1rem 0; }\n    .section { margin-bottom: 1rem; }\n    .section h5 { margin: 0 0 0.25rem; color: #666; font-size: 0.75rem; text-transform: uppercase; }\n    .section p { margin: 0; }\n  "] }]
    }], () => [{ type: i1.ApiService }], { patientId: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(MedicalHistoryComponent, { className: "MedicalHistoryComponent", filePath: "app/features/patients/components/medical-history/medical-history.component.ts", lineNumber: 40 }); })();
//# sourceMappingURL=medical-history.component.js.map