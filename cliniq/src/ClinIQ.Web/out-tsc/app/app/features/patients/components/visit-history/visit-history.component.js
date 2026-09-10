import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../../core/services/api.service";
import * as i2 from "@angular/common";
import * as i3 from "@angular/router";
import * as i4 from "@angular/material/button";
import * as i5 from "@angular/material/icon";
import * as i6 from "../../../../shared/components/loading-spinner/loading-spinner.component";
import * as i7 from "../../../../shared/components/status-badge/status-badge.component";
const _c0 = a0 => ["/visits", a0];
function VisitHistoryComponent_app_loading_spinner_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-loading-spinner");
} }
function VisitHistoryComponent_div_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 4)(1, "mat-icon");
    i0.ɵɵtext(2, "event_note");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4, "No visits recorded");
    i0.ɵɵelementEnd()();
} }
function VisitHistoryComponent_div_3_div_1_p_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 17);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const visit_r1 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(visit_r1.diagnosis);
} }
function VisitHistoryComponent_div_3_div_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 7)(1, "div", 8)(2, "span", 9);
    i0.ɵɵtext(3);
    i0.ɵɵpipe(4, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 10);
    i0.ɵɵtext(6);
    i0.ɵɵpipe(7, "date");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 11)(9, "div", 12)(10, "h4");
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(12, "app-status-badge", 13);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "p", 14);
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(15, VisitHistoryComponent_div_3_div_1_p_15_Template, 2, 1, "p", 15);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(16, "button", 16)(17, "mat-icon");
    i0.ɵɵtext(18, "chevron_right");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const visit_r1 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(4, 8, visit_r1.date, "dd"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(7, 11, visit_r1.date, "MMM yyyy"));
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(visit_r1.type);
    i0.ɵɵadvance();
    i0.ɵɵproperty("status", visit_r1.status);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("Dr. ", visit_r1.doctorName, " - ", visit_r1.department, "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", visit_r1.diagnosis);
    i0.ɵɵadvance();
    i0.ɵɵproperty("routerLink", i0.ɵɵpureFunction1(14, _c0, visit_r1.id));
} }
function VisitHistoryComponent_div_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 5);
    i0.ɵɵtemplate(1, VisitHistoryComponent_div_3_div_1_Template, 19, 16, "div", 6);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.visits);
} }
export class VisitHistoryComponent {
    constructor(api) {
        this.api = api;
        this.visits = [];
        this.loading = true;
    }
    ngOnInit() {
        this.api.get(`v1/patients/${this.patientId}/visits`).subscribe({
            next: (data) => { this.visits = data; this.loading = false; },
            error: () => this.loading = false
        });
    }
    static { this.ɵfac = function VisitHistoryComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || VisitHistoryComponent)(i0.ɵɵdirectiveInject(i1.ApiService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: VisitHistoryComponent, selectors: [["app-visit-history"]], inputs: { patientId: "patientId" }, standalone: false, decls: 4, vars: 3, consts: [[1, "visit-history"], [4, "ngIf"], ["class", "empty", 4, "ngIf"], ["class", "visit-list", 4, "ngIf"], [1, "empty"], [1, "visit-list"], ["class", "visit-item", 4, "ngFor", "ngForOf"], [1, "visit-item"], [1, "visit-date"], [1, "day"], [1, "month"], [1, "visit-content"], [1, "visit-header"], [3, "status"], [1, "doctor"], ["class", "diagnosis", 4, "ngIf"], ["mat-icon-button", "", 3, "routerLink"], [1, "diagnosis"]], template: function VisitHistoryComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵtemplate(1, VisitHistoryComponent_app_loading_spinner_1_Template, 1, 0, "app-loading-spinner", 1)(2, VisitHistoryComponent_div_2_Template, 5, 0, "div", 2)(3, VisitHistoryComponent_div_3_Template, 2, 1, "div", 3);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading && ctx.visits.length === 0);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading && ctx.visits.length > 0);
        } }, dependencies: [i2.NgForOf, i2.NgIf, i3.RouterLink, i4.MatIconButton, i5.MatIcon, i6.LoadingSpinnerComponent, i7.StatusBadgeComponent, i2.DatePipe], styles: [".visit-history[_ngcontent-%COMP%] { padding: 1rem 0; }\n    .empty[_ngcontent-%COMP%] { text-align: center; padding: 2rem; color: #666; }\n    .empty[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] { font-size: 48px; width: 48px; height: 48px; color: #ccc; }\n    .visit-list[_ngcontent-%COMP%] { display: flex; flex-direction: column; gap: 1rem; }\n    .visit-item[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 8px; }\n    .visit-date[_ngcontent-%COMP%] { text-align: center; min-width: 60px; }\n    .visit-date[_ngcontent-%COMP%]   .day[_ngcontent-%COMP%] { display: block; font-size: 1.5rem; font-weight: 700; color: #3f51b5; }\n    .visit-date[_ngcontent-%COMP%]   .month[_ngcontent-%COMP%] { display: block; font-size: 0.75rem; color: #666; }\n    .visit-content[_ngcontent-%COMP%] { flex: 1; }\n    .visit-header[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 0.5rem; }\n    .visit-header[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] { margin: 0; }\n    .doctor[_ngcontent-%COMP%] { margin: 0.25rem 0; font-size: 0.875rem; color: #666; }\n    .diagnosis[_ngcontent-%COMP%] { margin: 0; font-size: 0.875rem; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(VisitHistoryComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-visit-history', template: `
    <div class="visit-history">
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>
      <div *ngIf="!loading && visits.length === 0" class="empty">
        <mat-icon>event_note</mat-icon>
        <p>No visits recorded</p>
      </div>
      <div class="visit-list" *ngIf="!loading && visits.length > 0">
        <div class="visit-item" *ngFor="let visit of visits">
          <div class="visit-date">
            <span class="day">{{ visit.date | date:'dd' }}</span>
            <span class="month">{{ visit.date | date:'MMM yyyy' }}</span>
          </div>
          <div class="visit-content">
            <div class="visit-header">
              <h4>{{ visit.type }}</h4>
              <app-status-badge [status]="visit.status"></app-status-badge>
            </div>
            <p class="doctor">Dr. {{ visit.doctorName }} - {{ visit.department }}</p>
            <p class="diagnosis" *ngIf="visit.diagnosis">{{ visit.diagnosis }}</p>
          </div>
          <button mat-icon-button [routerLink]="['/visits', visit.id]"><mat-icon>chevron_right</mat-icon></button>
        </div>
      </div>
    </div>
  `, styles: ["\n    .visit-history { padding: 1rem 0; }\n    .empty { text-align: center; padding: 2rem; color: #666; }\n    .empty mat-icon { font-size: 48px; width: 48px; height: 48px; color: #ccc; }\n    .visit-list { display: flex; flex-direction: column; gap: 1rem; }\n    .visit-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 8px; }\n    .visit-date { text-align: center; min-width: 60px; }\n    .visit-date .day { display: block; font-size: 1.5rem; font-weight: 700; color: #3f51b5; }\n    .visit-date .month { display: block; font-size: 0.75rem; color: #666; }\n    .visit-content { flex: 1; }\n    .visit-header { display: flex; align-items: center; gap: 0.5rem; }\n    .visit-header h4 { margin: 0; }\n    .doctor { margin: 0.25rem 0; font-size: 0.875rem; color: #666; }\n    .diagnosis { margin: 0; font-size: 0.875rem; }\n  "] }]
    }], () => [{ type: i1.ApiService }], { patientId: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(VisitHistoryComponent, { className: "VisitHistoryComponent", filePath: "app/features/patients/components/visit-history/visit-history.component.ts", lineNumber: 49 }); })();
//# sourceMappingURL=visit-history.component.js.map