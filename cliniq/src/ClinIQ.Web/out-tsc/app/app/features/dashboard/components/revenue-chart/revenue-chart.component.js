import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/material/tooltip";
import * as i3 from "../../../../shared/components/loading-spinner/loading-spinner.component";
function RevenueChartComponent_app_loading_spinner_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-loading-spinner");
} }
function RevenueChartComponent_div_2_div_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 10);
    i0.ɵɵpipe(1, "currency");
    i0.ɵɵelementStart(2, "span", 11);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r1 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵstyleProp("height", ctx_r1.getBarHeight(item_r1.value), "%");
    i0.ɵɵproperty("matTooltip", item_r1.label + ": " + i0.ɵɵpipeBind1(1, 4, item_r1.value));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r1.label);
} }
function RevenueChartComponent_div_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 3)(1, "div", 4);
    i0.ɵɵtemplate(2, RevenueChartComponent_div_2_div_2_Template, 4, 6, "div", 5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 6)(4, "div", 7);
    i0.ɵɵelement(5, "span", 8);
    i0.ɵɵelementStart(6, "span");
    i0.ɵɵtext(7, "Revenue");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 7);
    i0.ɵɵelement(9, "span", 9);
    i0.ɵɵelementStart(10, "span");
    i0.ɵɵtext(11, "Expenses");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngForOf", ctx_r1.data);
} }
export class RevenueChartComponent {
    constructor() {
        this.data = [];
        this.loading = false;
    }
    getBarHeight(value) {
        if (!this.data.length)
            return 0;
        const maxValue = Math.max(...this.data.map(d => d.value));
        return maxValue > 0 ? (value / maxValue) * 100 : 0;
    }
    static { this.ɵfac = function RevenueChartComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || RevenueChartComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: RevenueChartComponent, selectors: [["app-revenue-chart"]], inputs: { data: "data", loading: "loading" }, standalone: false, decls: 3, vars: 2, consts: [[1, "revenue-chart"], [4, "ngIf"], ["class", "chart-placeholder", 4, "ngIf"], [1, "chart-placeholder"], [1, "chart-bars"], ["class", "chart-bar", 3, "height", "matTooltip", 4, "ngFor", "ngForOf"], [1, "chart-legend"], [1, "legend-item"], [1, "legend-color", "revenue"], [1, "legend-color", "expenses"], [1, "chart-bar", 3, "matTooltip"], [1, "bar-label"]], template: function RevenueChartComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵtemplate(1, RevenueChartComponent_app_loading_spinner_1_Template, 1, 0, "app-loading-spinner", 1)(2, RevenueChartComponent_div_2_Template, 12, 1, "div", 2);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading);
        } }, dependencies: [i1.NgForOf, i1.NgIf, i2.MatTooltip, i3.LoadingSpinnerComponent, i1.CurrencyPipe], styles: [".revenue-chart[_ngcontent-%COMP%] {\n      min-height: 300px;\n    }\n\n    .chart-placeholder[_ngcontent-%COMP%] {\n      padding: 1rem 0;\n    }\n\n    .chart-bars[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: flex-end;\n      justify-content: space-around;\n      height: 250px;\n      padding: 0 1rem;\n    }\n\n    .chart-bar[_ngcontent-%COMP%] {\n      width: 40px;\n      background: linear-gradient(to top, #3f51b5, #7986cb);\n      border-radius: 4px 4px 0 0;\n      position: relative;\n      min-height: 10px;\n      transition: all 0.3s;\n      cursor: pointer;\n    }\n\n    .chart-bar[_ngcontent-%COMP%]:hover {\n      opacity: 0.8;\n    }\n\n    .bar-label[_ngcontent-%COMP%] {\n      position: absolute;\n      bottom: -24px;\n      left: 50%;\n      transform: translateX(-50%);\n      font-size: 0.625rem;\n      color: #666;\n      white-space: nowrap;\n    }\n\n    .chart-legend[_ngcontent-%COMP%] {\n      display: flex;\n      justify-content: center;\n      gap: 2rem;\n      margin-top: 2rem;\n    }\n\n    .legend-item[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 0.5rem;\n      font-size: 0.75rem;\n      color: #666;\n    }\n\n    .legend-color[_ngcontent-%COMP%] {\n      width: 12px;\n      height: 12px;\n      border-radius: 2px;\n    }\n\n    .legend-color.revenue[_ngcontent-%COMP%] {\n      background: #3f51b5;\n    }\n\n    .legend-color.expenses[_ngcontent-%COMP%] {\n      background: #f44336;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(RevenueChartComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-revenue-chart', template: `
    <div class="revenue-chart">
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <div *ngIf="!loading" class="chart-placeholder">
        <div class="chart-bars">
          <div class="chart-bar" *ngFor="let item of data; let i = index"
               [style.height.%]="getBarHeight(item.value)"
               [matTooltip]="item.label + ': ' + (item.value | currency)">
            <span class="bar-label">{{ item.label }}</span>
          </div>
        </div>
        <div class="chart-legend">
          <div class="legend-item">
            <span class="legend-color revenue"></span>
            <span>Revenue</span>
          </div>
          <div class="legend-item">
            <span class="legend-color expenses"></span>
            <span>Expenses</span>
          </div>
        </div>
      </div>
    </div>
  `, styles: ["\n    .revenue-chart {\n      min-height: 300px;\n    }\n\n    .chart-placeholder {\n      padding: 1rem 0;\n    }\n\n    .chart-bars {\n      display: flex;\n      align-items: flex-end;\n      justify-content: space-around;\n      height: 250px;\n      padding: 0 1rem;\n    }\n\n    .chart-bar {\n      width: 40px;\n      background: linear-gradient(to top, #3f51b5, #7986cb);\n      border-radius: 4px 4px 0 0;\n      position: relative;\n      min-height: 10px;\n      transition: all 0.3s;\n      cursor: pointer;\n    }\n\n    .chart-bar:hover {\n      opacity: 0.8;\n    }\n\n    .bar-label {\n      position: absolute;\n      bottom: -24px;\n      left: 50%;\n      transform: translateX(-50%);\n      font-size: 0.625rem;\n      color: #666;\n      white-space: nowrap;\n    }\n\n    .chart-legend {\n      display: flex;\n      justify-content: center;\n      gap: 2rem;\n      margin-top: 2rem;\n    }\n\n    .legend-item {\n      display: flex;\n      align-items: center;\n      gap: 0.5rem;\n      font-size: 0.75rem;\n      color: #666;\n    }\n\n    .legend-color {\n      width: 12px;\n      height: 12px;\n      border-radius: 2px;\n    }\n\n    .legend-color.revenue {\n      background: #3f51b5;\n    }\n\n    .legend-color.expenses {\n      background: #f44336;\n    }\n  "] }]
    }], null, { data: [{
            type: Input
        }], loading: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(RevenueChartComponent, { className: "RevenueChartComponent", filePath: "app/features/dashboard/components/revenue-chart/revenue-chart.component.ts", lineNumber: 102 }); })();
//# sourceMappingURL=revenue-chart.component.js.map