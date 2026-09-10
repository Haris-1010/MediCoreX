import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "@angular/material/button";
import * as i3 from "@angular/material/icon";
import * as i4 from "@angular/material/table";
import * as i5 from "../../../shared/components/page-header/page-header.component";
import * as i6 from "../../../shared/components/status-badge/status-badge.component";
import * as i7 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "Radiology" });
const _c2 = (a0, a1) => [a0, a1];
function RadiologyDashboardComponent_th_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 15);
    i0.ɵɵtext(1, "Order #");
    i0.ɵɵelementEnd();
} }
function RadiologyDashboardComponent_td_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 16);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const o_r1 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(o_r1.orderNumber);
} }
function RadiologyDashboardComponent_th_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 15);
    i0.ɵɵtext(1, "Patient");
    i0.ɵɵelementEnd();
} }
function RadiologyDashboardComponent_td_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 16);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const o_r2 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(o_r2.patientName);
} }
function RadiologyDashboardComponent_th_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 15);
    i0.ɵɵtext(1, "Modality");
    i0.ɵɵelementEnd();
} }
function RadiologyDashboardComponent_td_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 16);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const o_r3 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(o_r3.modality);
} }
function RadiologyDashboardComponent_th_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 15);
    i0.ɵɵtext(1, "Body Part");
    i0.ɵɵelementEnd();
} }
function RadiologyDashboardComponent_td_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 16);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const o_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(o_r4.bodyPart);
} }
function RadiologyDashboardComponent_th_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 15);
    i0.ɵɵtext(1, "Status");
    i0.ɵɵelementEnd();
} }
function RadiologyDashboardComponent_td_37_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 16);
    i0.ɵɵelement(1, "app-status-badge", 17);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const o_r5 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("status", o_r5.status);
} }
function RadiologyDashboardComponent_th_39_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "th", 15);
} }
function RadiologyDashboardComponent_td_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 16)(1, "button", 18)(2, "mat-icon");
    i0.ɵɵtext(3, "visibility");
    i0.ɵɵelementEnd()()();
} }
function RadiologyDashboardComponent_tr_41_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 19);
} }
function RadiologyDashboardComponent_tr_42_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 20);
} }
export class RadiologyDashboardComponent {
    constructor(api) {
        this.api = api;
        this.stats = { pending: 0, completedToday: 0 };
        this.orders = [];
        this.columns = ['orderNumber', 'patient', 'modality', 'bodyPart', 'status', 'actions'];
    }
    ngOnInit() {
        this.api.get('v1/radiology/stats').subscribe(r => this.stats = r);
        this.api.get('v1/radiology/orders').subscribe(r => this.orders = r);
    }
    static { this.ɵfac = function RadiologyDashboardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || RadiologyDashboardComponent)(i0.ɵɵdirectiveInject(i1.ApiService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: RadiologyDashboardComponent, selectors: [["app-radiology-dashboard"]], standalone: false, decls: 43, vars: 11, consts: [["title", "Radiology", 3, "breadcrumbs"], [1, "stats-grid"], [1, "stat-card"], [1, "card"], ["mat-table", "", 3, "dataSource"], ["matColumnDef", "orderNumber"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "patient"], ["matColumnDef", "modality"], ["matColumnDef", "bodyPart"], ["matColumnDef", "status"], ["matColumnDef", "actions"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", ""], ["mat-cell", ""], [3, "status"], ["mat-icon-button", ""], ["mat-header-row", ""], ["mat-row", ""]], template: function RadiologyDashboardComponent_Template(rf, ctx) { if (rf & 1) {
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
            i0.ɵɵtext(13, "check_circle");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "div")(15, "h3");
            i0.ɵɵtext(16);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "p");
            i0.ɵɵtext(18, "Completed Today");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(19, "div", 3)(20, "h3");
            i0.ɵɵtext(21, "Imaging Orders");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "table", 4);
            i0.ɵɵelementContainerStart(23, 5);
            i0.ɵɵtemplate(24, RadiologyDashboardComponent_th_24_Template, 2, 0, "th", 6)(25, RadiologyDashboardComponent_td_25_Template, 2, 1, "td", 7);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(26, 8);
            i0.ɵɵtemplate(27, RadiologyDashboardComponent_th_27_Template, 2, 0, "th", 6)(28, RadiologyDashboardComponent_td_28_Template, 2, 1, "td", 7);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(29, 9);
            i0.ɵɵtemplate(30, RadiologyDashboardComponent_th_30_Template, 2, 0, "th", 6)(31, RadiologyDashboardComponent_td_31_Template, 2, 1, "td", 7);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(32, 10);
            i0.ɵɵtemplate(33, RadiologyDashboardComponent_th_33_Template, 2, 0, "th", 6)(34, RadiologyDashboardComponent_td_34_Template, 2, 1, "td", 7);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(35, 11);
            i0.ɵɵtemplate(36, RadiologyDashboardComponent_th_36_Template, 2, 0, "th", 6)(37, RadiologyDashboardComponent_td_37_Template, 2, 1, "td", 7);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(38, 12);
            i0.ɵɵtemplate(39, RadiologyDashboardComponent_th_39_Template, 1, 0, "th", 6)(40, RadiologyDashboardComponent_td_40_Template, 4, 0, "td", 7);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵtemplate(41, RadiologyDashboardComponent_tr_41_Template, 1, 0, "tr", 13)(42, RadiologyDashboardComponent_tr_42_Template, 1, 0, "tr", 14);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(8, _c2, i0.ɵɵpureFunction0(6, _c0), i0.ɵɵpureFunction0(7, _c1)));
            i0.ɵɵadvance(7);
            i0.ɵɵtextInterpolate(ctx.stats.pending);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(ctx.stats.completedToday);
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("dataSource", ctx.orders);
            i0.ɵɵadvance(19);
            i0.ɵɵproperty("matHeaderRowDef", ctx.columns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("matRowDefColumns", ctx.columns);
        } }, dependencies: [i2.MatIconButton, i3.MatIcon, i4.MatTable, i4.MatHeaderCellDef, i4.MatHeaderRowDef, i4.MatColumnDef, i4.MatCellDef, i4.MatRowDef, i4.MatHeaderCell, i4.MatCell, i4.MatHeaderRow, i4.MatRow, i5.PageHeaderComponent, i6.StatusBadgeComponent, i7.MainLayoutComponent], styles: [".stats-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem; max-width: 500px; }\n    .stat-card[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.5rem; border-radius: 8px; }\n    .stat-card[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] { font-size: 40px; width: 40px; height: 40px; color: #3f51b5; } .stat-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0; font-size: 1.75rem; } .stat-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0; color: #666; }\n    .card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; } .card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0 0 1rem; } table[_ngcontent-%COMP%] { width: 100%; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(RadiologyDashboardComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-radiology-dashboard', template: `
    <app-main-layout>
      <app-page-header title="Radiology" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Radiology' }]"></app-page-header>
      <div class="stats-grid">
        <div class="stat-card"><mat-icon>pending</mat-icon><div><h3>{{ stats.pending }}</h3><p>Pending</p></div></div>
        <div class="stat-card"><mat-icon>check_circle</mat-icon><div><h3>{{ stats.completedToday }}</h3><p>Completed Today</p></div></div>
      </div>
      <div class="card">
        <h3>Imaging Orders</h3>
        <table mat-table [dataSource]="orders">
          <ng-container matColumnDef="orderNumber"><th mat-header-cell *matHeaderCellDef>Order #</th><td mat-cell *matCellDef="let o">{{ o.orderNumber }}</td></ng-container>
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let o">{{ o.patientName }}</td></ng-container>
          <ng-container matColumnDef="modality"><th mat-header-cell *matHeaderCellDef>Modality</th><td mat-cell *matCellDef="let o">{{ o.modality }}</td></ng-container>
          <ng-container matColumnDef="bodyPart"><th mat-header-cell *matHeaderCellDef>Body Part</th><td mat-cell *matCellDef="let o">{{ o.bodyPart }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let o"><app-status-badge [status]="o.status"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let o"><button mat-icon-button><mat-icon>visibility</mat-icon></button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
      </div>
    </app-main-layout>
  `, styles: [".stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem; max-width: 500px; }\n    .stat-card { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.5rem; border-radius: 8px; }\n    .stat-card mat-icon { font-size: 40px; width: 40px; height: 40px; color: #3f51b5; } .stat-card h3 { margin: 0; font-size: 1.75rem; } .stat-card p { margin: 0; color: #666; }\n    .card { background: white; padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; } table { width: 100%; }"] }]
    }], () => [{ type: i1.ApiService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(RadiologyDashboardComponent, { className: "RadiologyDashboardComponent", filePath: "app/features/radiology/radiology-dashboard/radiology-dashboard.component.ts", lineNumber: 34 }); })();
//# sourceMappingURL=radiology-dashboard.component.js.map