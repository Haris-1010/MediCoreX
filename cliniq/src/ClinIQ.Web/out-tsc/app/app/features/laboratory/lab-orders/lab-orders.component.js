import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "@angular/common";
import * as i3 from "@angular/material/button";
import * as i4 from "@angular/material/icon";
import * as i5 from "@angular/material/input";
import * as i6 from "@angular/material/select";
import * as i7 from "@angular/material/table";
import * as i8 from "@angular/material/paginator";
import * as i9 from "../../../shared/components/page-header/page-header.component";
import * as i10 from "../../../shared/components/status-badge/status-badge.component";
import * as i11 from "../../../shared/components/search-input/search-input.component";
import * as i12 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Laboratory", route: "/laboratory" });
const _c1 = () => ({ label: "Orders" });
const _c2 = (a0, a1) => [a0, a1];
const _c3 = () => [10, 25, 50];
function LabOrdersComponent_button_17_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 23);
    i0.ɵɵlistener("click", function LabOrdersComponent_button_17_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.clearFilters()); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "filter_list_off");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3, " Clear Filters ");
    i0.ɵɵelementEnd();
} }
function LabOrdersComponent_th_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 24);
    i0.ɵɵtext(1, "Order #");
    i0.ɵɵelementEnd();
} }
function LabOrdersComponent_td_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 25);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const o_r3 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(o_r3.orderNumber);
} }
function LabOrdersComponent_th_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 24);
    i0.ɵɵtext(1, "Patient");
    i0.ɵɵelementEnd();
} }
function LabOrdersComponent_td_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 25);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const o_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(o_r4.patientName);
} }
function LabOrdersComponent_th_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 24);
    i0.ɵɵtext(1, "Tests");
    i0.ɵɵelementEnd();
} }
function LabOrdersComponent_td_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 25);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const o_r5 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(o_r5.tests.join(", "));
} }
function LabOrdersComponent_th_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 24);
    i0.ɵɵtext(1, "Date");
    i0.ɵɵelementEnd();
} }
function LabOrdersComponent_td_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 25);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "date");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const o_r6 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(2, 1, o_r6.orderDate, "mediumDate"));
} }
function LabOrdersComponent_th_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 24);
    i0.ɵɵtext(1, "Status");
    i0.ɵɵelementEnd();
} }
function LabOrdersComponent_td_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 25);
    i0.ɵɵelement(1, "app-status-badge", 26);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const o_r7 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("status", o_r7.status);
} }
function LabOrdersComponent_th_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "th", 24);
} }
function LabOrdersComponent_td_36_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 25)(1, "button", 27)(2, "mat-icon");
    i0.ɵɵtext(3, "visibility");
    i0.ɵɵelementEnd()()();
} }
function LabOrdersComponent_tr_37_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 28);
} }
function LabOrdersComponent_tr_38_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 29);
} }
export class LabOrdersComponent {
    constructor(api) {
        this.api = api;
        this.orders = [];
        this.columns = ['orderNumber', 'patient', 'tests', 'date', 'status', 'actions'];
        this.totalCount = 0;
        this.pageSize = 10;
        this.pageIndex = 0;
        this.searchTerm = '';
        this.filterStatus = '';
    }
    ngOnInit() { this.load(); }
    load() {
        this.api.get('v1/laboratory/orders', { pageNumber: this.pageIndex + 1, pageSize: this.pageSize, searchTerm: this.searchTerm, status: this.filterStatus })
            .subscribe(r => { this.orders = r.items; this.totalCount = r.totalCount; });
    }
    onSearch(term) { this.searchTerm = term; this.pageIndex = 0; this.load(); }
    onPage(e) { this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.load(); }
    hasActiveFilters() {
        return !!(this.searchTerm || this.filterStatus);
    }
    clearFilters() {
        this.searchTerm = '';
        this.filterStatus = '';
        this.pageIndex = 0;
        this.load();
    }
    static { this.ɵfac = function LabOrdersComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LabOrdersComponent)(i0.ɵɵdirectiveInject(i1.ApiService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: LabOrdersComponent, selectors: [["app-lab-orders"]], standalone: false, decls: 40, vars: 15, consts: [["title", "Lab Orders", 3, "breadcrumbs"], [1, "card"], [1, "filters"], ["placeholder", "Search...", 3, "search"], ["appearance", "outline"], [3, "valueChange", "selectionChange", "value"], ["value", ""], ["value", "Pending"], ["value", "InProgress"], ["value", "Completed"], ["mat-stroked-button", "", 3, "click", 4, "ngIf"], ["mat-table", "", 3, "dataSource"], ["matColumnDef", "orderNumber"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "patient"], ["matColumnDef", "tests"], ["matColumnDef", "date"], ["matColumnDef", "status"], ["matColumnDef", "actions"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], [3, "page", "length", "pageSize", "pageSizeOptions"], ["mat-stroked-button", "", 3, "click"], ["mat-header-cell", ""], ["mat-cell", ""], [3, "status"], ["mat-icon-button", ""], ["mat-header-row", ""], ["mat-row", ""]], template: function LabOrdersComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 0);
            i0.ɵɵelementStart(2, "div", 1)(3, "div", 2)(4, "app-search-input", 3);
            i0.ɵɵlistener("search", function LabOrdersComponent_Template_app_search_input_search_4_listener($event) { return ctx.onSearch($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "mat-form-field", 4)(6, "mat-label");
            i0.ɵɵtext(7, "Status");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "mat-select", 5);
            i0.ɵɵtwoWayListener("valueChange", function LabOrdersComponent_Template_mat_select_valueChange_8_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.filterStatus, $event) || (ctx.filterStatus = $event); return $event; });
            i0.ɵɵlistener("selectionChange", function LabOrdersComponent_Template_mat_select_selectionChange_8_listener() { return ctx.load(); });
            i0.ɵɵelementStart(9, "mat-option", 6);
            i0.ɵɵtext(10, "All");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "mat-option", 7);
            i0.ɵɵtext(12, "Pending");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "mat-option", 8);
            i0.ɵɵtext(14, "In Progress");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "mat-option", 9);
            i0.ɵɵtext(16, "Completed");
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(17, LabOrdersComponent_button_17_Template, 4, 0, "button", 10);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "table", 11);
            i0.ɵɵelementContainerStart(19, 12);
            i0.ɵɵtemplate(20, LabOrdersComponent_th_20_Template, 2, 0, "th", 13)(21, LabOrdersComponent_td_21_Template, 2, 1, "td", 14);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(22, 15);
            i0.ɵɵtemplate(23, LabOrdersComponent_th_23_Template, 2, 0, "th", 13)(24, LabOrdersComponent_td_24_Template, 2, 1, "td", 14);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(25, 16);
            i0.ɵɵtemplate(26, LabOrdersComponent_th_26_Template, 2, 0, "th", 13)(27, LabOrdersComponent_td_27_Template, 2, 1, "td", 14);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(28, 17);
            i0.ɵɵtemplate(29, LabOrdersComponent_th_29_Template, 2, 0, "th", 13)(30, LabOrdersComponent_td_30_Template, 3, 4, "td", 14);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(31, 18);
            i0.ɵɵtemplate(32, LabOrdersComponent_th_32_Template, 2, 0, "th", 13)(33, LabOrdersComponent_td_33_Template, 2, 1, "td", 14);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(34, 19);
            i0.ɵɵtemplate(35, LabOrdersComponent_th_35_Template, 1, 0, "th", 13)(36, LabOrdersComponent_td_36_Template, 4, 0, "td", 14);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵtemplate(37, LabOrdersComponent_tr_37_Template, 1, 0, "tr", 20)(38, LabOrdersComponent_tr_38_Template, 1, 0, "tr", 21);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(39, "mat-paginator", 22);
            i0.ɵɵlistener("page", function LabOrdersComponent_Template_mat_paginator_page_39_listener($event) { return ctx.onPage($event); });
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(11, _c2, i0.ɵɵpureFunction0(9, _c0), i0.ɵɵpureFunction0(10, _c1)));
            i0.ɵɵadvance(7);
            i0.ɵɵtwoWayProperty("value", ctx.filterStatus);
            i0.ɵɵadvance(9);
            i0.ɵɵproperty("ngIf", ctx.hasActiveFilters());
            i0.ɵɵadvance();
            i0.ɵɵproperty("dataSource", ctx.orders);
            i0.ɵɵadvance(19);
            i0.ɵɵproperty("matHeaderRowDef", ctx.columns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("matRowDefColumns", ctx.columns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("length", ctx.totalCount)("pageSize", ctx.pageSize)("pageSizeOptions", i0.ɵɵpureFunction0(14, _c3));
        } }, dependencies: [i2.NgIf, i3.MatButton, i3.MatIconButton, i4.MatIcon, i5.MatFormField, i5.MatLabel, i6.MatSelect, i6.MatOption, i7.MatTable, i7.MatHeaderCellDef, i7.MatHeaderRowDef, i7.MatColumnDef, i7.MatCellDef, i7.MatRowDef, i7.MatHeaderCell, i7.MatCell, i7.MatHeaderRow, i7.MatRow, i8.MatPaginator, i9.PageHeaderComponent, i10.StatusBadgeComponent, i11.SearchInputComponent, i12.MainLayoutComponent, i2.DatePipe], styles: [".card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; } .filters[_ngcontent-%COMP%] { display: flex; gap: 1rem; margin-bottom: 1rem; } table[_ngcontent-%COMP%] { width: 100%; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LabOrdersComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-lab-orders', template: `
    <app-main-layout>
      <app-page-header title="Lab Orders" [breadcrumbs]="[{ label: 'Laboratory', route: '/laboratory' }, { label: 'Orders' }]"></app-page-header>
      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search..." (search)="onSearch($event)"></app-search-input>
          <mat-form-field appearance="outline"><mat-label>Status</mat-label><mat-select [(value)]="filterStatus" (selectionChange)="load()"><mat-option value="">All</mat-option><mat-option value="Pending">Pending</mat-option><mat-option value="InProgress">In Progress</mat-option><mat-option value="Completed">Completed</mat-option></mat-select></mat-form-field>
          <button mat-stroked-button (click)="clearFilters()" *ngIf="hasActiveFilters()">
            <mat-icon>filter_list_off</mat-icon> Clear Filters
          </button>
        </div>
        <table mat-table [dataSource]="orders">
          <ng-container matColumnDef="orderNumber"><th mat-header-cell *matHeaderCellDef>Order #</th><td mat-cell *matCellDef="let o">{{ o.orderNumber }}</td></ng-container>
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let o">{{ o.patientName }}</td></ng-container>
          <ng-container matColumnDef="tests"><th mat-header-cell *matHeaderCellDef>Tests</th><td mat-cell *matCellDef="let o">{{ o.tests.join(', ') }}</td></ng-container>
          <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>Date</th><td mat-cell *matCellDef="let o">{{ o.orderDate | date:'mediumDate' }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let o"><app-status-badge [status]="o.status"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let o"><button mat-icon-button><mat-icon>visibility</mat-icon></button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <mat-paginator [length]="totalCount" [pageSize]="pageSize" [pageSizeOptions]="[10, 25, 50]" (page)="onPage($event)"></mat-paginator>
      </div>
    </app-main-layout>
  `, styles: [".card { background: white; padding: 1.5rem; border-radius: 8px; } .filters { display: flex; gap: 1rem; margin-bottom: 1rem; } table { width: 100%; }"] }]
    }], () => [{ type: i1.ApiService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(LabOrdersComponent, { className: "LabOrdersComponent", filePath: "app/features/laboratory/lab-orders/lab-orders.component.ts", lineNumber: 34 }); })();
//# sourceMappingURL=lab-orders.component.js.map