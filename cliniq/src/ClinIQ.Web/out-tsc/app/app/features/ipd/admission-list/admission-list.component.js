import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "@angular/common";
import * as i3 from "@angular/router";
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
import * as i15 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "IPD", route: "/ipd" });
const _c1 = () => ({ label: "Admissions" });
const _c2 = (a0, a1) => [a0, a1];
const _c3 = () => [10, 25, 50];
const _c4 = a0 => ["/ipd/discharge", a0];
function AdmissionListComponent_mat_option_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 27);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const w_r1 = ctx.$implicit;
    i0.ɵɵproperty("value", w_r1.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(w_r1.name);
} }
function AdmissionListComponent_button_26_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 28);
    i0.ɵɵlistener("click", function AdmissionListComponent_button_26_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.clearFilters()); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "filter_list_off");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3, " Clear Filters ");
    i0.ɵɵelementEnd();
} }
function AdmissionListComponent_th_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 29);
    i0.ɵɵtext(1, "Admission #");
    i0.ɵɵelementEnd();
} }
function AdmissionListComponent_td_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 30);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const a_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(a_r4.admissionNumber);
} }
function AdmissionListComponent_th_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 29);
    i0.ɵɵtext(1, "Patient");
    i0.ɵɵelementEnd();
} }
function AdmissionListComponent_td_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 30);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const a_r5 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(a_r5.patientName);
} }
function AdmissionListComponent_th_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 29);
    i0.ɵɵtext(1, "Ward");
    i0.ɵɵelementEnd();
} }
function AdmissionListComponent_td_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 30);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const a_r6 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(a_r6.wardName);
} }
function AdmissionListComponent_th_38_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 29);
    i0.ɵɵtext(1, "Bed");
    i0.ɵɵelementEnd();
} }
function AdmissionListComponent_td_39_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 30);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const a_r7 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(a_r7.bedNumber);
} }
function AdmissionListComponent_th_41_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 29);
    i0.ɵɵtext(1, "Doctor");
    i0.ɵɵelementEnd();
} }
function AdmissionListComponent_td_42_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 30);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const a_r8 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Dr. ", a_r8.doctorName, "");
} }
function AdmissionListComponent_th_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 29);
    i0.ɵɵtext(1, "Admitted");
    i0.ɵɵelementEnd();
} }
function AdmissionListComponent_td_45_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 30);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "date");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const a_r9 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(2, 1, a_r9.admissionDate, "mediumDate"));
} }
function AdmissionListComponent_th_47_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 29);
    i0.ɵɵtext(1, "Status");
    i0.ɵɵelementEnd();
} }
function AdmissionListComponent_td_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 30);
    i0.ɵɵelement(1, "app-status-badge", 31);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const a_r10 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("status", a_r10.status);
} }
function AdmissionListComponent_th_50_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "th", 29);
} }
function AdmissionListComponent_td_51_button_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "button", 35)(1, "mat-icon");
    i0.ɵɵtext(2, "logout");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3, " Discharge");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const a_r11 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("routerLink", i0.ɵɵpureFunction1(1, _c4, a_r11.id));
} }
function AdmissionListComponent_td_51_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 30)(1, "button", 32)(2, "mat-icon");
    i0.ɵɵtext(3, "more_vert");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "mat-menu", null, 0);
    i0.ɵɵtemplate(6, AdmissionListComponent_td_51_button_6_Template, 4, 3, "button", 33);
    i0.ɵɵelementStart(7, "button", 34)(8, "mat-icon");
    i0.ɵɵtext(9, "edit");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(10, " Edit");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const a_r11 = ctx.$implicit;
    const menu_r12 = i0.ɵɵreference(5);
    i0.ɵɵadvance();
    i0.ɵɵproperty("matMenuTriggerFor", menu_r12);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngIf", a_r11.status === "Admitted");
} }
function AdmissionListComponent_tr_52_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 36);
} }
function AdmissionListComponent_tr_53_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 37);
} }
export class AdmissionListComponent {
    constructor(api) {
        this.api = api;
        this.admissions = [];
        this.wards = [];
        this.columns = ['admissionNumber', 'patient', 'ward', 'bed', 'doctor', 'admissionDate', 'status', 'actions'];
        this.totalCount = 0;
        this.pageSize = 10;
        this.pageIndex = 0;
        this.searchTerm = '';
        this.filterWard = '';
        this.filterStatus = '';
    }
    ngOnInit() { this.load(); this.api.get('v1/wards').subscribe(r => this.wards = r); }
    load() {
        this.api.get('v1/admissions', { pageNumber: this.pageIndex + 1, pageSize: this.pageSize, searchTerm: this.searchTerm, wardId: this.filterWard, status: this.filterStatus })
            .subscribe(r => { this.admissions = r.items; this.totalCount = r.totalCount; });
    }
    onSearch(term) { this.searchTerm = term; this.pageIndex = 0; this.load(); }
    onPage(e) { this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.load(); }
    hasActiveFilters() {
        return !!(this.searchTerm || this.filterWard || this.filterStatus);
    }
    clearFilters() {
        this.searchTerm = '';
        this.filterWard = '';
        this.filterStatus = '';
        this.pageIndex = 0;
        this.load();
    }
    static { this.ɵfac = function AdmissionListComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AdmissionListComponent)(i0.ɵɵdirectiveInject(i1.ApiService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AdmissionListComponent, selectors: [["app-admission-list"]], standalone: false, decls: 55, vars: 17, consts: [["menu", "matMenu"], ["title", "Admissions", 3, "breadcrumbs"], ["mat-raised-button", "", "color", "primary", "routerLink", "/ipd/admit"], [1, "card"], [1, "filters"], ["placeholder", "Search...", 3, "search"], ["appearance", "outline"], [3, "valueChange", "selectionChange", "value"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], ["value", "Admitted"], ["value", "Discharged"], ["mat-stroked-button", "", 3, "click", 4, "ngIf"], ["mat-table", "", "matSort", "", 3, "dataSource"], ["matColumnDef", "admissionNumber"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "patient"], ["matColumnDef", "ward"], ["matColumnDef", "bed"], ["matColumnDef", "doctor"], ["matColumnDef", "admissionDate"], ["matColumnDef", "status"], ["matColumnDef", "actions"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], [3, "page", "length", "pageSize", "pageSizeOptions"], [3, "value"], ["mat-stroked-button", "", 3, "click"], ["mat-header-cell", ""], ["mat-cell", ""], [3, "status"], ["mat-icon-button", "", 3, "matMenuTriggerFor"], ["mat-menu-item", "", 3, "routerLink", 4, "ngIf"], ["mat-menu-item", ""], ["mat-menu-item", "", 3, "routerLink"], ["mat-header-row", ""], ["mat-row", ""]], template: function AdmissionListComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout")(1, "app-page-header", 1)(2, "button", 2)(3, "mat-icon");
            i0.ɵɵtext(4, "add");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(5, " New Admission");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "div", 3)(7, "div", 4)(8, "app-search-input", 5);
            i0.ɵɵlistener("search", function AdmissionListComponent_Template_app_search_input_search_8_listener($event) { return ctx.onSearch($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "mat-form-field", 6)(10, "mat-label");
            i0.ɵɵtext(11, "Ward");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "mat-select", 7);
            i0.ɵɵtwoWayListener("valueChange", function AdmissionListComponent_Template_mat_select_valueChange_12_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.filterWard, $event) || (ctx.filterWard = $event); return $event; });
            i0.ɵɵlistener("selectionChange", function AdmissionListComponent_Template_mat_select_selectionChange_12_listener() { return ctx.load(); });
            i0.ɵɵelementStart(13, "mat-option", 8);
            i0.ɵɵtext(14, "All");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(15, AdmissionListComponent_mat_option_15_Template, 2, 2, "mat-option", 9);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(16, "mat-form-field", 6)(17, "mat-label");
            i0.ɵɵtext(18, "Status");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "mat-select", 7);
            i0.ɵɵtwoWayListener("valueChange", function AdmissionListComponent_Template_mat_select_valueChange_19_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.filterStatus, $event) || (ctx.filterStatus = $event); return $event; });
            i0.ɵɵlistener("selectionChange", function AdmissionListComponent_Template_mat_select_selectionChange_19_listener() { return ctx.load(); });
            i0.ɵɵelementStart(20, "mat-option", 8);
            i0.ɵɵtext(21, "All");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "mat-option", 10);
            i0.ɵɵtext(23, "Admitted");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "mat-option", 11);
            i0.ɵɵtext(25, "Discharged");
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(26, AdmissionListComponent_button_26_Template, 4, 0, "button", 12);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(27, "table", 13);
            i0.ɵɵelementContainerStart(28, 14);
            i0.ɵɵtemplate(29, AdmissionListComponent_th_29_Template, 2, 0, "th", 15)(30, AdmissionListComponent_td_30_Template, 2, 1, "td", 16);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(31, 17);
            i0.ɵɵtemplate(32, AdmissionListComponent_th_32_Template, 2, 0, "th", 15)(33, AdmissionListComponent_td_33_Template, 2, 1, "td", 16);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(34, 18);
            i0.ɵɵtemplate(35, AdmissionListComponent_th_35_Template, 2, 0, "th", 15)(36, AdmissionListComponent_td_36_Template, 2, 1, "td", 16);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(37, 19);
            i0.ɵɵtemplate(38, AdmissionListComponent_th_38_Template, 2, 0, "th", 15)(39, AdmissionListComponent_td_39_Template, 2, 1, "td", 16);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(40, 20);
            i0.ɵɵtemplate(41, AdmissionListComponent_th_41_Template, 2, 0, "th", 15)(42, AdmissionListComponent_td_42_Template, 2, 1, "td", 16);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(43, 21);
            i0.ɵɵtemplate(44, AdmissionListComponent_th_44_Template, 2, 0, "th", 15)(45, AdmissionListComponent_td_45_Template, 3, 4, "td", 16);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(46, 22);
            i0.ɵɵtemplate(47, AdmissionListComponent_th_47_Template, 2, 0, "th", 15)(48, AdmissionListComponent_td_48_Template, 2, 1, "td", 16);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(49, 23);
            i0.ɵɵtemplate(50, AdmissionListComponent_th_50_Template, 1, 0, "th", 15)(51, AdmissionListComponent_td_51_Template, 11, 2, "td", 16);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵtemplate(52, AdmissionListComponent_tr_52_Template, 1, 0, "tr", 24)(53, AdmissionListComponent_tr_53_Template, 1, 0, "tr", 25);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(54, "mat-paginator", 26);
            i0.ɵɵlistener("page", function AdmissionListComponent_Template_mat_paginator_page_54_listener($event) { return ctx.onPage($event); });
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(13, _c2, i0.ɵɵpureFunction0(11, _c0), i0.ɵɵpureFunction0(12, _c1)));
            i0.ɵɵadvance(11);
            i0.ɵɵtwoWayProperty("value", ctx.filterWard);
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("ngForOf", ctx.wards);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("value", ctx.filterStatus);
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("ngIf", ctx.hasActiveFilters());
            i0.ɵɵadvance();
            i0.ɵɵproperty("dataSource", ctx.admissions);
            i0.ɵɵadvance(25);
            i0.ɵɵproperty("matHeaderRowDef", ctx.columns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("matRowDefColumns", ctx.columns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("length", ctx.totalCount)("pageSize", ctx.pageSize)("pageSizeOptions", i0.ɵɵpureFunction0(16, _c3));
        } }, dependencies: [i2.NgForOf, i2.NgIf, i3.RouterLink, i4.MatButton, i4.MatIconButton, i5.MatIcon, i6.MatFormField, i6.MatLabel, i7.MatSelect, i7.MatOption, i8.MatTable, i8.MatHeaderCellDef, i8.MatHeaderRowDef, i8.MatColumnDef, i8.MatCellDef, i8.MatRowDef, i8.MatHeaderCell, i8.MatCell, i8.MatHeaderRow, i8.MatRow, i9.MatPaginator, i10.MatSort, i11.MatMenu, i11.MatMenuItem, i11.MatMenuTrigger, i12.PageHeaderComponent, i13.StatusBadgeComponent, i14.SearchInputComponent, i15.MainLayoutComponent, i2.DatePipe], styles: [".card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; } .filters[_ngcontent-%COMP%] { display: flex; gap: 1rem; margin-bottom: 1rem; } table[_ngcontent-%COMP%] { width: 100%; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AdmissionListComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-admission-list', template: `
    <app-main-layout>
      <app-page-header title="Admissions" [breadcrumbs]="[{ label: 'IPD', route: '/ipd' }, { label: 'Admissions' }]">
        <button mat-raised-button color="primary" routerLink="/ipd/admit"><mat-icon>add</mat-icon> New Admission</button>
      </app-page-header>
      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search..." (search)="onSearch($event)"></app-search-input>
          <mat-form-field appearance="outline"><mat-label>Ward</mat-label>
            <mat-select [(value)]="filterWard" (selectionChange)="load()">
              <mat-option value="">All</mat-option><mat-option *ngFor="let w of wards" [value]="w.id">{{ w.name }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Status</mat-label>
            <mat-select [(value)]="filterStatus" (selectionChange)="load()">
              <mat-option value="">All</mat-option><mat-option value="Admitted">Admitted</mat-option><mat-option value="Discharged">Discharged</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-stroked-button (click)="clearFilters()" *ngIf="hasActiveFilters()">
            <mat-icon>filter_list_off</mat-icon> Clear Filters
          </button>
        </div>
        <table mat-table [dataSource]="admissions" matSort>
          <ng-container matColumnDef="admissionNumber"><th mat-header-cell *matHeaderCellDef>Admission #</th><td mat-cell *matCellDef="let a">{{ a.admissionNumber }}</td></ng-container>
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let a">{{ a.patientName }}</td></ng-container>
          <ng-container matColumnDef="ward"><th mat-header-cell *matHeaderCellDef>Ward</th><td mat-cell *matCellDef="let a">{{ a.wardName }}</td></ng-container>
          <ng-container matColumnDef="bed"><th mat-header-cell *matHeaderCellDef>Bed</th><td mat-cell *matCellDef="let a">{{ a.bedNumber }}</td></ng-container>
          <ng-container matColumnDef="doctor"><th mat-header-cell *matHeaderCellDef>Doctor</th><td mat-cell *matCellDef="let a">Dr. {{ a.doctorName }}</td></ng-container>
          <ng-container matColumnDef="admissionDate"><th mat-header-cell *matHeaderCellDef>Admitted</th><td mat-cell *matCellDef="let a">{{ a.admissionDate | date:'mediumDate' }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let a"><app-status-badge [status]="a.status"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let a">
              <button mat-icon-button [matMenuTriggerFor]="menu"><mat-icon>more_vert</mat-icon></button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item [routerLink]="['/ipd/discharge', a.id]" *ngIf="a.status === 'Admitted'"><mat-icon>logout</mat-icon> Discharge</button>
                <button mat-menu-item><mat-icon>edit</mat-icon> Edit</button>
              </mat-menu>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <mat-paginator [length]="totalCount" [pageSize]="pageSize" [pageSizeOptions]="[10, 25, 50]" (page)="onPage($event)"></mat-paginator>
      </div>
    </app-main-layout>
  `, styles: [".card { background: white; padding: 1.5rem; border-radius: 8px; } .filters { display: flex; gap: 1rem; margin-bottom: 1rem; } table { width: 100%; }"] }]
    }], () => [{ type: i1.ApiService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AdmissionListComponent, { className: "AdmissionListComponent", filePath: "app/features/ipd/admission-list/admission-list.component.ts", lineNumber: 55 }); })();
//# sourceMappingURL=admission-list.component.js.map