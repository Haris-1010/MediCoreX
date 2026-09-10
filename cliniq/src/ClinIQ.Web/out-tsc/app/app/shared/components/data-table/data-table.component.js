import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/material/button";
import * as i3 from "@angular/material/icon";
import * as i4 from "@angular/material/table";
import * as i5 from "@angular/material/paginator";
import * as i6 from "@angular/material/sort";
import * as i7 from "@angular/material/progress-spinner";
import * as i8 from "@angular/material/tooltip";
import * as i9 from "../status-badge/status-badge.component";
import * as i10 from "../empty-state/empty-state.component";
function DataTableComponent_div_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 8);
    i0.ɵɵelement(1, "mat-spinner", 9);
    i0.ɵɵelementEnd();
} }
function DataTableComponent_ng_container_3_th_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 13);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const column_r1 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵstyleProp("width", column_r1.width);
    i0.ɵɵproperty("mat-sort-header", column_r1.sortable !== false ? column_r1.key : "");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", column_r1.label, " ");
} }
function DataTableComponent_ng_container_3_td_2_ng_container_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "date");
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const row_r2 = i0.ɵɵnextContext().$implicit;
    const column_r1 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind2(2, 1, row_r2[column_r1.key], "mediumDate"), " ");
} }
function DataTableComponent_ng_container_3_td_2_ng_container_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtext(1);
    i0.ɵɵpipe(2, "currency");
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const row_r2 = i0.ɵɵnextContext().$implicit;
    const column_r1 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", i0.ɵɵpipeBind1(2, 1, row_r2[column_r1.key]), " ");
} }
function DataTableComponent_ng_container_3_td_2_ng_container_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵelement(1, "app-status-badge", 18);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const row_r2 = i0.ɵɵnextContext().$implicit;
    const column_r1 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("status", row_r2[column_r1.key]);
} }
function DataTableComponent_ng_container_3_td_2_ng_container_5_button_2_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 21);
    i0.ɵɵlistener("click", function DataTableComponent_ng_container_3_td_2_ng_container_5_button_2_Template_button_click_0_listener() { const action_r4 = i0.ɵɵrestoreView(_r3).$implicit; const row_r2 = i0.ɵɵnextContext(2).$implicit; const ctx_r4 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r4.onAction(action_r4.action, row_r2)); });
    i0.ɵɵelementStart(1, "mat-icon");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const action_r4 = ctx.$implicit;
    i0.ɵɵproperty("matTooltip", action_r4.label)("color", action_r4.color);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(action_r4.icon);
} }
function DataTableComponent_ng_container_3_td_2_ng_container_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵelementStart(1, "div", 19);
    i0.ɵɵtemplate(2, DataTableComponent_ng_container_3_td_2_ng_container_5_button_2_Template, 3, 3, "button", 20);
    i0.ɵɵelementEnd();
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r4 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngForOf", ctx_r4.actions);
} }
function DataTableComponent_ng_container_3_td_2_ng_container_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtext(1);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const row_r2 = i0.ɵɵnextContext().$implicit;
    const column_r1 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", row_r2[column_r1.key], " ");
} }
function DataTableComponent_ng_container_3_td_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 14);
    i0.ɵɵelementContainerStart(1, 15);
    i0.ɵɵtemplate(2, DataTableComponent_ng_container_3_td_2_ng_container_2_Template, 3, 4, "ng-container", 16)(3, DataTableComponent_ng_container_3_td_2_ng_container_3_Template, 3, 3, "ng-container", 16)(4, DataTableComponent_ng_container_3_td_2_ng_container_4_Template, 2, 1, "ng-container", 16)(5, DataTableComponent_ng_container_3_td_2_ng_container_5_Template, 3, 1, "ng-container", 16)(6, DataTableComponent_ng_container_3_td_2_ng_container_6_Template, 2, 1, "ng-container", 17);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const column_r1 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngSwitch", column_r1.type);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngSwitchCase", "date");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngSwitchCase", "currency");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngSwitchCase", "status");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngSwitchCase", "actions");
} }
function DataTableComponent_ng_container_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0, 10);
    i0.ɵɵtemplate(1, DataTableComponent_ng_container_3_th_1_Template, 2, 4, "th", 11)(2, DataTableComponent_ng_container_3_td_2_Template, 7, 5, "td", 12);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const column_r1 = ctx.$implicit;
    i0.ɵɵproperty("matColumnDef", column_r1.key);
} }
function DataTableComponent_tr_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 22);
} }
function DataTableComponent_tr_5_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 23);
    i0.ɵɵlistener("click", function DataTableComponent_tr_5_Template_tr_click_0_listener() { const row_r7 = i0.ɵɵrestoreView(_r6).$implicit; const ctx_r4 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r4.onRowClick(row_r7)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r4 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("clickable", ctx_r4.rowClickable);
} }
function DataTableComponent_tr_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 24)(1, "td", 25);
    i0.ɵɵelement(2, "app-empty-state", 26);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r4 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵattribute("colspan", ctx_r4.displayedColumns.length);
    i0.ɵɵadvance();
    i0.ɵɵproperty("icon", ctx_r4.emptyIcon)("title", ctx_r4.emptyTitle)("message", ctx_r4.emptyMessage);
} }
function DataTableComponent_mat_paginator_7_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "mat-paginator", 27);
    i0.ɵɵlistener("page", function DataTableComponent_mat_paginator_7_Template_mat_paginator_page_0_listener($event) { i0.ɵɵrestoreView(_r8); const ctx_r4 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r4.onPageChange($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r4 = i0.ɵɵnextContext();
    i0.ɵɵproperty("length", ctx_r4.totalCount)("pageSize", ctx_r4.pageSize)("pageIndex", ctx_r4.pageIndex)("pageSizeOptions", ctx_r4.pageSizeOptions);
} }
export class DataTableComponent {
    constructor() {
        this.data = [];
        this.columns = [];
        this.actions = [];
        this.loading = false;
        this.paginate = true;
        this.totalCount = 0;
        this.pageSize = 10;
        this.pageIndex = 0;
        this.pageSizeOptions = [5, 10, 25, 50];
        this.rowClickable = false;
        this.emptyIcon = 'inbox';
        this.emptyTitle = 'No data found';
        this.emptyMessage = 'There are no records to display.';
        this.pageChange = new EventEmitter();
        this.sortChange = new EventEmitter();
        this.actionClick = new EventEmitter();
        this.rowClick = new EventEmitter();
        this.dataSource = new MatTableDataSource();
        this.displayedColumns = [];
    }
    ngOnInit() {
        this.displayedColumns = this.columns.map(c => c.key);
    }
    ngAfterViewInit() {
        if (!this.paginate) {
            this.dataSource.paginator = this.paginator;
        }
        this.dataSource.sort = this.sort;
    }
    ngOnChanges() {
        this.dataSource.data = this.data;
    }
    onPageChange(event) {
        this.pageChange.emit(event);
    }
    onSort(sort) {
        this.sortChange.emit(sort);
    }
    onAction(action, row) {
        this.actionClick.emit({ action, row });
    }
    onRowClick(row) {
        if (this.rowClickable) {
            this.rowClick.emit(row);
        }
    }
    static { this.ɵfac = function DataTableComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DataTableComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: DataTableComponent, selectors: [["app-data-table"]], viewQuery: function DataTableComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(MatPaginator, 5);
            i0.ɵɵviewQuery(MatSort, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.paginator = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.sort = _t.first);
        } }, inputs: { data: "data", columns: "columns", actions: "actions", loading: "loading", paginate: "paginate", totalCount: "totalCount", pageSize: "pageSize", pageIndex: "pageIndex", pageSizeOptions: "pageSizeOptions", rowClickable: "rowClickable", emptyIcon: "emptyIcon", emptyTitle: "emptyTitle", emptyMessage: "emptyMessage" }, outputs: { pageChange: "pageChange", sortChange: "sortChange", actionClick: "actionClick", rowClick: "rowClick" }, standalone: false, features: [i0.ɵɵNgOnChangesFeature], decls: 8, vars: 6, consts: [[1, "table-container"], ["class", "table-loading", 4, "ngIf"], ["mat-table", "", "matSort", "", 3, "matSortChange", "dataSource"], [3, "matColumnDef", 4, "ngFor", "ngForOf"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 3, "clickable", "click", 4, "matRowDef", "matRowDefColumns"], ["class", "mat-row", 4, "matNoDataRow"], ["showFirstLastButtons", "", 3, "length", "pageSize", "pageIndex", "pageSizeOptions", "page", 4, "ngIf"], [1, "table-loading"], ["diameter", "40"], [3, "matColumnDef"], ["mat-header-cell", "", 3, "mat-sort-header", "width", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["mat-header-cell", "", 3, "mat-sort-header"], ["mat-cell", ""], [3, "ngSwitch"], [4, "ngSwitchCase"], [4, "ngSwitchDefault"], [3, "status"], [1, "action-buttons"], ["mat-icon-button", "", 3, "matTooltip", "color", "click", 4, "ngFor", "ngForOf"], ["mat-icon-button", "", 3, "click", "matTooltip", "color"], ["mat-header-row", ""], ["mat-row", "", 3, "click"], [1, "mat-row"], [1, "mat-cell", "no-data"], [3, "icon", "title", "message"], ["showFirstLastButtons", "", 3, "page", "length", "pageSize", "pageIndex", "pageSizeOptions"]], template: function DataTableComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵtemplate(1, DataTableComponent_div_1_Template, 2, 0, "div", 1);
            i0.ɵɵelementStart(2, "table", 2);
            i0.ɵɵlistener("matSortChange", function DataTableComponent_Template_table_matSortChange_2_listener($event) { return ctx.onSort($event); });
            i0.ɵɵtemplate(3, DataTableComponent_ng_container_3_Template, 3, 1, "ng-container", 3)(4, DataTableComponent_tr_4_Template, 1, 0, "tr", 4)(5, DataTableComponent_tr_5_Template, 1, 2, "tr", 5)(6, DataTableComponent_tr_6_Template, 3, 4, "tr", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(7, DataTableComponent_mat_paginator_7_Template, 1, 4, "mat-paginator", 7);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("dataSource", ctx.dataSource);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.columns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("matHeaderRowDef", ctx.displayedColumns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("matRowDefColumns", ctx.displayedColumns);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", ctx.paginate);
        } }, dependencies: [i1.NgForOf, i1.NgIf, i1.NgSwitch, i1.NgSwitchCase, i1.NgSwitchDefault, i2.MatIconButton, i3.MatIcon, i4.MatTable, i4.MatHeaderCellDef, i4.MatHeaderRowDef, i4.MatColumnDef, i4.MatCellDef, i4.MatRowDef, i4.MatHeaderCell, i4.MatCell, i4.MatHeaderRow, i4.MatRow, i4.MatNoDataRow, i5.MatPaginator, i6.MatSort, i6.MatSortHeader, i7.MatProgressSpinner, i8.MatTooltip, i9.StatusBadgeComponent, i10.EmptyStateComponent, i1.CurrencyPipe, i1.DatePipe], styles: [".table-container[_ngcontent-%COMP%] {\n      position: relative;\n      background: white;\n      border-radius: 8px;\n      overflow: hidden;\n    }\n\n    .table-loading[_ngcontent-%COMP%] {\n      position: absolute;\n      top: 0;\n      left: 0;\n      right: 0;\n      bottom: 0;\n      background: rgba(255, 255, 255, 0.8);\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      z-index: 10;\n    }\n\n    table[_ngcontent-%COMP%] {\n      width: 100%;\n    }\n\n    .mat-mdc-row.clickable[_ngcontent-%COMP%] {\n      cursor: pointer;\n    }\n\n    .mat-mdc-row.clickable[_ngcontent-%COMP%]:hover {\n      background: #f5f5f5;\n    }\n\n    .action-buttons[_ngcontent-%COMP%] {\n      display: flex;\n      gap: 0.25rem;\n    }\n\n    .no-data[_ngcontent-%COMP%] {\n      text-align: center;\n      padding: 2rem;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DataTableComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-data-table', template: `
    <div class="table-container">
      <div class="table-loading" *ngIf="loading">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <table mat-table [dataSource]="dataSource" matSort (matSortChange)="onSort($event)">
        <ng-container *ngFor="let column of columns" [matColumnDef]="column.key">
          <th mat-header-cell *matHeaderCellDef [mat-sort-header]="column.sortable !== false ? column.key : ''"
              [style.width]="column.width">
            {{ column.label }}
          </th>
          <td mat-cell *matCellDef="let row">
            <ng-container [ngSwitch]="column.type">
              <ng-container *ngSwitchCase="'date'">
                {{ row[column.key] | date:'mediumDate' }}
              </ng-container>
              <ng-container *ngSwitchCase="'currency'">
                {{ row[column.key] | currency }}
              </ng-container>
              <ng-container *ngSwitchCase="'status'">
                <app-status-badge [status]="row[column.key]"></app-status-badge>
              </ng-container>
              <ng-container *ngSwitchCase="'actions'">
                <div class="action-buttons">
                  <button mat-icon-button *ngFor="let action of actions"
                          [matTooltip]="action.label"
                          [color]="action.color"
                          (click)="onAction(action.action, row)">
                    <mat-icon>{{ action.icon }}</mat-icon>
                  </button>
                </div>
              </ng-container>
              <ng-container *ngSwitchDefault>
                {{ row[column.key] }}
              </ng-container>
            </ng-container>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"
            [class.clickable]="rowClickable"
            (click)="onRowClick(row)"></tr>

        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell no-data" [attr.colspan]="displayedColumns.length">
            <app-empty-state
              [icon]="emptyIcon"
              [title]="emptyTitle"
              [message]="emptyMessage">
            </app-empty-state>
          </td>
        </tr>
      </table>

      <mat-paginator *ngIf="paginate"
                     [length]="totalCount"
                     [pageSize]="pageSize"
                     [pageIndex]="pageIndex"
                     [pageSizeOptions]="pageSizeOptions"
                     (page)="onPageChange($event)"
                     showFirstLastButtons>
      </mat-paginator>
    </div>
  `, styles: ["\n    .table-container {\n      position: relative;\n      background: white;\n      border-radius: 8px;\n      overflow: hidden;\n    }\n\n    .table-loading {\n      position: absolute;\n      top: 0;\n      left: 0;\n      right: 0;\n      bottom: 0;\n      background: rgba(255, 255, 255, 0.8);\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      z-index: 10;\n    }\n\n    table {\n      width: 100%;\n    }\n\n    .mat-mdc-row.clickable {\n      cursor: pointer;\n    }\n\n    .mat-mdc-row.clickable:hover {\n      background: #f5f5f5;\n    }\n\n    .action-buttons {\n      display: flex;\n      gap: 0.25rem;\n    }\n\n    .no-data {\n      text-align: center;\n      padding: 2rem;\n    }\n  "] }]
    }], null, { data: [{
            type: Input
        }], columns: [{
            type: Input
        }], actions: [{
            type: Input
        }], loading: [{
            type: Input
        }], paginate: [{
            type: Input
        }], totalCount: [{
            type: Input
        }], pageSize: [{
            type: Input
        }], pageIndex: [{
            type: Input
        }], pageSizeOptions: [{
            type: Input
        }], rowClickable: [{
            type: Input
        }], emptyIcon: [{
            type: Input
        }], emptyTitle: [{
            type: Input
        }], emptyMessage: [{
            type: Input
        }], pageChange: [{
            type: Output
        }], sortChange: [{
            type: Output
        }], actionClick: [{
            type: Output
        }], rowClick: [{
            type: Output
        }], paginator: [{
            type: ViewChild,
            args: [MatPaginator]
        }], sort: [{
            type: ViewChild,
            args: [MatSort]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(DataTableComponent, { className: "DataTableComponent", filePath: "app/shared/components/data-table/data-table.component.ts", lineNumber: 135 }); })();
//# sourceMappingURL=data-table.component.js.map