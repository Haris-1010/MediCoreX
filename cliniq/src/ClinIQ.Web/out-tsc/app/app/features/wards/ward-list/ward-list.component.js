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
import * as i8 from "@angular/material/menu";
import * as i9 from "@angular/material/progress-spinner";
import * as i10 from "../../../shared/components/page-header/page-header.component";
import * as i11 from "../../../shared/components/search-input/search-input.component";
import * as i12 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "Wards" });
const _c2 = (a0, a1) => [a0, a1];
function WardListComponent_div_42_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 15);
    i0.ɵɵelement(1, "mat-spinner", 16);
    i0.ɵɵelementEnd();
} }
function WardListComponent_div_43_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 17)(1, "mat-icon", 18);
    i0.ɵɵtext(2, "hotel");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "h3");
    i0.ɵɵtext(4, "No Wards");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p");
    i0.ɵɵtext(6, "Create your first ward to get started.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 2);
    i0.ɵɵlistener("click", function WardListComponent_div_43_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.addWard()); });
    i0.ɵɵelementStart(8, "mat-icon");
    i0.ɵɵtext(9, "add");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(10, " Add Ward");
    i0.ɵɵelementEnd()();
} }
function WardListComponent_div_44_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 21)(1, "div", 22)(2, "div", 23);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 24)(5, "h3");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "span", 25);
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "button", 26)(10, "mat-icon");
    i0.ɵɵtext(11, "more_vert");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "mat-menu", null, 0)(14, "button", 27);
    i0.ɵɵlistener("click", function WardListComponent_div_44_div_1_Template_button_click_14_listener() { const w_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.viewBeds(w_r4)); });
    i0.ɵɵelementStart(15, "mat-icon");
    i0.ɵɵtext(16, "bed");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(17, " View Beds");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(18, "button", 28);
    i0.ɵɵlistener("click", function WardListComponent_div_44_div_1_Template_button_click_18_listener() { const w_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.deleteWard(w_r4)); });
    i0.ɵɵelementStart(19, "mat-icon", 29);
    i0.ɵɵtext(20, "delete");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(21, " Delete");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(22, "div", 30)(23, "div", 31)(24, "span");
    i0.ɵɵtext(25, "Building:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(26, "span");
    i0.ɵɵtext(27);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(28, "div", 31)(29, "span");
    i0.ɵɵtext(30, "Floor:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(31, "span");
    i0.ɵɵtext(32);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(33, "div", 31)(34, "span");
    i0.ɵɵtext(35, "Rooms:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(36, "span");
    i0.ɵɵtext(37);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(38, "div", 32)(39, "div", 33);
    i0.ɵɵelement(40, "div", 34);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(41, "div", 35)(42, "span", 36);
    i0.ɵɵtext(43);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(44, "span", 37);
    i0.ɵɵtext(45);
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const w_r4 = ctx.$implicit;
    const menu_r5 = i0.ɵɵreference(13);
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(w_r4.name.charAt(0));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(w_r4.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", w_r4.code, " \u00B7 ", w_r4.wardType, "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("matMenuTriggerFor", menu_r5);
    i0.ɵɵadvance(18);
    i0.ɵɵtextInterpolate(w_r4.buildingName || "\u2014");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(w_r4.floorName || "\u2014");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(w_r4.roomCount);
    i0.ɵɵadvance(3);
    i0.ɵɵstyleProp("width", ctx_r1.getOccupancyPercent(w_r4), "%");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("", w_r4.availableBeds, " available");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", w_r4.occupiedBeds, " occupied");
} }
function WardListComponent_div_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 19);
    i0.ɵɵtemplate(1, WardListComponent_div_44_div_1_Template, 46, 12, "div", 20);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.filteredWards);
} }
export class WardListComponent {
    constructor(api, router, dialog, notification) {
        this.api = api;
        this.router = router;
        this.dialog = dialog;
        this.notification = notification;
        this.wards = [];
        this.filteredWards = [];
        this.loading = false;
        this.searchTerm = '';
        this.totalBeds = 0;
        this.totalAvailable = 0;
        this.totalOccupied = 0;
    }
    ngOnInit() { this.load(); }
    load() {
        this.loading = true;
        this.api.get('v1/wards').subscribe({
            next: (data) => {
                this.wards = data;
                this.totalBeds = data.reduce((s, w) => s + (w.totalBeds || 0), 0);
                this.totalAvailable = data.reduce((s, w) => s + (w.availableBeds || 0), 0);
                this.totalOccupied = data.reduce((s, w) => s + (w.occupiedBeds || 0), 0);
                this.applyFilter();
                this.loading = false;
            },
            error: () => { this.loading = false; this.notification.error('Failed to load wards'); }
        });
    }
    onSearch(term) { this.searchTerm = term; this.applyFilter(); }
    applyFilter() {
        if (!this.searchTerm) {
            this.filteredWards = [...this.wards];
            return;
        }
        const t = this.searchTerm.toLowerCase();
        this.filteredWards = this.wards.filter(w => w.name.toLowerCase().includes(t) || (w.code && w.code.toLowerCase().includes(t)));
    }
    getOccupancyPercent(w) {
        if (!w.totalBeds)
            return 0;
        return Math.round((w.occupiedBeds / w.totalBeds) * 100);
    }
    addWard() { this.router.navigate(['/wards/new']); }
    viewBeds(w) { this.router.navigate(['/wards', w.id, 'beds']); }
    deleteWard(w) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { title: 'Delete Ward', message: `Delete "${w.name}"?`, confirmText: 'Delete', cancelText: 'Cancel' }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.api.delete('v1/wards', w.id).subscribe({
                    next: () => { this.notification.success('Ward deleted'); this.load(); },
                    error: () => { this.notification.error('Failed to delete ward'); }
                });
            }
        });
    }
    static { this.ɵfac = function WardListComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || WardListComponent)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.Router), i0.ɵɵdirectiveInject(i3.MatDialog), i0.ɵɵdirectiveInject(i4.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: WardListComponent, selectors: [["app-ward-list"]], standalone: false, decls: 45, vars: 13, consts: [["menu", "matMenu"], ["title", "Wards", 3, "breadcrumbs"], ["mat-raised-button", "", "color", "primary", 3, "click"], [1, "ward-stats"], [1, "stat-card"], [1, "stat-value"], [1, "stat-label"], [1, "stat-card", "available"], [1, "stat-card", "occupied"], [1, "card"], [1, "filters"], ["placeholder", "Search wards...", 3, "search"], ["class", "loading-container", 4, "ngIf"], ["class", "empty-state", 4, "ngIf"], ["class", "ward-grid", 4, "ngIf"], [1, "loading-container"], ["diameter", "40"], [1, "empty-state"], [1, "empty-icon"], [1, "ward-grid"], ["class", "ward-card", 4, "ngFor", "ngForOf"], [1, "ward-card"], [1, "ward-header"], [1, "ward-avatar"], [1, "ward-info"], [1, "ward-code"], ["mat-icon-button", "", 3, "matMenuTriggerFor"], ["mat-menu-item", "", 3, "click"], ["mat-menu-item", "", 1, "delete-action", 3, "click"], ["color", "warn"], [1, "ward-details"], [1, "detail-row"], [1, "bed-progress"], [1, "progress-bar"], [1, "progress-fill"], [1, "bed-counts"], [1, "available"], [1, "occupied"]], template: function WardListComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout")(1, "app-page-header", 1)(2, "button", 2);
            i0.ɵɵlistener("click", function WardListComponent_Template_button_click_2_listener() { return ctx.addWard(); });
            i0.ɵɵelementStart(3, "mat-icon");
            i0.ɵɵtext(4, "add");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(5, " Add Ward ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "div", 3)(7, "div", 4)(8, "mat-icon");
            i0.ɵɵtext(9, "bed");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "div")(11, "span", 5);
            i0.ɵɵtext(12);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "span", 6);
            i0.ɵɵtext(14, "Total Wards");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(15, "div", 4)(16, "mat-icon");
            i0.ɵɵtext(17, "single_bed");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "div")(19, "span", 5);
            i0.ɵɵtext(20);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "span", 6);
            i0.ɵɵtext(22, "Total Beds");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(23, "div", 7)(24, "mat-icon");
            i0.ɵɵtext(25, "check_circle");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "div")(27, "span", 5);
            i0.ɵɵtext(28);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "span", 6);
            i0.ɵɵtext(30, "Available");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(31, "div", 8)(32, "mat-icon");
            i0.ɵɵtext(33, "block");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(34, "div")(35, "span", 5);
            i0.ɵɵtext(36);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(37, "span", 6);
            i0.ɵɵtext(38, "Occupied");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(39, "div", 9)(40, "div", 10)(41, "app-search-input", 11);
            i0.ɵɵlistener("search", function WardListComponent_Template_app_search_input_search_41_listener($event) { return ctx.onSearch($event); });
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(42, WardListComponent_div_42_Template, 2, 0, "div", 12)(43, WardListComponent_div_43_Template, 11, 0, "div", 13)(44, WardListComponent_div_44_Template, 2, 1, "div", 14);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(10, _c2, i0.ɵɵpureFunction0(8, _c0), i0.ɵɵpureFunction0(9, _c1)));
            i0.ɵɵadvance(11);
            i0.ɵɵtextInterpolate(ctx.wards.length);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(ctx.totalBeds);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(ctx.totalAvailable);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate(ctx.totalOccupied);
            i0.ɵɵadvance(6);
            i0.ɵɵproperty("ngIf", ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading && ctx.filteredWards.length === 0);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading && ctx.filteredWards.length > 0);
        } }, dependencies: [i5.NgForOf, i5.NgIf, i6.MatButton, i6.MatIconButton, i7.MatIcon, i8.MatMenu, i8.MatMenuItem, i8.MatMenuTrigger, i9.MatProgressSpinner, i10.PageHeaderComponent, i11.SearchInputComponent, i12.MainLayoutComponent], styles: [".card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; margin-top: 1rem; }\n    .ward-stats[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }\n    .stat-card[_ngcontent-%COMP%] { background: white; padding: 1.25rem; border-radius: 8px; display: flex; align-items: center; gap: 1rem; }\n    .stat-card[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] { font-size: 28px; width: 28px; height: 28px; color: #1a237e; }\n    .stat-card.available[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] { color: #2e7d32; }\n    .stat-card.occupied[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] { color: #c62828; }\n    .stat-value[_ngcontent-%COMP%] { display: block; font-size: 1.5rem; font-weight: 700; color: #333; }\n    .stat-label[_ngcontent-%COMP%] { font-size: 0.75rem; color: #999; }\n    .loading-container[_ngcontent-%COMP%] { display: flex; justify-content: center; padding: 3rem; }\n    .empty-state[_ngcontent-%COMP%] { text-align: center; padding: 3rem; color: #666; }\n    .empty-icon[_ngcontent-%COMP%] { font-size: 48px; width: 48px; height: 48px; color: #ccc; margin-bottom: 1rem; }\n    .empty-state[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0 0 0.5rem; color: #333; }\n    .empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0 0 1.5rem; }\n    .ward-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1rem; margin-top: 0.5rem; }\n    .ward-card[_ngcontent-%COMP%] { background: #fafafa; border: 1px solid #eee; border-radius: 10px; padding: 1.25rem; transition: box-shadow 0.2s; }\n    .ward-card[_ngcontent-%COMP%]:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.08); }\n    .ward-header[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }\n    .ward-avatar[_ngcontent-%COMP%] { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #1a237e, #0d47a1); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; }\n    .ward-info[_ngcontent-%COMP%] { flex: 1; }\n    .ward-info[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0; font-size: 1rem; }\n    .ward-code[_ngcontent-%COMP%] { font-size: 0.75rem; color: #999; }\n    .ward-details[_ngcontent-%COMP%] { margin-bottom: 1rem; }\n    .detail-row[_ngcontent-%COMP%] { display: flex; justify-content: space-between; padding: 0.25rem 0; font-size: 0.85rem; color: #666; }\n    .bed-progress[_ngcontent-%COMP%] { margin-top: auto; }\n    .progress-bar[_ngcontent-%COMP%] { height: 6px; background: #e0e0e0; border-radius: 3px; overflow: hidden; margin-bottom: 0.5rem; }\n    .progress-fill[_ngcontent-%COMP%] { height: 100%; background: linear-gradient(90deg, #2e7d32, #66bb6a); border-radius: 3px; transition: width 0.3s; }\n    .bed-counts[_ngcontent-%COMP%] { display: flex; justify-content: space-between; font-size: 0.75rem; }\n    .bed-counts[_ngcontent-%COMP%]   .available[_ngcontent-%COMP%] { color: #2e7d32; }\n    .bed-counts[_ngcontent-%COMP%]   .occupied[_ngcontent-%COMP%] { color: #c62828; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(WardListComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-ward-list', template: `
    <app-main-layout>
      <app-page-header title="Wards" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Wards' }]">
        <button mat-raised-button color="primary" (click)="addWard()">
          <mat-icon>add</mat-icon> Add Ward
        </button>
      </app-page-header>

      <div class="ward-stats">
        <div class="stat-card">
          <mat-icon>bed</mat-icon>
          <div><span class="stat-value">{{ wards.length }}</span><span class="stat-label">Total Wards</span></div>
        </div>
        <div class="stat-card">
          <mat-icon>single_bed</mat-icon>
          <div><span class="stat-value">{{ totalBeds }}</span><span class="stat-label">Total Beds</span></div>
        </div>
        <div class="stat-card available">
          <mat-icon>check_circle</mat-icon>
          <div><span class="stat-value">{{ totalAvailable }}</span><span class="stat-label">Available</span></div>
        </div>
        <div class="stat-card occupied">
          <mat-icon>block</mat-icon>
          <div><span class="stat-value">{{ totalOccupied }}</span><span class="stat-label">Occupied</span></div>
        </div>
      </div>

      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search wards..." (search)="onSearch($event)"></app-search-input>
        </div>

        <div *ngIf="loading" class="loading-container"><mat-spinner diameter="40"></mat-spinner></div>

        <div *ngIf="!loading && filteredWards.length === 0" class="empty-state">
          <mat-icon class="empty-icon">hotel</mat-icon>
          <h3>No Wards</h3>
          <p>Create your first ward to get started.</p>
          <button mat-raised-button color="primary" (click)="addWard()"><mat-icon>add</mat-icon> Add Ward</button>
        </div>

        <div class="ward-grid" *ngIf="!loading && filteredWards.length > 0">
          <div class="ward-card" *ngFor="let w of filteredWards">
            <div class="ward-header">
              <div class="ward-avatar">{{ w.name.charAt(0) }}</div>
              <div class="ward-info">
                <h3>{{ w.name }}</h3>
                <span class="ward-code">{{ w.code }} · {{ w.wardType }}</span>
              </div>
              <button mat-icon-button [matMenuTriggerFor]="menu"><mat-icon>more_vert</mat-icon></button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="viewBeds(w)"><mat-icon>bed</mat-icon> View Beds</button>
                <button mat-menu-item (click)="deleteWard(w)" class="delete-action"><mat-icon color="warn">delete</mat-icon> Delete</button>
              </mat-menu>
            </div>
            <div class="ward-details">
              <div class="detail-row"><span>Building:</span><span>{{ w.buildingName || '—' }}</span></div>
              <div class="detail-row"><span>Floor:</span><span>{{ w.floorName || '—' }}</span></div>
              <div class="detail-row"><span>Rooms:</span><span>{{ w.roomCount }}</span></div>
            </div>
            <div class="bed-progress">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="getOccupancyPercent(w)"></div>
              </div>
              <div class="bed-counts">
                <span class="available">{{ w.availableBeds }} available</span>
                <span class="occupied">{{ w.occupiedBeds }} occupied</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </app-main-layout>
  `, styles: ["\n    .card { background: white; padding: 1.5rem; border-radius: 8px; margin-top: 1rem; }\n    .ward-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }\n    .stat-card { background: white; padding: 1.25rem; border-radius: 8px; display: flex; align-items: center; gap: 1rem; }\n    .stat-card mat-icon { font-size: 28px; width: 28px; height: 28px; color: #1a237e; }\n    .stat-card.available mat-icon { color: #2e7d32; }\n    .stat-card.occupied mat-icon { color: #c62828; }\n    .stat-value { display: block; font-size: 1.5rem; font-weight: 700; color: #333; }\n    .stat-label { font-size: 0.75rem; color: #999; }\n    .loading-container { display: flex; justify-content: center; padding: 3rem; }\n    .empty-state { text-align: center; padding: 3rem; color: #666; }\n    .empty-icon { font-size: 48px; width: 48px; height: 48px; color: #ccc; margin-bottom: 1rem; }\n    .empty-state h3 { margin: 0 0 0.5rem; color: #333; }\n    .empty-state p { margin: 0 0 1.5rem; }\n    .ward-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1rem; margin-top: 0.5rem; }\n    .ward-card { background: #fafafa; border: 1px solid #eee; border-radius: 10px; padding: 1.25rem; transition: box-shadow 0.2s; }\n    .ward-card:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.08); }\n    .ward-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }\n    .ward-avatar { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #1a237e, #0d47a1); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; }\n    .ward-info { flex: 1; }\n    .ward-info h3 { margin: 0; font-size: 1rem; }\n    .ward-code { font-size: 0.75rem; color: #999; }\n    .ward-details { margin-bottom: 1rem; }\n    .detail-row { display: flex; justify-content: space-between; padding: 0.25rem 0; font-size: 0.85rem; color: #666; }\n    .bed-progress { margin-top: auto; }\n    .progress-bar { height: 6px; background: #e0e0e0; border-radius: 3px; overflow: hidden; margin-bottom: 0.5rem; }\n    .progress-fill { height: 100%; background: linear-gradient(90deg, #2e7d32, #66bb6a); border-radius: 3px; transition: width 0.3s; }\n    .bed-counts { display: flex; justify-content: space-between; font-size: 0.75rem; }\n    .bed-counts .available { color: #2e7d32; }\n    .bed-counts .occupied { color: #c62828; }\n  "] }]
    }], () => [{ type: i1.ApiService }, { type: i2.Router }, { type: i3.MatDialog }, { type: i4.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(WardListComponent, { className: "WardListComponent", filePath: "app/features/wards/ward-list/ward-list.component.ts", lineNumber: 117 }); })();
//# sourceMappingURL=ward-list.component.js.map