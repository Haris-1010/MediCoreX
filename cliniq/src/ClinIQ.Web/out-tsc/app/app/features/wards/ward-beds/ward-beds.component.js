import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "@angular/router";
import * as i3 from "../../../core/services/notification.service";
import * as i4 from "@angular/common";
import * as i5 from "@angular/material/icon";
import * as i6 from "@angular/material/progress-spinner";
import * as i7 from "../../../shared/components/page-header/page-header.component";
import * as i8 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Wards", route: "/wards" });
const _c1 = a0 => ({ label: a0 });
const _c2 = (a0, a1) => [a0, a1];
function WardBedsComponent_div_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 9);
    i0.ɵɵelement(1, "mat-spinner", 10);
    i0.ɵɵelementEnd();
} }
function WardBedsComponent_div_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 11)(1, "mat-icon", 12);
    i0.ɵɵtext(2, "bed");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "h3");
    i0.ɵɵtext(4, "No Beds");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p");
    i0.ɵɵtext(6, "This ward has no beds configured.");
    i0.ɵɵelementEnd()();
} }
function WardBedsComponent_div_18_div_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 15)(1, "div", 16)(2, "mat-icon");
    i0.ɵɵtext(3, "single_bed");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "div", 17);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 18);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 19);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "div", 20);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const b_r1 = ctx.$implicit;
    i0.ɵɵclassProp("available", b_r1.status === "Available")("occupied", b_r1.status === "Occupied")("maintenance", b_r1.status === "Maintenance");
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(b_r1.bedNumber);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Room ", b_r1.roomNumber || "\u2014", "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(b_r1.bedType);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(b_r1.status.toLowerCase());
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(b_r1.status);
} }
function WardBedsComponent_div_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 13);
    i0.ɵɵtemplate(1, WardBedsComponent_div_18_div_1_Template, 12, 12, "div", 14);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.beds);
} }
export class WardBedsComponent {
    constructor(api, route, router, notification) {
        this.api = api;
        this.route = route;
        this.router = router;
        this.notification = notification;
        this.wardId = '';
        this.wardName = 'Ward';
        this.beds = [];
        this.loading = false;
        this.availableCount = 0;
        this.occupiedCount = 0;
    }
    ngOnInit() {
        this.wardId = this.route.snapshot.paramMap.get('id') || '';
        this.loadBeds();
    }
    loadBeds() {
        this.loading = true;
        this.api.get(`v1/wards/${this.wardId}/beds`).subscribe({
            next: (data) => {
                this.beds = data;
                this.availableCount = data.filter((b) => b.status === 'Available').length;
                this.occupiedCount = data.filter((b) => b.status === 'Occupied').length;
                this.loading = false;
            },
            error: () => { this.loading = false; this.notification.error('Failed to load beds'); }
        });
    }
    static { this.ɵfac = function WardBedsComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || WardBedsComponent)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.ActivatedRoute), i0.ɵɵdirectiveInject(i2.Router), i0.ɵɵdirectiveInject(i3.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: WardBedsComponent, selectors: [["app-ward-beds"]], standalone: false, decls: 19, vars: 14, consts: [[3, "title", "breadcrumbs"], [1, "bed-stats"], [1, "stat-pill", "available"], [1, "stat-pill", "occupied"], [1, "stat-pill", "total"], [1, "card"], ["class", "loading-container", 4, "ngIf"], ["class", "empty-state", 4, "ngIf"], ["class", "bed-grid", 4, "ngIf"], [1, "loading-container"], ["diameter", "40"], [1, "empty-state"], [1, "empty-icon"], [1, "bed-grid"], ["class", "bed-card", 3, "available", "occupied", "maintenance", 4, "ngFor", "ngForOf"], [1, "bed-card"], [1, "bed-icon"], [1, "bed-number"], [1, "bed-room"], [1, "bed-type"], [1, "bed-status-badge"]], template: function WardBedsComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 0);
            i0.ɵɵelementStart(2, "div", 1)(3, "div", 2)(4, "mat-icon");
            i0.ɵɵtext(5, "check_circle");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "div", 3)(8, "mat-icon");
            i0.ɵɵtext(9, "block");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(10);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "div", 4)(12, "mat-icon");
            i0.ɵɵtext(13, "bed");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(14);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(15, "div", 5);
            i0.ɵɵtemplate(16, WardBedsComponent_div_16_Template, 2, 0, "div", 6)(17, WardBedsComponent_div_17_Template, 7, 0, "div", 7)(18, WardBedsComponent_div_18_Template, 2, 1, "div", 8);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("title", ctx.wardName + " \u2014 Beds")("breadcrumbs", i0.ɵɵpureFunction2(11, _c2, i0.ɵɵpureFunction0(8, _c0), i0.ɵɵpureFunction1(9, _c1, ctx.wardName)));
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate1(" ", ctx.availableCount, " Available");
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate1(" ", ctx.occupiedCount, " Occupied");
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate1(" ", ctx.beds.length, " Total");
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading && ctx.beds.length === 0);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading && ctx.beds.length > 0);
        } }, dependencies: [i4.NgForOf, i4.NgIf, i5.MatIcon, i6.MatProgressSpinner, i7.PageHeaderComponent, i8.MainLayoutComponent], styles: [".card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; margin-top: 1rem; }\n    .bed-stats[_ngcontent-%COMP%] { display: flex; gap: 1rem; }\n    .stat-pill[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 0.5rem; background: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.875rem; font-weight: 600; }\n    .stat-pill.available[_ngcontent-%COMP%] { color: #2e7d32; border: 1px solid #a5d6a7; }\n    .stat-pill.occupied[_ngcontent-%COMP%] { color: #c62828; border: 1px solid #ef9a9a; }\n    .stat-pill.total[_ngcontent-%COMP%] { color: #1565c0; border: 1px solid #90caf9; }\n    .stat-pill[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] { font-size: 18px; width: 18px; height: 18px; }\n    .loading-container[_ngcontent-%COMP%] { display: flex; justify-content: center; padding: 3rem; }\n    .empty-state[_ngcontent-%COMP%] { text-align: center; padding: 3rem; color: #666; }\n    .empty-icon[_ngcontent-%COMP%] { font-size: 48px; width: 48px; height: 48px; color: #ccc; }\n    .bed-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; margin-top: 1rem; }\n    .bed-card[_ngcontent-%COMP%] { border: 2px solid #e0e0e0; border-radius: 10px; padding: 1rem; text-align: center; transition: all 0.2s; }\n    .bed-card.available[_ngcontent-%COMP%] { border-color: #a5d6a7; background: #f1f8e9; }\n    .bed-card.occupied[_ngcontent-%COMP%] { border-color: #ef9a9a; background: #fce4ec; }\n    .bed-card.maintenance[_ngcontent-%COMP%] { border-color: #fff9c4; background: #fffde7; }\n    .bed-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] { font-size: 32px; width: 32px; height: 32px; color: #1a237e; }\n    .bed-number[_ngcontent-%COMP%] { font-size: 1.1rem; font-weight: 700; margin: 0.25rem 0; }\n    .bed-room[_ngcontent-%COMP%] { font-size: 0.75rem; color: #999; }\n    .bed-type[_ngcontent-%COMP%] { font-size: 0.75rem; color: #666; margin-bottom: 0.5rem; }\n    .bed-status-badge[_ngcontent-%COMP%] { display: inline-block; padding: 0.1rem 0.5rem; border-radius: 8px; font-size: 0.7rem; font-weight: 600; }\n    .bed-status-badge.available[_ngcontent-%COMP%] { background: #c8e6c9; color: #2e7d32; }\n    .bed-status-badge.occupied[_ngcontent-%COMP%] { background: #ffcdd2; color: #c62828; }\n    .bed-status-badge.maintenance[_ngcontent-%COMP%] { background: #fff9c4; color: #f57f17; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(WardBedsComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-ward-beds', template: `
    <app-main-layout>
      <app-page-header [title]="wardName + ' — Beds'" [breadcrumbs]="[{ label: 'Wards', route: '/wards' }, { label: wardName }]"></app-page-header>
      <div class="bed-stats">
        <div class="stat-pill available"><mat-icon>check_circle</mat-icon> {{ availableCount }} Available</div>
        <div class="stat-pill occupied"><mat-icon>block</mat-icon> {{ occupiedCount }} Occupied</div>
        <div class="stat-pill total"><mat-icon>bed</mat-icon> {{ beds.length }} Total</div>
      </div>
      <div class="card">
        <div *ngIf="loading" class="loading-container"><mat-spinner diameter="40"></mat-spinner></div>
        <div *ngIf="!loading && beds.length === 0" class="empty-state">
          <mat-icon class="empty-icon">bed</mat-icon>
          <h3>No Beds</h3>
          <p>This ward has no beds configured.</p>
        </div>
        <div class="bed-grid" *ngIf="!loading && beds.length > 0">
          <div class="bed-card" *ngFor="let b of beds" [class.available]="b.status === 'Available'" [class.occupied]="b.status === 'Occupied'" [class.maintenance]="b.status === 'Maintenance'">
            <div class="bed-icon"><mat-icon>single_bed</mat-icon></div>
            <div class="bed-number">{{ b.bedNumber }}</div>
            <div class="bed-room">Room {{ b.roomNumber || '—' }}</div>
            <div class="bed-type">{{ b.bedType }}</div>
            <div class="bed-status-badge" [class]="b.status.toLowerCase()">{{ b.status }}</div>
          </div>
        </div>
      </div>
    </app-main-layout>
  `, styles: ["\n    .card { background: white; padding: 1.5rem; border-radius: 8px; margin-top: 1rem; }\n    .bed-stats { display: flex; gap: 1rem; }\n    .stat-pill { display: flex; align-items: center; gap: 0.5rem; background: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.875rem; font-weight: 600; }\n    .stat-pill.available { color: #2e7d32; border: 1px solid #a5d6a7; }\n    .stat-pill.occupied { color: #c62828; border: 1px solid #ef9a9a; }\n    .stat-pill.total { color: #1565c0; border: 1px solid #90caf9; }\n    .stat-pill mat-icon { font-size: 18px; width: 18px; height: 18px; }\n    .loading-container { display: flex; justify-content: center; padding: 3rem; }\n    .empty-state { text-align: center; padding: 3rem; color: #666; }\n    .empty-icon { font-size: 48px; width: 48px; height: 48px; color: #ccc; }\n    .bed-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; margin-top: 1rem; }\n    .bed-card { border: 2px solid #e0e0e0; border-radius: 10px; padding: 1rem; text-align: center; transition: all 0.2s; }\n    .bed-card.available { border-color: #a5d6a7; background: #f1f8e9; }\n    .bed-card.occupied { border-color: #ef9a9a; background: #fce4ec; }\n    .bed-card.maintenance { border-color: #fff9c4; background: #fffde7; }\n    .bed-icon mat-icon { font-size: 32px; width: 32px; height: 32px; color: #1a237e; }\n    .bed-number { font-size: 1.1rem; font-weight: 700; margin: 0.25rem 0; }\n    .bed-room { font-size: 0.75rem; color: #999; }\n    .bed-type { font-size: 0.75rem; color: #666; margin-bottom: 0.5rem; }\n    .bed-status-badge { display: inline-block; padding: 0.1rem 0.5rem; border-radius: 8px; font-size: 0.7rem; font-weight: 600; }\n    .bed-status-badge.available { background: #c8e6c9; color: #2e7d32; }\n    .bed-status-badge.occupied { background: #ffcdd2; color: #c62828; }\n    .bed-status-badge.maintenance { background: #fff9c4; color: #f57f17; }\n  "] }]
    }], () => [{ type: i1.ApiService }, { type: i2.ActivatedRoute }, { type: i2.Router }, { type: i3.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(WardBedsComponent, { className: "WardBedsComponent", filePath: "app/features/wards/ward-beds/ward-beds.component.ts", lineNumber: 62 }); })();
//# sourceMappingURL=ward-beds.component.js.map