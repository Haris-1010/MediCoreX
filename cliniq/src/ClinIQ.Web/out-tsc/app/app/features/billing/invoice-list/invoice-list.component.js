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
import * as i10 from "@angular/material/menu";
import * as i11 from "../../../shared/components/page-header/page-header.component";
import * as i12 from "../../../shared/components/status-badge/status-badge.component";
import * as i13 from "../../../shared/components/search-input/search-input.component";
import * as i14 from "../../../shared/components/date-range-picker/date-range-picker.component";
import * as i15 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Billing", route: "/billing" });
const _c1 = () => ({ label: "Invoices" });
const _c2 = (a0, a1) => [a0, a1];
const _c3 = () => [10, 25, 50];
const _c4 = a0 => [a0];
const _c5 = a0 => ["/billing/payment", a0];
function InvoiceListComponent_button_24_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 30);
    i0.ɵɵlistener("click", function InvoiceListComponent_button_24_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.clearFilters()); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "filter_list_off");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3, " Clear Filters ");
    i0.ɵɵelementEnd();
} }
function InvoiceListComponent_th_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 31);
    i0.ɵɵtext(1, "Invoice #");
    i0.ɵɵelementEnd();
} }
function InvoiceListComponent_td_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 32);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const i_r3 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i_r3.invoiceNumber);
} }
function InvoiceListComponent_th_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 31);
    i0.ɵɵtext(1, "Patient");
    i0.ɵɵelementEnd();
} }
function InvoiceListComponent_td_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 32);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const i_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i_r4.patientName);
} }
function InvoiceListComponent_th_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 31);
    i0.ɵɵtext(1, "Date");
    i0.ɵɵelementEnd();
} }
function InvoiceListComponent_td_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 32);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "date");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const i_r5 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(2, 1, i_r5.invoiceDate, "mediumDate"));
} }
function InvoiceListComponent_th_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 31);
    i0.ɵɵtext(1, "Amount");
    i0.ɵɵelementEnd();
} }
function InvoiceListComponent_td_37_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 32);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "currency");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const i_r6 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, i_r6.totalAmount));
} }
function InvoiceListComponent_th_39_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 31);
    i0.ɵɵtext(1, "Paid");
    i0.ɵɵelementEnd();
} }
function InvoiceListComponent_td_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 32);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "currency");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const i_r7 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, i_r7.paidAmount));
} }
function InvoiceListComponent_th_42_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 31);
    i0.ɵɵtext(1, "Balance");
    i0.ɵɵelementEnd();
} }
function InvoiceListComponent_td_43_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 32);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "currency");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const i_r8 = ctx.$implicit;
    i0.ɵɵclassProp("overdue", i_r8.status === "Overdue");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 3, i_r8.balanceAmount));
} }
function InvoiceListComponent_th_45_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 31);
    i0.ɵɵtext(1, "Status");
    i0.ɵɵelementEnd();
} }
function InvoiceListComponent_td_46_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 32);
    i0.ɵɵelement(1, "app-status-badge", 33);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const i_r9 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("status", i_r9.status);
} }
function InvoiceListComponent_th_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "th", 31);
} }
function InvoiceListComponent_td_49_button_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "button", 35)(1, "mat-icon");
    i0.ɵɵtext(2, "payment");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3, " Receive Payment");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const i_r11 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("routerLink", i0.ɵɵpureFunction1(1, _c5, i_r11.id));
} }
function InvoiceListComponent_td_49_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "td", 32)(1, "button", 34)(2, "mat-icon");
    i0.ɵɵtext(3, "more_vert");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "mat-menu", null, 0)(6, "button", 35)(7, "mat-icon");
    i0.ɵɵtext(8, "visibility");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(9, " View");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(10, InvoiceListComponent_td_49_button_10_Template, 4, 3, "button", 36);
    i0.ɵɵelementStart(11, "button", 37);
    i0.ɵɵlistener("click", function InvoiceListComponent_td_49_Template_button_click_11_listener() { const i_r11 = i0.ɵɵrestoreView(_r10).$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.print(i_r11)); });
    i0.ɵɵelementStart(12, "mat-icon");
    i0.ɵɵtext(13, "print");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(14, " Print");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const i_r11 = ctx.$implicit;
    const menu_r12 = i0.ɵɵreference(5);
    i0.ɵɵadvance();
    i0.ɵɵproperty("matMenuTriggerFor", menu_r12);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("routerLink", i0.ɵɵpureFunction1(3, _c4, i_r11.id));
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngIf", i_r11.balanceAmount > 0);
} }
function InvoiceListComponent_tr_50_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 38);
} }
function InvoiceListComponent_tr_51_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 39);
} }
export class InvoiceListComponent {
    constructor(api) {
        this.api = api;
        this.invoices = [];
        this.columns = ['invoiceNumber', 'patient', 'date', 'amount', 'paid', 'balance', 'status', 'actions'];
        this.totalCount = 0;
        this.pageSize = 10;
        this.pageIndex = 0;
        this.searchTerm = '';
        this.filterStatus = '';
        this.startDate = null;
        this.endDate = null;
    }
    ngOnInit() { this.load(); }
    load() {
        this.api.get('v1/invoices', { pageNumber: this.pageIndex + 1, pageSize: this.pageSize, searchTerm: this.searchTerm, status: this.filterStatus, startDate: this.startDate?.toISOString(), endDate: this.endDate?.toISOString() })
            .subscribe(r => { this.invoices = r.items; this.totalCount = r.totalCount; });
    }
    onSearch(term) { this.searchTerm = term; this.pageIndex = 0; this.load(); }
    onDateRange(range) { this.startDate = range.start; this.endDate = range.end; this.load(); }
    onPage(e) { this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.load(); }
    print(i) { window.open(`/api/v1/invoices/${i.id}/print`, '_blank'); }
    hasActiveFilters() {
        return !!(this.searchTerm || this.filterStatus || this.startDate || this.endDate);
    }
    clearFilters() {
        this.searchTerm = '';
        this.filterStatus = '';
        this.startDate = null;
        this.endDate = null;
        this.pageIndex = 0;
        this.load();
    }
    static { this.ɵfac = function InvoiceListComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || InvoiceListComponent)(i0.ɵɵdirectiveInject(i1.ApiService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: InvoiceListComponent, selectors: [["app-invoice-list"]], standalone: false, decls: 53, vars: 15, consts: [["menu", "matMenu"], ["title", "Invoices", 3, "breadcrumbs"], ["mat-raised-button", "", "color", "primary", "routerLink", "new"], [1, "card"], [1, "filters"], ["placeholder", "Search...", 3, "search"], [3, "rangeChange"], ["appearance", "outline"], [3, "valueChange", "selectionChange", "value"], ["value", ""], ["value", "Paid"], ["value", "Unpaid"], ["value", "PartiallyPaid"], ["value", "Overdue"], ["mat-stroked-button", "", 3, "click", 4, "ngIf"], ["mat-table", "", 3, "dataSource"], ["matColumnDef", "invoiceNumber"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "patient"], ["matColumnDef", "date"], ["matColumnDef", "amount"], ["matColumnDef", "paid"], ["matColumnDef", "balance"], ["mat-cell", "", 3, "overdue", 4, "matCellDef"], ["matColumnDef", "status"], ["matColumnDef", "actions"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], [3, "page", "length", "pageSize", "pageSizeOptions"], ["mat-stroked-button", "", 3, "click"], ["mat-header-cell", ""], ["mat-cell", ""], [3, "status"], ["mat-icon-button", "", 3, "matMenuTriggerFor"], ["mat-menu-item", "", 3, "routerLink"], ["mat-menu-item", "", 3, "routerLink", 4, "ngIf"], ["mat-menu-item", "", 3, "click"], ["mat-header-row", ""], ["mat-row", ""]], template: function InvoiceListComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout")(1, "app-page-header", 1)(2, "button", 2)(3, "mat-icon");
            i0.ɵɵtext(4, "add");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(5, " New Invoice");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "div", 3)(7, "div", 4)(8, "app-search-input", 5);
            i0.ɵɵlistener("search", function InvoiceListComponent_Template_app_search_input_search_8_listener($event) { return ctx.onSearch($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "app-date-range-picker", 6);
            i0.ɵɵlistener("rangeChange", function InvoiceListComponent_Template_app_date_range_picker_rangeChange_9_listener($event) { return ctx.onDateRange($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "mat-form-field", 7)(11, "mat-label");
            i0.ɵɵtext(12, "Status");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "mat-select", 8);
            i0.ɵɵtwoWayListener("valueChange", function InvoiceListComponent_Template_mat_select_valueChange_13_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.filterStatus, $event) || (ctx.filterStatus = $event); return $event; });
            i0.ɵɵlistener("selectionChange", function InvoiceListComponent_Template_mat_select_selectionChange_13_listener() { return ctx.load(); });
            i0.ɵɵelementStart(14, "mat-option", 9);
            i0.ɵɵtext(15, "All");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "mat-option", 10);
            i0.ɵɵtext(17, "Paid");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "mat-option", 11);
            i0.ɵɵtext(19, "Unpaid");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "mat-option", 12);
            i0.ɵɵtext(21, "Partially Paid");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "mat-option", 13);
            i0.ɵɵtext(23, "Overdue");
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(24, InvoiceListComponent_button_24_Template, 4, 0, "button", 14);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(25, "table", 15);
            i0.ɵɵelementContainerStart(26, 16);
            i0.ɵɵtemplate(27, InvoiceListComponent_th_27_Template, 2, 0, "th", 17)(28, InvoiceListComponent_td_28_Template, 2, 1, "td", 18);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(29, 19);
            i0.ɵɵtemplate(30, InvoiceListComponent_th_30_Template, 2, 0, "th", 17)(31, InvoiceListComponent_td_31_Template, 2, 1, "td", 18);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(32, 20);
            i0.ɵɵtemplate(33, InvoiceListComponent_th_33_Template, 2, 0, "th", 17)(34, InvoiceListComponent_td_34_Template, 3, 4, "td", 18);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(35, 21);
            i0.ɵɵtemplate(36, InvoiceListComponent_th_36_Template, 2, 0, "th", 17)(37, InvoiceListComponent_td_37_Template, 3, 3, "td", 18);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(38, 22);
            i0.ɵɵtemplate(39, InvoiceListComponent_th_39_Template, 2, 0, "th", 17)(40, InvoiceListComponent_td_40_Template, 3, 3, "td", 18);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(41, 23);
            i0.ɵɵtemplate(42, InvoiceListComponent_th_42_Template, 2, 0, "th", 17)(43, InvoiceListComponent_td_43_Template, 3, 5, "td", 24);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(44, 25);
            i0.ɵɵtemplate(45, InvoiceListComponent_th_45_Template, 2, 0, "th", 17)(46, InvoiceListComponent_td_46_Template, 2, 1, "td", 18);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(47, 26);
            i0.ɵɵtemplate(48, InvoiceListComponent_th_48_Template, 1, 0, "th", 17)(49, InvoiceListComponent_td_49_Template, 15, 5, "td", 18);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵtemplate(50, InvoiceListComponent_tr_50_Template, 1, 0, "tr", 27)(51, InvoiceListComponent_tr_51_Template, 1, 0, "tr", 28);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(52, "mat-paginator", 29);
            i0.ɵɵlistener("page", function InvoiceListComponent_Template_mat_paginator_page_52_listener($event) { return ctx.onPage($event); });
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(11, _c2, i0.ɵɵpureFunction0(9, _c0), i0.ɵɵpureFunction0(10, _c1)));
            i0.ɵɵadvance(12);
            i0.ɵɵtwoWayProperty("value", ctx.filterStatus);
            i0.ɵɵadvance(11);
            i0.ɵɵproperty("ngIf", ctx.hasActiveFilters());
            i0.ɵɵadvance();
            i0.ɵɵproperty("dataSource", ctx.invoices);
            i0.ɵɵadvance(25);
            i0.ɵɵproperty("matHeaderRowDef", ctx.columns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("matRowDefColumns", ctx.columns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("length", ctx.totalCount)("pageSize", ctx.pageSize)("pageSizeOptions", i0.ɵɵpureFunction0(14, _c3));
        } }, dependencies: [i2.NgIf, i3.RouterLink, i4.MatButton, i4.MatIconButton, i5.MatIcon, i6.MatFormField, i6.MatLabel, i7.MatSelect, i7.MatOption, i8.MatTable, i8.MatHeaderCellDef, i8.MatHeaderRowDef, i8.MatColumnDef, i8.MatCellDef, i8.MatRowDef, i8.MatHeaderCell, i8.MatCell, i8.MatHeaderRow, i8.MatRow, i9.MatPaginator, i10.MatMenu, i10.MatMenuItem, i10.MatMenuTrigger, i11.PageHeaderComponent, i12.StatusBadgeComponent, i13.SearchInputComponent, i14.DateRangePickerComponent, i15.MainLayoutComponent, i2.CurrencyPipe, i2.DatePipe], styles: [".card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; } .filters[_ngcontent-%COMP%] { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; } table[_ngcontent-%COMP%] { width: 100%; } .overdue[_ngcontent-%COMP%] { color: #f44336; font-weight: 600; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(InvoiceListComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-invoice-list', template: `
    <app-main-layout>
      <app-page-header title="Invoices" [breadcrumbs]="[{ label: 'Billing', route: '/billing' }, { label: 'Invoices' }]">
        <button mat-raised-button color="primary" routerLink="new"><mat-icon>add</mat-icon> New Invoice</button>
      </app-page-header>
      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search..." (search)="onSearch($event)"></app-search-input>
          <app-date-range-picker (rangeChange)="onDateRange($event)"></app-date-range-picker>
          <mat-form-field appearance="outline"><mat-label>Status</mat-label>
            <mat-select [(value)]="filterStatus" (selectionChange)="load()">
              <mat-option value="">All</mat-option><mat-option value="Paid">Paid</mat-option><mat-option value="Unpaid">Unpaid</mat-option><mat-option value="PartiallyPaid">Partially Paid</mat-option><mat-option value="Overdue">Overdue</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-stroked-button (click)="clearFilters()" *ngIf="hasActiveFilters()">
            <mat-icon>filter_list_off</mat-icon> Clear Filters
          </button>
        </div>
        <table mat-table [dataSource]="invoices">
          <ng-container matColumnDef="invoiceNumber"><th mat-header-cell *matHeaderCellDef>Invoice #</th><td mat-cell *matCellDef="let i">{{ i.invoiceNumber }}</td></ng-container>
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let i">{{ i.patientName }}</td></ng-container>
          <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>Date</th><td mat-cell *matCellDef="let i">{{ i.invoiceDate | date:'mediumDate' }}</td></ng-container>
          <ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef>Amount</th><td mat-cell *matCellDef="let i">{{ i.totalAmount | currency }}</td></ng-container>
          <ng-container matColumnDef="paid"><th mat-header-cell *matHeaderCellDef>Paid</th><td mat-cell *matCellDef="let i">{{ i.paidAmount | currency }}</td></ng-container>
          <ng-container matColumnDef="balance"><th mat-header-cell *matHeaderCellDef>Balance</th><td mat-cell *matCellDef="let i" [class.overdue]="i.status === 'Overdue'">{{ i.balanceAmount | currency }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let i"><app-status-badge [status]="i.status"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let i">
              <button mat-icon-button [matMenuTriggerFor]="menu"><mat-icon>more_vert</mat-icon></button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item [routerLink]="[i.id]"><mat-icon>visibility</mat-icon> View</button>
                <button mat-menu-item [routerLink]="['/billing/payment', i.id]" *ngIf="i.balanceAmount > 0"><mat-icon>payment</mat-icon> Receive Payment</button>
                <button mat-menu-item (click)="print(i)"><mat-icon>print</mat-icon> Print</button>
              </mat-menu>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <mat-paginator [length]="totalCount" [pageSize]="pageSize" [pageSizeOptions]="[10, 25, 50]" (page)="onPage($event)"></mat-paginator>
      </div>
    </app-main-layout>
  `, styles: [".card { background: white; padding: 1.5rem; border-radius: 8px; } .filters { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; } table { width: 100%; } .overdue { color: #f44336; font-weight: 600; }"] }]
    }], () => [{ type: i1.ApiService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(InvoiceListComponent, { className: "InvoiceListComponent", filePath: "app/features/billing/invoice-list/invoice-list.component.ts", lineNumber: 52 }); })();
//# sourceMappingURL=invoice-list.component.js.map