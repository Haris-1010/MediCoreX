import { Component } from '@angular/core';
import { ItemDialogComponent } from '../item-dialog/item-dialog.component';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "@angular/material/dialog";
import * as i3 from "@angular/common";
import * as i4 from "@angular/material/button";
import * as i5 from "@angular/material/icon";
import * as i6 from "@angular/material/input";
import * as i7 from "@angular/material/select";
import * as i8 from "@angular/material/table";
import * as i9 from "@angular/material/paginator";
import * as i10 from "@angular/material/menu";
import * as i11 from "../../../shared/components/page-header/page-header.component";
import * as i12 from "../../../shared/components/search-input/search-input.component";
import * as i13 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Inventory", route: "/inventory" });
const _c1 = () => ({ label: "Items" });
const _c2 = (a0, a1) => [a0, a1];
const _c3 = () => [10, 25, 50];
function ItemListComponent_mat_option_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 28);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const c_r1 = ctx.$implicit;
    i0.ɵɵproperty("value", c_r1.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(c_r1.name);
} }
function ItemListComponent_button_28_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 29);
    i0.ɵɵlistener("click", function ItemListComponent_button_28_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.clearFilters()); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "filter_list_off");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3, " Clear Filters ");
    i0.ɵɵelementEnd();
} }
function ItemListComponent_th_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 30);
    i0.ɵɵtext(1, "Item Name");
    i0.ɵɵelementEnd();
} }
function ItemListComponent_td_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 31);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const i_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i_r4.name);
} }
function ItemListComponent_th_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 30);
    i0.ɵɵtext(1, "SKU");
    i0.ɵɵelementEnd();
} }
function ItemListComponent_td_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 31);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const i_r5 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i_r5.sku);
} }
function ItemListComponent_th_37_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 30);
    i0.ɵɵtext(1, "Category");
    i0.ɵɵelementEnd();
} }
function ItemListComponent_td_38_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 31);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const i_r6 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i_r6.categoryName);
} }
function ItemListComponent_th_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 30);
    i0.ɵɵtext(1, "Quantity");
    i0.ɵɵelementEnd();
} }
function ItemListComponent_td_41_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 31);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const i_r7 = ctx.$implicit;
    i0.ɵɵclassProp("low", i_r7.quantity <= i_r7.reorderLevel)("out", i_r7.quantity === 0);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("", i_r7.quantity, " ", i_r7.unit, "");
} }
function ItemListComponent_th_43_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 30);
    i0.ɵɵtext(1, "Reorder Level");
    i0.ɵɵelementEnd();
} }
function ItemListComponent_td_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 31);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const i_r8 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i_r8.reorderLevel);
} }
function ItemListComponent_th_46_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 30);
    i0.ɵɵtext(1, "Unit Price");
    i0.ɵɵelementEnd();
} }
function ItemListComponent_td_47_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 31);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "currency");
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const i_r9 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(2, 1, i_r9.unitPrice));
} }
function ItemListComponent_th_49_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "th", 30);
} }
function ItemListComponent_td_50_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "td", 31)(1, "button", 32)(2, "mat-icon");
    i0.ɵɵtext(3, "more_vert");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "mat-menu", null, 0)(6, "button", 33);
    i0.ɵɵlistener("click", function ItemListComponent_td_50_Template_button_click_6_listener() { const i_r11 = i0.ɵɵrestoreView(_r10).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.openItemDialog(i_r11)); });
    i0.ɵɵelementStart(7, "mat-icon");
    i0.ɵɵtext(8, "edit");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(9, " Edit");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "button", 33);
    i0.ɵɵlistener("click", function ItemListComponent_td_50_Template_button_click_10_listener() { const i_r11 = i0.ɵɵrestoreView(_r10).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.adjustStock(i_r11)); });
    i0.ɵɵelementStart(11, "mat-icon");
    i0.ɵɵtext(12, "tune");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(13, " Adjust Stock");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const menu_r12 = i0.ɵɵreference(5);
    i0.ɵɵadvance();
    i0.ɵɵproperty("matMenuTriggerFor", menu_r12);
} }
function ItemListComponent_tr_51_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 34);
} }
function ItemListComponent_tr_52_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 35);
} }
export class ItemListComponent {
    constructor(api, dialog) {
        this.api = api;
        this.dialog = dialog;
        this.items = [];
        this.categories = [];
        this.columns = ['name', 'sku', 'category', 'quantity', 'reorderLevel', 'unitPrice', 'actions'];
        this.totalCount = 0;
        this.pageSize = 10;
        this.pageIndex = 0;
        this.searchTerm = '';
        this.filterCategory = '';
        this.filterStatus = '';
    }
    ngOnInit() { this.load(); this.api.get('v1/inventory/categories').subscribe(r => this.categories = r); }
    load() {
        this.api.get('v1/inventory/items', { pageNumber: this.pageIndex + 1, pageSize: this.pageSize, searchTerm: this.searchTerm, categoryId: this.filterCategory, status: this.filterStatus })
            .subscribe(r => { this.items = r.items; this.totalCount = r.totalCount; });
    }
    onSearch(term) { this.searchTerm = term; this.pageIndex = 0; this.load(); }
    onPage(e) { this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.load(); }
    openItemDialog(item) {
        const dialogRef = this.dialog.open(ItemDialogComponent, {
            data: { item, mode: item ? 'edit' : 'add' },
            width: '500px'
        });
        dialogRef.afterClosed().subscribe(result => { if (result)
            this.load(); });
    }
    adjustStock(item) {
        const dialogRef = this.dialog.open(ItemDialogComponent, {
            data: { item, mode: 'adjust' },
            width: '450px'
        });
        dialogRef.afterClosed().subscribe(result => { if (result)
            this.load(); });
    }
    hasActiveFilters() {
        return !!(this.searchTerm || this.filterCategory || this.filterStatus);
    }
    clearFilters() {
        this.searchTerm = '';
        this.filterCategory = '';
        this.filterStatus = '';
        this.pageIndex = 0;
        this.load();
    }
    static { this.ɵfac = function ItemListComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ItemListComponent)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.MatDialog)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ItemListComponent, selectors: [["app-item-list"]], standalone: false, decls: 54, vars: 17, consts: [["menu", "matMenu"], ["title", "Inventory Items", 3, "breadcrumbs"], ["mat-raised-button", "", "color", "primary", 3, "click"], [1, "card"], [1, "filters"], ["placeholder", "Search items...", 3, "search"], ["appearance", "outline"], [3, "valueChange", "selectionChange", "value"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], ["value", "InStock"], ["value", "LowStock"], ["value", "OutOfStock"], ["mat-stroked-button", "", 3, "click", 4, "ngIf"], ["mat-table", "", 3, "dataSource"], ["matColumnDef", "name"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "sku"], ["matColumnDef", "category"], ["matColumnDef", "quantity"], ["mat-cell", "", 3, "low", "out", 4, "matCellDef"], ["matColumnDef", "reorderLevel"], ["matColumnDef", "unitPrice"], ["matColumnDef", "actions"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], [3, "page", "length", "pageSize", "pageSizeOptions"], [3, "value"], ["mat-stroked-button", "", 3, "click"], ["mat-header-cell", ""], ["mat-cell", ""], ["mat-icon-button", "", 3, "matMenuTriggerFor"], ["mat-menu-item", "", 3, "click"], ["mat-header-row", ""], ["mat-row", ""]], template: function ItemListComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout")(1, "app-page-header", 1)(2, "button", 2);
            i0.ɵɵlistener("click", function ItemListComponent_Template_button_click_2_listener() { return ctx.openItemDialog(); });
            i0.ɵɵelementStart(3, "mat-icon");
            i0.ɵɵtext(4, "add");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(5, " Add Item");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "div", 3)(7, "div", 4)(8, "app-search-input", 5);
            i0.ɵɵlistener("search", function ItemListComponent_Template_app_search_input_search_8_listener($event) { return ctx.onSearch($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "mat-form-field", 6)(10, "mat-label");
            i0.ɵɵtext(11, "Category");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "mat-select", 7);
            i0.ɵɵtwoWayListener("valueChange", function ItemListComponent_Template_mat_select_valueChange_12_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.filterCategory, $event) || (ctx.filterCategory = $event); return $event; });
            i0.ɵɵlistener("selectionChange", function ItemListComponent_Template_mat_select_selectionChange_12_listener() { return ctx.load(); });
            i0.ɵɵelementStart(13, "mat-option", 8);
            i0.ɵɵtext(14, "All");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(15, ItemListComponent_mat_option_15_Template, 2, 2, "mat-option", 9);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(16, "mat-form-field", 6)(17, "mat-label");
            i0.ɵɵtext(18, "Status");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "mat-select", 7);
            i0.ɵɵtwoWayListener("valueChange", function ItemListComponent_Template_mat_select_valueChange_19_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.filterStatus, $event) || (ctx.filterStatus = $event); return $event; });
            i0.ɵɵlistener("selectionChange", function ItemListComponent_Template_mat_select_selectionChange_19_listener() { return ctx.load(); });
            i0.ɵɵelementStart(20, "mat-option", 8);
            i0.ɵɵtext(21, "All");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "mat-option", 10);
            i0.ɵɵtext(23, "In Stock");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "mat-option", 11);
            i0.ɵɵtext(25, "Low Stock");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "mat-option", 12);
            i0.ɵɵtext(27, "Out of Stock");
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(28, ItemListComponent_button_28_Template, 4, 0, "button", 13);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "table", 14);
            i0.ɵɵelementContainerStart(30, 15);
            i0.ɵɵtemplate(31, ItemListComponent_th_31_Template, 2, 0, "th", 16)(32, ItemListComponent_td_32_Template, 2, 1, "td", 17);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(33, 18);
            i0.ɵɵtemplate(34, ItemListComponent_th_34_Template, 2, 0, "th", 16)(35, ItemListComponent_td_35_Template, 2, 1, "td", 17);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(36, 19);
            i0.ɵɵtemplate(37, ItemListComponent_th_37_Template, 2, 0, "th", 16)(38, ItemListComponent_td_38_Template, 2, 1, "td", 17);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(39, 20);
            i0.ɵɵtemplate(40, ItemListComponent_th_40_Template, 2, 0, "th", 16)(41, ItemListComponent_td_41_Template, 2, 6, "td", 21);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(42, 22);
            i0.ɵɵtemplate(43, ItemListComponent_th_43_Template, 2, 0, "th", 16)(44, ItemListComponent_td_44_Template, 2, 1, "td", 17);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(45, 23);
            i0.ɵɵtemplate(46, ItemListComponent_th_46_Template, 2, 0, "th", 16)(47, ItemListComponent_td_47_Template, 3, 3, "td", 17);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(48, 24);
            i0.ɵɵtemplate(49, ItemListComponent_th_49_Template, 1, 0, "th", 16)(50, ItemListComponent_td_50_Template, 14, 1, "td", 17);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵtemplate(51, ItemListComponent_tr_51_Template, 1, 0, "tr", 25)(52, ItemListComponent_tr_52_Template, 1, 0, "tr", 26);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(53, "mat-paginator", 27);
            i0.ɵɵlistener("page", function ItemListComponent_Template_mat_paginator_page_53_listener($event) { return ctx.onPage($event); });
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(13, _c2, i0.ɵɵpureFunction0(11, _c0), i0.ɵɵpureFunction0(12, _c1)));
            i0.ɵɵadvance(11);
            i0.ɵɵtwoWayProperty("value", ctx.filterCategory);
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("ngForOf", ctx.categories);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("value", ctx.filterStatus);
            i0.ɵɵadvance(9);
            i0.ɵɵproperty("ngIf", ctx.hasActiveFilters());
            i0.ɵɵadvance();
            i0.ɵɵproperty("dataSource", ctx.items);
            i0.ɵɵadvance(22);
            i0.ɵɵproperty("matHeaderRowDef", ctx.columns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("matRowDefColumns", ctx.columns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("length", ctx.totalCount)("pageSize", ctx.pageSize)("pageSizeOptions", i0.ɵɵpureFunction0(16, _c3));
        } }, dependencies: [i3.NgForOf, i3.NgIf, i4.MatButton, i4.MatIconButton, i5.MatIcon, i6.MatFormField, i6.MatLabel, i7.MatSelect, i7.MatOption, i8.MatTable, i8.MatHeaderCellDef, i8.MatHeaderRowDef, i8.MatColumnDef, i8.MatCellDef, i8.MatRowDef, i8.MatHeaderCell, i8.MatCell, i8.MatHeaderRow, i8.MatRow, i9.MatPaginator, i10.MatMenu, i10.MatMenuItem, i10.MatMenuTrigger, i11.PageHeaderComponent, i12.SearchInputComponent, i13.MainLayoutComponent, i3.CurrencyPipe], styles: [".card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; } .filters[_ngcontent-%COMP%] { display: flex; gap: 1rem; margin-bottom: 1rem; } table[_ngcontent-%COMP%] { width: 100%; } .low[_ngcontent-%COMP%] { color: #ff9800; font-weight: 600; } .out[_ngcontent-%COMP%] { color: #f44336; font-weight: 600; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ItemListComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-item-list', template: `
    <app-main-layout>
      <app-page-header title="Inventory Items" [breadcrumbs]="[{ label: 'Inventory', route: '/inventory' }, { label: 'Items' }]">
        <button mat-raised-button color="primary" (click)="openItemDialog()"><mat-icon>add</mat-icon> Add Item</button>
      </app-page-header>
      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search items..." (search)="onSearch($event)"></app-search-input>
          <mat-form-field appearance="outline"><mat-label>Category</mat-label><mat-select [(value)]="filterCategory" (selectionChange)="load()"><mat-option value="">All</mat-option><mat-option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</mat-option></mat-select></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Status</mat-label><mat-select [(value)]="filterStatus" (selectionChange)="load()"><mat-option value="">All</mat-option><mat-option value="InStock">In Stock</mat-option><mat-option value="LowStock">Low Stock</mat-option><mat-option value="OutOfStock">Out of Stock</mat-option></mat-select></mat-form-field>
          <button mat-stroked-button (click)="clearFilters()" *ngIf="hasActiveFilters()">
            <mat-icon>filter_list_off</mat-icon> Clear Filters
          </button>
        </div>
        <table mat-table [dataSource]="items">
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Item Name</th><td mat-cell *matCellDef="let i">{{ i.name }}</td></ng-container>
          <ng-container matColumnDef="sku"><th mat-header-cell *matHeaderCellDef>SKU</th><td mat-cell *matCellDef="let i">{{ i.sku }}</td></ng-container>
          <ng-container matColumnDef="category"><th mat-header-cell *matHeaderCellDef>Category</th><td mat-cell *matCellDef="let i">{{ i.categoryName }}</td></ng-container>
          <ng-container matColumnDef="quantity"><th mat-header-cell *matHeaderCellDef>Quantity</th><td mat-cell *matCellDef="let i" [class.low]="i.quantity <= i.reorderLevel" [class.out]="i.quantity === 0">{{ i.quantity }} {{ i.unit }}</td></ng-container>
          <ng-container matColumnDef="reorderLevel"><th mat-header-cell *matHeaderCellDef>Reorder Level</th><td mat-cell *matCellDef="let i">{{ i.reorderLevel }}</td></ng-container>
          <ng-container matColumnDef="unitPrice"><th mat-header-cell *matHeaderCellDef>Unit Price</th><td mat-cell *matCellDef="let i">{{ i.unitPrice | currency }}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let i"><button mat-icon-button [matMenuTriggerFor]="menu"><mat-icon>more_vert</mat-icon></button><mat-menu #menu="matMenu"><button mat-menu-item (click)="openItemDialog(i)"><mat-icon>edit</mat-icon> Edit</button><button mat-menu-item (click)="adjustStock(i)"><mat-icon>tune</mat-icon> Adjust Stock</button></mat-menu></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <mat-paginator [length]="totalCount" [pageSize]="pageSize" [pageSizeOptions]="[10, 25, 50]" (page)="onPage($event)"></mat-paginator>
      </div>
    </app-main-layout>
  `, styles: [".card { background: white; padding: 1.5rem; border-radius: 8px; } .filters { display: flex; gap: 1rem; margin-bottom: 1rem; } table { width: 100%; } .low { color: #ff9800; font-weight: 600; } .out { color: #f44336; font-weight: 600; }"] }]
    }], () => [{ type: i1.ApiService }, { type: i2.MatDialog }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ItemListComponent, { className: "ItemListComponent", filePath: "app/features/inventory/item-list/item-list.component.ts", lineNumber: 40 }); })();
//# sourceMappingURL=item-list.component.js.map