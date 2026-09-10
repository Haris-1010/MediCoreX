import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "@angular/router";
import * as i3 from "@angular/common";
import * as i4 from "@angular/material/button";
import * as i5 from "@angular/material/icon";
import * as i6 from "@angular/material/input";
import * as i7 from "@angular/material/select";
import * as i8 from "@angular/material/table";
import * as i9 from "@angular/material/paginator";
import * as i10 from "@angular/material/sort";
import * as i11 from "@angular/material/menu";
import * as i12 from "../../../shared/components/page-header/page-header.component";
import * as i13 from "../../../shared/components/status-badge/status-badge.component";
import * as i14 from "../../../shared/components/search-input/search-input.component";
import * as i15 from "../../../shared/components/date-range-picker/date-range-picker.component";
import * as i16 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "Appointments" });
const _c2 = (a0, a1) => [a0, a1];
const _c3 = () => [10, 25, 50];
const _c4 = a0 => [a0, "edit"];
function AppointmentListComponent_button_30_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 31);
    i0.ɵɵlistener("click", function AppointmentListComponent_button_30_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.clearFilters()); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "filter_list_off");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3, " Clear Filters ");
    i0.ɵɵelementEnd();
} }
function AppointmentListComponent_th_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 32);
    i0.ɵɵtext(1, "Date");
    i0.ɵɵelementEnd();
} }
function AppointmentListComponent_td_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 33);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "date");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const a_r3 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(2, 1, a_r3.appointmentDate, "mediumDate"));
} }
function AppointmentListComponent_th_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 34);
    i0.ɵɵtext(1, "Time");
    i0.ɵɵelementEnd();
} }
function AppointmentListComponent_td_37_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 33);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const a_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("", a_r4.startTime, " - ", a_r4.endTime, "");
} }
function AppointmentListComponent_th_39_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 32);
    i0.ɵɵtext(1, "Patient");
    i0.ɵɵelementEnd();
} }
function AppointmentListComponent_td_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 33);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const a_r5 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(a_r5.patientName);
} }
function AppointmentListComponent_th_42_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 32);
    i0.ɵɵtext(1, "Doctor");
    i0.ɵɵelementEnd();
} }
function AppointmentListComponent_td_43_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 33);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const a_r6 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Dr. ", a_r6.doctorName, "");
} }
function AppointmentListComponent_th_45_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 34);
    i0.ɵɵtext(1, "Type");
    i0.ɵɵelementEnd();
} }
function AppointmentListComponent_td_46_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 33);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const a_r7 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(a_r7.appointmentType);
} }
function AppointmentListComponent_th_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 34);
    i0.ɵɵtext(1, "Status");
    i0.ɵɵelementEnd();
} }
function AppointmentListComponent_td_49_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 33);
    i0.ɵɵelement(1, "app-status-badge", 35);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const a_r8 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("status", a_r8.status);
} }
function AppointmentListComponent_th_51_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 34);
    i0.ɵɵtext(1, "Actions");
    i0.ɵɵelementEnd();
} }
function AppointmentListComponent_td_52_button_6_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 39);
    i0.ɵɵlistener("click", function AppointmentListComponent_td_52_button_6_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r9); const a_r10 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.checkIn(a_r10)); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "how_to_reg");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3, " Check In");
    i0.ɵɵelementEnd();
} }
function AppointmentListComponent_td_52_button_11_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 39);
    i0.ɵɵlistener("click", function AppointmentListComponent_td_52_button_11_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r11); const a_r10 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.cancel(a_r10)); });
    i0.ɵɵelementStart(1, "mat-icon", 40);
    i0.ɵɵtext(2, "cancel");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3, " Cancel");
    i0.ɵɵelementEnd();
} }
function AppointmentListComponent_td_52_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 33)(1, "button", 36)(2, "mat-icon");
    i0.ɵɵtext(3, "more_vert");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "mat-menu", null, 0);
    i0.ɵɵtemplate(6, AppointmentListComponent_td_52_button_6_Template, 4, 0, "button", 37);
    i0.ɵɵelementStart(7, "button", 38)(8, "mat-icon");
    i0.ɵɵtext(9, "edit");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(10, " Edit");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(11, AppointmentListComponent_td_52_button_11_Template, 4, 0, "button", 37);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const a_r10 = ctx.$implicit;
    const menu_r12 = i0.ɵɵreference(5);
    i0.ɵɵadvance();
    i0.ɵɵproperty("matMenuTriggerFor", menu_r12);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngIf", a_r10.status === "Confirmed");
    i0.ɵɵadvance();
    i0.ɵɵproperty("routerLink", i0.ɵɵpureFunction1(4, _c4, a_r10.id));
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngIf", a_r10.status !== "Cancelled");
} }
function AppointmentListComponent_tr_53_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 41);
} }
function AppointmentListComponent_tr_54_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 42);
} }
export class AppointmentListComponent {
    constructor(api, router) {
        this.api = api;
        this.router = router;
        this.appointments = [];
        this.displayedColumns = ['date', 'time', 'patient', 'doctor', 'type', 'status', 'actions'];
        this.totalCount = 0;
        this.pageSize = 10;
        this.pageIndex = 0;
        this.searchTerm = '';
        this.filterStatus = '';
        this.startDate = null;
        this.endDate = null;
    }
    ngOnInit() { this.loadAppointments(); }
    loadAppointments() {
        this.api.get('v1/appointments', {
            pageNumber: this.pageIndex + 1, pageSize: this.pageSize, searchTerm: this.searchTerm,
            status: this.filterStatus, startDate: this.startDate?.toISOString(), endDate: this.endDate?.toISOString()
        }).subscribe(r => { this.appointments = r.items; this.totalCount = r.totalCount; });
    }
    onSearch(term) { this.searchTerm = term; this.pageIndex = 0; this.loadAppointments(); }
    onDateRangeChange(range) { this.startDate = range.start; this.endDate = range.end; this.loadAppointments(); }
    onPageChange(e) { this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.loadAppointments(); }
    checkIn(a) { this.api.post(`v1/appointments/${a.id}/check-in`, {}).subscribe(() => this.loadAppointments()); }
    cancel(a) { this.api.post(`v1/appointments/${a.id}/cancel`, {}).subscribe(() => this.loadAppointments()); }
    hasActiveFilters() {
        return !!(this.searchTerm || this.filterStatus || this.startDate || this.endDate);
    }
    clearFilters() {
        this.searchTerm = '';
        this.filterStatus = '';
        this.startDate = null;
        this.endDate = null;
        this.pageIndex = 0;
        this.loadAppointments();
    }
    static { this.ɵfac = function AppointmentListComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppointmentListComponent)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.Router)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AppointmentListComponent, selectors: [["app-appointment-list"]], standalone: false, decls: 56, vars: 15, consts: [["menu", "matMenu"], ["title", "Appointments", "subtitle", "Manage appointments", 3, "breadcrumbs"], ["mat-stroked-button", "", "routerLink", "calendar"], ["mat-raised-button", "", "color", "primary", "routerLink", "new"], [1, "card"], [1, "filters"], ["placeholder", "Search...", 3, "search"], ["label", "Date Range", 3, "rangeChange"], ["appearance", "outline"], [3, "valueChange", "selectionChange", "value"], ["value", ""], ["value", "Scheduled"], ["value", "Confirmed"], ["value", "CheckedIn"], ["value", "Completed"], ["value", "Cancelled"], ["mat-stroked-button", "", 3, "click", 4, "ngIf"], ["mat-table", "", "matSort", "", 3, "dataSource"], ["matColumnDef", "date"], ["mat-header-cell", "", "mat-sort-header", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "time"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["matColumnDef", "patient"], ["matColumnDef", "doctor"], ["matColumnDef", "type"], ["matColumnDef", "status"], ["matColumnDef", "actions"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], [3, "page", "length", "pageSize", "pageSizeOptions"], ["mat-stroked-button", "", 3, "click"], ["mat-header-cell", "", "mat-sort-header", ""], ["mat-cell", ""], ["mat-header-cell", ""], [3, "status"], ["mat-icon-button", "", 3, "matMenuTriggerFor"], ["mat-menu-item", "", 3, "click", 4, "ngIf"], ["mat-menu-item", "", 3, "routerLink"], ["mat-menu-item", "", 3, "click"], ["color", "warn"], ["mat-header-row", ""], ["mat-row", ""]], template: function AppointmentListComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout")(1, "app-page-header", 1)(2, "button", 2)(3, "mat-icon");
            i0.ɵɵtext(4, "calendar_today");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(5, " Calendar View");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "button", 3)(7, "mat-icon");
            i0.ɵɵtext(8, "add");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(9, " New Appointment");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(10, "div", 4)(11, "div", 5)(12, "app-search-input", 6);
            i0.ɵɵlistener("search", function AppointmentListComponent_Template_app_search_input_search_12_listener($event) { return ctx.onSearch($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "app-date-range-picker", 7);
            i0.ɵɵlistener("rangeChange", function AppointmentListComponent_Template_app_date_range_picker_rangeChange_13_listener($event) { return ctx.onDateRangeChange($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "mat-form-field", 8)(15, "mat-label");
            i0.ɵɵtext(16, "Status");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "mat-select", 9);
            i0.ɵɵtwoWayListener("valueChange", function AppointmentListComponent_Template_mat_select_valueChange_17_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.filterStatus, $event) || (ctx.filterStatus = $event); return $event; });
            i0.ɵɵlistener("selectionChange", function AppointmentListComponent_Template_mat_select_selectionChange_17_listener() { return ctx.loadAppointments(); });
            i0.ɵɵelementStart(18, "mat-option", 10);
            i0.ɵɵtext(19, "All");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "mat-option", 11);
            i0.ɵɵtext(21, "Scheduled");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "mat-option", 12);
            i0.ɵɵtext(23, "Confirmed");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "mat-option", 13);
            i0.ɵɵtext(25, "Checked In");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "mat-option", 14);
            i0.ɵɵtext(27, "Completed");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "mat-option", 15);
            i0.ɵɵtext(29, "Cancelled");
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(30, AppointmentListComponent_button_30_Template, 4, 0, "button", 16);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(31, "table", 17);
            i0.ɵɵelementContainerStart(32, 18);
            i0.ɵɵtemplate(33, AppointmentListComponent_th_33_Template, 2, 0, "th", 19)(34, AppointmentListComponent_td_34_Template, 3, 4, "td", 20);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(35, 21);
            i0.ɵɵtemplate(36, AppointmentListComponent_th_36_Template, 2, 0, "th", 22)(37, AppointmentListComponent_td_37_Template, 2, 2, "td", 20);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(38, 23);
            i0.ɵɵtemplate(39, AppointmentListComponent_th_39_Template, 2, 0, "th", 19)(40, AppointmentListComponent_td_40_Template, 2, 1, "td", 20);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(41, 24);
            i0.ɵɵtemplate(42, AppointmentListComponent_th_42_Template, 2, 0, "th", 19)(43, AppointmentListComponent_td_43_Template, 2, 1, "td", 20);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(44, 25);
            i0.ɵɵtemplate(45, AppointmentListComponent_th_45_Template, 2, 0, "th", 22)(46, AppointmentListComponent_td_46_Template, 2, 1, "td", 20);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(47, 26);
            i0.ɵɵtemplate(48, AppointmentListComponent_th_48_Template, 2, 0, "th", 22)(49, AppointmentListComponent_td_49_Template, 2, 1, "td", 20);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(50, 27);
            i0.ɵɵtemplate(51, AppointmentListComponent_th_51_Template, 2, 0, "th", 22)(52, AppointmentListComponent_td_52_Template, 12, 6, "td", 20);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵtemplate(53, AppointmentListComponent_tr_53_Template, 1, 0, "tr", 28)(54, AppointmentListComponent_tr_54_Template, 1, 0, "tr", 29);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(55, "mat-paginator", 30);
            i0.ɵɵlistener("page", function AppointmentListComponent_Template_mat_paginator_page_55_listener($event) { return ctx.onPageChange($event); });
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(11, _c2, i0.ɵɵpureFunction0(9, _c0), i0.ɵɵpureFunction0(10, _c1)));
            i0.ɵɵadvance(16);
            i0.ɵɵtwoWayProperty("value", ctx.filterStatus);
            i0.ɵɵadvance(13);
            i0.ɵɵproperty("ngIf", ctx.hasActiveFilters());
            i0.ɵɵadvance();
            i0.ɵɵproperty("dataSource", ctx.appointments);
            i0.ɵɵadvance(22);
            i0.ɵɵproperty("matHeaderRowDef", ctx.displayedColumns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("matRowDefColumns", ctx.displayedColumns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("length", ctx.totalCount)("pageSize", ctx.pageSize)("pageSizeOptions", i0.ɵɵpureFunction0(14, _c3));
        } }, dependencies: [i3.NgIf, i2.RouterLink, i4.MatButton, i4.MatIconButton, i5.MatIcon, i6.MatFormField, i6.MatLabel, i7.MatSelect, i7.MatOption, i8.MatTable, i8.MatHeaderCellDef, i8.MatHeaderRowDef, i8.MatColumnDef, i8.MatCellDef, i8.MatRowDef, i8.MatHeaderCell, i8.MatCell, i8.MatHeaderRow, i8.MatRow, i9.MatPaginator, i10.MatSort, i10.MatSortHeader, i11.MatMenu, i11.MatMenuItem, i11.MatMenuTrigger, i12.PageHeaderComponent, i13.StatusBadgeComponent, i14.SearchInputComponent, i15.DateRangePickerComponent, i16.MainLayoutComponent, i3.DatePipe], styles: [".filters[_ngcontent-%COMP%] { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; } table[_ngcontent-%COMP%] { width: 100%; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppointmentListComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-appointment-list', template: `
    <app-main-layout>
      <app-page-header title="Appointments" subtitle="Manage appointments"
        [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Appointments' }]">
        <button mat-stroked-button routerLink="calendar"><mat-icon>calendar_today</mat-icon> Calendar View</button>
        <button mat-raised-button color="primary" routerLink="new"><mat-icon>add</mat-icon> New Appointment</button>
      </app-page-header>

      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search..." (search)="onSearch($event)"></app-search-input>
          <app-date-range-picker label="Date Range" (rangeChange)="onDateRangeChange($event)"></app-date-range-picker>
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select [(value)]="filterStatus" (selectionChange)="loadAppointments()">
              <mat-option value="">All</mat-option>
              <mat-option value="Scheduled">Scheduled</mat-option>
              <mat-option value="Confirmed">Confirmed</mat-option>
              <mat-option value="CheckedIn">Checked In</mat-option>
              <mat-option value="Completed">Completed</mat-option>
              <mat-option value="Cancelled">Cancelled</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-stroked-button (click)="clearFilters()" *ngIf="hasActiveFilters()">
            <mat-icon>filter_list_off</mat-icon> Clear Filters
          </button>
        </div>

        <table mat-table [dataSource]="appointments" matSort>
          <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th><td mat-cell *matCellDef="let a">{{ a.appointmentDate | date:'mediumDate' }}</td></ng-container>
          <ng-container matColumnDef="time"><th mat-header-cell *matHeaderCellDef>Time</th><td mat-cell *matCellDef="let a">{{ a.startTime }} - {{ a.endTime }}</td></ng-container>
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef mat-sort-header>Patient</th><td mat-cell *matCellDef="let a">{{ a.patientName }}</td></ng-container>
          <ng-container matColumnDef="doctor"><th mat-header-cell *matHeaderCellDef mat-sort-header>Doctor</th><td mat-cell *matCellDef="let a">Dr. {{ a.doctorName }}</td></ng-container>
          <ng-container matColumnDef="type"><th mat-header-cell *matHeaderCellDef>Type</th><td mat-cell *matCellDef="let a">{{ a.appointmentType }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let a"><app-status-badge [status]="a.status"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let a">
              <button mat-icon-button [matMenuTriggerFor]="menu"><mat-icon>more_vert</mat-icon></button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="checkIn(a)" *ngIf="a.status === 'Confirmed'"><mat-icon>how_to_reg</mat-icon> Check In</button>
                <button mat-menu-item [routerLink]="[a.id, 'edit']"><mat-icon>edit</mat-icon> Edit</button>
                <button mat-menu-item (click)="cancel(a)" *ngIf="a.status !== 'Cancelled'"><mat-icon color="warn">cancel</mat-icon> Cancel</button>
              </mat-menu>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <mat-paginator [length]="totalCount" [pageSize]="pageSize" [pageSizeOptions]="[10, 25, 50]" (page)="onPageChange($event)"></mat-paginator>
      </div>
    </app-main-layout>
  `, styles: [".filters { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; } table { width: 100%; }"] }]
    }], () => [{ type: i1.ApiService }, { type: i2.Router }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AppointmentListComponent, { className: "AppointmentListComponent", filePath: "app/features/appointments/appointment-list/appointment-list.component.ts", lineNumber: 62 }); })();
//# sourceMappingURL=appointment-list.component.js.map