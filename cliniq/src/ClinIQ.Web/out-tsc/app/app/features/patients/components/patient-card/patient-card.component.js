import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../../shared/components/status-badge/status-badge.component";
export class PatientCardComponent {
    constructor() {
        this.cardClick = new EventEmitter();
    }
    getInitials() {
        return (this.patient?.firstName?.charAt(0) || '') + (this.patient?.lastName?.charAt(0) || '');
    }
    static { this.ɵfac = function PatientCardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PatientCardComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PatientCardComponent, selectors: [["app-patient-card"]], inputs: { patient: "patient" }, outputs: { cardClick: "cardClick" }, standalone: false, decls: 11, vars: 6, consts: [[1, "patient-card", 3, "click"], [1, "avatar"], [1, "info"], [3, "status"]], template: function PatientCardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵlistener("click", function PatientCardComponent_Template_div_click_0_listener() { return ctx.cardClick.emit(ctx.patient); });
            i0.ɵɵelementStart(1, "div", 1);
            i0.ɵɵtext(2);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(3, "div", 2)(4, "h4");
            i0.ɵɵtext(5);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "p");
            i0.ɵɵtext(7);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "p");
            i0.ɵɵtext(9);
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(10, "app-status-badge", 3);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.getInitials());
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.patient.fullName);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1("MRN: ", ctx.patient.mrn, "");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate2("", ctx.patient.gender, ", ", ctx.patient.age, " years");
            i0.ɵɵadvance();
            i0.ɵɵproperty("status", ctx.patient.status);
        } }, dependencies: [i1.StatusBadgeComponent], styles: [".patient-card[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); cursor: pointer; }\n    .patient-card[_ngcontent-%COMP%]:hover { box-shadow: 0 4px 8px rgba(0,0,0,0.15); }\n    .avatar[_ngcontent-%COMP%] { width: 48px; height: 48px; border-radius: 50%; background: #3f51b5; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; }\n    .info[_ngcontent-%COMP%] { flex: 1; }\n    .info[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] { margin: 0; }\n    .info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0; font-size: 0.875rem; color: #666; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PatientCardComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-patient-card', template: `
    <div class="patient-card" (click)="cardClick.emit(patient)">
      <div class="avatar">{{ getInitials() }}</div>
      <div class="info">
        <h4>{{ patient.fullName }}</h4>
        <p>MRN: {{ patient.mrn }}</p>
        <p>{{ patient.gender }}, {{ patient.age }} years</p>
      </div>
      <app-status-badge [status]="patient.status"></app-status-badge>
    </div>
  `, styles: ["\n    .patient-card { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); cursor: pointer; }\n    .patient-card:hover { box-shadow: 0 4px 8px rgba(0,0,0,0.15); }\n    .avatar { width: 48px; height: 48px; border-radius: 50%; background: #3f51b5; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; }\n    .info { flex: 1; }\n    .info h4 { margin: 0; }\n    .info p { margin: 0; font-size: 0.875rem; color: #666; }\n  "] }]
    }], null, { patient: [{
            type: Input
        }], cardClick: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PatientCardComponent, { className: "PatientCardComponent", filePath: "app/features/patients/components/patient-card/patient-card.component.ts", lineNumber: 26 }); })();
//# sourceMappingURL=patient-card.component.js.map