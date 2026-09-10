import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "@angular/common";
import * as i3 from "@angular/material/icon";
import * as i4 from "@angular/material/table";
import * as i5 from "@angular/material/tabs";
import * as i6 from "../../../shared/components/page-header/page-header.component";
import * as i7 from "../../../shared/components/status-badge/status-badge.component";
import * as i8 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "Facility" });
const _c2 = (a0, a1) => [a0, a1];
function FacilityDashboardComponent_div_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 9)(1, "mat-icon");
    i0.ɵɵtext(2, "business");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "h4");
    i0.ɵɵtext(4, "No Buildings");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p");
    i0.ɵɵtext(6, "Buildings will appear here once registered.");
    i0.ɵɵelementEnd()();
} }
function FacilityDashboardComponent_div_6_div_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 12)(1, "mat-icon");
    i0.ɵɵtext(2, "business");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "h4");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const b_r1 = ctx.$implicit;
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(b_r1.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", b_r1.floors, " floors");
} }
function FacilityDashboardComponent_div_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 10);
    i0.ɵɵtemplate(1, FacilityDashboardComponent_div_6_div_1_Template, 7, 2, "div", 11);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.buildings);
} }
function FacilityDashboardComponent_div_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 9)(1, "mat-icon");
    i0.ɵɵtext(2, "hotel");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "h4");
    i0.ɵɵtext(4, "No Wards");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p");
    i0.ɵɵtext(6, "Ward information will appear here once configured.");
    i0.ɵɵelementEnd()();
} }
function FacilityDashboardComponent_table_10_th_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 23);
    i0.ɵɵtext(1, "Ward Name");
    i0.ɵɵelementEnd();
} }
function FacilityDashboardComponent_table_10_td_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 24);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const w_r3 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(w_r3.name);
} }
function FacilityDashboardComponent_table_10_th_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 23);
    i0.ɵɵtext(1, "Type");
    i0.ɵɵelementEnd();
} }
function FacilityDashboardComponent_table_10_td_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 24);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const w_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(w_r4.type);
} }
function FacilityDashboardComponent_table_10_th_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 23);
    i0.ɵɵtext(1, "Total Beds");
    i0.ɵɵelementEnd();
} }
function FacilityDashboardComponent_table_10_td_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 24);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const w_r5 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(w_r5.totalBeds);
} }
function FacilityDashboardComponent_table_10_th_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 23);
    i0.ɵɵtext(1, "Available");
    i0.ɵɵelementEnd();
} }
function FacilityDashboardComponent_table_10_td_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 24);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const w_r6 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(w_r6.availableBeds);
} }
function FacilityDashboardComponent_table_10_th_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 23);
    i0.ɵɵtext(1, "Status");
    i0.ɵɵelementEnd();
} }
function FacilityDashboardComponent_table_10_td_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 24);
    i0.ɵɵelement(1, "app-status-badge", 25);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const w_r7 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("status", w_r7.status);
} }
function FacilityDashboardComponent_table_10_tr_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 26);
} }
function FacilityDashboardComponent_table_10_tr_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "tr", 27);
} }
function FacilityDashboardComponent_table_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "table", 13);
    i0.ɵɵelementContainerStart(1, 14);
    i0.ɵɵtemplate(2, FacilityDashboardComponent_table_10_th_2_Template, 2, 0, "th", 15)(3, FacilityDashboardComponent_table_10_td_3_Template, 2, 1, "td", 16);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(4, 17);
    i0.ɵɵtemplate(5, FacilityDashboardComponent_table_10_th_5_Template, 2, 0, "th", 15)(6, FacilityDashboardComponent_table_10_td_6_Template, 2, 1, "td", 16);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(7, 18);
    i0.ɵɵtemplate(8, FacilityDashboardComponent_table_10_th_8_Template, 2, 0, "th", 15)(9, FacilityDashboardComponent_table_10_td_9_Template, 2, 1, "td", 16);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(10, 19);
    i0.ɵɵtemplate(11, FacilityDashboardComponent_table_10_th_11_Template, 2, 0, "th", 15)(12, FacilityDashboardComponent_table_10_td_12_Template, 2, 1, "td", 16);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵelementContainerStart(13, 20);
    i0.ɵɵtemplate(14, FacilityDashboardComponent_table_10_th_14_Template, 2, 0, "th", 15)(15, FacilityDashboardComponent_table_10_td_15_Template, 2, 1, "td", 16);
    i0.ɵɵelementContainerEnd();
    i0.ɵɵtemplate(16, FacilityDashboardComponent_table_10_tr_16_Template, 1, 0, "tr", 21)(17, FacilityDashboardComponent_table_10_tr_17_Template, 1, 0, "tr", 22);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("dataSource", ctx_r1.wards);
    i0.ɵɵadvance(16);
    i0.ɵɵproperty("matHeaderRowDef", ctx_r1.wardColumns);
    i0.ɵɵadvance();
    i0.ɵɵproperty("matRowDefColumns", ctx_r1.wardColumns);
} }
export class FacilityDashboardComponent {
    constructor(api) {
        this.api = api;
        this.buildings = [];
        this.wards = [];
        this.wardColumns = ['name', 'type', 'beds', 'available', 'status'];
    }
    ngOnInit() {
        this.api.get('v1/facility/buildings').subscribe(r => this.buildings = r);
        this.api.get('v1/wards').subscribe(r => this.wards = r);
    }
    static { this.ɵfac = function FacilityDashboardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || FacilityDashboardComponent)(i0.ɵɵdirectiveInject(i1.ApiService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: FacilityDashboardComponent, selectors: [["app-facility-dashboard"]], standalone: false, decls: 19, vars: 10, consts: [["title", "Facility Management", 3, "breadcrumbs"], ["label", "Buildings"], [1, "tab-content"], ["class", "empty-state", 4, "ngIf"], ["class", "facility-grid", 4, "ngIf"], ["label", "Wards"], ["mat-table", "", 3, "dataSource", 4, "ngIf"], ["label", "Rooms"], ["label", "Equipment"], [1, "empty-state"], [1, "facility-grid"], ["class", "facility-card", 4, "ngFor", "ngForOf"], [1, "facility-card"], ["mat-table", "", 3, "dataSource"], ["matColumnDef", "name"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "type"], ["matColumnDef", "beds"], ["matColumnDef", "available"], ["matColumnDef", "status"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", ""], ["mat-cell", ""], [3, "status"], ["mat-header-row", ""], ["mat-row", ""]], template: function FacilityDashboardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 0);
            i0.ɵɵelementStart(2, "mat-tab-group")(3, "mat-tab", 1)(4, "div", 2);
            i0.ɵɵtemplate(5, FacilityDashboardComponent_div_5_Template, 7, 0, "div", 3)(6, FacilityDashboardComponent_div_6_Template, 2, 1, "div", 4);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(7, "mat-tab", 5)(8, "div", 2);
            i0.ɵɵtemplate(9, FacilityDashboardComponent_div_9_Template, 7, 0, "div", 3)(10, FacilityDashboardComponent_table_10_Template, 18, 3, "table", 6);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(11, "mat-tab", 7)(12, "div", 2)(13, "p");
            i0.ɵɵtext(14, "Room management interface");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(15, "mat-tab", 8)(16, "div", 2)(17, "p");
            i0.ɵɵtext(18, "Equipment tracking interface");
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(7, _c2, i0.ɵɵpureFunction0(5, _c0), i0.ɵɵpureFunction0(6, _c1)));
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("ngIf", ctx.buildings.length === 0);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.buildings.length > 0);
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("ngIf", ctx.wards.length === 0);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.wards.length > 0);
        } }, dependencies: [i2.NgForOf, i2.NgIf, i3.MatIcon, i4.MatTable, i4.MatHeaderCellDef, i4.MatHeaderRowDef, i4.MatColumnDef, i4.MatCellDef, i4.MatRowDef, i4.MatHeaderCell, i4.MatCell, i4.MatHeaderRow, i4.MatRow, i5.MatTab, i5.MatTabGroup, i6.PageHeaderComponent, i7.StatusBadgeComponent, i8.MainLayoutComponent], styles: [".tab-content[_ngcontent-%COMP%] { padding: 1.5rem; }\n    .facility-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }\n    .facility-card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }\n    .facility-card[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] { font-size: 48px; width: 48px; height: 48px; color: #3f51b5; }\n    .facility-card[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] { margin: 0.5rem 0 0; } .facility-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0; color: #666; }\n    table[_ngcontent-%COMP%] { width: 100%; background: white; }\n    .empty-state[_ngcontent-%COMP%] { display: flex; flex-direction: column; align-items: center; padding: 3rem; color: #999; background: white; border-radius: 8px; }\n    .empty-state[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] { font-size: 64px; width: 64px; height: 64px; margin-bottom: 1rem; opacity: 0.5; }\n    .empty-state[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] { margin: 0 0 0.5rem; color: #666; }\n    .empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(FacilityDashboardComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-facility-dashboard', template: `
    <app-main-layout>
      <app-page-header title="Facility Management" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Facility' }]"></app-page-header>
      <mat-tab-group>
        <mat-tab label="Buildings">
          <div class="tab-content">
            <div class="empty-state" *ngIf="buildings.length === 0">
              <mat-icon>business</mat-icon>
              <h4>No Buildings</h4>
              <p>Buildings will appear here once registered.</p>
            </div>
            <div class="facility-grid" *ngIf="buildings.length > 0">
              <div class="facility-card" *ngFor="let b of buildings">
                <mat-icon>business</mat-icon>
                <h4>{{ b.name }}</h4>
                <p>{{ b.floors }} floors</p>
              </div>
            </div>
          </div>
        </mat-tab>
        <mat-tab label="Wards">
          <div class="tab-content">
            <div class="empty-state" *ngIf="wards.length === 0">
              <mat-icon>hotel</mat-icon>
              <h4>No Wards</h4>
              <p>Ward information will appear here once configured.</p>
            </div>
            <table mat-table [dataSource]="wards" *ngIf="wards.length > 0">
              <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Ward Name</th><td mat-cell *matCellDef="let w">{{ w.name }}</td></ng-container>
              <ng-container matColumnDef="type"><th mat-header-cell *matHeaderCellDef>Type</th><td mat-cell *matCellDef="let w">{{ w.type }}</td></ng-container>
              <ng-container matColumnDef="beds"><th mat-header-cell *matHeaderCellDef>Total Beds</th><td mat-cell *matCellDef="let w">{{ w.totalBeds }}</td></ng-container>
              <ng-container matColumnDef="available"><th mat-header-cell *matHeaderCellDef>Available</th><td mat-cell *matCellDef="let w">{{ w.availableBeds }}</td></ng-container>
              <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let w"><app-status-badge [status]="w.status"></app-status-badge></td></ng-container>
              <tr mat-header-row *matHeaderRowDef="wardColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: wardColumns;"></tr>
            </table>
          </div>
        </mat-tab>
        <mat-tab label="Rooms">
          <div class="tab-content">
            <p>Room management interface</p>
          </div>
        </mat-tab>
        <mat-tab label="Equipment">
          <div class="tab-content">
            <p>Equipment tracking interface</p>
          </div>
        </mat-tab>
      </mat-tab-group>
    </app-main-layout>
  `, styles: [".tab-content { padding: 1.5rem; }\n    .facility-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }\n    .facility-card { background: white; padding: 1.5rem; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }\n    .facility-card mat-icon { font-size: 48px; width: 48px; height: 48px; color: #3f51b5; }\n    .facility-card h4 { margin: 0.5rem 0 0; } .facility-card p { margin: 0; color: #666; }\n    table { width: 100%; background: white; }\n    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 3rem; color: #999; background: white; border-radius: 8px; }\n    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 1rem; opacity: 0.5; }\n    .empty-state h4 { margin: 0 0 0.5rem; color: #666; }\n    .empty-state p { margin: 0; }"] }]
    }], () => [{ type: i1.ApiService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(FacilityDashboardComponent, { className: "FacilityDashboardComponent", filePath: "app/features/facility/facility-dashboard/facility-dashboard.component.ts", lineNumber: 69 }); })();
//# sourceMappingURL=facility-dashboard.component.js.map