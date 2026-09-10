import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@angular/material/icon";
export class AuthLayoutComponent {
    static { this.ɵfac = function AuthLayoutComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AuthLayoutComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AuthLayoutComponent, selectors: [["app-auth-layout"]], standalone: false, decls: 34, vars: 0, consts: [[1, "auth-layout"], [1, "auth-sidebar"], [1, "sidebar-content"], [1, "features"], [1, "auth-main"]], template: function AuthLayoutComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1");
            i0.ɵɵtext(4, "ClinIQ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "p");
            i0.ɵɵtext(6, "Complete Clinic & Hospital Management Solution");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "ul", 3)(8, "li")(9, "mat-icon");
            i0.ɵɵtext(10, "check_circle");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(11, " Patient Management");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "li")(13, "mat-icon");
            i0.ɵɵtext(14, "check_circle");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(15, " Appointment Scheduling");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "li")(17, "mat-icon");
            i0.ɵɵtext(18, "check_circle");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(19, " Electronic Medical Records");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "li")(21, "mat-icon");
            i0.ɵɵtext(22, "check_circle");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(23, " Billing & Invoicing");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "li")(25, "mat-icon");
            i0.ɵɵtext(26, "check_circle");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(27, " Inventory Management");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "li")(29, "mat-icon");
            i0.ɵɵtext(30, "check_circle");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(31, " Real-time Analytics");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(32, "div", 4);
            i0.ɵɵelement(33, "router-outlet");
            i0.ɵɵelementEnd()();
        } }, dependencies: [i1.RouterOutlet, i2.MatIcon], styles: [".auth-layout[_ngcontent-%COMP%] {\n      display: flex;\n      min-height: 100vh;\n    }\n\n    .auth-sidebar[_ngcontent-%COMP%] {\n      flex: 0 0 40%;\n      background: linear-gradient(135deg, #1a237e 0%, #3f51b5 100%);\n      color: white;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      padding: 2rem;\n    }\n\n    .sidebar-content[_ngcontent-%COMP%] {\n      max-width: 400px;\n    }\n\n    .sidebar-content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n      font-size: 3rem;\n      font-weight: 700;\n      margin-bottom: 1rem;\n    }\n\n    .sidebar-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n      font-size: 1.25rem;\n      opacity: 0.9;\n      margin-bottom: 2rem;\n    }\n\n    .features[_ngcontent-%COMP%] {\n      list-style: none;\n      padding: 0;\n    }\n\n    .features[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 0.75rem;\n      padding: 0.5rem 0;\n      font-size: 1rem;\n      opacity: 0.9;\n    }\n\n    .features[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n      color: #00bcd4;\n    }\n\n    .auth-main[_ngcontent-%COMP%] {\n      flex: 1;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      padding: 2rem;\n      background: #f5f5f5;\n    }\n\n    @media (max-width: 992px) {\n      .auth-sidebar[_ngcontent-%COMP%] {\n        display: none;\n      }\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AuthLayoutComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-auth-layout', template: `
    <div class="auth-layout">
      <div class="auth-sidebar">
        <div class="sidebar-content">
          <h1>ClinIQ</h1>
          <p>Complete Clinic & Hospital Management Solution</p>
          <ul class="features">
            <li><mat-icon>check_circle</mat-icon> Patient Management</li>
            <li><mat-icon>check_circle</mat-icon> Appointment Scheduling</li>
            <li><mat-icon>check_circle</mat-icon> Electronic Medical Records</li>
            <li><mat-icon>check_circle</mat-icon> Billing & Invoicing</li>
            <li><mat-icon>check_circle</mat-icon> Inventory Management</li>
            <li><mat-icon>check_circle</mat-icon> Real-time Analytics</li>
          </ul>
        </div>
      </div>
      <div class="auth-main">
        <router-outlet></router-outlet>
      </div>
    </div>
  `, styles: ["\n    .auth-layout {\n      display: flex;\n      min-height: 100vh;\n    }\n\n    .auth-sidebar {\n      flex: 0 0 40%;\n      background: linear-gradient(135deg, #1a237e 0%, #3f51b5 100%);\n      color: white;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      padding: 2rem;\n    }\n\n    .sidebar-content {\n      max-width: 400px;\n    }\n\n    .sidebar-content h1 {\n      font-size: 3rem;\n      font-weight: 700;\n      margin-bottom: 1rem;\n    }\n\n    .sidebar-content p {\n      font-size: 1.25rem;\n      opacity: 0.9;\n      margin-bottom: 2rem;\n    }\n\n    .features {\n      list-style: none;\n      padding: 0;\n    }\n\n    .features li {\n      display: flex;\n      align-items: center;\n      gap: 0.75rem;\n      padding: 0.5rem 0;\n      font-size: 1rem;\n      opacity: 0.9;\n    }\n\n    .features mat-icon {\n      color: #00bcd4;\n    }\n\n    .auth-main {\n      flex: 1;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      padding: 2rem;\n      background: #f5f5f5;\n    }\n\n    @media (max-width: 992px) {\n      .auth-sidebar {\n        display: none;\n      }\n    }\n  "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AuthLayoutComponent, { className: "AuthLayoutComponent", filePath: "app/features/auth/auth-layout/auth-layout.component.ts", lineNumber: 93 }); })();
//# sourceMappingURL=auth-layout.component.js.map