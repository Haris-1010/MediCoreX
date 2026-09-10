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
import * as i9 from "@angular/material/menu";
import * as i10 from "../../../shared/components/page-header/page-header.component";
import * as i11 from "../../../shared/components/status-badge/status-badge.component";
import * as i12 from "../../../shared/components/search-input/search-input.component";
import * as i13 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Inventory", route: "/inventory" });
const _c1 = () => ({ label: "Purchase Orders" });
const _c2 = (a0, a1) => [a0, a1];
const _c3 = () => [10, 25, 50];
function PurchaseOrdersComponent_th_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 25);
    i0.ɵɵtext(1, "PO Number");
    i0.ɵɵelementEnd();
} }
function PurchaseOrdersComponent_td_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 26);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const o_r1 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(o_r1.poNumber);
} }
function PurchaseOrdersComponent_th_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 25);
    i0.ɵɵtext(1, "Supplier");
    i0.ɵɵelementEnd();
} }
function PurchaseOrdersComponent_td_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 26);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const o_r2 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(o_r2.supplierName);
} }
function PurchaseOrdersComponent_th_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 25);
    i0.ɵɵtext(1, "Date");
    i0.ɵɵelementEnd();
} }
function PurchaseOrdersComponent_td_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 26);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "date");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const o_r3 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(2, 1, o_r3.orderDate, "mediumDate"));
} }
function PurchaseOrdersComponent_th_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 25);
    i0.ɵɵtext(1, "Total");
    i0.ɵɵelementEnd();
} }
function PurchaseOrdersComponent_td_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 26);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "currency");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const o_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, o_r4.totalAmount));
} }
function PurchaseOrdersComponent_th_37_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 25);
    i0.ɵɵtext(1, "Status");
    i0.ɵɵelementEnd();
} }
function PurchaseOrdersComponent_td_38_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 26);
    i0.ɵɵelement(1, "app-status-badge", 27);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const o_r5 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("status", o_r5.status);
} }
function PurchaseOrdersComponent_th_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "th", 25);
} }
function PurchaseOrdersComponent_td_41_button_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "button", 29)(1, "mat-icon");
    i0.ɵɵtext(2, "local_shipping");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3, " Receive");
    i0.ɵɵelementEnd();
} }
function PurchaseOrdersComponent_td_41_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 26)(1, "button", 28)(2, "mat-icon");
    i0.ɵɵtext(3, "more_vert");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "mat-menu", null, 0)(6, "button", 29)(7, "mat-icon");
    i0.ɵɵtext(8, "visibility");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(9, " View");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(10, PurchaseOrdersComponent_td_41_button_10_Template, 4, 0, "button", 30);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const o_r6 = ctx.$implicit;
    const menu_r7 = i0.ɵɵreference(5);
    i0.ɵɵadvance();
    i0.ɵɵproperty("matMenuTriggerFor", menu_r7);
    i0.ɵɵadvance(9);
    i0.ɵɵproperty("ngIf", o_r6.status === "Approved");
} }
function PurchaseOrdersComponent_tr_42_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 31);
} }
function PurchaseOrdersComponent_tr_43_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 32);
} }
export class PurchaseOrdersComponent {
    constructor(api) {
        this.api = api;
        this.orders = [];
        this.columns = ['poNumber', 'supplier', 'date', 'total', 'status', 'actions'];
        this.totalCount = 0;
        this.pageSize = 10;
        this.pageIndex = 0;
        this.searchTerm = '';
        this.filterStatus = '';
    }
    ngOnInit() { this.load(); }
    load() {
        this.api.get('v1/purchase-orders', { pageNumber: this.pageIndex + 1, pageSize: this.pageSize, searchTerm: this.searchTerm, status: this.filterStatus })
            .subscribe(r => { this.orders = r.items; this.totalCount = r.totalCount; });
    }
    onSearch(term) { this.searchTerm = term; this.pageIndex = 0; this.load(); }
    onPage(e) { this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.load(); }
    createOrder() {
        const supplierName = prompt('Supplier name:');
        if (!supplierName)
            return;
        const orderDate = new Date().toISOString().split('T')[0];
        this.api.post('v1/purchase-orders', { supplierName, orderDate, status: 'Draft', items: [] }).subscribe({
            next: () => { this.load(); },
            error: () => { }
        });
    }
    static { this.ɵfac = function PurchaseOrdersComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PurchaseOrdersComponent)(i0.ɵɵdirectiveInject(i1.ApiService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PurchaseOrdersComponent, selectors: [["app-purchase-orders"]], standalone: false, decls: 45, vars: 14, consts: [["menu", "matMenu"], ["title", "Purchase Orders", 3, "breadcrumbs"], ["mat-raised-button", "", "color", "primary", 3, "click"], [1, "card"], [1, "filters"], ["placeholder", "Search...", 3, "search"], ["appearance", "outline"], [3, "valueChange", "selectionChange", "value"], ["value", ""], ["value", "Draft"], ["value", "Submitted"], ["value", "Approved"], ["value", "Received"], ["mat-table", "", 3, "dataSource"], ["matColumnDef", "poNumber"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "supplier"], ["matColumnDef", "date"], ["matColumnDef", "total"], ["matColumnDef", "status"], ["matColumnDef", "actions"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], [3, "page", "length", "pageSize", "pageSizeOptions"], ["mat-header-cell", ""], ["mat-cell", ""], [3, "status"], ["mat-icon-button", "", 3, "matMenuTriggerFor"], ["mat-menu-item", ""], ["mat-menu-item", "", 4, "ngIf"], ["mat-header-row", ""], ["mat-row", ""]], template: function PurchaseOrdersComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout")(1, "app-page-header", 1)(2, "button", 2);
            i0.ɵɵlistener("click", function PurchaseOrdersComponent_Template_button_click_2_listener() { return ctx.createOrder(); });
            i0.ɵɵelementStart(3, "mat-icon");
            i0.ɵɵtext(4, "add");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(5, " New Order");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "div", 3)(7, "div", 4)(8, "app-search-input", 5);
            i0.ɵɵlistener("search", function PurchaseOrdersComponent_Template_app_search_input_search_8_listener($event) { return ctx.onSearch($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "mat-form-field", 6)(10, "mat-label");
            i0.ɵɵtext(11, "Status");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "mat-select", 7);
            i0.ɵɵtwoWayListener("valueChange", function PurchaseOrdersComponent_Template_mat_select_valueChange_12_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.filterStatus, $event) || (ctx.filterStatus = $event); return $event; });
            i0.ɵɵlistener("selectionChange", function PurchaseOrdersComponent_Template_mat_select_selectionChange_12_listener() { return ctx.load(); });
            i0.ɵɵelementStart(13, "mat-option", 8);
            i0.ɵɵtext(14, "All");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "mat-option", 9);
            i0.ɵɵtext(16, "Draft");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "mat-option", 10);
            i0.ɵɵtext(18, "Submitted");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "mat-option", 11);
            i0.ɵɵtext(20, "Approved");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "mat-option", 12);
            i0.ɵɵtext(22, "Received");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(23, "table", 13);
            i0.ɵɵelementContainerStart(24, 14);
            i0.ɵɵtemplate(25, PurchaseOrdersComponent_th_25_Template, 2, 0, "th", 15)(26, PurchaseOrdersComponent_td_26_Template, 2, 1, "td", 16);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(27, 17);
            i0.ɵɵtemplate(28, PurchaseOrdersComponent_th_28_Template, 2, 0, "th", 15)(29, PurchaseOrdersComponent_td_29_Template, 2, 1, "td", 16);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(30, 18);
            i0.ɵɵtemplate(31, PurchaseOrdersComponent_th_31_Template, 2, 0, "th", 15)(32, PurchaseOrdersComponent_td_32_Template, 3, 4, "td", 16);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(33, 19);
            i0.ɵɵtemplate(34, PurchaseOrdersComponent_th_34_Template, 2, 0, "th", 15)(35, PurchaseOrdersComponent_td_35_Template, 3, 3, "td", 16);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(36, 20);
            i0.ɵɵtemplate(37, PurchaseOrdersComponent_th_37_Template, 2, 0, "th", 15)(38, PurchaseOrdersComponent_td_38_Template, 2, 1, "td", 16);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(39, 21);
            i0.ɵɵtemplate(40, PurchaseOrdersComponent_th_40_Template, 1, 0, "th", 15)(41, PurchaseOrdersComponent_td_41_Template, 11, 2, "td", 16);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵtemplate(42, PurchaseOrdersComponent_tr_42_Template, 1, 0, "tr", 22)(43, PurchaseOrdersComponent_tr_43_Template, 1, 0, "tr", 23);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(44, "mat-paginator", 24);
            i0.ɵɵlistener("page", function PurchaseOrdersComponent_Template_mat_paginator_page_44_listener($event) { return ctx.onPage($event); });
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(10, _c2, i0.ɵɵpureFunction0(8, _c0), i0.ɵɵpureFunction0(9, _c1)));
            i0.ɵɵadvance(11);
            i0.ɵɵtwoWayProperty("value", ctx.filterStatus);
            i0.ɵɵadvance(11);
            i0.ɵɵproperty("dataSource", ctx.orders);
            i0.ɵɵadvance(19);
            i0.ɵɵproperty("matHeaderRowDef", ctx.columns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("matRowDefColumns", ctx.columns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("length", ctx.totalCount)("pageSize", ctx.pageSize)("pageSizeOptions", i0.ɵɵpureFunction0(13, _c3));
        } }, dependencies: [i2.NgIf, i3.MatButton, i3.MatIconButton, i4.MatIcon, i5.MatFormField, i5.MatLabel, i6.MatSelect, i6.MatOption, i7.MatTable, i7.MatHeaderCellDef, i7.MatHeaderRowDef, i7.MatColumnDef, i7.MatCellDef, i7.MatRowDef, i7.MatHeaderCell, i7.MatCell, i7.MatHeaderRow, i7.MatRow, i8.MatPaginator, i9.MatMenu, i9.MatMenuItem, i9.MatMenuTrigger, i10.PageHeaderComponent, i11.StatusBadgeComponent, i12.SearchInputComponent, i13.MainLayoutComponent, i2.CurrencyPipe, i2.DatePipe], styles: [".card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; } .filters[_ngcontent-%COMP%] { display: flex; gap: 1rem; margin-bottom: 1rem; } table[_ngcontent-%COMP%] { width: 100%; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PurchaseOrdersComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-purchase-orders', template: `
    <app-main-layout>
      <app-page-header title="Purchase Orders" [breadcrumbs]="[{ label: 'Inventory', route: '/inventory' }, { label: 'Purchase Orders' }]">
        <button mat-raised-button color="primary" (click)="createOrder()"><mat-icon>add</mat-icon> New Order</button>
      </app-page-header>
      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search..." (search)="onSearch($event)"></app-search-input>
          <mat-form-field appearance="outline"><mat-label>Status</mat-label><mat-select [(value)]="filterStatus" (selectionChange)="load()"><mat-option value="">All</mat-option><mat-option value="Draft">Draft</mat-option><mat-option value="Submitted">Submitted</mat-option><mat-option value="Approved">Approved</mat-option><mat-option value="Received">Received</mat-option></mat-select></mat-form-field>
        </div>
        <table mat-table [dataSource]="orders">
          <ng-container matColumnDef="poNumber"><th mat-header-cell *matHeaderCellDef>PO Number</th><td mat-cell *matCellDef="let o">{{ o.poNumber }}</td></ng-container>
          <ng-container matColumnDef="supplier"><th mat-header-cell *matHeaderCellDef>Supplier</th><td mat-cell *matCellDef="let o">{{ o.supplierName }}</td></ng-container>
          <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>Date</th><td mat-cell *matCellDef="let o">{{ o.orderDate | date:'mediumDate' }}</td></ng-container>
          <ng-container matColumnDef="total"><th mat-header-cell *matHeaderCellDef>Total</th><td mat-cell *matCellDef="let o">{{ o.totalAmount | currency }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let o"><app-status-badge [status]="o.status"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let o"><button mat-icon-button [matMenuTriggerFor]="menu"><mat-icon>more_vert</mat-icon></button><mat-menu #menu="matMenu"><button mat-menu-item><mat-icon>visibility</mat-icon> View</button><button mat-menu-item *ngIf="o.status === 'Approved'"><mat-icon>local_shipping</mat-icon> Receive</button></mat-menu></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <mat-paginator [length]="totalCount" [pageSize]="pageSize" [pageSizeOptions]="[10, 25, 50]" (page)="onPage($event)"></mat-paginator>
      </div>
    </app-main-layout>
  `, styles: [".card { background: white; padding: 1.5rem; border-radius: 8px; } .filters { display: flex; gap: 1rem; margin-bottom: 1rem; } table { width: 100%; }"] }]
    }], () => [{ type: i1.ApiService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PurchaseOrdersComponent, { className: "PurchaseOrdersComponent", filePath: "app/features/inventory/purchase-orders/purchase-orders.component.ts", lineNumber: 33 }); })();
//# sourceMappingURL=purchase-orders.component.js.map