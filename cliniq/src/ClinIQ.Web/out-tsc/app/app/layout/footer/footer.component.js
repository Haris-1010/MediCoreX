import { Component } from '@angular/core';
import * as i0 from "@angular/core";
export class FooterComponent {
    constructor() {
        this.currentYear = new Date().getFullYear();
    }
    static { this.ɵfac = function FooterComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || FooterComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: FooterComponent, selectors: [["app-footer"]], standalone: false, decls: 11, vars: 1, consts: [[1, "footer"], [1, "separator"], ["href", "/privacy"], ["href", "/terms"]], template: function FooterComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "footer", 0)(1, "span");
            i0.ɵɵtext(2);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(3, "span", 1);
            i0.ɵɵtext(4, "|");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "a", 2);
            i0.ɵɵtext(6, "Privacy Policy");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "span", 1);
            i0.ɵɵtext(8, "|");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "a", 3);
            i0.ɵɵtext(10, "Terms of Service");
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1("\u00A9 ", ctx.currentYear, " ClinIQ. All rights reserved.");
        } }, styles: [".footer[_ngcontent-%COMP%] {\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      gap: 0.5rem;\n      padding: 1rem;\n      background: white;\n      border-top: 1px solid #e0e0e0;\n      font-size: 0.75rem;\n      color: #666;\n    }\n\n    .separator[_ngcontent-%COMP%] {\n      color: #ccc;\n    }\n\n    a[_ngcontent-%COMP%] {\n      color: #3f51b5;\n      text-decoration: none;\n    }\n\n    a[_ngcontent-%COMP%]:hover {\n      text-decoration: underline;\n    }\n\n    @media (max-width: 768px) {\n      .footer[_ngcontent-%COMP%] {\n        flex-wrap: wrap;\n      }\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(FooterComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-footer', template: `
    <footer class="footer">
      <span>&copy; {{ currentYear }} ClinIQ. All rights reserved.</span>
      <span class="separator">|</span>
      <a href="/privacy">Privacy Policy</a>
      <span class="separator">|</span>
      <a href="/terms">Terms of Service</a>
    </footer>
  `, styles: ["\n    .footer {\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      gap: 0.5rem;\n      padding: 1rem;\n      background: white;\n      border-top: 1px solid #e0e0e0;\n      font-size: 0.75rem;\n      color: #666;\n    }\n\n    .separator {\n      color: #ccc;\n    }\n\n    a {\n      color: #3f51b5;\n      text-decoration: none;\n    }\n\n    a:hover {\n      text-decoration: underline;\n    }\n\n    @media (max-width: 768px) {\n      .footer {\n        flex-wrap: wrap;\n      }\n    }\n  "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(FooterComponent, { className: "FooterComponent", filePath: "app/layout/footer/footer.component.ts", lineNumber: 48 }); })();
//# sourceMappingURL=footer.component.js.map