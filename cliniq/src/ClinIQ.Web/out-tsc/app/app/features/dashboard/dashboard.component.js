import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../../core/services/api.service";
import * as i2 from "../../core/services/auth.service";
import * as i3 from "../../core/services/signalr.service";
import * as i4 from "@angular/router";
import * as i5 from "@angular/material/button";
import * as i6 from "@angular/material/button-toggle";
import * as i7 from "../../shared/components/page-header/page-header.component";
import * as i8 from "../../layout/main-layout/main-layout.component";
import * as i9 from "./components/stats-card/stats-card.component";
import * as i10 from "./components/appointment-widget/appointment-widget.component";
import * as i11 from "./components/revenue-chart/revenue-chart.component";
import * as i12 from "./components/queue-widget/queue-widget.component";
import * as i13 from "./components/bed-occupancy-widget/bed-occupancy-widget.component";
export class DashboardComponent {
    constructor(api, authService, signalR) {
        this.api = api;
        this.authService = authService;
        this.signalR = signalR;
        this.userName = '';
        this.stats = {
            totalPatients: 0,
            todayAppointments: 0,
            activeAdmissions: 0,
            todayRevenue: 0,
            patientGrowth: 0,
            appointmentGrowth: 0,
            admissionGrowth: 0,
            revenueGrowth: 0
        };
        this.todayAppointments = [];
        this.queueItems = [];
        this.revenueData = [];
        this.revenuePeriod = 'week';
        this.loadingAppointments = true;
        this.loadingQueue = true;
        this.loadingRevenue = true;
        this.loadingBeds = true;
        this.destroy$ = new Subject();
    }
    ngOnInit() {
        const user = this.authService.getCurrentUser();
        this.userName = user?.firstName || 'User';
        this.loadDashboardData();
        this.setupRealtimeUpdates();
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    loadDashboardData() {
        this.loadStats();
        this.loadTodayAppointments();
        this.loadQueueItems();
        this.loadRevenueData();
        this.loadBedOccupancy();
    }
    loadStats() {
        this.api.get('v1/dashboard/stats').subscribe({
            next: (data) => this.stats = data,
            error: () => { }
        });
    }
    loadTodayAppointments() {
        this.loadingAppointments = true;
        this.api.get('v1/dashboard/today-appointments').subscribe({
            next: (data) => {
                this.todayAppointments = data;
                this.loadingAppointments = false;
            },
            error: () => this.loadingAppointments = false
        });
    }
    loadQueueItems() {
        this.loadingQueue = true;
        this.api.get('v1/dashboard/queue').subscribe({
            next: (data) => {
                this.queueItems = data;
                this.loadingQueue = false;
            },
            error: () => this.loadingQueue = false
        });
    }
    loadRevenueData() {
        this.loadingRevenue = true;
        this.api.get(`v1/dashboard/revenue?period=${this.revenuePeriod}`).subscribe({
            next: (data) => {
                this.revenueData = data;
                this.loadingRevenue = false;
            },
            error: () => this.loadingRevenue = false
        });
    }
    loadBedOccupancy() {
        this.loadingBeds = true;
        setTimeout(() => this.loadingBeds = false, 1000);
    }
    setupRealtimeUpdates() {
        this.signalR.queueUpdate$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.loadQueueItems();
        });
    }
    static { this.ɵfac = function DashboardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DashboardComponent)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.AuthService), i0.ɵɵdirectiveInject(i3.SignalRService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: DashboardComponent, selectors: [["app-dashboard"]], standalone: false, decls: 41, vars: 19, consts: [["title", "Dashboard", 3, "subtitle"], [1, "stats-grid"], ["title", "Total Patients", "icon", "people", "color", "primary", 3, "value", "growth"], ["title", "Today's Appointments", "icon", "event", "color", "accent", 3, "value", "growth"], ["title", "Active Admissions", "icon", "local_hospital", "color", "warn", 3, "value", "growth"], ["title", "Today's Revenue", "icon", "attach_money", "color", "success", 3, "value", "isCurrency", "growth"], [1, "dashboard-grid"], [1, "card", "appointments-card"], [1, "card-header"], ["mat-button", "", "color", "primary", "routerLink", "/appointments"], [3, "appointments", "loading"], [1, "card", "queue-card"], ["mat-button", "", "color", "primary", "routerLink", "/opd/queue"], [3, "queueItems", "loading"], [1, "card", "revenue-card"], [3, "valueChange", "change", "value"], ["value", "week"], ["value", "month"], ["value", "year"], [3, "data", "loading"], [1, "card", "bed-card"], ["mat-button", "", "color", "primary", "routerLink", "/facility/beds"], [3, "loading"]], template: function DashboardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 0);
            i0.ɵɵelementStart(2, "div", 1);
            i0.ɵɵelement(3, "app-stats-card", 2)(4, "app-stats-card", 3)(5, "app-stats-card", 4)(6, "app-stats-card", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "div", 6)(8, "div", 7)(9, "div", 8)(10, "h3");
            i0.ɵɵtext(11, "Today's Appointments");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "a", 9);
            i0.ɵɵtext(13, "View All");
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(14, "app-appointment-widget", 10);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "div", 11)(16, "div", 8)(17, "h3");
            i0.ɵɵtext(18, "OPD Queue");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "a", 12);
            i0.ɵɵtext(20, "Manage Queue");
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(21, "app-queue-widget", 13);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "div", 14)(23, "div", 8)(24, "h3");
            i0.ɵɵtext(25, "Revenue Overview");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "mat-button-toggle-group", 15);
            i0.ɵɵtwoWayListener("valueChange", function DashboardComponent_Template_mat_button_toggle_group_valueChange_26_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.revenuePeriod, $event) || (ctx.revenuePeriod = $event); return $event; });
            i0.ɵɵlistener("change", function DashboardComponent_Template_mat_button_toggle_group_change_26_listener() { return ctx.loadRevenueData(); });
            i0.ɵɵelementStart(27, "mat-button-toggle", 16);
            i0.ɵɵtext(28, "Week");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "mat-button-toggle", 17);
            i0.ɵɵtext(30, "Month");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(31, "mat-button-toggle", 18);
            i0.ɵɵtext(32, "Year");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelement(33, "app-revenue-chart", 19);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(34, "div", 20)(35, "div", 8)(36, "h3");
            i0.ɵɵtext(37, "Bed Occupancy");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(38, "a", 21);
            i0.ɵɵtext(39, "View All");
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(40, "app-bed-occupancy-widget", 22);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵpropertyInterpolate1("subtitle", "Welcome back, ", ctx.userName, "");
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("value", ctx.stats.totalPatients)("growth", ctx.stats.patientGrowth);
            i0.ɵɵadvance();
            i0.ɵɵproperty("value", ctx.stats.todayAppointments)("growth", ctx.stats.appointmentGrowth);
            i0.ɵɵadvance();
            i0.ɵɵproperty("value", ctx.stats.activeAdmissions)("growth", ctx.stats.admissionGrowth);
            i0.ɵɵadvance();
            i0.ɵɵproperty("value", ctx.stats.todayRevenue)("isCurrency", true)("growth", ctx.stats.revenueGrowth);
            i0.ɵɵadvance(8);
            i0.ɵɵproperty("appointments", ctx.todayAppointments)("loading", ctx.loadingAppointments);
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("queueItems", ctx.queueItems)("loading", ctx.loadingQueue);
            i0.ɵɵadvance(5);
            i0.ɵɵtwoWayProperty("value", ctx.revenuePeriod);
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("data", ctx.revenueData)("loading", ctx.loadingRevenue);
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("loading", ctx.loadingBeds);
        } }, dependencies: [i4.RouterLink, i5.MatAnchor, i6.MatButtonToggleGroup, i6.MatButtonToggle, i7.PageHeaderComponent, i8.MainLayoutComponent, i9.StatsCardComponent, i10.AppointmentWidgetComponent, i11.RevenueChartComponent, i12.QueueWidgetComponent, i13.BedOccupancyWidgetComponent], styles: [".stats-grid[_ngcontent-%COMP%] {\n      display: grid;\n      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n      gap: 1.5rem;\n      margin-bottom: 1.5rem;\n    }\n\n    .dashboard-grid[_ngcontent-%COMP%] {\n      display: grid;\n      grid-template-columns: repeat(2, 1fr);\n      gap: 1.5rem;\n    }\n\n    .card[_ngcontent-%COMP%] {\n      background: white;\n      border-radius: 8px;\n      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n      padding: 1.5rem;\n    }\n\n    .card-header[_ngcontent-%COMP%] {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      margin-bottom: 1rem;\n    }\n\n    .card-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n      margin: 0;\n      font-size: 1.125rem;\n      font-weight: 600;\n    }\n\n    .revenue-card[_ngcontent-%COMP%] {\n      grid-column: span 2;\n    }\n\n    @media (max-width: 992px) {\n      .dashboard-grid[_ngcontent-%COMP%] {\n        grid-template-columns: 1fr;\n      }\n\n      .revenue-card[_ngcontent-%COMP%] {\n        grid-column: span 1;\n      }\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DashboardComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-dashboard', template: `
    <app-main-layout>
      <app-page-header title="Dashboard" subtitle="Welcome back, {{ userName }}"></app-page-header>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <app-stats-card
          title="Total Patients"
          [value]="stats.totalPatients"
          icon="people"
          color="primary"
          [growth]="stats.patientGrowth">
        </app-stats-card>

        <app-stats-card
          title="Today's Appointments"
          [value]="stats.todayAppointments"
          icon="event"
          color="accent"
          [growth]="stats.appointmentGrowth">
        </app-stats-card>

        <app-stats-card
          title="Active Admissions"
          [value]="stats.activeAdmissions"
          icon="local_hospital"
          color="warn"
          [growth]="stats.admissionGrowth">
        </app-stats-card>

        <app-stats-card
          title="Today's Revenue"
          [value]="stats.todayRevenue"
          [isCurrency]="true"
          icon="attach_money"
          color="success"
          [growth]="stats.revenueGrowth">
        </app-stats-card>
      </div>

      <!-- Main Content -->
      <div class="dashboard-grid">
        <!-- Today's Appointments -->
        <div class="card appointments-card">
          <div class="card-header">
            <h3>Today's Appointments</h3>
            <a mat-button color="primary" routerLink="/appointments">View All</a>
          </div>
          <app-appointment-widget [appointments]="todayAppointments" [loading]="loadingAppointments">
          </app-appointment-widget>
        </div>

        <!-- Queue Widget -->
        <div class="card queue-card">
          <div class="card-header">
            <h3>OPD Queue</h3>
            <a mat-button color="primary" routerLink="/opd/queue">Manage Queue</a>
          </div>
          <app-queue-widget [queueItems]="queueItems" [loading]="loadingQueue">
          </app-queue-widget>
        </div>

        <!-- Revenue Chart -->
        <div class="card revenue-card">
          <div class="card-header">
            <h3>Revenue Overview</h3>
            <mat-button-toggle-group [(value)]="revenuePeriod" (change)="loadRevenueData()">
              <mat-button-toggle value="week">Week</mat-button-toggle>
              <mat-button-toggle value="month">Month</mat-button-toggle>
              <mat-button-toggle value="year">Year</mat-button-toggle>
            </mat-button-toggle-group>
          </div>
          <app-revenue-chart [data]="revenueData" [loading]="loadingRevenue">
          </app-revenue-chart>
        </div>

        <!-- Bed Occupancy -->
        <div class="card bed-card">
          <div class="card-header">
            <h3>Bed Occupancy</h3>
            <a mat-button color="primary" routerLink="/facility/beds">View All</a>
          </div>
          <app-bed-occupancy-widget [loading]="loadingBeds">
          </app-bed-occupancy-widget>
        </div>
      </div>
    </app-main-layout>
  `, styles: ["\n    .stats-grid {\n      display: grid;\n      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n      gap: 1.5rem;\n      margin-bottom: 1.5rem;\n    }\n\n    .dashboard-grid {\n      display: grid;\n      grid-template-columns: repeat(2, 1fr);\n      gap: 1.5rem;\n    }\n\n    .card {\n      background: white;\n      border-radius: 8px;\n      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n      padding: 1.5rem;\n    }\n\n    .card-header {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      margin-bottom: 1rem;\n    }\n\n    .card-header h3 {\n      margin: 0;\n      font-size: 1.125rem;\n      font-weight: 600;\n    }\n\n    .revenue-card {\n      grid-column: span 2;\n    }\n\n    @media (max-width: 992px) {\n      .dashboard-grid {\n        grid-template-columns: 1fr;\n      }\n\n      .revenue-card {\n        grid-column: span 1;\n      }\n    }\n  "] }]
    }], () => [{ type: i1.ApiService }, { type: i2.AuthService }, { type: i3.SignalRService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(DashboardComponent, { className: "DashboardComponent", filePath: "app/features/dashboard/dashboard.component.ts", lineNumber: 177 }); })();
//# sourceMappingURL=dashboard.component.js.map