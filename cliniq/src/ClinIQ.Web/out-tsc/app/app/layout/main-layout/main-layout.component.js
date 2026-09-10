import { Component, ViewChild } from '@angular/core';
import { Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/layout";
import * as i2 from "@angular/material/sidenav";
import * as i3 from "../header/header.component";
import * as i4 from "../sidebar/sidebar.component";
import * as i5 from "../footer/footer.component";
import * as i6 from "@angular/common";
const _c0 = ["sidenav"];
const _c1 = ["*"];
export class MainLayoutComponent {
    constructor(breakpointObserver) {
        this.breakpointObserver = breakpointObserver;
        this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(result => result.matches), shareReplay());
    }
    ngOnInit() { }
    onMenuItemClick() {
        this.isHandset$.subscribe(isHandset => {
            if (isHandset) {
                this.sidenav.close();
            }
        });
    }
    static { this.ɵfac = function MainLayoutComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || MainLayoutComponent)(i0.ɵɵdirectiveInject(i1.BreakpointObserver)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: MainLayoutComponent, selectors: [["app-main-layout"]], viewQuery: function MainLayoutComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.sidenav = _t.first);
        } }, standalone: false, ngContentSelectors: _c1, decls: 11, vars: 7, consts: [["sidenav", ""], [1, "sidenav-container"], ["fixedTopGap", "64", 1, "sidenav", 3, "mode", "opened", "fixedInViewport"], [3, "menuItemClick"], [1, "sidenav-content"], [3, "menuToggle"], [1, "main-content"]], template: function MainLayoutComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵprojectionDef();
            i0.ɵɵelementStart(0, "mat-sidenav-container", 1)(1, "mat-sidenav", 2, 0);
            i0.ɵɵpipe(3, "async");
            i0.ɵɵpipe(4, "async");
            i0.ɵɵelementStart(5, "app-sidebar", 3);
            i0.ɵɵlistener("menuItemClick", function MainLayoutComponent_Template_app_sidebar_menuItemClick_5_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onMenuItemClick()); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(6, "mat-sidenav-content", 4)(7, "app-header", 5);
            i0.ɵɵlistener("menuToggle", function MainLayoutComponent_Template_app_header_menuToggle_7_listener() { i0.ɵɵrestoreView(_r1); const sidenav_r2 = i0.ɵɵreference(2); return i0.ɵɵresetView(sidenav_r2.toggle()); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "main", 6);
            i0.ɵɵprojection(9);
            i0.ɵɵelementEnd();
            i0.ɵɵelement(10, "app-footer");
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("mode", i0.ɵɵpipeBind1(3, 3, ctx.isHandset$) ? "over" : "side")("opened", !i0.ɵɵpipeBind1(4, 5, ctx.isHandset$))("fixedInViewport", true);
        } }, dependencies: [i2.MatSidenav, i2.MatSidenavContainer, i2.MatSidenavContent, i3.HeaderComponent, i4.SidebarComponent, i5.FooterComponent, i6.AsyncPipe], styles: [".sidenav-container[_ngcontent-%COMP%] {\n      height: 100vh;\n    }\n\n    .sidenav[_ngcontent-%COMP%] {\n      width: 260px;\n      background: #1a237e;\n    }\n\n    .sidenav-content[_ngcontent-%COMP%] {\n      display: flex;\n      flex-direction: column;\n      min-height: 100vh;\n    }\n\n    .main-content[_ngcontent-%COMP%] {\n      flex: 1;\n      padding: 1.5rem;\n      background: #f5f5f5;\n      margin-top: 64px;\n    }\n\n    @media (max-width: 768px) {\n      .main-content[_ngcontent-%COMP%] {\n        padding: 1rem;\n      }\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MainLayoutComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-main-layout', template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav
                   class="sidenav"
                   [mode]="(isHandset$ | async) ? 'over' : 'side'"
                   [opened]="!(isHandset$ | async)"
                   [fixedInViewport]="true"
                   fixedTopGap="64">
        <app-sidebar (menuItemClick)="onMenuItemClick()"></app-sidebar>
      </mat-sidenav>

      <mat-sidenav-content class="sidenav-content">
        <app-header (menuToggle)="sidenav.toggle()"></app-header>
        <main class="main-content">
          <ng-content></ng-content>
        </main>
        <app-footer></app-footer>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `, styles: ["\n    .sidenav-container {\n      height: 100vh;\n    }\n\n    .sidenav {\n      width: 260px;\n      background: #1a237e;\n    }\n\n    .sidenav-content {\n      display: flex;\n      flex-direction: column;\n      min-height: 100vh;\n    }\n\n    .main-content {\n      flex: 1;\n      padding: 1.5rem;\n      background: #f5f5f5;\n      margin-top: 64px;\n    }\n\n    @media (max-width: 768px) {\n      .main-content {\n        padding: 1rem;\n      }\n    }\n  "] }]
    }], () => [{ type: i1.BreakpointObserver }], { sidenav: [{
            type: ViewChild,
            args: ['sidenav']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(MainLayoutComponent, { className: "MainLayoutComponent", filePath: "app/layout/main-layout/main-layout.component.ts", lineNumber: 60 }); })();
//# sourceMappingURL=main-layout.component.js.map