import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "@angular/common";
import * as i3 from "@angular/router";
import * as i4 from "@angular/material/button";
import * as i5 from "@angular/material/icon";
import * as i6 from "@angular/material/table";
import * as i7 from "../../../shared/components/page-header/page-header.component";
import * as i8 from "../../../shared/components/status-badge/status-badge.component";
import * as i9 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "Emergency" });
const _c2 = (a0, a1) => [a0, a1];
function EmergencyDashboardComponent_th_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 19);
    i0.ɵɵtext(1, "Priority");
    i0.ɵɵelementEnd();
} }
function EmergencyDashboardComponent_td_45_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 20)(1, "span", 21);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const c_r1 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngClass", c_r1.priority.toLowerCase());
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(c_r1.priority);
} }
function EmergencyDashboardComponent_th_47_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 19);
    i0.ɵɵtext(1, "Patient");
    i0.ɵɵelementEnd();
} }
function EmergencyDashboardComponent_td_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 20);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const c_r2 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(c_r2.patientName);
} }
function EmergencyDashboardComponent_th_50_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 19);
    i0.ɵɵtext(1, "Chief Complaint");
    i0.ɵɵelementEnd();
} }
function EmergencyDashboardComponent_td_51_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 20);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const c_r3 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(c_r3.chiefComplaint);
} }
function EmergencyDashboardComponent_th_53_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 19);
    i0.ɵɵtext(1, "Arrival");
    i0.ɵɵelementEnd();
} }
function EmergencyDashboardComponent_td_54_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 20);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "date");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const c_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(2, 1, c_r4.arrivalTime, "shortTime"));
} }
function EmergencyDashboardComponent_th_56_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 19);
    i0.ɵɵtext(1, "Status");
    i0.ɵɵelementEnd();
} }
function EmergencyDashboardComponent_td_57_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 20);
    i0.ɵɵelement(1, "app-status-badge", 22);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const c_r5 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("status", c_r5.status);
} }
function EmergencyDashboardComponent_th_59_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "th", 19);
} }
function EmergencyDashboardComponent_td_60_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 20)(1, "button", 23)(2, "mat-icon");
    i0.ɵɵtext(3, "more_vert");
    i0.ɵɵelementEnd()()();
} }
function EmergencyDashboardComponent_tr_61_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 24);
} }
function EmergencyDashboardComponent_tr_62_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 25);
} }
export class EmergencyDashboardComponent {
    constructor(api) {
        this.api = api;
        this.stats = { critical: 0, urgent: 0, moderate: 0, stable: 0 };
        this.cases = [];
        this.columns = ['priority', 'patient', 'complaint', 'arrival', 'status', 'actions'];
    }
    ngOnInit() {
        this.api.get('v1/emergency/stats').subscribe(r => this.stats = r);
        this.api.get('v1/emergency/active').subscribe(r => this.cases = r);
    }
    static { this.ɵfac = function EmergencyDashboardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || EmergencyDashboardComponent)(i0.ɵɵdirectiveInject(i1.ApiService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: EmergencyDashboardComponent, selectors: [["app-emergency-dashboard"]], standalone: false, decls: 63, vars: 13, consts: [["title", "Emergency Department", 3, "breadcrumbs"], ["mat-raised-button", "", "color", "warn", "routerLink", "triage"], [1, "stats-grid"], [1, "stat-card", "critical"], [1, "stat-card", "urgent"], [1, "stat-card", "moderate"], [1, "stat-card", "stable"], [1, "card"], ["mat-table", "", 3, "dataSource"], ["matColumnDef", "priority"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "patient"], ["matColumnDef", "complaint"], ["matColumnDef", "arrival"], ["matColumnDef", "status"], ["matColumnDef", "actions"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", ""], ["mat-cell", ""], [1, "priority-badge", 3, "ngClass"], [3, "status"], ["mat-icon-button", ""], ["mat-header-row", ""], ["mat-row", ""]], template: function EmergencyDashboardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout")(1, "app-page-header", 0)(2, "button", 1)(3, "mat-icon");
            i0.ɵɵtext(4, "add");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(5, " New Emergency");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "div", 2)(7, "div", 3)(8, "mat-icon");
            i0.ɵɵtext(9, "warning");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "div")(11, "h3");
            i0.ɵɵtext(12);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "p");
            i0.ɵɵtext(14, "Critical");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(15, "div", 4)(16, "mat-icon");
            i0.ɵɵtext(17, "priority_high");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "div")(19, "h3");
            i0.ɵɵtext(20);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "p");
            i0.ɵɵtext(22, "Urgent");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(23, "div", 5)(24, "mat-icon");
            i0.ɵɵtext(25, "schedule");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "div")(27, "h3");
            i0.ɵɵtext(28);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "p");
            i0.ɵɵtext(30, "Moderate");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(31, "div", 6)(32, "mat-icon");
            i0.ɵɵtext(33, "check");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(34, "div")(35, "h3");
            i0.ɵɵtext(36);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(37, "p");
            i0.ɵɵtext(38, "Stable");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(39, "div", 7)(40, "h3");
            i0.ɵɵtext(41, "Active Emergency Cases");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(42, "table", 8);
            i0.ɵɵelementContainerStart(43, 9);
            i0.ɵɵtemplate(44, EmergencyDashboardComponent_th_44_Template, 2, 0, "th", 10)(45, EmergencyDashboardComponent_td_45_Template, 3, 2, "td", 11);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(46, 12);
            i0.ɵɵtemplate(47, EmergencyDashboardComponent_th_47_Template, 2, 0, "th", 10)(48, EmergencyDashboardComponent_td_48_Template, 2, 1, "td", 11);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(49, 13);
            i0.ɵɵtemplate(50, EmergencyDashboardComponent_th_50_Template, 2, 0, "th", 10)(51, EmergencyDashboardComponent_td_51_Template, 2, 1, "td", 11);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(52, 14);
            i0.ɵɵtemplate(53, EmergencyDashboardComponent_th_53_Template, 2, 0, "th", 10)(54, EmergencyDashboardComponent_td_54_Template, 3, 4, "td", 11);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(55, 15);
            i0.ɵɵtemplate(56, EmergencyDashboardComponent_th_56_Template, 2, 0, "th", 10)(57, EmergencyDashboardComponent_td_57_Template, 2, 1, "td", 11);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(58, 16);
            i0.ɵɵtemplate(59, EmergencyDashboardComponent_th_59_Template, 1, 0, "th", 10)(60, EmergencyDashboardComponent_td_60_Template, 4, 0, "td", 11);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵtemplate(61, EmergencyDashboardComponent_tr_61_Template, 1, 0, "tr", 17)(62, EmergencyDashboardComponent_tr_62_Template, 1, 0, "tr", 18);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(10, _c2, i0.ɵɵpureFunction0(8, _c0), i0.ɵɵpureFunction0(9, _c1)));
            i0.ɵɵadvance(11);
            i0.ɵɵtextInterpolate(ctx.stats.critical);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(ctx.stats.urgent);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(ctx.stats.moderate);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(ctx.stats.stable);
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("dataSource", ctx.cases);
            i0.ɵɵadvance(19);
            i0.ɵɵproperty("matHeaderRowDef", ctx.columns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("matRowDefColumns", ctx.columns);
        } }, dependencies: [i2.NgClass, i3.RouterLink, i4.MatButton, i4.MatIconButton, i5.MatIcon, i6.MatTable, i6.MatHeaderCellDef, i6.MatHeaderRowDef, i6.MatColumnDef, i6.MatCellDef, i6.MatRowDef, i6.MatHeaderCell, i6.MatCell, i6.MatHeaderRow, i6.MatRow, i7.PageHeaderComponent, i8.StatusBadgeComponent, i9.MainLayoutComponent, i2.DatePipe], styles: [".stats-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }\n    .stat-card[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 1rem; padding: 1.5rem; border-radius: 8px; color: white; }\n    .stat-card.critical[_ngcontent-%COMP%] { background: #d32f2f; } .stat-card.urgent[_ngcontent-%COMP%] { background: #f57c00; }\n    .stat-card.moderate[_ngcontent-%COMP%] { background: #fbc02d; color: #333; } .stat-card.stable[_ngcontent-%COMP%] { background: #388e3c; }\n    .stat-card[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] { font-size: 40px; width: 40px; height: 40px; } .stat-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0; font-size: 2rem; } .stat-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0; }\n    .card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; } .card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0 0 1rem; } table[_ngcontent-%COMP%] { width: 100%; }\n    .priority-badge[_ngcontent-%COMP%] { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }\n    .priority-badge.critical[_ngcontent-%COMP%] { background: #ffebee; color: #c62828; } .priority-badge.urgent[_ngcontent-%COMP%] { background: #fff3e0; color: #e65100; }\n    .priority-badge.moderate[_ngcontent-%COMP%] { background: #fffde7; color: #f9a825; } .priority-badge.stable[_ngcontent-%COMP%] { background: #e8f5e9; color: #2e7d32; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(EmergencyDashboardComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-emergency-dashboard', template: `
    <app-main-layout>
      <app-page-header title="Emergency Department" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Emergency' }]">
        <button mat-raised-button color="warn" routerLink="triage"><mat-icon>add</mat-icon> New Emergency</button>
      </app-page-header>
      <div class="stats-grid">
        <div class="stat-card critical"><mat-icon>warning</mat-icon><div><h3>{{ stats.critical }}</h3><p>Critical</p></div></div>
        <div class="stat-card urgent"><mat-icon>priority_high</mat-icon><div><h3>{{ stats.urgent }}</h3><p>Urgent</p></div></div>
        <div class="stat-card moderate"><mat-icon>schedule</mat-icon><div><h3>{{ stats.moderate }}</h3><p>Moderate</p></div></div>
        <div class="stat-card stable"><mat-icon>check</mat-icon><div><h3>{{ stats.stable }}</h3><p>Stable</p></div></div>
      </div>
      <div class="card">
        <h3>Active Emergency Cases</h3>
        <table mat-table [dataSource]="cases">
          <ng-container matColumnDef="priority"><th mat-header-cell *matHeaderCellDef>Priority</th><td mat-cell *matCellDef="let c"><span class="priority-badge" [ngClass]="c.priority.toLowerCase()">{{ c.priority }}</span></td></ng-container>
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let c">{{ c.patientName }}</td></ng-container>
          <ng-container matColumnDef="complaint"><th mat-header-cell *matHeaderCellDef>Chief Complaint</th><td mat-cell *matCellDef="let c">{{ c.chiefComplaint }}</td></ng-container>
          <ng-container matColumnDef="arrival"><th mat-header-cell *matHeaderCellDef>Arrival</th><td mat-cell *matCellDef="let c">{{ c.arrivalTime | date:'shortTime' }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let c"><app-status-badge [status]="c.status"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let c"><button mat-icon-button><mat-icon>more_vert</mat-icon></button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
      </div>
    </app-main-layout>
  `, styles: [".stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }\n    .stat-card { display: flex; align-items: center; gap: 1rem; padding: 1.5rem; border-radius: 8px; color: white; }\n    .stat-card.critical { background: #d32f2f; } .stat-card.urgent { background: #f57c00; }\n    .stat-card.moderate { background: #fbc02d; color: #333; } .stat-card.stable { background: #388e3c; }\n    .stat-card mat-icon { font-size: 40px; width: 40px; height: 40px; } .stat-card h3 { margin: 0; font-size: 2rem; } .stat-card p { margin: 0; }\n    .card { background: white; padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; } table { width: 100%; }\n    .priority-badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }\n    .priority-badge.critical { background: #ffebee; color: #c62828; } .priority-badge.urgent { background: #fff3e0; color: #e65100; }\n    .priority-badge.moderate { background: #fffde7; color: #f9a825; } .priority-badge.stable { background: #e8f5e9; color: #2e7d32; }"] }]
    }], () => [{ type: i1.ApiService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(EmergencyDashboardComponent, { className: "EmergencyDashboardComponent", filePath: "app/features/emergency/emergency-dashboard/emergency-dashboard.component.ts", lineNumber: 43 }); })();
//# sourceMappingURL=emergency-dashboard.component.js.map