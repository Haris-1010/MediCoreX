import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/material/button";
import * as i3 from "@angular/material/icon";
function EmptyStateComponent_p_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.message);
} }
function EmptyStateComponent_button_6_mat_icon_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-icon");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.actionIcon);
} }
function EmptyStateComponent_button_6_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 3);
    i0.ɵɵlistener("click", function EmptyStateComponent_button_6_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.onAction()); });
    i0.ɵɵtemplate(1, EmptyStateComponent_button_6_mat_icon_1_Template, 2, 1, "mat-icon", 1);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r0.actionIcon);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.actionText, " ");
} }
export class EmptyStateComponent {
    constructor() {
        this.icon = 'inbox';
        this.title = 'No data found';
        this.action = new EventEmitter();
    }
    onAction() {
        this.action.emit();
    }
    static { this.ɵfac = function EmptyStateComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || EmptyStateComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: EmptyStateComponent, selectors: [["app-empty-state"]], inputs: { icon: "icon", title: "title", message: "message", actionText: "actionText", actionIcon: "actionIcon" }, outputs: { action: "action" }, standalone: false, decls: 7, vars: 4, consts: [[1, "empty-state"], [4, "ngIf"], ["mat-raised-button", "", "color", "primary", 3, "click", 4, "ngIf"], ["mat-raised-button", "", "color", "primary", 3, "click"]], template: function EmptyStateComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "mat-icon");
            i0.ɵɵtext(2);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(3, "h3");
            i0.ɵɵtext(4);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(5, EmptyStateComponent_p_5_Template, 2, 1, "p", 1)(6, EmptyStateComponent_button_6_Template, 3, 2, "button", 2);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.icon);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.title);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.message);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.actionText);
        } }, dependencies: [i1.NgIf, i2.MatButton, i3.MatIcon], styles: [".empty-state[_ngcontent-%COMP%] {\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: center;\n      padding: 3rem;\n      text-align: center;\n    }\n\n    mat-icon[_ngcontent-%COMP%] {\n      font-size: 64px;\n      width: 64px;\n      height: 64px;\n      color: #ccc;\n      margin-bottom: 1rem;\n    }\n\n    h3[_ngcontent-%COMP%] {\n      margin: 0 0 0.5rem;\n      color: #333;\n      font-weight: 500;\n    }\n\n    p[_ngcontent-%COMP%] {\n      margin: 0 0 1.5rem;\n      color: #666;\n      max-width: 400px;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(EmptyStateComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-empty-state', template: `
    <div class="empty-state">
      <mat-icon>{{ icon }}</mat-icon>
      <h3>{{ title }}</h3>
      <p *ngIf="message">{{ message }}</p>
      <button mat-raised-button color="primary" *ngIf="actionText" (click)="onAction()">
        <mat-icon *ngIf="actionIcon">{{ actionIcon }}</mat-icon>
        {{ actionText }}
      </button>
    </div>
  `, styles: ["\n    .empty-state {\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: center;\n      padding: 3rem;\n      text-align: center;\n    }\n\n    mat-icon {\n      font-size: 64px;\n      width: 64px;\n      height: 64px;\n      color: #ccc;\n      margin-bottom: 1rem;\n    }\n\n    h3 {\n      margin: 0 0 0.5rem;\n      color: #333;\n      font-weight: 500;\n    }\n\n    p {\n      margin: 0 0 1.5rem;\n      color: #666;\n      max-width: 400px;\n    }\n  "] }]
    }], null, { icon: [{
            type: Input
        }], title: [{
            type: Input
        }], message: [{
            type: Input
        }], actionText: [{
            type: Input
        }], actionIcon: [{
            type: Input
        }], action: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(EmptyStateComponent, { className: "EmptyStateComponent", filePath: "app/shared/components/empty-state/empty-state.component.ts", lineNumber: 48 }); })();
//# sourceMappingURL=empty-state.component.js.map