import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/router";
import * as i3 from "@angular/material/icon";
const _c0 = ["*"];
function PageHeaderComponent_nav_2_ng_container_1_a_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "a", 9);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r1 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("routerLink", item_r1.route);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r1.label);
} }
function PageHeaderComponent_nav_2_ng_container_1_span_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r1 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r1.label);
} }
function PageHeaderComponent_nav_2_ng_container_1_mat_icon_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-icon");
    i0.ɵɵtext(1, "chevron_right");
    i0.ɵɵelementEnd();
} }
function PageHeaderComponent_nav_2_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, PageHeaderComponent_nav_2_ng_container_1_a_1_Template, 2, 2, "a", 7)(2, PageHeaderComponent_nav_2_ng_container_1_span_2_Template, 2, 1, "span", 8)(3, PageHeaderComponent_nav_2_ng_container_1_mat_icon_3_Template, 2, 0, "mat-icon", 8);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const item_r1 = ctx.$implicit;
    const last_r2 = ctx.last;
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", item_r1.route && !last_r2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !item_r1.route || last_r2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !last_r2);
} }
function PageHeaderComponent_nav_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "nav", 5);
    i0.ɵɵtemplate(1, PageHeaderComponent_nav_2_ng_container_1_Template, 4, 3, "ng-container", 6);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r2.breadcrumbs);
} }
function PageHeaderComponent_p_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 10);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r2.subtitle);
} }
export class PageHeaderComponent {
    static { this.ɵfac = function PageHeaderComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PageHeaderComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PageHeaderComponent, selectors: [["app-page-header"]], inputs: { title: "title", subtitle: "subtitle", breadcrumbs: "breadcrumbs" }, standalone: false, ngContentSelectors: _c0, decls: 8, vars: 3, consts: [[1, "page-header"], [1, "header-left"], ["class", "breadcrumb", 4, "ngIf"], ["class", "subtitle", 4, "ngIf"], [1, "header-right"], [1, "breadcrumb"], [4, "ngFor", "ngForOf"], [3, "routerLink", 4, "ngIf"], [4, "ngIf"], [3, "routerLink"], [1, "subtitle"]], template: function PageHeaderComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1);
            i0.ɵɵtemplate(2, PageHeaderComponent_nav_2_Template, 2, 1, "nav", 2);
            i0.ɵɵelementStart(3, "h1");
            i0.ɵɵtext(4);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(5, PageHeaderComponent_p_5_Template, 2, 1, "p", 3);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "div", 4);
            i0.ɵɵprojection(7);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", ctx.breadcrumbs == null ? null : ctx.breadcrumbs.length);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.title);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.subtitle);
        } }, dependencies: [i1.NgForOf, i1.NgIf, i2.RouterLink, i3.MatIcon], styles: [".page-header[_ngcontent-%COMP%] {\n      display: flex;\n      justify-content: space-between;\n      align-items: flex-start;\n      margin-bottom: 1.5rem;\n      flex-wrap: wrap;\n      gap: 1rem;\n    }\n\n    .header-left[_ngcontent-%COMP%] {\n      flex: 1;\n    }\n\n    .breadcrumb[_ngcontent-%COMP%] {\n      display: flex;\n      align-items: center;\n      gap: 0.25rem;\n      font-size: 0.875rem;\n      color: #666;\n      margin-bottom: 0.5rem;\n    }\n\n    .breadcrumb[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n      color: #3f51b5;\n      text-decoration: none;\n    }\n\n    .breadcrumb[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n      text-decoration: underline;\n    }\n\n    .breadcrumb[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n      font-size: 16px;\n      width: 16px;\n      height: 16px;\n    }\n\n    h1[_ngcontent-%COMP%] {\n      margin: 0;\n      font-size: 1.5rem;\n      font-weight: 600;\n      color: #333;\n    }\n\n    .subtitle[_ngcontent-%COMP%] {\n      margin: 0.25rem 0 0;\n      color: #666;\n      font-size: 0.875rem;\n    }\n\n    .header-right[_ngcontent-%COMP%] {\n      display: flex;\n      gap: 0.5rem;\n      align-items: center;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PageHeaderComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-page-header', template: `
    <div class="page-header">
      <div class="header-left">
        <nav class="breadcrumb" *ngIf="breadcrumbs?.length">
          <ng-container *ngFor="let item of breadcrumbs; let last = last">
            <a *ngIf="item.route && !last" [routerLink]="item.route">{{ item.label }}</a>
            <span *ngIf="!item.route || last">{{ item.label }}</span>
            <mat-icon *ngIf="!last">chevron_right</mat-icon>
          </ng-container>
        </nav>
        <h1>{{ title }}</h1>
        <p *ngIf="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
      <div class="header-right">
        <ng-content></ng-content>
      </div>
    </div>
  `, styles: ["\n    .page-header {\n      display: flex;\n      justify-content: space-between;\n      align-items: flex-start;\n      margin-bottom: 1.5rem;\n      flex-wrap: wrap;\n      gap: 1rem;\n    }\n\n    .header-left {\n      flex: 1;\n    }\n\n    .breadcrumb {\n      display: flex;\n      align-items: center;\n      gap: 0.25rem;\n      font-size: 0.875rem;\n      color: #666;\n      margin-bottom: 0.5rem;\n    }\n\n    .breadcrumb a {\n      color: #3f51b5;\n      text-decoration: none;\n    }\n\n    .breadcrumb a:hover {\n      text-decoration: underline;\n    }\n\n    .breadcrumb mat-icon {\n      font-size: 16px;\n      width: 16px;\n      height: 16px;\n    }\n\n    h1 {\n      margin: 0;\n      font-size: 1.5rem;\n      font-weight: 600;\n      color: #333;\n    }\n\n    .subtitle {\n      margin: 0.25rem 0 0;\n      color: #666;\n      font-size: 0.875rem;\n    }\n\n    .header-right {\n      display: flex;\n      gap: 0.5rem;\n      align-items: center;\n    }\n  "] }]
    }], null, { title: [{
            type: Input
        }], subtitle: [{
            type: Input
        }], breadcrumbs: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PageHeaderComponent, { className: "PageHeaderComponent", filePath: "app/shared/components/page-header/page-header.component.ts", lineNumber: 87 }); })();
//# sourceMappingURL=page-header.component.js.map