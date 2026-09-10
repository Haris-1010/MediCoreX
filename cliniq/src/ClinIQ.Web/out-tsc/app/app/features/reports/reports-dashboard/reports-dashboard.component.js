import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "@angular/common";
import * as i3 from "@angular/material/icon";
import * as i4 from "@angular/material/progress-spinner";
import * as i5 from "../../../shared/components/page-header/page-header.component";
import * as i6 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "Reports" });
const _c2 = (a0, a1) => [a0, a1];
function ReportsDashboardComponent_div_3_div_6_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 7);
    i0.ɵɵlistener("click", function ReportsDashboardComponent_div_3_div_6_Template_div_click_0_listener() { const r_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.generateReport(r_r2)); });
    i0.ɵɵelementStart(1, "div", 8)(2, "span", 9);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 10);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "mat-icon");
    i0.ɵɵtext(7, "chevron_right");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const r_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("active", (ctx_r2.selectedReport == null ? null : ctx_r2.selectedReport.id) === r_r2.id);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(r_r2.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(r_r2.description);
} }
function ReportsDashboardComponent_div_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 4)(1, "h3")(2, "mat-icon");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 5);
    i0.ɵɵtemplate(6, ReportsDashboardComponent_div_3_div_6_Template, 8, 4, "div", 6);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const cat_r4 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(cat_r4.icon);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", cat_r4.name, "");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngForOf", cat_r4.reports);
} }
function ReportsDashboardComponent_div_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 11)(1, "h3")(2, "mat-icon");
    i0.ɵɵtext(3, "assessment");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(4);
    i0.ɵɵpipe(5, "titlecase");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 12);
    i0.ɵɵtext(7);
    i0.ɵɵpipe(8, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 13)(10, "div", 14)(11, "mat-icon");
    i0.ɵɵtext(12, "info_outline");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "p");
    i0.ɵɵtext(14);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(5, 3, ctx_r2.reportData.title), " Report");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("Generated: ", i0.ɵɵpipeBind2(8, 5, ctx_r2.reportData.generatedAt, "medium"), "");
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r2.reportData.message);
} }
function ReportsDashboardComponent_div_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 11)(1, "div", 15);
    i0.ɵɵelement(2, "mat-spinner", 16);
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4, "Generating report...");
    i0.ɵɵelementEnd()()();
} }
export class ReportsDashboardComponent {
    constructor(api) {
        this.api = api;
        this.reportCategories = [];
        this.selectedReport = null;
        this.reportData = null;
        this.loading = false;
    }
    ngOnInit() {
        this.loadReports();
    }
    loadReports() {
        this.api.get('v1/reports').subscribe({
            next: (data) => {
                this.reportCategories = data;
            },
            error: () => {
                // Fallback to static data
                this.reportCategories = [
                    { name: 'Patient Reports', icon: 'people', reports: [
                            { name: 'Patient List', id: 'patient-list', description: 'Complete list of all registered patients' },
                            { name: 'New Registrations', id: 'new-registrations', description: 'Recently registered patients' },
                            { name: 'Patient Demographics', id: 'patient-demographics', description: 'Age, gender, and blood group distribution' }
                        ] },
                    { name: 'Financial Reports', icon: 'attach_money', reports: [
                            { name: 'Revenue Summary', id: 'revenue-summary', description: 'Total revenue breakdown by department' },
                            { name: 'Outstanding Payments', id: 'outstanding-payments', description: 'Pending and overdue invoices' },
                            { name: 'Daily Collection', id: 'daily-collection', description: "Today's collection summary" }
                        ] },
                    { name: 'Clinical Reports', icon: 'medical_services', reports: [
                            { name: 'OPD Summary', id: 'opd-summary', description: 'Outpatient department visit statistics' },
                            { name: 'IPD Statistics', id: 'ipd-statistics', description: 'Inpatient department admission data' },
                            { name: 'Diagnosis Report', id: 'diagnosis-report', description: 'Common diagnoses and treatment outcomes' }
                        ] },
                    { name: 'Operational Reports', icon: 'analytics', reports: [
                            { name: 'Bed Occupancy', id: 'bed-occupancy', description: 'Current bed utilization across departments' },
                            { name: 'Staff Attendance', id: 'staff-attendance', description: 'Staff attendance and shift coverage' },
                            { name: 'Department Performance', id: 'department-performance', description: 'KPIs by department' }
                        ] }
                ];
            }
        });
    }
    generateReport(report) {
        this.selectedReport = report;
        this.loading = true;
        this.reportData = null;
        this.api.get(`v1/reports/${report.id}`).subscribe({
            next: (data) => {
                this.reportData = data;
                this.loading = false;
            },
            error: () => {
                this.reportData = {
                    title: report.name,
                    generatedAt: new Date(),
                    message: 'Report generation not yet implemented'
                };
                this.loading = false;
            }
        });
    }
    static { this.ɵfac = function ReportsDashboardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ReportsDashboardComponent)(i0.ɵɵdirectiveInject(i1.ApiService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ReportsDashboardComponent, selectors: [["app-reports-dashboard"]], standalone: false, decls: 6, vars: 9, consts: [["title", "Reports", 3, "breadcrumbs"], [1, "reports-grid"], ["class", "report-category", 4, "ngFor", "ngForOf"], ["class", "report-result card", 4, "ngIf"], [1, "report-category"], [1, "report-list"], ["class", "report-item", 3, "active", "click", 4, "ngFor", "ngForOf"], [1, "report-item", 3, "click"], [1, "report-info"], [1, "report-name"], [1, "report-desc"], [1, "report-result", "card"], [1, "report-meta"], [1, "report-content"], [1, "empty-state"], [1, "loading-state"], ["diameter", "40"]], template: function ReportsDashboardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 0);
            i0.ɵɵelementStart(2, "div", 1);
            i0.ɵɵtemplate(3, ReportsDashboardComponent_div_3_Template, 7, 3, "div", 2);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(4, ReportsDashboardComponent_div_4_Template, 15, 8, "div", 3)(5, ReportsDashboardComponent_div_5_Template, 5, 0, "div", 3);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(6, _c2, i0.ɵɵpureFunction0(4, _c0), i0.ɵɵpureFunction0(5, _c1)));
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngForOf", ctx.reportCategories);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.reportData);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.loading);
        } }, dependencies: [i2.NgForOf, i2.NgIf, i3.MatIcon, i4.MatProgressSpinner, i5.PageHeaderComponent, i6.MainLayoutComponent, i2.TitleCasePipe, i2.DatePipe], styles: [".reports-grid[_ngcontent-%COMP%] {\n      display: grid;\n      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n      gap: 1.5rem;\n    }\n\n    .report-category[_ngcontent-%COMP%] {\n      background: white;\n      border-radius: 8px;\n      overflow: hidden;\n      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n    }\n\n    .report-category[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 0.5rem;\n      margin: 0;\n      padding: 1rem;\n      background: linear-gradient(135deg, #1a237e, #0d47a1);\n      color: white;\n      font-size: 1rem;\n    }\n\n    .report-list[_ngcontent-%COMP%] {\n      padding: 0.5rem;\n    }\n\n    .report-item[_ngcontent-%COMP%] {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      padding: 0.75rem 1rem;\n      cursor: pointer;\n      border-radius: 4px;\n      transition: all 0.2s ease;\n    }\n\n    .report-item[_ngcontent-%COMP%]:hover {\n      background: #f0f4ff;\n    }\n\n    .report-item.active[_ngcontent-%COMP%] {\n      background: #e3f2fd;\n      border-left: 3px solid #1a237e;\n    }\n\n    .report-info[_ngcontent-%COMP%] {\n      display: flex;\n      flex-direction: column;\n    }\n\n    .report-name[_ngcontent-%COMP%] {\n      font-weight: 500;\n    }\n\n    .report-desc[_ngcontent-%COMP%] {\n      font-size: 0.75rem;\n      color: #666;\n      margin-top: 2px;\n    }\n\n    .report-result[_ngcontent-%COMP%] {\n      margin-top: 1.5rem;\n    }\n\n    .report-result[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 0.5rem;\n      margin: 0 0 0.5rem 0;\n      color: #1a237e;\n    }\n\n    .report-meta[_ngcontent-%COMP%] {\n      font-size: 0.85rem;\n      color: #666;\n      margin-bottom: 1rem;\n    }\n\n    .empty-state[_ngcontent-%COMP%], .loading-state[_ngcontent-%COMP%] {\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      padding: 2rem;\n      color: #999;\n    }\n\n    .empty-state[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%], .loading-state[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n      font-size: 48px;\n      width: 48px;\n      height: 48px;\n      margin-bottom: 0.5rem;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ReportsDashboardComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-reports-dashboard', template: `
    <app-main-layout>
      <app-page-header title="Reports" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Reports' }]"></app-page-header>

      <div class="reports-grid">
        <div class="report-category" *ngFor="let cat of reportCategories">
          <h3><mat-icon>{{ cat.icon }}</mat-icon> {{ cat.name }}</h3>
          <div class="report-list">
            <div class="report-item" *ngFor="let r of cat.reports" (click)="generateReport(r)" [class.active]="selectedReport?.id === r.id">
              <div class="report-info">
                <span class="report-name">{{ r.name }}</span>
                <span class="report-desc">{{ r.description }}</span>
              </div>
              <mat-icon>chevron_right</mat-icon>
            </div>
          </div>
        </div>
      </div>

      <div class="report-result card" *ngIf="reportData">
        <h3><mat-icon>assessment</mat-icon> {{ reportData.title | titlecase }} Report</h3>
        <p class="report-meta">Generated: {{ reportData.generatedAt | date:'medium' }}</p>
        <div class="report-content">
          <div class="empty-state">
            <mat-icon>info_outline</mat-icon>
            <p>{{ reportData.message }}</p>
          </div>
        </div>
      </div>

      <div class="report-result card" *ngIf="loading">
        <div class="loading-state">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Generating report...</p>
        </div>
      </div>
    </app-main-layout>
  `, styles: ["\n    .reports-grid {\n      display: grid;\n      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n      gap: 1.5rem;\n    }\n\n    .report-category {\n      background: white;\n      border-radius: 8px;\n      overflow: hidden;\n      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n    }\n\n    .report-category h3 {\n      display: flex;\n      align-items: center;\n      gap: 0.5rem;\n      margin: 0;\n      padding: 1rem;\n      background: linear-gradient(135deg, #1a237e, #0d47a1);\n      color: white;\n      font-size: 1rem;\n    }\n\n    .report-list {\n      padding: 0.5rem;\n    }\n\n    .report-item {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      padding: 0.75rem 1rem;\n      cursor: pointer;\n      border-radius: 4px;\n      transition: all 0.2s ease;\n    }\n\n    .report-item:hover {\n      background: #f0f4ff;\n    }\n\n    .report-item.active {\n      background: #e3f2fd;\n      border-left: 3px solid #1a237e;\n    }\n\n    .report-info {\n      display: flex;\n      flex-direction: column;\n    }\n\n    .report-name {\n      font-weight: 500;\n    }\n\n    .report-desc {\n      font-size: 0.75rem;\n      color: #666;\n      margin-top: 2px;\n    }\n\n    .report-result {\n      margin-top: 1.5rem;\n    }\n\n    .report-result h3 {\n      display: flex;\n      align-items: center;\n      gap: 0.5rem;\n      margin: 0 0 0.5rem 0;\n      color: #1a237e;\n    }\n\n    .report-meta {\n      font-size: 0.85rem;\n      color: #666;\n      margin-bottom: 1rem;\n    }\n\n    .empty-state, .loading-state {\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      padding: 2rem;\n      color: #999;\n    }\n\n    .empty-state mat-icon, .loading-state mat-icon {\n      font-size: 48px;\n      width: 48px;\n      height: 48px;\n      margin-bottom: 0.5rem;\n    }\n  "] }]
    }], () => [{ type: i1.ApiService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ReportsDashboardComponent, { className: "ReportsDashboardComponent", filePath: "app/features/reports/reports-dashboard/reports-dashboard.component.ts", lineNumber: 142 }); })();
//# sourceMappingURL=reports-dashboard.component.js.map