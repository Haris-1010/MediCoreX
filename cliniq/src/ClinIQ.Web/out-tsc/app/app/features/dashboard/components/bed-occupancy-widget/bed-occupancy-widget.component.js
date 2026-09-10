import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../../core/services/api.service";
import * as i2 from "@angular/common";
import * as i3 from "../../../../shared/components/loading-spinner/loading-spinner.component";
function BedOccupancyWidgetComponent_app_loading_spinner_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-loading-spinner");
} }
function BedOccupancyWidgetComponent_div_2_div_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 18)(1, "span", 19);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 20);
    i0.ɵɵelement(4, "div", 21);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span", 22);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ward_r1 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ward_r1.ward);
    i0.ɵɵadvance(2);
    i0.ɵɵstyleProp("width", ward_r1.occupied / ward_r1.total * 100, "%");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", ward_r1.occupied, "/", ward_r1.total, "");
} }
function BedOccupancyWidgetComponent_div_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 3)(1, "div", 4)(2, "div", 5);
    i0.ɵɵnamespaceSVG();
    i0.ɵɵelementStart(3, "svg", 6);
    i0.ɵɵelement(4, "path", 7)(5, "path", 8);
    i0.ɵɵelementStart(6, "text", 9);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()()();
    i0.ɵɵnamespaceHTML();
    i0.ɵɵelementStart(8, "div", 10)(9, "div", 11)(10, "span", 12);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "span", 13);
    i0.ɵɵtext(13, "Available");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "div", 11)(15, "span", 14);
    i0.ɵɵtext(16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(17, "span", 13);
    i0.ɵɵtext(18, "Occupied");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(19, "div", 11)(20, "span", 15);
    i0.ɵɵtext(21);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "span", 13);
    i0.ɵɵtext(23, "Maintenance");
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(24, "div", 16);
    i0.ɵɵtemplate(25, BedOccupancyWidgetComponent_div_2_div_25_Template, 7, 5, "div", 17);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵattribute("stroke-dasharray", ctx_r1.occupancyPercentage + ", 100");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", ctx_r1.occupancyPercentage, "%");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.totalAvailable);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.totalOccupied);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.totalMaintenance);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngForOf", ctx_r1.wardStats);
} }
export class BedOccupancyWidgetComponent {
    constructor(api) {
        this.api = api;
        this.loading = false;
        this.wardStats = [];
        this.totalAvailable = 0;
        this.totalOccupied = 0;
        this.totalMaintenance = 0;
        this.occupancyPercentage = 0;
    }
    ngOnInit() {
        this.loadBedStats();
    }
    loadBedStats() {
        this.api.get('v1/dashboard/bed-stats').subscribe({
            next: (data) => {
                this.wardStats = data;
                this.calculateTotals();
            },
            error: () => {
                // Use mock data if API fails
                this.wardStats = [
                    { ward: 'General Ward', total: 50, occupied: 35, available: 12, maintenance: 3 },
                    { ward: 'ICU', total: 20, occupied: 18, available: 1, maintenance: 1 },
                    { ward: 'Pediatric', total: 30, occupied: 15, available: 14, maintenance: 1 },
                    { ward: 'Maternity', total: 25, occupied: 20, available: 4, maintenance: 1 }
                ];
                this.calculateTotals();
            }
        });
    }
    calculateTotals() {
        this.totalAvailable = this.wardStats.reduce((sum, w) => sum + w.available, 0);
        this.totalOccupied = this.wardStats.reduce((sum, w) => sum + w.occupied, 0);
        this.totalMaintenance = this.wardStats.reduce((sum, w) => sum + w.maintenance, 0);
        const totalBeds = this.wardStats.reduce((sum, w) => sum + w.total, 0);
        this.occupancyPercentage = totalBeds > 0 ? Math.round((this.totalOccupied / totalBeds) * 100) : 0;
    }
    static { this.ɵfac = function BedOccupancyWidgetComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || BedOccupancyWidgetComponent)(i0.ɵɵdirectiveInject(i1.ApiService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: BedOccupancyWidgetComponent, selectors: [["app-bed-occupancy-widget"]], inputs: { loading: "loading" }, standalone: false, decls: 3, vars: 2, consts: [[1, "bed-widget"], [4, "ngIf"], ["class", "bed-stats", 4, "ngIf"], [1, "bed-stats"], [1, "overall-stats"], [1, "stat-ring"], ["viewBox", "0 0 36 36", 1, "circular-chart"], ["d", "M18 2.0845\n                       a 15.9155 15.9155 0 0 1 0 31.831\n                       a 15.9155 15.9155 0 0 1 0 -31.831", 1, "circle-bg"], ["d", "M18 2.0845\n                       a 15.9155 15.9155 0 0 1 0 31.831\n                       a 15.9155 15.9155 0 0 1 0 -31.831", 1, "circle"], ["x", "18", "y", "20.35", 1, "percentage"], [1, "stat-summary"], [1, "stat-item"], [1, "stat-value", "available"], [1, "stat-label"], [1, "stat-value", "occupied"], [1, "stat-value", "maintenance"], [1, "ward-list"], ["class", "ward-item", 4, "ngFor", "ngForOf"], [1, "ward-item"], [1, "ward-name"], [1, "ward-bar"], [1, "bar-fill"], [1, "ward-count"]], template: function BedOccupancyWidgetComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵtemplate(1, BedOccupancyWidgetComponent_app_loading_spinner_1_Template, 1, 0, "app-loading-spinner", 1)(2, BedOccupancyWidgetComponent_div_2_Template, 26, 6, "div", 2);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading);
        } }, dependencies: [i2.NgForOf, i2.NgIf, i3.LoadingSpinnerComponent], styles: [".bed-widget[_ngcontent-%COMP%] {\n      min-height: 200px;\n    }\n\n    .overall-stats[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 2rem;\n      margin-bottom: 1.5rem;\n    }\n\n    .stat-ring[_ngcontent-%COMP%] {\n      width: 120px;\n      height: 120px;\n    }\n\n    .circular-chart[_ngcontent-%COMP%] {\n      display: block;\n      max-width: 100%;\n    }\n\n    .circle-bg[_ngcontent-%COMP%] {\n      fill: none;\n      stroke: #eee;\n      stroke-width: 3.8;\n    }\n\n    .circle[_ngcontent-%COMP%] {\n      fill: none;\n      stroke-width: 2.8;\n      stroke-linecap: round;\n      stroke: #3f51b5;\n      animation: _ngcontent-%COMP%_progress 1s ease-out forwards;\n    }\n\n    @keyframes _ngcontent-%COMP%_progress {\n      0% { stroke-dasharray: 0 100; }\n    }\n\n    .percentage[_ngcontent-%COMP%] {\n      fill: #333;\n      font-size: 0.5em;\n      text-anchor: middle;\n      font-weight: 600;\n    }\n\n    .stat-summary[_ngcontent-%COMP%] {\n      display: flex;\n      flex-direction: column;\n      gap: 0.5rem;\n    }\n\n    .stat-item[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 0.5rem;\n    }\n\n    .stat-value[_ngcontent-%COMP%] {\n      font-size: 1.25rem;\n      font-weight: 700;\n      min-width: 30px;\n    }\n\n    .stat-value.available[_ngcontent-%COMP%] { color: #4caf50; }\n    .stat-value.occupied[_ngcontent-%COMP%] { color: #f44336; }\n    .stat-value.maintenance[_ngcontent-%COMP%] { color: #ff9800; }\n\n    .stat-label[_ngcontent-%COMP%] {\n      font-size: 0.75rem;\n      color: #666;\n    }\n\n    .ward-list[_ngcontent-%COMP%] {\n      display: flex;\n      flex-direction: column;\n      gap: 0.75rem;\n    }\n\n    .ward-item[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 1rem;\n    }\n\n    .ward-name[_ngcontent-%COMP%] {\n      font-size: 0.875rem;\n      min-width: 100px;\n    }\n\n    .ward-bar[_ngcontent-%COMP%] {\n      flex: 1;\n      height: 8px;\n      background: #eee;\n      border-radius: 4px;\n      overflow: hidden;\n    }\n\n    .bar-fill[_ngcontent-%COMP%] {\n      height: 100%;\n      background: linear-gradient(to right, #4caf50, #f44336);\n      border-radius: 4px;\n      transition: width 0.3s;\n    }\n\n    .ward-count[_ngcontent-%COMP%] {\n      font-size: 0.75rem;\n      color: #666;\n      min-width: 50px;\n      text-align: right;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(BedOccupancyWidgetComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-bed-occupancy-widget', template: `
    <div class="bed-widget">
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <div *ngIf="!loading" class="bed-stats">
        <div class="overall-stats">
          <div class="stat-ring">
            <svg viewBox="0 0 36 36" class="circular-chart">
              <path class="circle-bg"
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="circle"
                    [attr.stroke-dasharray]="occupancyPercentage + ', 100'"
                    d="M18 2.0845
                       a 15.9155 15.9155 0 0 1 0 31.831
                       a 15.9155 15.9155 0 0 1 0 -31.831" />
              <text x="18" y="20.35" class="percentage">{{ occupancyPercentage }}%</text>
            </svg>
          </div>
          <div class="stat-summary">
            <div class="stat-item">
              <span class="stat-value available">{{ totalAvailable }}</span>
              <span class="stat-label">Available</span>
            </div>
            <div class="stat-item">
              <span class="stat-value occupied">{{ totalOccupied }}</span>
              <span class="stat-label">Occupied</span>
            </div>
            <div class="stat-item">
              <span class="stat-value maintenance">{{ totalMaintenance }}</span>
              <span class="stat-label">Maintenance</span>
            </div>
          </div>
        </div>

        <div class="ward-list">
          <div class="ward-item" *ngFor="let ward of wardStats">
            <span class="ward-name">{{ ward.ward }}</span>
            <div class="ward-bar">
              <div class="bar-fill" [style.width.%]="(ward.occupied / ward.total) * 100"></div>
            </div>
            <span class="ward-count">{{ ward.occupied }}/{{ ward.total }}</span>
          </div>
        </div>
      </div>
    </div>
  `, styles: ["\n    .bed-widget {\n      min-height: 200px;\n    }\n\n    .overall-stats {\n      display: flex;\n      align-items: center;\n      gap: 2rem;\n      margin-bottom: 1.5rem;\n    }\n\n    .stat-ring {\n      width: 120px;\n      height: 120px;\n    }\n\n    .circular-chart {\n      display: block;\n      max-width: 100%;\n    }\n\n    .circle-bg {\n      fill: none;\n      stroke: #eee;\n      stroke-width: 3.8;\n    }\n\n    .circle {\n      fill: none;\n      stroke-width: 2.8;\n      stroke-linecap: round;\n      stroke: #3f51b5;\n      animation: progress 1s ease-out forwards;\n    }\n\n    @keyframes progress {\n      0% { stroke-dasharray: 0 100; }\n    }\n\n    .percentage {\n      fill: #333;\n      font-size: 0.5em;\n      text-anchor: middle;\n      font-weight: 600;\n    }\n\n    .stat-summary {\n      display: flex;\n      flex-direction: column;\n      gap: 0.5rem;\n    }\n\n    .stat-item {\n      display: flex;\n      align-items: center;\n      gap: 0.5rem;\n    }\n\n    .stat-value {\n      font-size: 1.25rem;\n      font-weight: 700;\n      min-width: 30px;\n    }\n\n    .stat-value.available { color: #4caf50; }\n    .stat-value.occupied { color: #f44336; }\n    .stat-value.maintenance { color: #ff9800; }\n\n    .stat-label {\n      font-size: 0.75rem;\n      color: #666;\n    }\n\n    .ward-list {\n      display: flex;\n      flex-direction: column;\n      gap: 0.75rem;\n    }\n\n    .ward-item {\n      display: flex;\n      align-items: center;\n      gap: 1rem;\n    }\n\n    .ward-name {\n      font-size: 0.875rem;\n      min-width: 100px;\n    }\n\n    .ward-bar {\n      flex: 1;\n      height: 8px;\n      background: #eee;\n      border-radius: 4px;\n      overflow: hidden;\n    }\n\n    .bar-fill {\n      height: 100%;\n      background: linear-gradient(to right, #4caf50, #f44336);\n      border-radius: 4px;\n      transition: width 0.3s;\n    }\n\n    .ward-count {\n      font-size: 0.75rem;\n      color: #666;\n      min-width: 50px;\n      text-align: right;\n    }\n  "] }]
    }], () => [{ type: i1.ApiService }], { loading: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(BedOccupancyWidgetComponent, { className: "BedOccupancyWidgetComponent", filePath: "app/features/dashboard/components/bed-occupancy-widget/bed-occupancy-widget.component.ts", lineNumber: 177 }); })();
//# sourceMappingURL=bed-occupancy-widget.component.js.map