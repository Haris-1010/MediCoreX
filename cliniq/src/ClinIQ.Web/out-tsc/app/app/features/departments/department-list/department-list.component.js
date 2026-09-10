import { Component } from '@angular/core';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "@angular/router";
import * as i3 from "@angular/material/dialog";
import * as i4 from "../../../core/services/notification.service";
import * as i5 from "@angular/common";
import * as i6 from "@angular/material/button";
import * as i7 from "@angular/material/icon";
import * as i8 from "@angular/material/table";
import * as i9 from "@angular/material/menu";
import * as i10 from "@angular/material/progress-spinner";
import * as i11 from "../../../shared/components/page-header/page-header.component";
import * as i12 from "../../../shared/components/search-input/search-input.component";
import * as i13 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "Departments" });
const _c2 = (a0, a1) => [a0, a1];
function DepartmentListComponent_button_9_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 10);
    i0.ɵɵlistener("click", function DepartmentListComponent_button_9_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.clearFilters()); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2, "filter_list_off");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3, " Clear ");
    i0.ɵɵelementEnd();
} }
function DepartmentListComponent_div_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 11);
    i0.ɵɵelement(1, "mat-spinner", 12);
    i0.ɵɵelementEnd();
} }
function DepartmentListComponent_div_11_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 13)(1, "mat-icon", 14);
    i0.ɵɵtext(2, "business");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "h3");
    i0.ɵɵtext(4, "No Departments");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p");
    i0.ɵɵtext(6, "Get started by creating your first department.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 2);
    i0.ɵɵlistener("click", function DepartmentListComponent_div_11_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.addDepartment()); });
    i0.ɵɵelementStart(8, "mat-icon");
    i0.ɵɵtext(9, "add");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(10, " Add Department ");
    i0.ɵɵelementEnd()();
} }
function DepartmentListComponent_table_12_th_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 25);
    i0.ɵɵtext(1, "Department Name");
    i0.ɵɵelementEnd();
} }
function DepartmentListComponent_table_12_td_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 26)(1, "div", 27)(2, "div", 28);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div")(5, "div", 29);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "div", 30);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const d_r4 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(d_r4.name.charAt(0));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(d_r4.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(d_r4.code);
} }
function DepartmentListComponent_table_12_th_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 25);
    i0.ɵɵtext(1, "Description");
    i0.ɵɵelementEnd();
} }
function DepartmentListComponent_table_12_td_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 26);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const d_r5 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(d_r5.description || "\u2014");
} }
function DepartmentListComponent_table_12_th_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 25);
    i0.ɵɵtext(1, "Head of Department");
    i0.ɵɵelementEnd();
} }
function DepartmentListComponent_table_12_td_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 26);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const d_r6 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(d_r6.headOfDepartment || "\u2014");
} }
function DepartmentListComponent_table_12_th_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 25);
    i0.ɵɵtext(1, "Status");
    i0.ɵɵelementEnd();
} }
function DepartmentListComponent_table_12_td_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 26)(1, "span", 31);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const d_r7 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵclassProp("active", d_r7.isActive)("inactive", !d_r7.isActive);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", d_r7.isActive ? "Active" : "Inactive", " ");
} }
function DepartmentListComponent_table_12_th_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "th", 25);
} }
function DepartmentListComponent_table_12_td_15_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "td", 26)(1, "button", 32)(2, "mat-icon");
    i0.ɵɵtext(3, "more_vert");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "mat-menu", null, 0)(6, "button", 33);
    i0.ɵɵlistener("click", function DepartmentListComponent_table_12_td_15_Template_button_click_6_listener() { const d_r9 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.editDepartment(d_r9)); });
    i0.ɵɵelementStart(7, "mat-icon");
    i0.ɵɵtext(8, "edit");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(9, " Edit ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "button", 34);
    i0.ɵɵlistener("click", function DepartmentListComponent_table_12_td_15_Template_button_click_10_listener() { const d_r9 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.deleteDepartment(d_r9)); });
    i0.ɵɵelementStart(11, "mat-icon", 35);
    i0.ɵɵtext(12, "delete");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(13, " Delete ");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const menu_r10 = i0.ɵɵreference(5);
    i0.ɵɵadvance();
    i0.ɵɵproperty("matMenuTriggerFor", menu_r10);
} }
function DepartmentListComponent_table_12_tr_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 36);
} }
function DepartmentListComponent_table_12_tr_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 37);
} }
function DepartmentListComponent_table_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "table", 15);
    i0.ɵɵelementContainerStart(1, 16);
    i0.ɵɵtemplate(2, DepartmentListComponent_table_12_th_2_Template, 2, 0, "th", 17)(3, DepartmentListComponent_table_12_td_3_Template, 9, 3, "td", 18);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(4, 19);
    i0.ɵɵtemplate(5, DepartmentListComponent_table_12_th_5_Template, 2, 0, "th", 17)(6, DepartmentListComponent_table_12_td_6_Template, 2, 1, "td", 18);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(7, 20);
    i0.ɵɵtemplate(8, DepartmentListComponent_table_12_th_8_Template, 2, 0, "th", 17)(9, DepartmentListComponent_table_12_td_9_Template, 2, 1, "td", 18);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(10, 21);
    i0.ɵɵtemplate(11, DepartmentListComponent_table_12_th_11_Template, 2, 0, "th", 17)(12, DepartmentListComponent_table_12_td_12_Template, 3, 5, "td", 18);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(13, 22);
    i0.ɵɵtemplate(14, DepartmentListComponent_table_12_th_14_Template, 1, 0, "th", 17)(15, DepartmentListComponent_table_12_td_15_Template, 14, 1, "td", 18);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵtemplate(16, DepartmentListComponent_table_12_tr_16_Template, 1, 0, "tr", 23)(17, DepartmentListComponent_table_12_tr_17_Template, 1, 0, "tr", 24);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("dataSource", ctx_r1.filteredDepartments);
    i0.ɵɵadvance(16);
    i0.ɵɵproperty("matHeaderRowDef", ctx_r1.columns);
    i0.ɵɵadvance();
    i0.ɵɵproperty("matRowDefColumns", ctx_r1.columns);
} }
export class DepartmentListComponent {
    constructor(api, router, dialog, notification) {
        this.api = api;
        this.router = router;
        this.dialog = dialog;
        this.notification = notification;
        this.departments = [];
        this.filteredDepartments = [];
        this.loading = false;
        this.searchTerm = '';
        this.columns = ['name', 'description', 'head', 'status', 'actions'];
    }
    ngOnInit() {
        this.load();
    }
    load() {
        this.loading = true;
        this.api.get('v1/departments').subscribe({
            next: (data) => {
                this.departments = data;
                this.applyFilter();
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.notification.error('Failed to load departments');
            }
        });
    }
    onSearch(term) {
        this.searchTerm = term;
        this.applyFilter();
    }
    applyFilter() {
        if (!this.searchTerm) {
            this.filteredDepartments = [...this.departments];
            return;
        }
        const term = this.searchTerm.toLowerCase();
        this.filteredDepartments = this.departments.filter(d => d.name.toLowerCase().includes(term) ||
            (d.code && d.code.toLowerCase().includes(term)) ||
            (d.description && d.description.toLowerCase().includes(term)));
    }
    clearFilters() {
        this.searchTerm = '';
        this.filteredDepartments = [...this.departments];
    }
    addDepartment() {
        this.router.navigate(['/departments/new']);
    }
    editDepartment(dept) {
        this.router.navigate(['/departments/edit', dept.id]);
    }
    deleteDepartment(dept) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Delete Department',
                message: `Are you sure you want to delete "${dept.name}"? This action cannot be undone.`,
                confirmText: 'Delete',
                cancelText: 'Cancel'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.api.delete('v1/departments', dept.id).subscribe({
                    next: () => {
                        this.notification.success('Department deleted successfully');
                        this.load();
                    },
                    error: () => {
                        this.notification.error('Failed to delete department');
                    }
                });
            }
        });
    }
    static { this.ɵfac = function DepartmentListComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DepartmentListComponent)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.Router), i0.ɵɵdirectiveInject(i3.MatDialog), i0.ɵɵdirectiveInject(i4.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: DepartmentListComponent, selectors: [["app-department-list"]], standalone: false, decls: 13, vars: 10, consts: [["menu", "matMenu"], ["title", "Departments", 3, "breadcrumbs"], ["mat-raised-button", "", "color", "primary", 3, "click"], [1, "card"], [1, "filters"], ["placeholder", "Search departments...", 3, "search"], ["mat-stroked-button", "", 3, "click", 4, "ngIf"], ["class", "loading-container", 4, "ngIf"], ["class", "empty-state", 4, "ngIf"], ["mat-table", "", 3, "dataSource", 4, "ngIf"], ["mat-stroked-button", "", 3, "click"], [1, "loading-container"], ["diameter", "40"], [1, "empty-state"], [1, "empty-icon"], ["mat-table", "", 3, "dataSource"], ["matColumnDef", "name"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "description"], ["matColumnDef", "head"], ["matColumnDef", "status"], ["matColumnDef", "actions"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", ""], ["mat-cell", ""], [1, "dept-name"], [1, "dept-avatar"], [1, "dept-title"], [1, "dept-code"], [1, "status-chip"], ["mat-icon-button", "", 3, "matMenuTriggerFor"], ["mat-menu-item", "", 3, "click"], ["mat-menu-item", "", 1, "delete-action", 3, "click"], ["color", "warn"], ["mat-header-row", ""], ["mat-row", ""]], template: function DepartmentListComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout")(1, "app-page-header", 1)(2, "button", 2);
            i0.ɵɵlistener("click", function DepartmentListComponent_Template_button_click_2_listener() { return ctx.addDepartment(); });
            i0.ɵɵelementStart(3, "mat-icon");
            i0.ɵɵtext(4, "add");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(5, " Add Department ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "div", 3)(7, "div", 4)(8, "app-search-input", 5);
            i0.ɵɵlistener("search", function DepartmentListComponent_Template_app_search_input_search_8_listener($event) { return ctx.onSearch($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(9, DepartmentListComponent_button_9_Template, 4, 0, "button", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(10, DepartmentListComponent_div_10_Template, 2, 0, "div", 7)(11, DepartmentListComponent_div_11_Template, 11, 0, "div", 8)(12, DepartmentListComponent_table_12_Template, 18, 3, "table", 9);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(7, _c2, i0.ɵɵpureFunction0(5, _c0), i0.ɵɵpureFunction0(6, _c1)));
            i0.ɵɵadvance(8);
            i0.ɵɵproperty("ngIf", ctx.searchTerm);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading && ctx.filteredDepartments.length === 0);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading && ctx.filteredDepartments.length > 0);
        } }, dependencies: [i5.NgIf, i6.MatButton, i6.MatIconButton, i7.MatIcon, i8.MatTable, i8.MatHeaderCellDef, i8.MatHeaderRowDef, i8.MatColumnDef, i8.MatCellDef, i8.MatRowDef, i8.MatHeaderCell, i8.MatCell, i8.MatHeaderRow, i8.MatRow, i9.MatMenu, i9.MatMenuItem, i9.MatMenuTrigger, i10.MatProgressSpinner, i11.PageHeaderComponent, i12.SearchInputComponent, i13.MainLayoutComponent], styles: [".card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; }\n    .filters[_ngcontent-%COMP%] { display: flex; gap: 1rem; margin-bottom: 1rem; align-items: center; }\n    table[_ngcontent-%COMP%] { width: 100%; }\n\n    .loading-container[_ngcontent-%COMP%] { display: flex; justify-content: center; padding: 3rem; }\n\n    .empty-state[_ngcontent-%COMP%] { text-align: center; padding: 3rem; color: #666; }\n    .empty-icon[_ngcontent-%COMP%] { font-size: 48px; width: 48px; height: 48px; color: #ccc; margin-bottom: 1rem; }\n    .empty-state[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0 0 0.5rem; color: #333; }\n    .empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0 0 1.5rem; }\n\n    .dept-name[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 0.75rem; }\n    .dept-avatar[_ngcontent-%COMP%] {\n      width: 36px; height: 36px; border-radius: 8px;\n      background: linear-gradient(135deg, #1a237e, #0d47a1);\n      color: white; display: flex; align-items: center; justify-content: center;\n      font-weight: 700; font-size: 0.9rem;\n    }\n    .dept-title[_ngcontent-%COMP%] { font-weight: 600; font-size: 0.9rem; }\n    .dept-code[_ngcontent-%COMP%] { font-size: 0.75rem; color: #999; }\n\n    .status-chip[_ngcontent-%COMP%] {\n      display: inline-block; padding: 0.15rem 0.6rem; border-radius: 12px;\n      font-size: 0.75rem; font-weight: 600;\n    }\n    .status-chip.active[_ngcontent-%COMP%] { background: #e8f5e9; color: #2e7d32; }\n    .status-chip.inactive[_ngcontent-%COMP%] { background: #ffebee; color: #c62828; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DepartmentListComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-department-list', template: `
    <app-main-layout>
      <app-page-header title="Departments" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Departments' }]">
        <button mat-raised-button color="primary" (click)="addDepartment()">
          <mat-icon>add</mat-icon> Add Department
        </button>
      </app-page-header>

      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search departments..." (search)="onSearch($event)"></app-search-input>
          <button mat-stroked-button (click)="clearFilters()" *ngIf="searchTerm">
            <mat-icon>filter_list_off</mat-icon> Clear
          </button>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && filteredDepartments.length === 0" class="empty-state">
          <mat-icon class="empty-icon">business</mat-icon>
          <h3>No Departments</h3>
          <p>Get started by creating your first department.</p>
          <button mat-raised-button color="primary" (click)="addDepartment()">
            <mat-icon>add</mat-icon> Add Department
          </button>
        </div>

        <!-- Table -->
        <table mat-table [dataSource]="filteredDepartments" *ngIf="!loading && filteredDepartments.length > 0">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Department Name</th>
            <td mat-cell *matCellDef="let d">
              <div class="dept-name">
                <div class="dept-avatar">{{ d.name.charAt(0) }}</div>
                <div>
                  <div class="dept-title">{{ d.name }}</div>
                  <div class="dept-code">{{ d.code }}</div>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let d">{{ d.description || '—' }}</td>
          </ng-container>

          <ng-container matColumnDef="head">
            <th mat-header-cell *matHeaderCellDef>Head of Department</th>
            <td mat-cell *matCellDef="let d">{{ d.headOfDepartment || '—' }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let d">
              <span class="status-chip" [class.active]="d.isActive" [class.inactive]="!d.isActive">
                {{ d.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let d">
              <button mat-icon-button [matMenuTriggerFor]="menu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="editDepartment(d)">
                  <mat-icon>edit</mat-icon> Edit
                </button>
                <button mat-menu-item (click)="deleteDepartment(d)" class="delete-action">
                  <mat-icon color="warn">delete</mat-icon> Delete
                </button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
      </div>
    </app-main-layout>
  `, styles: ["\n    .card { background: white; padding: 1.5rem; border-radius: 8px; }\n    .filters { display: flex; gap: 1rem; margin-bottom: 1rem; align-items: center; }\n    table { width: 100%; }\n\n    .loading-container { display: flex; justify-content: center; padding: 3rem; }\n\n    .empty-state { text-align: center; padding: 3rem; color: #666; }\n    .empty-icon { font-size: 48px; width: 48px; height: 48px; color: #ccc; margin-bottom: 1rem; }\n    .empty-state h3 { margin: 0 0 0.5rem; color: #333; }\n    .empty-state p { margin: 0 0 1.5rem; }\n\n    .dept-name { display: flex; align-items: center; gap: 0.75rem; }\n    .dept-avatar {\n      width: 36px; height: 36px; border-radius: 8px;\n      background: linear-gradient(135deg, #1a237e, #0d47a1);\n      color: white; display: flex; align-items: center; justify-content: center;\n      font-weight: 700; font-size: 0.9rem;\n    }\n    .dept-title { font-weight: 600; font-size: 0.9rem; }\n    .dept-code { font-size: 0.75rem; color: #999; }\n\n    .status-chip {\n      display: inline-block; padding: 0.15rem 0.6rem; border-radius: 12px;\n      font-size: 0.75rem; font-weight: 600;\n    }\n    .status-chip.active { background: #e8f5e9; color: #2e7d32; }\n    .status-chip.inactive { background: #ffebee; color: #c62828; }\n  "] }]
    }], () => [{ type: i1.ApiService }, { type: i2.Router }, { type: i3.MatDialog }, { type: i4.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(DepartmentListComponent, { className: "DepartmentListComponent", filePath: "app/features/departments/department-list/department-list.component.ts", lineNumber: 129 }); })();
//# sourceMappingURL=department-list.component.js.map