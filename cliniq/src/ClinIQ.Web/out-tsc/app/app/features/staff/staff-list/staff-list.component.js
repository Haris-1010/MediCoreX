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
import * as i10 from "../../../shared/components/page-header/page-header.component";
import * as i11 from "../../../shared/components/status-badge/status-badge.component";
import * as i12 from "../../../shared/components/search-input/search-input.component";
import * as i13 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "Staff" });
const _c2 = (a0, a1) => [a0, a1];
const _c3 = () => [10, 25, 50];
function StaffListComponent_mat_option_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 23);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const r_r1 = ctx.$implicit;
    i0.ɵɵproperty("value", r_r1.name);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(r_r1.name);
} }
function StaffListComponent_button_16_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 24);
    i0.ɵɵlistener("click", function StaffListComponent_button_16_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.clearFilters()); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "filter_list_off");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3, " Clear Filters ");
    i0.ɵɵelementEnd();
} }
function StaffListComponent_th_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 25);
    i0.ɵɵtext(1, "Name");
    i0.ɵɵelementEnd();
} }
function StaffListComponent_td_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 26);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const s_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(s_r4.fullName);
} }
function StaffListComponent_th_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 25);
    i0.ɵɵtext(1, "Email");
    i0.ɵɵelementEnd();
} }
function StaffListComponent_td_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 26);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const s_r5 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(s_r5.email);
} }
function StaffListComponent_th_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 25);
    i0.ɵɵtext(1, "Role");
    i0.ɵɵelementEnd();
} }
function StaffListComponent_td_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 26);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const s_r6 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(s_r6.role);
} }
function StaffListComponent_th_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 25);
    i0.ɵɵtext(1, "Department");
    i0.ɵɵelementEnd();
} }
function StaffListComponent_td_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 26);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const s_r7 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(s_r7.departmentName);
} }
function StaffListComponent_th_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 25);
    i0.ɵɵtext(1, "Phone");
    i0.ɵɵelementEnd();
} }
function StaffListComponent_td_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 26);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const s_r8 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(s_r8.phone);
} }
function StaffListComponent_th_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 25);
    i0.ɵɵtext(1, "Status");
    i0.ɵɵelementEnd();
} }
function StaffListComponent_td_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 26);
    i0.ɵɵelement(1, "app-status-badge", 27);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const s_r9 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("status", s_r9.status);
} }
function StaffListComponent_th_37_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "th", 25);
} }
function StaffListComponent_td_38_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 26)(1, "button", 28)(2, "mat-icon");
    i0.ɵɵtext(3, "more_vert");
    i0.ɵɵelementEnd()()();
} }
function StaffListComponent_tr_39_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 29);
} }
function StaffListComponent_tr_40_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 30);
} }
export class StaffListComponent {
    constructor(api, router) {
        this.api = api;
        this.router = router;
        this.staff = [];
        this.columns = ['name', 'email', 'role', 'department', 'phone', 'status', 'actions'];
        this.totalCount = 0;
        this.pageSize = 10;
        this.pageIndex = 0;
        this.searchTerm = '';
        this.filterRole = '';
        this.roles = [];
    }
    ngOnInit() { this.load(); }
    ngAfterViewInit() { this.loadRoles(); }
    loadRoles() {
        this.api.get('v1/roles').subscribe({ next: r => this.roles = r, error: () => this.roles = [] });
    }
    load() {
        this.api.get('v1/staff', { pageNumber: this.pageIndex + 1, pageSize: this.pageSize, searchTerm: this.searchTerm, role: this.filterRole })
            .subscribe(r => { this.staff = r.items; this.totalCount = r.totalCount; });
    }
    onSearch(term) { this.searchTerm = term; this.pageIndex = 0; this.load(); }
    onPage(e) { this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.load(); }
    addStaff() { this.router.navigate(['/staff/new']); }
    hasActiveFilters() {
        return !!(this.searchTerm || this.filterRole);
    }
    clearFilters() {
        this.searchTerm = '';
        this.filterRole = '';
        this.pageIndex = 0;
        this.load();
    }
    static { this.ɵfac = function StaffListComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StaffListComponent)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.Router)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StaffListComponent, selectors: [["app-staff-list"]], standalone: false, decls: 42, vars: 16, consts: [["title", "Staff Management", 3, "breadcrumbs"], ["mat-raised-button", "", "color", "primary", 3, "click"], [1, "card"], [1, "filters"], ["placeholder", "Search staff...", 3, "search"], ["appearance", "outline"], [3, "valueChange", "selectionChange", "value"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], ["mat-stroked-button", "", 3, "click", 4, "ngIf"], ["mat-table", "", 3, "dataSource"], ["matColumnDef", "name"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "email"], ["matColumnDef", "role"], ["matColumnDef", "department"], ["matColumnDef", "phone"], ["matColumnDef", "status"], ["matColumnDef", "actions"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], [3, "page", "length", "pageSize", "pageSizeOptions"], [3, "value"], ["mat-stroked-button", "", 3, "click"], ["mat-header-cell", ""], ["mat-cell", ""], [3, "status"], ["mat-icon-button", ""], ["mat-header-row", ""], ["mat-row", ""]], template: function StaffListComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout")(1, "app-page-header", 0)(2, "button", 1);
            i0.ɵɵlistener("click", function StaffListComponent_Template_button_click_2_listener() { return ctx.addStaff(); });
            i0.ɵɵelementStart(3, "mat-icon");
            i0.ɵɵtext(4, "add");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(5, " Add Staff");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "div", 2)(7, "div", 3)(8, "app-search-input", 4);
            i0.ɵɵlistener("search", function StaffListComponent_Template_app_search_input_search_8_listener($event) { return ctx.onSearch($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "mat-form-field", 5)(10, "mat-label");
            i0.ɵɵtext(11, "Role");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "mat-select", 6);
            i0.ɵɵtwoWayListener("valueChange", function StaffListComponent_Template_mat_select_valueChange_12_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.filterRole, $event) || (ctx.filterRole = $event); return $event; });
            i0.ɵɵlistener("selectionChange", function StaffListComponent_Template_mat_select_selectionChange_12_listener() { return ctx.load(); });
            i0.ɵɵelementStart(13, "mat-option", 7);
            i0.ɵɵtext(14, "All");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(15, StaffListComponent_mat_option_15_Template, 2, 2, "mat-option", 8);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(16, StaffListComponent_button_16_Template, 4, 0, "button", 9);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "table", 10);
            i0.ɵɵelementContainerStart(18, 11);
            i0.ɵɵtemplate(19, StaffListComponent_th_19_Template, 2, 0, "th", 12)(20, StaffListComponent_td_20_Template, 2, 1, "td", 13);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(21, 14);
            i0.ɵɵtemplate(22, StaffListComponent_th_22_Template, 2, 0, "th", 12)(23, StaffListComponent_td_23_Template, 2, 1, "td", 13);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(24, 15);
            i0.ɵɵtemplate(25, StaffListComponent_th_25_Template, 2, 0, "th", 12)(26, StaffListComponent_td_26_Template, 2, 1, "td", 13);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(27, 16);
            i0.ɵɵtemplate(28, StaffListComponent_th_28_Template, 2, 0, "th", 12)(29, StaffListComponent_td_29_Template, 2, 1, "td", 13);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(30, 17);
            i0.ɵɵtemplate(31, StaffListComponent_th_31_Template, 2, 0, "th", 12)(32, StaffListComponent_td_32_Template, 2, 1, "td", 13);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(33, 18);
            i0.ɵɵtemplate(34, StaffListComponent_th_34_Template, 2, 0, "th", 12)(35, StaffListComponent_td_35_Template, 2, 1, "td", 13);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementContainerStart(36, 19);
            i0.ɵɵtemplate(37, StaffListComponent_th_37_Template, 1, 0, "th", 12)(38, StaffListComponent_td_38_Template, 4, 0, "td", 13);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵtemplate(39, StaffListComponent_tr_39_Template, 1, 0, "tr", 20)(40, StaffListComponent_tr_40_Template, 1, 0, "tr", 21);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(41, "mat-paginator", 22);
            i0.ɵɵlistener("page", function StaffListComponent_Template_mat_paginator_page_41_listener($event) { return ctx.onPage($event); });
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(12, _c2, i0.ɵɵpureFunction0(10, _c0), i0.ɵɵpureFunction0(11, _c1)));
            i0.ɵɵadvance(11);
            i0.ɵɵtwoWayProperty("value", ctx.filterRole);
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("ngForOf", ctx.roles);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.hasActiveFilters());
            i0.ɵɵadvance();
            i0.ɵɵproperty("dataSource", ctx.staff);
            i0.ɵɵadvance(22);
            i0.ɵɵproperty("matHeaderRowDef", ctx.columns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("matRowDefColumns", ctx.columns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("length", ctx.totalCount)("pageSize", ctx.pageSize)("pageSizeOptions", i0.ɵɵpureFunction0(15, _c3));
        } }, dependencies: [i3.NgForOf, i3.NgIf, i4.MatButton, i4.MatIconButton, i5.MatIcon, i6.MatFormField, i6.MatLabel, i7.MatSelect, i7.MatOption, i8.MatTable, i8.MatHeaderCellDef, i8.MatHeaderRowDef, i8.MatColumnDef, i8.MatCellDef, i8.MatRowDef, i8.MatHeaderCell, i8.MatCell, i8.MatHeaderRow, i8.MatRow, i9.MatPaginator, i10.PageHeaderComponent, i11.StatusBadgeComponent, i12.SearchInputComponent, i13.MainLayoutComponent], styles: [".card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; } .filters[_ngcontent-%COMP%] { display: flex; gap: 1rem; margin-bottom: 1rem; } table[_ngcontent-%COMP%] { width: 100%; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StaffListComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-staff-list', template: `
    <app-main-layout>
      <app-page-header title="Staff Management" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Staff' }]">
        <button mat-raised-button color="primary" (click)="addStaff()"><mat-icon>add</mat-icon> Add Staff</button>
      </app-page-header>
      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search staff..." (search)="onSearch($event)"></app-search-input>
          <mat-form-field appearance="outline"><mat-label>Role</mat-label><mat-select [(value)]="filterRole" (selectionChange)="load()"><mat-option value="">All</mat-option><mat-option *ngFor="let r of roles" [value]="r.name">{{ r.name }}</mat-option></mat-select></mat-form-field>
          <button mat-stroked-button (click)="clearFilters()" *ngIf="hasActiveFilters()">
            <mat-icon>filter_list_off</mat-icon> Clear Filters
          </button>
        </div>
        <table mat-table [dataSource]="staff">
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Name</th><td mat-cell *matCellDef="let s">{{ s.fullName }}</td></ng-container>
          <ng-container matColumnDef="email"><th mat-header-cell *matHeaderCellDef>Email</th><td mat-cell *matCellDef="let s">{{ s.email }}</td></ng-container>
          <ng-container matColumnDef="role"><th mat-header-cell *matHeaderCellDef>Role</th><td mat-cell *matCellDef="let s">{{ s.role }}</td></ng-container>
          <ng-container matColumnDef="department"><th mat-header-cell *matHeaderCellDef>Department</th><td mat-cell *matCellDef="let s">{{ s.departmentName }}</td></ng-container>
          <ng-container matColumnDef="phone"><th mat-header-cell *matHeaderCellDef>Phone</th><td mat-cell *matCellDef="let s">{{ s.phone }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let s"><app-status-badge [status]="s.status"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let s"><button mat-icon-button><mat-icon>more_vert</mat-icon></button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <mat-paginator [length]="totalCount" [pageSize]="pageSize" [pageSizeOptions]="[10, 25, 50]" (page)="onPage($event)"></mat-paginator>
      </div>
    </app-main-layout>
  `, styles: [".card { background: white; padding: 1.5rem; border-radius: 8px; } .filters { display: flex; gap: 1rem; margin-bottom: 1rem; } table { width: 100%; }"] }]
    }], () => [{ type: i1.ApiService }, { type: i2.Router }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StaffListComponent, { className: "StaffListComponent", filePath: "app/features/staff/staff-list/staff-list.component.ts", lineNumber: 38 }); })();
//# sourceMappingURL=staff-list.component.js.map