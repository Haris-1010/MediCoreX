import { Component } from '@angular/core';
import { NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@angular/common";
import * as i3 from "@angular/material/progress-spinner";
function AppComponent_div_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 1);
    i0.ɵɵelement(1, "mat-spinner", 2);
    i0.ɵɵelementEnd();
} }
export class AppComponent {
    constructor(router) {
        this.router = router;
        this.isLoading = false;
    }
    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.isLoading = true;
            }
            else if (event instanceof NavigationEnd ||
                event instanceof NavigationCancel ||
                event instanceof NavigationError) {
                this.isLoading = false;
            }
        });
    }
    static { this.ɵfac = function AppComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppComponent)(i0.ɵɵdirectiveInject(i1.Router)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AppComponent, selectors: [["app-root"]], standalone: false, decls: 2, vars: 1, consts: [["class", "app-loading", 4, "ngIf"], [1, "app-loading"], ["diameter", "50"]], template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, AppComponent_div_0_Template, 2, 0, "div", 0);
            i0.ɵɵelement(1, "router-outlet");
        } if (rf & 2) {
            i0.ɵɵproperty("ngIf", ctx.isLoading);
        } }, dependencies: [i2.NgIf, i1.RouterOutlet, i3.MatProgressSpinner], styles: [".app-loading[_ngcontent-%COMP%] {\n      position: fixed;\n      top: 0;\n      left: 0;\n      right: 0;\n      bottom: 0;\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      background: rgba(255, 255, 255, 0.8);\n      z-index: 9999;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-root', template: `
    <div class="app-loading" *ngIf="isLoading">
      <mat-spinner diameter="50"></mat-spinner>
    </div>
    <router-outlet></router-outlet>
  `, styles: ["\n    .app-loading {\n      position: fixed;\n      top: 0;\n      left: 0;\n      right: 0;\n      bottom: 0;\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      background: rgba(255, 255, 255, 0.8);\n      z-index: 9999;\n    }\n  "] }]
    }], () => [{ type: i1.Router }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "app/app.component.ts", lineNumber: 28 }); })();
//# sourceMappingURL=app.component.js.map