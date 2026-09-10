import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "../../../core/services/signalr.service";
import * as i3 from "@angular/common";
import * as i4 from "@angular/router";
import * as i5 from "@angular/material/button";
import * as i6 from "@angular/material/icon";
import * as i7 from "../../../shared/components/page-header/page-header.component";
import * as i8 from "../../../shared/components/status-badge/status-badge.component";
import * as i9 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "OPD" });
const _c2 = (a0, a1) => [a0, a1];
function OpdDashboardComponent_div_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 11)(1, "div", 12);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 13)(4, "h4");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 14)(9, "span", 15);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "span");
    i0.ɵɵtext(12, "in queue");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const d_r1 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(d_r1.initials);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("Dr. ", d_r1.fullName, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(d_r1.specialization);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(d_r1.queueCount);
} }
function OpdDashboardComponent_div_49_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 16)(1, "div", 17);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 13)(4, "h4");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(8, "app-status-badge", 18);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const q_r2 = ctx.$implicit;
    i0.ɵɵclassProp("current", q_r2.status === "InProgress");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(q_r2.tokenNumber);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(q_r2.patientName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Dr. ", q_r2.doctorName, "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("status", q_r2.status);
} }
function OpdDashboardComponent_p_50_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 19);
    i0.ɵɵtext(1, "No patients in queue");
    i0.ɵɵelementEnd();
} }
export class OpdDashboardComponent {
    constructor(api, signalR) {
        this.api = api;
        this.signalR = signalR;
        this.stats = { totalPatients: 0, waitingCount: 0, inProgressCount: 0, completedCount: 0 };
        this.activeDoctors = [];
        this.currentQueue = [];
        this.destroy$ = new Subject();
    }
    ngOnInit() {
        this.loadData();
        this.signalR.queueUpdate$.pipe(takeUntil(this.destroy$)).subscribe(() => this.loadData());
    }
    ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }
    loadData() {
        this.api.get('v1/opd/stats').subscribe(r => this.stats = r);
        this.api.get('v1/opd/active-doctors').subscribe(r => this.activeDoctors = r);
        this.api.get('v1/opd/current-queue').subscribe(r => this.currentQueue = r);
    }
    static { this.ɵfac = function OpdDashboardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || OpdDashboardComponent)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.SignalRService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: OpdDashboardComponent, selectors: [["app-opd-dashboard"]], standalone: false, decls: 51, vars: 13, consts: [["title", "OPD Dashboard", "subtitle", "Out-Patient Department", 3, "breadcrumbs"], ["mat-raised-button", "", "color", "primary", "routerLink", "queue"], [1, "stats-grid"], [1, "stat-card"], [1, "dashboard-grid"], [1, "card"], [1, "doctor-list"], ["class", "doctor-item", 4, "ngFor", "ngForOf"], [1, "queue-list"], ["class", "queue-item", 3, "current", 4, "ngFor", "ngForOf"], ["class", "empty", 4, "ngIf"], [1, "doctor-item"], [1, "avatar"], [1, "info"], [1, "queue-info"], [1, "count"], [1, "queue-item"], [1, "token"], [3, "status"], [1, "empty"]], template: function OpdDashboardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout")(1, "app-page-header", 0)(2, "button", 1)(3, "mat-icon");
            i0.ɵɵtext(4, "queue");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(5, " Manage Queue");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "div", 2)(7, "div", 3)(8, "mat-icon");
            i0.ɵɵtext(9, "people");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "div")(11, "h3");
            i0.ɵɵtext(12);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "p");
            i0.ɵɵtext(14, "Today's Patients");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(15, "div", 3)(16, "mat-icon");
            i0.ɵɵtext(17, "hourglass_empty");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "div")(19, "h3");
            i0.ɵɵtext(20);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "p");
            i0.ɵɵtext(22, "Waiting");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(23, "div", 3)(24, "mat-icon");
            i0.ɵɵtext(25, "play_arrow");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "div")(27, "h3");
            i0.ɵɵtext(28);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "p");
            i0.ɵɵtext(30, "In Progress");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(31, "div", 3)(32, "mat-icon");
            i0.ɵɵtext(33, "check_circle");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(34, "div")(35, "h3");
            i0.ɵɵtext(36);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(37, "p");
            i0.ɵɵtext(38, "Completed");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(39, "div", 4)(40, "div", 5)(41, "h3");
            i0.ɵɵtext(42, "Active Doctors");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(43, "div", 6);
            i0.ɵɵtemplate(44, OpdDashboardComponent_div_44_Template, 13, 4, "div", 7);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(45, "div", 5)(46, "h3");
            i0.ɵɵtext(47, "Current Queue");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(48, "div", 8);
            i0.ɵɵtemplate(49, OpdDashboardComponent_div_49_Template, 9, 6, "div", 9)(50, OpdDashboardComponent_p_50_Template, 2, 0, "p", 10);
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(10, _c2, i0.ɵɵpureFunction0(8, _c0), i0.ɵɵpureFunction0(9, _c1)));
            i0.ɵɵadvance(11);
            i0.ɵɵtextInterpolate(ctx.stats.totalPatients);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(ctx.stats.waitingCount);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(ctx.stats.inProgressCount);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(ctx.stats.completedCount);
            i0.ɵɵadvance(8);
            i0.ɵɵproperty("ngForOf", ctx.activeDoctors);
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngForOf", ctx.currentQueue);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.currentQueue.length === 0);
        } }, dependencies: [i3.NgForOf, i3.NgIf, i4.RouterLink, i5.MatButton, i6.MatIcon, i7.PageHeaderComponent, i8.StatusBadgeComponent, i9.MainLayoutComponent], styles: [".stats-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }\n    .stat-card[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }\n    .stat-card[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] { font-size: 40px; width: 40px; height: 40px; color: #3f51b5; }\n    .stat-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0; font-size: 1.75rem; } .stat-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0; color: #666; }\n    .dashboard-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }\n    .card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; } .card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0 0 1rem; }\n    .doctor-list[_ngcontent-%COMP%], .queue-list[_ngcontent-%COMP%] { display: flex; flex-direction: column; gap: 0.75rem; }\n    .doctor-item[_ngcontent-%COMP%], .queue-item[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: #f5f5f5; border-radius: 8px; }\n    .avatar[_ngcontent-%COMP%] { width: 40px; height: 40px; border-radius: 50%; background: #3f51b5; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; }\n    .info[_ngcontent-%COMP%] { flex: 1; } .info[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] { margin: 0; } .info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0; font-size: 0.875rem; color: #666; }\n    .queue-info[_ngcontent-%COMP%] { text-align: center; } .queue-info[_ngcontent-%COMP%]   .count[_ngcontent-%COMP%] { display: block; font-size: 1.25rem; font-weight: 700; color: #3f51b5; }\n    .token[_ngcontent-%COMP%] { width: 40px; height: 40px; border-radius: 50%; background: #3f51b5; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; }\n    .queue-item.current[_ngcontent-%COMP%] { background: #e3f2fd; border-left: 3px solid #3f51b5; }\n    .empty[_ngcontent-%COMP%] { text-align: center; color: #666; padding: 1rem; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(OpdDashboardComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-opd-dashboard', template: `
    <app-main-layout>
      <app-page-header title="OPD Dashboard" subtitle="Out-Patient Department"
        [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'OPD' }]">
        <button mat-raised-button color="primary" routerLink="queue"><mat-icon>queue</mat-icon> Manage Queue</button>
      </app-page-header>

      <div class="stats-grid">
        <div class="stat-card"><mat-icon>people</mat-icon><div><h3>{{ stats.totalPatients }}</h3><p>Today's Patients</p></div></div>
        <div class="stat-card"><mat-icon>hourglass_empty</mat-icon><div><h3>{{ stats.waitingCount }}</h3><p>Waiting</p></div></div>
        <div class="stat-card"><mat-icon>play_arrow</mat-icon><div><h3>{{ stats.inProgressCount }}</h3><p>In Progress</p></div></div>
        <div class="stat-card"><mat-icon>check_circle</mat-icon><div><h3>{{ stats.completedCount }}</h3><p>Completed</p></div></div>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <h3>Active Doctors</h3>
          <div class="doctor-list">
            <div class="doctor-item" *ngFor="let d of activeDoctors">
              <div class="avatar">{{ d.initials }}</div>
              <div class="info"><h4>Dr. {{ d.fullName }}</h4><p>{{ d.specialization }}</p></div>
              <div class="queue-info"><span class="count">{{ d.queueCount }}</span><span>in queue</span></div>
            </div>
          </div>
        </div>
        <div class="card">
          <h3>Current Queue</h3>
          <div class="queue-list">
            <div class="queue-item" *ngFor="let q of currentQueue" [class.current]="q.status === 'InProgress'">
              <div class="token">{{ q.tokenNumber }}</div>
              <div class="info"><h4>{{ q.patientName }}</h4><p>Dr. {{ q.doctorName }}</p></div>
              <app-status-badge [status]="q.status"></app-status-badge>
            </div>
            <p *ngIf="currentQueue.length === 0" class="empty">No patients in queue</p>
          </div>
        </div>
      </div>
    </app-main-layout>
  `, styles: [".stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }\n    .stat-card { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }\n    .stat-card mat-icon { font-size: 40px; width: 40px; height: 40px; color: #3f51b5; }\n    .stat-card h3 { margin: 0; font-size: 1.75rem; } .stat-card p { margin: 0; color: #666; }\n    .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }\n    .card { background: white; padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; }\n    .doctor-list, .queue-list { display: flex; flex-direction: column; gap: 0.75rem; }\n    .doctor-item, .queue-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: #f5f5f5; border-radius: 8px; }\n    .avatar { width: 40px; height: 40px; border-radius: 50%; background: #3f51b5; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; }\n    .info { flex: 1; } .info h4 { margin: 0; } .info p { margin: 0; font-size: 0.875rem; color: #666; }\n    .queue-info { text-align: center; } .queue-info .count { display: block; font-size: 1.25rem; font-weight: 700; color: #3f51b5; }\n    .token { width: 40px; height: 40px; border-radius: 50%; background: #3f51b5; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; }\n    .queue-item.current { background: #e3f2fd; border-left: 3px solid #3f51b5; }\n    .empty { text-align: center; color: #666; padding: 1rem; }"] }]
    }], () => [{ type: i1.ApiService }, { type: i2.SignalRService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(OpdDashboardComponent, { className: "OpdDashboardComponent", filePath: "app/features/opd/opd-dashboard/opd-dashboard.component.ts", lineNumber: 64 }); })();
//# sourceMappingURL=opd-dashboard.component.js.map