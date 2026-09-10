import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/material/progress-spinner";
function LoadingSpinnerComponent_p_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 3);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.message);
} }
export class LoadingSpinnerComponent {
    constructor() {
        this.diameter = 40;
        this.overlay = false;
    }
    static { this.ɵfac = function LoadingSpinnerComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LoadingSpinnerComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: LoadingSpinnerComponent, selectors: [["app-loading-spinner"]], inputs: { diameter: "diameter", message: "message", overlay: "overlay" }, standalone: false, decls: 3, vars: 4, consts: [[1, "loading-container"], [3, "diameter"], ["class", "loading-message", 4, "ngIf"], [1, "loading-message"]], template: function LoadingSpinnerComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵelement(1, "mat-spinner", 1);
            i0.ɵɵtemplate(2, LoadingSpinnerComponent_p_2_Template, 2, 1, "p", 2);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵclassProp("overlay", ctx.overlay);
            i0.ɵɵadvance();
            i0.ɵɵproperty("diameter", ctx.diameter);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.message);
        } }, dependencies: [i1.NgIf, i2.MatProgressSpinner], styles: [".loading-container[_ngcontent-%COMP%] {\n      display: flex;\n      flex-direction: column;\n      justify-content: center;\n      align-items: center;\n      padding: 2rem;\n    }\n\n    .loading-container.overlay[_ngcontent-%COMP%] {\n      position: absolute;\n      top: 0;\n      left: 0;\n      right: 0;\n      bottom: 0;\n      background: rgba(255, 255, 255, 0.8);\n      z-index: 100;\n    }\n\n    .loading-message[_ngcontent-%COMP%] {\n      margin-top: 1rem;\n      color: #666;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LoadingSpinnerComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-loading-spinner', template: `
    <div class="loading-container" [class.overlay]="overlay">
      <mat-spinner [diameter]="diameter"></mat-spinner>
      <p *ngIf="message" class="loading-message">{{ message }}</p>
    </div>
  `, styles: ["\n    .loading-container {\n      display: flex;\n      flex-direction: column;\n      justify-content: center;\n      align-items: center;\n      padding: 2rem;\n    }\n\n    .loading-container.overlay {\n      position: absolute;\n      top: 0;\n      left: 0;\n      right: 0;\n      bottom: 0;\n      background: rgba(255, 255, 255, 0.8);\n      z-index: 100;\n    }\n\n    .loading-message {\n      margin-top: 1rem;\n      color: #666;\n    }\n  "] }]
    }], null, { diameter: [{
            type: Input
        }], message: [{
            type: Input
        }], overlay: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(LoadingSpinnerComponent, { className: "LoadingSpinnerComponent", filePath: "app/shared/components/loading-spinner/loading-spinner.component.ts", lineNumber: 37 }); })();
//# sourceMappingURL=loading-spinner.component.js.map