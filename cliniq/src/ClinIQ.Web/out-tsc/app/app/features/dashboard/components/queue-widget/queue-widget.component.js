import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/material/icon";
import * as i3 from "../../../../shared/components/loading-spinner/loading-spinner.component";
import * as i4 from "../../../../shared/components/status-badge/status-badge.component";
function QueueWidgetComponent_app_loading_spinner_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-loading-spinner");
} }
function QueueWidgetComponent_div_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 4)(1, "mat-icon");
    i0.ɵɵtext(2, "how_to_reg");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4, "No patients in queue");
    i0.ɵɵelementEnd()();
} }
function QueueWidgetComponent_div_3_div_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 7)(1, "div", 8);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 9)(4, "div", 10);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 11);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 12);
    i0.ɵɵelement(9, "app-status-badge", 13);
    i0.ɵɵelementStart(10, "span", 14);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const item_r1 = ctx.$implicit;
    i0.ɵɵclassProp("current", item_r1.status === "InProgress");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", item_r1.tokenNumber, " ");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r1.patientName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r1.doctorName);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("status", item_r1.status);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", item_r1.waitTime, " min");
} }
function QueueWidgetComponent_div_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 5);
    i0.ɵɵtemplate(1, QueueWidgetComponent_div_3_div_1_Template, 12, 7, "div", 6);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.queueItems);
} }
export class QueueWidgetComponent {
    constructor() {
        this.queueItems = [];
        this.loading = false;
    }
    static { this.ɵfac = function QueueWidgetComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || QueueWidgetComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: QueueWidgetComponent, selectors: [["app-queue-widget"]], inputs: { queueItems: "queueItems", loading: "loading" }, standalone: false, decls: 4, vars: 3, consts: [[1, "queue-widget"], [4, "ngIf"], ["class", "empty-state", 4, "ngIf"], ["class", "queue-list", 4, "ngIf"], [1, "empty-state"], [1, "queue-list"], ["class", "queue-item", 3, "current", 4, "ngFor", "ngForOf"], [1, "queue-item"], [1, "token-number"], [1, "queue-details"], [1, "patient-name"], [1, "doctor-name"], [1, "queue-meta"], [3, "status"], [1, "wait-time"]], template: function QueueWidgetComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵtemplate(1, QueueWidgetComponent_app_loading_spinner_1_Template, 1, 0, "app-loading-spinner", 1)(2, QueueWidgetComponent_div_2_Template, 5, 0, "div", 2)(3, QueueWidgetComponent_div_3_Template, 2, 1, "div", 3);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.loading);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading && ctx.queueItems.length === 0);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.loading && ctx.queueItems.length > 0);
        } }, dependencies: [i1.NgForOf, i1.NgIf, i2.MatIcon, i3.LoadingSpinnerComponent, i4.StatusBadgeComponent], styles: [".queue-widget[_ngcontent-%COMP%] {\n      min-height: 200px;\n    }\n\n    .empty-state[_ngcontent-%COMP%] {\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: center;\n      padding: 2rem;\n      color: #666;\n    }\n\n    .empty-state[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n      font-size: 48px;\n      width: 48px;\n      height: 48px;\n      color: #ccc;\n      margin-bottom: 0.5rem;\n    }\n\n    .queue-list[_ngcontent-%COMP%] {\n      display: flex;\n      flex-direction: column;\n      gap: 0.5rem;\n    }\n\n    .queue-item[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 1rem;\n      padding: 0.75rem;\n      border-radius: 8px;\n      background: #f5f5f5;\n      transition: all 0.2s;\n    }\n\n    .queue-item.current[_ngcontent-%COMP%] {\n      background: #e3f2fd;\n      border-left: 3px solid #3f51b5;\n    }\n\n    .token-number[_ngcontent-%COMP%] {\n      width: 40px;\n      height: 40px;\n      border-radius: 50%;\n      background: #3f51b5;\n      color: white;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      font-weight: 700;\n      font-size: 0.875rem;\n    }\n\n    .queue-details[_ngcontent-%COMP%] {\n      flex: 1;\n    }\n\n    .patient-name[_ngcontent-%COMP%] {\n      font-weight: 500;\n    }\n\n    .doctor-name[_ngcontent-%COMP%] {\n      font-size: 0.75rem;\n      color: #666;\n    }\n\n    .queue-meta[_ngcontent-%COMP%] {\n      display: flex;\n      flex-direction: column;\n      align-items: flex-end;\n      gap: 0.25rem;\n    }\n\n    .wait-time[_ngcontent-%COMP%] {\n      font-size: 0.75rem;\n      color: #666;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QueueWidgetComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-queue-widget', template: `
    <div class="queue-widget">
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <div *ngIf="!loading && queueItems.length === 0" class="empty-state">
        <mat-icon>how_to_reg</mat-icon>
        <span>No patients in queue</span>
      </div>

      <div class="queue-list" *ngIf="!loading && queueItems.length > 0">
        <div class="queue-item" *ngFor="let item of queueItems" [class.current]="item.status === 'InProgress'">
          <div class="token-number">
            {{ item.tokenNumber }}
          </div>
          <div class="queue-details">
            <div class="patient-name">{{ item.patientName }}</div>
            <div class="doctor-name">{{ item.doctorName }}</div>
          </div>
          <div class="queue-meta">
            <app-status-badge [status]="item.status"></app-status-badge>
            <span class="wait-time">{{ item.waitTime }} min</span>
          </div>
        </div>
      </div>
    </div>
  `, styles: ["\n    .queue-widget {\n      min-height: 200px;\n    }\n\n    .empty-state {\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: center;\n      padding: 2rem;\n      color: #666;\n    }\n\n    .empty-state mat-icon {\n      font-size: 48px;\n      width: 48px;\n      height: 48px;\n      color: #ccc;\n      margin-bottom: 0.5rem;\n    }\n\n    .queue-list {\n      display: flex;\n      flex-direction: column;\n      gap: 0.5rem;\n    }\n\n    .queue-item {\n      display: flex;\n      align-items: center;\n      gap: 1rem;\n      padding: 0.75rem;\n      border-radius: 8px;\n      background: #f5f5f5;\n      transition: all 0.2s;\n    }\n\n    .queue-item.current {\n      background: #e3f2fd;\n      border-left: 3px solid #3f51b5;\n    }\n\n    .token-number {\n      width: 40px;\n      height: 40px;\n      border-radius: 50%;\n      background: #3f51b5;\n      color: white;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      font-weight: 700;\n      font-size: 0.875rem;\n    }\n\n    .queue-details {\n      flex: 1;\n    }\n\n    .patient-name {\n      font-weight: 500;\n    }\n\n    .doctor-name {\n      font-size: 0.75rem;\n      color: #666;\n    }\n\n    .queue-meta {\n      display: flex;\n      flex-direction: column;\n      align-items: flex-end;\n      gap: 0.25rem;\n    }\n\n    .wait-time {\n      font-size: 0.75rem;\n      color: #666;\n    }\n  "] }]
    }], null, { queueItems: [{
            type: Input
        }], loading: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(QueueWidgetComponent, { className: "QueueWidgetComponent", filePath: "app/features/dashboard/components/queue-widget/queue-widget.component.ts", lineNumber: 123 }); })();
//# sourceMappingURL=queue-widget.component.js.map