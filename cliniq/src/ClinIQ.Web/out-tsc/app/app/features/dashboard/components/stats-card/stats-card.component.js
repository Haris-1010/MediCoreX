import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/material/icon";
function StatsCardComponent_div_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 5)(1, "mat-icon");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵpipe(5, "number");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("positive", ctx_r0.growth >= 0)("negative", ctx_r0.growth < 0);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.growth >= 0 ? "trending_up" : "trending_down");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", i0.ɵɵpipeBind2(5, 6, ctx_r0.growth, "1.1-1"), "% from last month");
} }
export class StatsCardComponent {
    constructor() {
        this.color = 'primary';
        this.isCurrency = false;
    }
    static { this.ɵfac = function StatsCardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StatsCardComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StatsCardComponent, selectors: [["app-stats-card"]], inputs: { title: "title", value: "value", icon: "icon", color: "color", growth: "growth", isCurrency: "isCurrency" }, standalone: false, decls: 11, vars: 7, consts: [[1, "stats-card", 3, "ngClass"], [1, "stats-icon"], [1, "stats-content"], [1, "stats-value"], ["class", "stats-growth", 3, "positive", "negative", 4, "ngIf"], [1, "stats-growth"]], template: function StatsCardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "mat-icon");
            i0.ɵɵtext(3);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(4, "div", 2)(5, "h4");
            i0.ɵɵtext(6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "div", 3);
            i0.ɵɵtext(8);
            i0.ɵɵpipe(9, "currency");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(10, StatsCardComponent_div_10_Template, 6, 9, "div", 4);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵproperty("ngClass", "stats-" + ctx.color);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.icon);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.title);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1(" ", ctx.isCurrency ? i0.ɵɵpipeBind1(9, 5, ctx.value) : ctx.value, " ");
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", ctx.growth !== undefined);
        } }, dependencies: [i1.NgClass, i1.NgIf, i2.MatIcon, i1.DecimalPipe, i1.CurrencyPipe], styles: [".stats-card[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: flex-start;\n      gap: 1rem;\n      background: white;\n      border-radius: 8px;\n      padding: 1.5rem;\n      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n    }\n\n    .stats-icon[_ngcontent-%COMP%] {\n      width: 48px;\n      height: 48px;\n      border-radius: 12px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n\n    .stats-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n      font-size: 24px;\n      width: 24px;\n      height: 24px;\n      color: white;\n    }\n\n    .stats-primary[_ngcontent-%COMP%]   .stats-icon[_ngcontent-%COMP%] { background: #3f51b5; }\n    .stats-accent[_ngcontent-%COMP%]   .stats-icon[_ngcontent-%COMP%] { background: #009688; }\n    .stats-warn[_ngcontent-%COMP%]   .stats-icon[_ngcontent-%COMP%] { background: #f44336; }\n    .stats-success[_ngcontent-%COMP%]   .stats-icon[_ngcontent-%COMP%] { background: #4caf50; }\n\n    .stats-content[_ngcontent-%COMP%] {\n      flex: 1;\n    }\n\n    .stats-content[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n      margin: 0;\n      font-size: 0.875rem;\n      font-weight: 500;\n      color: #666;\n    }\n\n    .stats-value[_ngcontent-%COMP%] {\n      font-size: 1.75rem;\n      font-weight: 700;\n      color: #333;\n      margin: 0.25rem 0;\n    }\n\n    .stats-growth[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 0.25rem;\n      font-size: 0.75rem;\n    }\n\n    .stats-growth[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n      font-size: 16px;\n      width: 16px;\n      height: 16px;\n    }\n\n    .stats-growth.positive[_ngcontent-%COMP%] {\n      color: #4caf50;\n    }\n\n    .stats-growth.negative[_ngcontent-%COMP%] {\n      color: #f44336;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StatsCardComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-stats-card', template: `
    <div class="stats-card" [ngClass]="'stats-' + color">
      <div class="stats-icon">
        <mat-icon>{{ icon }}</mat-icon>
      </div>
      <div class="stats-content">
        <h4>{{ title }}</h4>
        <div class="stats-value">
          {{ isCurrency ? (value | currency) : value }}
        </div>
        <div class="stats-growth" *ngIf="growth !== undefined" [class.positive]="growth >= 0" [class.negative]="growth < 0">
          <mat-icon>{{ growth >= 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
          <span>{{ growth | number:'1.1-1' }}% from last month</span>
        </div>
      </div>
    </div>
  `, styles: ["\n    .stats-card {\n      display: flex;\n      align-items: flex-start;\n      gap: 1rem;\n      background: white;\n      border-radius: 8px;\n      padding: 1.5rem;\n      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n    }\n\n    .stats-icon {\n      width: 48px;\n      height: 48px;\n      border-radius: 12px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n\n    .stats-icon mat-icon {\n      font-size: 24px;\n      width: 24px;\n      height: 24px;\n      color: white;\n    }\n\n    .stats-primary .stats-icon { background: #3f51b5; }\n    .stats-accent .stats-icon { background: #009688; }\n    .stats-warn .stats-icon { background: #f44336; }\n    .stats-success .stats-icon { background: #4caf50; }\n\n    .stats-content {\n      flex: 1;\n    }\n\n    .stats-content h4 {\n      margin: 0;\n      font-size: 0.875rem;\n      font-weight: 500;\n      color: #666;\n    }\n\n    .stats-value {\n      font-size: 1.75rem;\n      font-weight: 700;\n      color: #333;\n      margin: 0.25rem 0;\n    }\n\n    .stats-growth {\n      display: flex;\n      align-items: center;\n      gap: 0.25rem;\n      font-size: 0.75rem;\n    }\n\n    .stats-growth mat-icon {\n      font-size: 16px;\n      width: 16px;\n      height: 16px;\n    }\n\n    .stats-growth.positive {\n      color: #4caf50;\n    }\n\n    .stats-growth.negative {\n      color: #f44336;\n    }\n  "] }]
    }], null, { title: [{
            type: Input
        }], value: [{
            type: Input
        }], icon: [{
            type: Input
        }], color: [{
            type: Input
        }], growth: [{
            type: Input
        }], isCurrency: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StatsCardComponent, { className: "StatsCardComponent", filePath: "app/features/dashboard/components/stats-card/stats-card.component.ts", lineNumber: 95 }); })();
//# sourceMappingURL=stats-card.component.js.map