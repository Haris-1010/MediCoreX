import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "@angular/common";
import * as i3 from "@angular/router";
import * as i4 from "@angular/material/button";
import * as i5 from "@angular/material/icon";
import * as i6 from "../../../shared/components/page-header/page-header.component";
import * as i7 from "../../../shared/components/status-badge/status-badge.component";
import * as i8 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "IPD" });
const _c2 = (a0, a1) => [a0, a1];
function IpdDashboardComponent_div_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 10)(1, "div", 11)(2, "h4");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "div", 12)(7, "div", 13);
    i0.ɵɵelement(8, "div", 14);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "span");
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const w_r1 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(w_r1.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(w_r1.type);
    i0.ɵɵadvance(3);
    i0.ɵɵstyleProp("width", w_r1.occupied / w_r1.total * 100, "%");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", w_r1.occupied, "/", w_r1.total, "");
} }
function IpdDashboardComponent_div_49_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 15)(1, "div", 16)(2, "h4");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "div", 17)(7, "span");
    i0.ɵɵtext(8);
    i0.ɵɵpipe(9, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(10, "app-status-badge", 18);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const a_r2 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(a_r2.patientName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", a_r2.ward, " - Bed ", a_r2.bedNumber, "");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(9, 5, a_r2.admissionDate, "shortDate"));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("status", a_r2.status);
} }
export class IpdDashboardComponent {
    constructor(api) {
        this.api = api;
        this.stats = { totalAdmissions: 0, availableBeds: 0, todayAdmissions: 0, todayDischarges: 0 };
        this.wards = [];
        this.recentAdmissions = [];
    }
    ngOnInit() {
        this.api.get('v1/ipd/stats').subscribe(r => this.stats = r);
        this.api.get('v1/ipd/wards/overview').subscribe(r => this.wards = r);
        this.api.get('v1/ipd/admissions/recent').subscribe(r => this.recentAdmissions = r);
    }
    static { this.ɵfac = function IpdDashboardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IpdDashboardComponent)(i0.ɵɵdirectiveInject(i1.ApiService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IpdDashboardComponent, selectors: [["app-ipd-dashboard"]], standalone: false, decls: 50, vars: 12, consts: [["title", "IPD Dashboard", "subtitle", "In-Patient Department", 3, "breadcrumbs"], ["mat-raised-button", "", "color", "primary", "routerLink", "admit"], [1, "stats-grid"], [1, "stat-card"], [1, "dashboard-grid"], [1, "card"], [1, "ward-list"], ["class", "ward-item", 4, "ngFor", "ngForOf"], [1, "admission-list"], ["class", "admission-item", 4, "ngFor", "ngForOf"], [1, "ward-item"], [1, "ward-info"], [1, "occupancy"], [1, "bar"], [1, "fill"], [1, "admission-item"], [1, "info"], [1, "meta"], [3, "status"]], template: function IpdDashboardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout")(1, "app-page-header", 0)(2, "button", 1)(3, "mat-icon");
            i0.ɵɵtext(4, "add");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(5, " New Admission");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "div", 2)(7, "div", 3)(8, "mat-icon");
            i0.ɵɵtext(9, "hotel");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "div")(11, "h3");
            i0.ɵɵtext(12);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "p");
            i0.ɵɵtext(14, "Active Admissions");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(15, "div", 3)(16, "mat-icon");
            i0.ɵɵtext(17, "bed");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "div")(19, "h3");
            i0.ɵɵtext(20);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "p");
            i0.ɵɵtext(22, "Available Beds");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(23, "div", 3)(24, "mat-icon");
            i0.ɵɵtext(25, "login");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "div")(27, "h3");
            i0.ɵɵtext(28);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "p");
            i0.ɵɵtext(30, "Today's Admissions");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(31, "div", 3)(32, "mat-icon");
            i0.ɵɵtext(33, "logout");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(34, "div")(35, "h3");
            i0.ɵɵtext(36);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(37, "p");
            i0.ɵɵtext(38, "Today's Discharges");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(39, "div", 4)(40, "div", 5)(41, "h3");
            i0.ɵɵtext(42, "Ward Overview");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(43, "div", 6);
            i0.ɵɵtemplate(44, IpdDashboardComponent_div_44_Template, 11, 6, "div", 7);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(45, "div", 5)(46, "h3");
            i0.ɵɵtext(47, "Recent Admissions");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(48, "div", 8);
            i0.ɵɵtemplate(49, IpdDashboardComponent_div_49_Template, 11, 8, "div", 9);
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(9, _c2, i0.ɵɵpureFunction0(7, _c0), i0.ɵɵpureFunction0(8, _c1)));
            i0.ɵɵadvance(11);
            i0.ɵɵtextInterpolate(ctx.stats.totalAdmissions);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(ctx.stats.availableBeds);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(ctx.stats.todayAdmissions);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(ctx.stats.todayDischarges);
            i0.ɵɵadvance(8);
            i0.ɵɵproperty("ngForOf", ctx.wards);
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngForOf", ctx.recentAdmissions);
        } }, dependencies: [i2.NgForOf, i3.RouterLink, i4.MatButton, i5.MatIcon, i6.PageHeaderComponent, i7.StatusBadgeComponent, i8.MainLayoutComponent, i2.DatePipe], styles: [".stats-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }\n    .stat-card[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.5rem; border-radius: 8px; }\n    .stat-card[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] { font-size: 40px; width: 40px; height: 40px; color: #3f51b5; }\n    .stat-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0; font-size: 1.75rem; } .stat-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0; color: #666; }\n    .dashboard-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }\n    .card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; } .card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0 0 1rem; }\n    .ward-list[_ngcontent-%COMP%], .admission-list[_ngcontent-%COMP%] { display: flex; flex-direction: column; gap: 0.75rem; }\n    .ward-item[_ngcontent-%COMP%], .admission-item[_ngcontent-%COMP%] { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: #f5f5f5; border-radius: 8px; }\n    .ward-info[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%], .info[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] { margin: 0; } .ward-info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0; font-size: 0.875rem; color: #666; }\n    .occupancy[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 0.5rem; } .bar[_ngcontent-%COMP%] { width: 100px; height: 8px; background: #e0e0e0; border-radius: 4px; } .fill[_ngcontent-%COMP%] { height: 100%; background: #3f51b5; border-radius: 4px; }\n    .meta[_ngcontent-%COMP%] { display: flex; flex-direction: column; align-items: flex-end; gap: 0.25rem; } .meta[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] { font-size: 0.75rem; color: #666; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IpdDashboardComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-ipd-dashboard', template: `
    <app-main-layout>
      <app-page-header title="IPD Dashboard" subtitle="In-Patient Department" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'IPD' }]">
        <button mat-raised-button color="primary" routerLink="admit"><mat-icon>add</mat-icon> New Admission</button>
      </app-page-header>

      <div class="stats-grid">
        <div class="stat-card"><mat-icon>hotel</mat-icon><div><h3>{{ stats.totalAdmissions }}</h3><p>Active Admissions</p></div></div>
        <div class="stat-card"><mat-icon>bed</mat-icon><div><h3>{{ stats.availableBeds }}</h3><p>Available Beds</p></div></div>
        <div class="stat-card"><mat-icon>login</mat-icon><div><h3>{{ stats.todayAdmissions }}</h3><p>Today's Admissions</p></div></div>
        <div class="stat-card"><mat-icon>logout</mat-icon><div><h3>{{ stats.todayDischarges }}</h3><p>Today's Discharges</p></div></div>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <h3>Ward Overview</h3>
          <div class="ward-list">
            <div class="ward-item" *ngFor="let w of wards">
              <div class="ward-info"><h4>{{ w.name }}</h4><p>{{ w.type }}</p></div>
              <div class="occupancy"><div class="bar"><div class="fill" [style.width.%]="(w.occupied / w.total) * 100"></div></div><span>{{ w.occupied }}/{{ w.total }}</span></div>
            </div>
          </div>
        </div>
        <div class="card">
          <h3>Recent Admissions</h3>
          <div class="admission-list">
            <div class="admission-item" *ngFor="let a of recentAdmissions">
              <div class="info"><h4>{{ a.patientName }}</h4><p>{{ a.ward }} - Bed {{ a.bedNumber }}</p></div>
              <div class="meta"><span>{{ a.admissionDate | date:'shortDate' }}</span><app-status-badge [status]="a.status"></app-status-badge></div>
            </div>
          </div>
        </div>
      </div>
    </app-main-layout>
  `, styles: [".stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }\n    .stat-card { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.5rem; border-radius: 8px; }\n    .stat-card mat-icon { font-size: 40px; width: 40px; height: 40px; color: #3f51b5; }\n    .stat-card h3 { margin: 0; font-size: 1.75rem; } .stat-card p { margin: 0; color: #666; }\n    .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }\n    .card { background: white; padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; }\n    .ward-list, .admission-list { display: flex; flex-direction: column; gap: 0.75rem; }\n    .ward-item, .admission-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: #f5f5f5; border-radius: 8px; }\n    .ward-info h4, .info h4 { margin: 0; } .ward-info p, .info p { margin: 0; font-size: 0.875rem; color: #666; }\n    .occupancy { display: flex; align-items: center; gap: 0.5rem; } .bar { width: 100px; height: 8px; background: #e0e0e0; border-radius: 4px; } .fill { height: 100%; background: #3f51b5; border-radius: 4px; }\n    .meta { display: flex; flex-direction: column; align-items: flex-end; gap: 0.25rem; } .meta span { font-size: 0.75rem; color: #666; }"] }]
    }], () => [{ type: i1.ApiService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IpdDashboardComponent, { className: "IpdDashboardComponent", filePath: "app/features/ipd/ipd-dashboard/ipd-dashboard.component.ts", lineNumber: 54 }); })();
//# sourceMappingURL=ipd-dashboard.component.js.map