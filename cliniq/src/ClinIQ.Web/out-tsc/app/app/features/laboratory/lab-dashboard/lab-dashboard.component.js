import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "@angular/router";
import * as i3 from "@angular/material/button";
import * as i4 from "@angular/material/icon";
import * as i5 from "@angular/material/table";
import * as i6 from "../../../shared/components/page-header/page-header.component";
import * as i7 from "../../../shared/components/status-badge/status-badge.component";
import * as i8 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "Laboratory" });
const _c2 = (a0, a1) => [a0, a1];
const _c3 = a0 => ["results", a0];
function LabDashboardComponent_th_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 15);
    i0.ɵɵtext(1, "Order #");
    i0.ɵɵelementEnd();
} }
function LabDashboardComponent_td_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 16);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const o_r1 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(o_r1.orderNumber);
} }
function LabDashboardComponent_th_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 15);
    i0.ɵɵtext(1, "Patient");
    i0.ɵɵelementEnd();
} }
function LabDashboardComponent_td_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 16);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const o_r2 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(o_r2.patientName);
} }
function LabDashboardComponent_th_38_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 15);
    i0.ɵɵtext(1, "Tests");
    i0.ɵɵelementEnd();
} }
function LabDashboardComponent_td_39_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 16);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const o_r3 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", o_r3.testCount, " tests");
} }
function LabDashboardComponent_th_41_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 15);
    i0.ɵɵtext(1, "Priority");
    i0.ɵɵelementEnd();
} }
function LabDashboardComponent_td_42_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 16);
    i0.ɵɵelement(1, "app-status-badge", 17);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const o_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("status", o_r4.priority);
} }
function LabDashboardComponent_th_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 15);
    i0.ɵɵtext(1, "Ordered By");
    i0.ɵɵelementEnd();
} }
function LabDashboardComponent_td_45_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 16);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const o_r5 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Dr. ", o_r5.orderedBy, "");
} }
function LabDashboardComponent_th_47_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "th", 15);
} }
function LabDashboardComponent_td_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 16)(1, "button", 18);
    i0.ɵɵtext(2, "Enter Results");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const o_r6 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("routerLink", i0.ɵɵpureFunction1(1, _c3, o_r6.id));
} }
function LabDashboardComponent_tr_49_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 19);
} }
function LabDashboardComponent_tr_50_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 20);
} }
export class LabDashboardComponent {
    constructor(api) {
        this.api = api;
        this.stats = { pending: 0, inProgress: 0, completedToday: 0 };
        this.orders = [];
        this.columns = ['orderNumber', 'patient', 'tests', 'priority', 'orderedBy', 'actions'];
    }
    ngOnInit() {
        this.api.get('v1/laboratory/stats').subscribe(r => this.stats = r);
        this.api.get('v1/laboratory/pending').subscribe(r => this.orders = r);
    }
    static { this.ɵfac = function LabDashboardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LabDashboardComponent)(i0.ɵɵdirectiveInject(i1.ApiService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: LabDashboardComponent, selectors: [["app-lab-dashboard"]], standalone: false, decls: 51, vars: 12, consts: [["title", "Laboratory", 3, "breadcrumbs"], [1, "stats-grid"], [1, "stat-card"], [1, "card"], ["mat-table", "", 3, "dataSource"], ["matColumnDef", "orderNumber"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "patient"], ["matColumnDef", "tests"], ["matColumnDef", "priority"], ["matColumnDef", "orderedBy"], ["matColumnDef", "actions"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", ""], ["mat-cell", ""], [3, "status"], ["mat-raised-button", "", "color", "primary", 3, "routerLink"], ["mat-header-row", ""], ["mat-row", ""]], template: function LabDashboardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 0);
            i0.ɵɵelementStart(2, "div", 1)(3, "div", 2)(4, "mat-icon");
            i0.ɵɵtext(5, "pending");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "div")(7, "h3");
            i0.ɵɵtext(8);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "p");
            i0.ɵɵtext(10, "Pending");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(11, "div", 2)(12, "mat-icon");
            i0.ɵɵtext(13, "science");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "div")(15, "h3");
            i0.ɵɵtext(16);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "p");
            i0.ɵɵtext(18, "In Progress");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(19, "div", 2)(20, "mat-icon");
            i0.ɵɵtext(21, "check_circle");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "div")(23, "h3");
            i0.ɵɵtext(24);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(25, "p");
            i0.ɵɵtext(26, "Completed Today");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(27, "div", 3)(28, "h3");
            i0.ɵɵtext(29, "Pending Lab Orders");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(30, "table", 4);
            i0.ɵɵelementContainerStart(31, 5);
            i0.ɵɵtemplate(32, LabDashboardComponent_th_32_Template, 2, 0, "th", 6)(33, LabDashboardComponent_td_33_Template, 2, 1, "td", 7);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(34, 8);
            i0.ɵɵtemplate(35, LabDashboardComponent_th_35_Template, 2, 0, "th", 6)(36, LabDashboardComponent_td_36_Template, 2, 1, "td", 7);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(37, 9);
            i0.ɵɵtemplate(38, LabDashboardComponent_th_38_Template, 2, 0, "th", 6)(39, LabDashboardComponent_td_39_Template, 2, 1, "td", 7);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(40, 10);
            i0.ɵɵtemplate(41, LabDashboardComponent_th_41_Template, 2, 0, "th", 6)(42, LabDashboardComponent_td_42_Template, 2, 1, "td", 7);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(43, 11);
            i0.ɵɵtemplate(44, LabDashboardComponent_th_44_Template, 2, 0, "th", 6)(45, LabDashboardComponent_td_45_Template, 2, 1, "td", 7);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(46, 12);
            i0.ɵɵtemplate(47, LabDashboardComponent_th_47_Template, 1, 0, "th", 6)(48, LabDashboardComponent_td_48_Template, 3, 3, "td", 7);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵtemplate(49, LabDashboardComponent_tr_49_Template, 1, 0, "tr", 13)(50, LabDashboardComponent_tr_50_Template, 1, 0, "tr", 14);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(9, _c2, i0.ɵɵpureFunction0(7, _c0), i0.ɵɵpureFunction0(8, _c1)));
            i0.ɵɵadvance(7);
            i0.ɵɵtextInterpolate(ctx.stats.pending);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(ctx.stats.inProgress);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(ctx.stats.completedToday);
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("dataSource", ctx.orders);
            i0.ɵɵadvance(19);
            i0.ɵɵproperty("matHeaderRowDef", ctx.columns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("matRowDefColumns", ctx.columns);
        } }, dependencies: [i2.RouterLink, i3.MatButton, i4.MatIcon, i5.MatTable, i5.MatHeaderCellDef, i5.MatHeaderRowDef, i5.MatColumnDef, i5.MatCellDef, i5.MatRowDef, i5.MatHeaderCell, i5.MatCell, i5.MatHeaderRow, i5.MatRow, i6.PageHeaderComponent, i7.StatusBadgeComponent, i8.MainLayoutComponent], styles: [".stats-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }\n    .stat-card[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.5rem; border-radius: 8px; }\n    .stat-card[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] { font-size: 40px; width: 40px; height: 40px; color: #3f51b5; } .stat-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0; font-size: 1.75rem; } .stat-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0; color: #666; }\n    .card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; } .card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0 0 1rem; } table[_ngcontent-%COMP%] { width: 100%; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LabDashboardComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-lab-dashboard', template: `
    <app-main-layout>
      <app-page-header title="Laboratory" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Laboratory' }]"></app-page-header>
      <div class="stats-grid">
        <div class="stat-card"><mat-icon>pending</mat-icon><div><h3>{{ stats.pending }}</h3><p>Pending</p></div></div>
        <div class="stat-card"><mat-icon>science</mat-icon><div><h3>{{ stats.inProgress }}</h3><p>In Progress</p></div></div>
        <div class="stat-card"><mat-icon>check_circle</mat-icon><div><h3>{{ stats.completedToday }}</h3><p>Completed Today</p></div></div>
      </div>
      <div class="card">
        <h3>Pending Lab Orders</h3>
        <table mat-table [dataSource]="orders">
          <ng-container matColumnDef="orderNumber"><th mat-header-cell *matHeaderCellDef>Order #</th><td mat-cell *matCellDef="let o">{{ o.orderNumber }}</td></ng-container>
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let o">{{ o.patientName }}</td></ng-container>
          <ng-container matColumnDef="tests"><th mat-header-cell *matHeaderCellDef>Tests</th><td mat-cell *matCellDef="let o">{{ o.testCount }} tests</td></ng-container>
          <ng-container matColumnDef="priority"><th mat-header-cell *matHeaderCellDef>Priority</th><td mat-cell *matCellDef="let o"><app-status-badge [status]="o.priority"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="orderedBy"><th mat-header-cell *matHeaderCellDef>Ordered By</th><td mat-cell *matCellDef="let o">Dr. {{ o.orderedBy }}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let o"><button mat-raised-button color="primary" [routerLink]="['results', o.id]">Enter Results</button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
      </div>
    </app-main-layout>
  `, styles: [".stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }\n    .stat-card { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.5rem; border-radius: 8px; }\n    .stat-card mat-icon { font-size: 40px; width: 40px; height: 40px; color: #3f51b5; } .stat-card h3 { margin: 0; font-size: 1.75rem; } .stat-card p { margin: 0; color: #666; }\n    .card { background: white; padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; } table { width: 100%; }"] }]
    }], () => [{ type: i1.ApiService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(LabDashboardComponent, { className: "LabDashboardComponent", filePath: "app/features/laboratory/lab-dashboard/lab-dashboard.component.ts", lineNumber: 35 }); })();
//# sourceMappingURL=lab-dashboard.component.js.map