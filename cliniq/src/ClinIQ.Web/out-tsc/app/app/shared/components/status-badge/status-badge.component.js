import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class StatusBadgeComponent {
    constructor() {
        this.statusMap = {
            // Common statuses
            'active': { class: 'badge-success' },
            'inactive': { class: 'badge-secondary' },
            'pending': { class: 'badge-warning' },
            'completed': { class: 'badge-success' },
            'cancelled': { class: 'badge-danger' },
            'draft': { class: 'badge-secondary' },
            // Appointment statuses
            'scheduled': { class: 'badge-info' },
            'confirmed': { class: 'badge-primary' },
            'checkedin': { class: 'badge-info', text: 'Checked In' },
            'inprogress': { class: 'badge-warning', text: 'In Progress' },
            'noshow': { class: 'badge-danger', text: 'No Show' },
            // Admission statuses
            'admitted': { class: 'badge-info' },
            'discharged': { class: 'badge-success' },
            'transferred': { class: 'badge-warning' },
            // Invoice statuses
            'paid': { class: 'badge-success' },
            'unpaid': { class: 'badge-danger' },
            'partiallypaid': { class: 'badge-warning', text: 'Partially Paid' },
            'overdue': { class: 'badge-danger' },
            'refunded': { class: 'badge-secondary' },
            // Bed statuses
            'available': { class: 'badge-success' },
            'occupied': { class: 'badge-danger' },
            'reserved': { class: 'badge-warning' },
            'maintenance': { class: 'badge-secondary' },
            'cleaning': { class: 'badge-info' },
            // Order statuses
            'ordered': { class: 'badge-info' },
            'processing': { class: 'badge-warning' },
            'shipped': { class: 'badge-info' },
            'delivered': { class: 'badge-success' },
            'returned': { class: 'badge-danger' },
            // Priority
            'low': { class: 'badge-secondary' },
            'normal': { class: 'badge-info' },
            'high': { class: 'badge-warning' },
            'urgent': { class: 'badge-danger' },
            'critical': { class: 'badge-danger' }
        };
    }
    get badgeClass() {
        if (this.customClass) {
            return this.customClass;
        }
        const normalizedStatus = this.status?.toLowerCase().replace(/[_\s-]/g, '');
        return this.statusMap[normalizedStatus]?.class || 'badge-secondary';
    }
    get displayText() {
        if (this.customText) {
            return this.customText;
        }
        const normalizedStatus = this.status?.toLowerCase().replace(/[_\s-]/g, '');
        return this.statusMap[normalizedStatus]?.text || this.status;
    }
    static { this.ɵfac = function StatusBadgeComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StatusBadgeComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StatusBadgeComponent, selectors: [["app-status-badge"]], inputs: { status: "status", customText: "customText", customClass: "customClass" }, standalone: false, decls: 2, vars: 2, consts: [[1, "badge", 3, "ngClass"]], template: function StatusBadgeComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "span", 0);
            i0.ɵɵtext(1);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵproperty("ngClass", ctx.badgeClass);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.displayText, " ");
        } }, dependencies: [i1.NgClass], styles: [".badge[_ngcontent-%COMP%] {\n      display: inline-block;\n      padding: 0.25rem 0.75rem;\n      border-radius: 12px;\n      font-size: 0.75rem;\n      font-weight: 500;\n      text-transform: capitalize;\n    }\n\n    .badge-success[_ngcontent-%COMP%] {\n      background: #e8f5e9;\n      color: #2e7d32;\n    }\n\n    .badge-warning[_ngcontent-%COMP%] {\n      background: #fff3e0;\n      color: #ef6c00;\n    }\n\n    .badge-danger[_ngcontent-%COMP%] {\n      background: #ffebee;\n      color: #c62828;\n    }\n\n    .badge-info[_ngcontent-%COMP%] {\n      background: #e3f2fd;\n      color: #1565c0;\n    }\n\n    .badge-secondary[_ngcontent-%COMP%] {\n      background: #f5f5f5;\n      color: #666;\n    }\n\n    .badge-primary[_ngcontent-%COMP%] {\n      background: #e8eaf6;\n      color: #3f51b5;\n    }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StatusBadgeComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-status-badge', template: `
    <span class="badge" [ngClass]="badgeClass">
      {{ displayText }}
    </span>
  `, styles: ["\n    .badge {\n      display: inline-block;\n      padding: 0.25rem 0.75rem;\n      border-radius: 12px;\n      font-size: 0.75rem;\n      font-weight: 500;\n      text-transform: capitalize;\n    }\n\n    .badge-success {\n      background: #e8f5e9;\n      color: #2e7d32;\n    }\n\n    .badge-warning {\n      background: #fff3e0;\n      color: #ef6c00;\n    }\n\n    .badge-danger {\n      background: #ffebee;\n      color: #c62828;\n    }\n\n    .badge-info {\n      background: #e3f2fd;\n      color: #1565c0;\n    }\n\n    .badge-secondary {\n      background: #f5f5f5;\n      color: #666;\n    }\n\n    .badge-primary {\n      background: #e8eaf6;\n      color: #3f51b5;\n    }\n  "] }]
    }], null, { status: [{
            type: Input
        }], customText: [{
            type: Input
        }], customClass: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StatusBadgeComponent, { className: "StatusBadgeComponent", filePath: "app/shared/components/status-badge/status-badge.component.ts", lineNumber: 52 }); })();
//# sourceMappingURL=status-badge.component.js.map