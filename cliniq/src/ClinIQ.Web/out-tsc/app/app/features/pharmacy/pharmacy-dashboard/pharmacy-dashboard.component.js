import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "@angular/router";
import * as i3 from "@angular/material/button";
import * as i4 from "@angular/material/icon";
import * as i5 from "@angular/material/table";
import * as i6 from "../../../shared/components/page-header/page-header.component";
import * as i7 from "../../../layout/main-layout/main-layout.component";
import * as i8 from "@angular/common";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "Pharmacy" });
const _c2 = (a0, a1) => [a0, a1];
const _c3 = a0 => ["dispense", a0];
function PharmacyDashboardComponent_th_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 14);
    i0.ɵɵtext(1, "Patient");
    i0.ɵɵelementEnd();
} }
function PharmacyDashboardComponent_td_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 15);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r1 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(p_r1.patientName);
} }
function PharmacyDashboardComponent_th_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 14);
    i0.ɵɵtext(1, "Doctor");
    i0.ɵɵelementEnd();
} }
function PharmacyDashboardComponent_td_37_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 15);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r2 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Dr. ", p_r2.doctorName, "");
} }
function PharmacyDashboardComponent_th_39_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 14);
    i0.ɵɵtext(1, "Items");
    i0.ɵɵelementEnd();
} }
function PharmacyDashboardComponent_td_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 15);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r3 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", p_r3.itemCount, " items");
} }
function PharmacyDashboardComponent_th_42_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 14);
    i0.ɵɵtext(1, "Time");
    i0.ɵɵelementEnd();
} }
function PharmacyDashboardComponent_td_43_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 15);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "date");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const p_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(2, 1, p_r4.createdAt, "shortTime"));
} }
function PharmacyDashboardComponent_th_45_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "th", 14);
} }
function PharmacyDashboardComponent_td_46_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 15)(1, "button", 16);
    i0.ɵɵtext(2, "Dispense");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const p_r5 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("routerLink", i0.ɵɵpureFunction1(1, _c3, p_r5.id));
} }
function PharmacyDashboardComponent_tr_47_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 17);
} }
function PharmacyDashboardComponent_tr_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 18);
} }
export class PharmacyDashboardComponent {
    constructor(api) {
        this.api = api;
        this.stats = { pendingPrescriptions: 0, dispensedToday: 0, todaySales: 0 };
        this.prescriptions = [];
        this.columns = ['patient', 'doctor', 'items', 'time', 'actions'];
    }
    ngOnInit() {
        this.api.get('v1/pharmacy/stats').subscribe(r => this.stats = r);
        this.api.get('v1/pharmacy/pending').subscribe(r => this.prescriptions = r);
    }
    static { this.ɵfac = function PharmacyDashboardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PharmacyDashboardComponent)(i0.ɵɵdirectiveInject(i1.ApiService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PharmacyDashboardComponent, selectors: [["app-pharmacy-dashboard"]], standalone: false, decls: 49, vars: 14, consts: [["title", "Pharmacy", 3, "breadcrumbs"], [1, "stats-grid"], [1, "stat-card"], [1, "card"], ["mat-table", "", 3, "dataSource"], ["matColumnDef", "patient"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "doctor"], ["matColumnDef", "items"], ["matColumnDef", "time"], ["matColumnDef", "actions"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", ""], ["mat-cell", ""], ["mat-raised-button", "", "color", "primary", 3, "routerLink"], ["mat-header-row", ""], ["mat-row", ""]], template: function PharmacyDashboardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 0);
            i0.ɵɵelementStart(2, "div", 1)(3, "div", 2)(4, "mat-icon");
            i0.ɵɵtext(5, "receipt");
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
            i0.ɵɵtext(18, "Dispensed Today");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(19, "div", 2)(20, "mat-icon");
            i0.ɵɵtext(21, "attach_money");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "div")(23, "h3");
            i0.ɵɵtext(24);
            i0.ɵɵpipe(25, "currency");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "p");
            i0.ɵɵtext(27, "Today's Sales");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(28, "div", 3)(29, "h3");
            i0.ɵɵtext(30, "Pending Prescriptions");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(31, "table", 4);
            i0.ɵɵelementContainerStart(32, 5);
            i0.ɵɵtemplate(33, PharmacyDashboardComponent_th_33_Template, 2, 0, "th", 6)(34, PharmacyDashboardComponent_td_34_Template, 2, 1, "td", 7);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(35, 8);
            i0.ɵɵtemplate(36, PharmacyDashboardComponent_th_36_Template, 2, 0, "th", 6)(37, PharmacyDashboardComponent_td_37_Template, 2, 1, "td", 7);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(38, 9);
            i0.ɵɵtemplate(39, PharmacyDashboardComponent_th_39_Template, 2, 0, "th", 6)(40, PharmacyDashboardComponent_td_40_Template, 2, 1, "td", 7);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(41, 10);
            i0.ɵɵtemplate(42, PharmacyDashboardComponent_th_42_Template, 2, 0, "th", 6)(43, PharmacyDashboardComponent_td_43_Template, 3, 4, "td", 7);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(44, 11);
            i0.ɵɵtemplate(45, PharmacyDashboardComponent_th_45_Template, 1, 0, "th", 6)(46, PharmacyDashboardComponent_td_46_Template, 3, 3, "td", 7);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵtemplate(47, PharmacyDashboardComponent_tr_47_Template, 1, 0, "tr", 12)(48, PharmacyDashboardComponent_tr_48_Template, 1, 0, "tr", 13);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(11, _c2, i0.ɵɵpureFunction0(9, _c0), i0.ɵɵpureFunction0(10, _c1)));
            i0.ɵɵadvance(7);
            i0.ɵɵtextInterpolate(ctx.stats.pendingPrescriptions);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(ctx.stats.dispensedToday);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(25, 7, ctx.stats.todaySales));
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("dataSource", ctx.prescriptions);
            i0.ɵɵadvance(16);
            i0.ɵɵproperty("matHeaderRowDef", ctx.columns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("matRowDefColumns", ctx.columns);
        } }, dependencies: [i2.RouterLink, i3.MatButton, i4.MatIcon, i5.MatTable, i5.MatHeaderCellDef, i5.MatHeaderRowDef, i5.MatColumnDef, i5.MatCellDef, i5.MatRowDef, i5.MatHeaderCell, i5.MatCell, i5.MatHeaderRow, i5.MatRow, i6.PageHeaderComponent, i7.MainLayoutComponent, i8.CurrencyPipe, i8.DatePipe], styles: [".stats-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }\n    .stat-card[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.5rem; border-radius: 8px; }\n    .stat-card[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] { font-size: 40px; width: 40px; height: 40px; color: #3f51b5; } .stat-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0; font-size: 1.75rem; } .stat-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0; color: #666; }\n    .card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; } .card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0 0 1rem; } table[_ngcontent-%COMP%] { width: 100%; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PharmacyDashboardComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-pharmacy-dashboard', template: `
    <app-main-layout>
      <app-page-header title="Pharmacy" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Pharmacy' }]"></app-page-header>
      <div class="stats-grid">
        <div class="stat-card"><mat-icon>receipt</mat-icon><div><h3>{{ stats.pendingPrescriptions }}</h3><p>Pending</p></div></div>
        <div class="stat-card"><mat-icon>check_circle</mat-icon><div><h3>{{ stats.dispensedToday }}</h3><p>Dispensed Today</p></div></div>
        <div class="stat-card"><mat-icon>attach_money</mat-icon><div><h3>{{ stats.todaySales | currency }}</h3><p>Today's Sales</p></div></div>
      </div>
      <div class="card">
        <h3>Pending Prescriptions</h3>
        <table mat-table [dataSource]="prescriptions">
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let p">{{ p.patientName }}</td></ng-container>
          <ng-container matColumnDef="doctor"><th mat-header-cell *matHeaderCellDef>Doctor</th><td mat-cell *matCellDef="let p">Dr. {{ p.doctorName }}</td></ng-container>
          <ng-container matColumnDef="items"><th mat-header-cell *matHeaderCellDef>Items</th><td mat-cell *matCellDef="let p">{{ p.itemCount }} items</td></ng-container>
          <ng-container matColumnDef="time"><th mat-header-cell *matHeaderCellDef>Time</th><td mat-cell *matCellDef="let p">{{ p.createdAt | date:'shortTime' }}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let p"><button mat-raised-button color="primary" [routerLink]="['dispense', p.id]">Dispense</button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
      </div>
    </app-main-layout>
  `, styles: [".stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }\n    .stat-card { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.5rem; border-radius: 8px; }\n    .stat-card mat-icon { font-size: 40px; width: 40px; height: 40px; color: #3f51b5; } .stat-card h3 { margin: 0; font-size: 1.75rem; } .stat-card p { margin: 0; color: #666; }\n    .card { background: white; padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; } table { width: 100%; }"] }]
    }], () => [{ type: i1.ApiService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PharmacyDashboardComponent, { className: "PharmacyDashboardComponent", filePath: "app/features/pharmacy/pharmacy-dashboard/pharmacy-dashboard.component.ts", lineNumber: 34 }); })();
//# sourceMappingURL=pharmacy-dashboard.component.js.map