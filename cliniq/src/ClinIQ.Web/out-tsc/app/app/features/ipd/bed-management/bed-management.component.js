import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "@angular/router";
import * as i3 from "@angular/common";
import * as i4 from "@angular/material/icon";
import * as i5 from "@angular/material/button-toggle";
import * as i6 from "../../../shared/components/page-header/page-header.component";
import * as i7 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "IPD", route: "/ipd" });
const _c1 = () => ({ label: "Beds" });
const _c2 = (a0, a1) => [a0, a1];
function BedManagementComponent_mat_button_toggle_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-button-toggle", 11);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const w_r1 = ctx.$implicit;
    i0.ɵɵproperty("value", w_r1.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(w_r1.name);
} }
function BedManagementComponent_div_5_div_1_div_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 18)(1, "mat-icon");
    i0.ɵɵtext(2, "person");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const b_r3 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(b_r3.patientName);
} }
function BedManagementComponent_div_5_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 14);
    i0.ɵɵlistener("click", function BedManagementComponent_div_5_div_1_Template_div_click_0_listener() { const b_r3 = i0.ɵɵrestoreView(_r2).$implicit; const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.selectBed(b_r3)); });
    i0.ɵɵelementStart(1, "span", 15);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 16);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, BedManagementComponent_div_5_div_1_div_5_Template, 4, 1, "div", 17);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const b_r3 = ctx.$implicit;
    i0.ɵɵproperty("ngClass", "bed-" + b_r3.status.toLowerCase());
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(b_r3.bedNumber);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(b_r3.bedType);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", b_r3.patientName);
} }
function BedManagementComponent_div_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 12);
    i0.ɵɵtemplate(1, BedManagementComponent_div_5_div_1_Template, 6, 4, "div", 13);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r3 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r3.beds);
} }
export class BedManagementComponent {
    constructor(api, router) {
        this.api = api;
        this.router = router;
        this.wards = [];
        this.beds = [];
        this.selectedWard = null;
    }
    ngOnInit() { this.api.get('v1/wards').subscribe(r => { this.wards = r; if (r.length) {
        this.selectedWard = r[0].id;
        this.loadBeds();
    } }); }
    loadBeds() { if (this.selectedWard)
        this.api.get(`v1/wards/${this.selectedWard}/beds`).subscribe(r => this.beds = r); }
    selectBed(bed) {
        if (bed.status === 'Available') {
            if (confirm(`Admit patient to bed ${bed.bedNumber}?`)) {
                this.router.navigate(['/ipd/admit'], { queryParams: { bedId: bed.id } });
            }
        }
        else if (bed.patientName) {
            alert(`Bed ${bed.bedNumber}\nType: ${bed.bedType}\nStatus: ${bed.status}\nPatient: ${bed.patientName}`);
        }
        else {
            alert(`Bed ${bed.bedNumber}\nType: ${bed.bedType}\nStatus: ${bed.status}`);
        }
    }
    static { this.ɵfac = function BedManagementComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || BedManagementComponent)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.Router)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: BedManagementComponent, selectors: [["app-bed-management"]], standalone: false, decls: 19, vars: 9, consts: [["title", "Bed Management", 3, "breadcrumbs"], [1, "ward-selector"], [3, "valueChange", "change", "value"], [3, "value", 4, "ngFor", "ngForOf"], ["class", "bed-grid", 4, "ngIf"], [1, "legend"], [1, "legend-item"], [1, "dot", "available"], [1, "dot", "occupied"], [1, "dot", "reserved"], [1, "dot", "maintenance"], [3, "value"], [1, "bed-grid"], ["class", "bed", 3, "ngClass", "click", 4, "ngFor", "ngForOf"], [1, "bed", 3, "click", "ngClass"], [1, "bed-number"], [1, "bed-type"], ["class", "patient-info", 4, "ngIf"], [1, "patient-info"]], template: function BedManagementComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout");
            i0.ɵɵelement(1, "app-page-header", 0);
            i0.ɵɵelementStart(2, "div", 1)(3, "mat-button-toggle-group", 2);
            i0.ɵɵtwoWayListener("valueChange", function BedManagementComponent_Template_mat_button_toggle_group_valueChange_3_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.selectedWard, $event) || (ctx.selectedWard = $event); return $event; });
            i0.ɵɵlistener("change", function BedManagementComponent_Template_mat_button_toggle_group_change_3_listener() { return ctx.loadBeds(); });
            i0.ɵɵtemplate(4, BedManagementComponent_mat_button_toggle_4_Template, 2, 2, "mat-button-toggle", 3);
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(5, BedManagementComponent_div_5_Template, 2, 1, "div", 4);
            i0.ɵɵelementStart(6, "div", 5)(7, "span", 6);
            i0.ɵɵelement(8, "span", 7);
            i0.ɵɵtext(9, " Available");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "span", 6);
            i0.ɵɵelement(11, "span", 8);
            i0.ɵɵtext(12, " Occupied");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "span", 6);
            i0.ɵɵelement(14, "span", 9);
            i0.ɵɵtext(15, " Reserved");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "span", 6);
            i0.ɵɵelement(17, "span", 10);
            i0.ɵɵtext(18, " Maintenance");
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(6, _c2, i0.ɵɵpureFunction0(4, _c0), i0.ɵɵpureFunction0(5, _c1)));
            i0.ɵɵadvance(2);
            i0.ɵɵtwoWayProperty("value", ctx.selectedWard);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.wards);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.selectedWard);
        } }, dependencies: [i3.NgClass, i3.NgForOf, i3.NgIf, i4.MatIcon, i5.MatButtonToggleGroup, i5.MatButtonToggle, i6.PageHeaderComponent, i7.MainLayoutComponent], styles: [".ward-selector[_ngcontent-%COMP%] { margin-bottom: 1.5rem; }\n    .bed-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; }\n    .bed[_ngcontent-%COMP%] { background: white; padding: 1rem; border-radius: 8px; text-align: center; cursor: pointer; border: 2px solid transparent; transition: all 0.2s; }\n    .bed[_ngcontent-%COMP%]:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }\n    .bed-available[_ngcontent-%COMP%] { border-color: #4caf50; } .bed-occupied[_ngcontent-%COMP%] { border-color: #f44336; background: #ffebee; }\n    .bed-reserved[_ngcontent-%COMP%] { border-color: #ff9800; background: #fff3e0; } .bed-maintenance[_ngcontent-%COMP%] { border-color: #9e9e9e; background: #f5f5f5; }\n    .bed-number[_ngcontent-%COMP%] { display: block; font-size: 1.5rem; font-weight: 700; } .bed-type[_ngcontent-%COMP%] { display: block; font-size: 0.75rem; color: #666; }\n    .patient-info[_ngcontent-%COMP%] { display: flex; align-items: center; justify-content: center; gap: 0.25rem; margin-top: 0.5rem; font-size: 0.875rem; }\n    .patient-info[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] { font-size: 16px; width: 16px; height: 16px; }\n    .legend[_ngcontent-%COMP%] { display: flex; gap: 1.5rem; margin-top: 1.5rem; padding: 1rem; background: white; border-radius: 8px; }\n    .legend-item[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 0.5rem; } .dot[_ngcontent-%COMP%] { width: 12px; height: 12px; border-radius: 50%; }\n    .dot.available[_ngcontent-%COMP%] { background: #4caf50; } .dot.occupied[_ngcontent-%COMP%] { background: #f44336; } .dot.reserved[_ngcontent-%COMP%] { background: #ff9800; } .dot.maintenance[_ngcontent-%COMP%] { background: #9e9e9e; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(BedManagementComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-bed-management', template: `
    <app-main-layout>
      <app-page-header title="Bed Management" [breadcrumbs]="[{ label: 'IPD', route: '/ipd' }, { label: 'Beds' }]"></app-page-header>
      <div class="ward-selector">
        <mat-button-toggle-group [(value)]="selectedWard" (change)="loadBeds()">
          <mat-button-toggle *ngFor="let w of wards" [value]="w.id">{{ w.name }}</mat-button-toggle>
        </mat-button-toggle-group>
      </div>
      <div class="bed-grid" *ngIf="selectedWard">
        <div class="bed" *ngFor="let b of beds" [ngClass]="'bed-' + b.status.toLowerCase()" (click)="selectBed(b)">
          <span class="bed-number">{{ b.bedNumber }}</span>
          <span class="bed-type">{{ b.bedType }}</span>
          <div class="patient-info" *ngIf="b.patientName"><mat-icon>person</mat-icon>{{ b.patientName }}</div>
        </div>
      </div>
      <div class="legend">
        <span class="legend-item"><span class="dot available"></span> Available</span>
        <span class="legend-item"><span class="dot occupied"></span> Occupied</span>
        <span class="legend-item"><span class="dot reserved"></span> Reserved</span>
        <span class="legend-item"><span class="dot maintenance"></span> Maintenance</span>
      </div>
    </app-main-layout>
  `, styles: [".ward-selector { margin-bottom: 1.5rem; }\n    .bed-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; }\n    .bed { background: white; padding: 1rem; border-radius: 8px; text-align: center; cursor: pointer; border: 2px solid transparent; transition: all 0.2s; }\n    .bed:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }\n    .bed-available { border-color: #4caf50; } .bed-occupied { border-color: #f44336; background: #ffebee; }\n    .bed-reserved { border-color: #ff9800; background: #fff3e0; } .bed-maintenance { border-color: #9e9e9e; background: #f5f5f5; }\n    .bed-number { display: block; font-size: 1.5rem; font-weight: 700; } .bed-type { display: block; font-size: 0.75rem; color: #666; }\n    .patient-info { display: flex; align-items: center; justify-content: center; gap: 0.25rem; margin-top: 0.5rem; font-size: 0.875rem; }\n    .patient-info mat-icon { font-size: 16px; width: 16px; height: 16px; }\n    .legend { display: flex; gap: 1.5rem; margin-top: 1.5rem; padding: 1rem; background: white; border-radius: 8px; }\n    .legend-item { display: flex; align-items: center; gap: 0.5rem; } .dot { width: 12px; height: 12px; border-radius: 50%; }\n    .dot.available { background: #4caf50; } .dot.occupied { background: #f44336; } .dot.reserved { background: #ff9800; } .dot.maintenance { background: #9e9e9e; }"] }]
    }], () => [{ type: i1.ApiService }, { type: i2.Router }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(BedManagementComponent, { className: "BedManagementComponent", filePath: "app/features/ipd/bed-management/bed-management.component.ts", lineNumber: 44 }); })();
//# sourceMappingURL=bed-management.component.js.map