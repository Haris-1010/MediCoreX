import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "../../../core/services/signalr.service";
import * as i3 from "../../../core/services/notification.service";
import * as i4 from "@angular/common";
import * as i5 from "@angular/material/button";
import * as i6 from "@angular/material/icon";
import * as i7 from "@angular/material/input";
import * as i8 from "@angular/material/select";
import * as i9 from "@angular/material/tooltip";
import * as i10 from "../../../shared/components/page-header/page-header.component";
import * as i11 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "OPD", route: "/opd" });
const _c1 = () => ({ label: "Queue" });
const _c2 = (a0, a1) => [a0, a1];
function QueueManagementComponent_mat_option_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "mat-option", 5);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const d_r1 = ctx.$implicit;
    i0.ɵɵproperty("value", d_r1.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Dr. ", d_r1.fullName, "");
} }
function QueueManagementComponent_div_7_div_4_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 14)(1, "div", 15);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 16)(4, "h2");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 17)(9, "button", 18);
    i0.ɵɵlistener("click", function QueueManagementComponent_div_7_div_4_Template_button_click_9_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.completeConsultation()); });
    i0.ɵɵelementStart(10, "mat-icon");
    i0.ɵɵtext(11, "check");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(12, " Complete");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "button", 19);
    i0.ɵɵlistener("click", function QueueManagementComponent_div_7_div_4_Template_button_click_13_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.skipPatient()); });
    i0.ɵɵelementStart(14, "mat-icon");
    i0.ɵɵtext(15, "skip_next");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(16, " Skip");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r2.currentPatient.tokenNumber);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r2.currentPatient.patientName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("MRN: ", ctx_r2.currentPatient.mrn, "");
} }
function QueueManagementComponent_div_7_div_5_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 20)(1, "mat-icon");
    i0.ɵɵtext(2, "person_off");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4, "No patient currently being served");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 21);
    i0.ɵɵlistener("click", function QueueManagementComponent_div_7_div_5_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.callNext()); });
    i0.ɵɵelementStart(6, "mat-icon");
    i0.ɵɵtext(7, "arrow_forward");
    i0.ɵɵelementEnd();
    i0.ɵɵtext(8, " Call Next");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("disabled", ctx_r2.queue.length === 0);
} }
function QueueManagementComponent_div_7_div_10_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 22)(1, "span", 23);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 24);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 25)(6, "h4");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "p");
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "div", 26)(11, "button", 27);
    i0.ɵɵlistener("click", function QueueManagementComponent_div_7_div_10_Template_button_click_11_listener() { const q_r6 = i0.ɵɵrestoreView(_r5).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.callPatient(q_r6)); });
    i0.ɵɵelementStart(12, "mat-icon");
    i0.ɵɵtext(13, "volume_up");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(14, "button", 28);
    i0.ɵɵlistener("click", function QueueManagementComponent_div_7_div_10_Template_button_click_14_listener() { const q_r6 = i0.ɵɵrestoreView(_r5).$implicit; const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.removeFromQueue(q_r6)); });
    i0.ɵɵelementStart(15, "mat-icon");
    i0.ɵɵtext(16, "close");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const q_r6 = ctx.$implicit;
    const i_r7 = ctx.index;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i_r7 + 1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(q_r6.tokenNumber);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(q_r6.patientName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Wait: ", q_r6.waitTime, " min");
} }
function QueueManagementComponent_div_7_p_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 29);
    i0.ɵɵtext(1, "No patients waiting");
    i0.ɵɵelementEnd();
} }
function QueueManagementComponent_div_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 6)(1, "div", 7)(2, "h3");
    i0.ɵɵtext(3, "Current Patient");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(4, QueueManagementComponent_div_7_div_4_Template, 17, 3, "div", 8)(5, QueueManagementComponent_div_7_div_5_Template, 9, 1, "div", 9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "div", 10)(7, "h3");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 11);
    i0.ɵɵtemplate(10, QueueManagementComponent_div_7_div_10_Template, 17, 4, "div", 12)(11, QueueManagementComponent_div_7_p_11_Template, 2, 0, "p", 13);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngIf", ctx_r2.currentPatient);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r2.currentPatient);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("Waiting Queue (", ctx_r2.queue.length, ")");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngForOf", ctx_r2.queue);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r2.queue.length === 0);
} }
export class QueueManagementComponent {
    constructor(api, signalR, notification) {
        this.api = api;
        this.signalR = signalR;
        this.notification = notification;
        this.doctors = [];
        this.selectedDoctorId = null;
        this.currentPatient = null;
        this.queue = [];
        this.destroy$ = new Subject();
    }
    ngOnInit() {
        this.api.get('v1/doctors').subscribe(r => this.doctors = r);
        this.signalR.queueUpdate$.pipe(takeUntil(this.destroy$)).subscribe(() => this.loadQueue());
    }
    ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }
    loadQueue() {
        if (!this.selectedDoctorId)
            return;
        this.api.get(`v1/opd/queue/${this.selectedDoctorId}`).subscribe(r => { this.currentPatient = r.currentPatient; this.queue = r.waitingQueue; });
    }
    callNext() { this.signalR.callNextToken(this.selectedDoctorId).then(() => this.loadQueue()); }
    callPatient(q) { this.api.post(`v1/opd/queue/${q.id}/call`, {}).subscribe(() => this.loadQueue()); }
    completeConsultation() { this.api.post(`v1/opd/queue/${this.currentPatient.id}/complete`, {}).subscribe(() => { this.notification.success('Consultation completed'); this.loadQueue(); }); }
    skipPatient() { this.api.post(`v1/opd/queue/${this.currentPatient.id}/skip`, {}).subscribe(() => this.loadQueue()); }
    removeFromQueue(q) { this.api.delete('v1/opd/queue', q.id).subscribe(() => this.loadQueue()); }
    static { this.ɵfac = function QueueManagementComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || QueueManagementComponent)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.SignalRService), i0.ɵɵdirectiveInject(i3.NotificationService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: QueueManagementComponent, selectors: [["app-queue-management"]], standalone: false, decls: 8, vars: 9, consts: [["title", "Queue Management", 3, "breadcrumbs"], ["appearance", "outline"], [3, "valueChange", "selectionChange", "value"], [3, "value", 4, "ngFor", "ngForOf"], ["class", "queue-container", 4, "ngIf"], [3, "value"], [1, "queue-container"], [1, "card", "current-patient"], ["class", "patient-info", 4, "ngIf"], ["class", "no-patient", 4, "ngIf"], [1, "card", "waiting-queue"], [1, "queue-list"], ["class", "queue-item", "draggable", "true", 4, "ngFor", "ngForOf"], ["class", "empty", 4, "ngIf"], [1, "patient-info"], [1, "token-large"], [1, "details"], [1, "actions"], ["mat-raised-button", "", "color", "primary", 3, "click"], ["mat-stroked-button", "", 3, "click"], [1, "no-patient"], ["mat-raised-button", "", "color", "primary", 3, "click", "disabled"], ["draggable", "true", 1, "queue-item"], [1, "position"], [1, "token"], [1, "info"], [1, "item-actions"], ["mat-icon-button", "", "matTooltip", "Call", 3, "click"], ["mat-icon-button", "", "matTooltip", "Remove", 3, "click"], [1, "empty"]], template: function QueueManagementComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout")(1, "app-page-header", 0)(2, "mat-form-field", 1)(3, "mat-label");
            i0.ɵɵtext(4, "Select Doctor");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "mat-select", 2);
            i0.ɵɵtwoWayListener("valueChange", function QueueManagementComponent_Template_mat_select_valueChange_5_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.selectedDoctorId, $event) || (ctx.selectedDoctorId = $event); return $event; });
            i0.ɵɵlistener("selectionChange", function QueueManagementComponent_Template_mat_select_selectionChange_5_listener() { return ctx.loadQueue(); });
            i0.ɵɵtemplate(6, QueueManagementComponent_mat_option_6_Template, 2, 2, "mat-option", 3);
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(7, QueueManagementComponent_div_7_Template, 12, 5, "div", 4);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction2(6, _c2, i0.ɵɵpureFunction0(4, _c0), i0.ɵɵpureFunction0(5, _c1)));
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("value", ctx.selectedDoctorId);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.doctors);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.selectedDoctorId);
        } }, dependencies: [i4.NgForOf, i4.NgIf, i5.MatButton, i5.MatIconButton, i6.MatIcon, i7.MatFormField, i7.MatLabel, i8.MatSelect, i8.MatOption, i9.MatTooltip, i10.PageHeaderComponent, i11.MainLayoutComponent], styles: [".queue-container[_ngcontent-%COMP%] { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }\n    .card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; } .card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0 0 1rem; }\n    .current-patient[_ngcontent-%COMP%]   .patient-info[_ngcontent-%COMP%] { display: flex; gap: 1.5rem; align-items: center; }\n    .token-large[_ngcontent-%COMP%] { width: 100px; height: 100px; border-radius: 50%; background: #3f51b5; color: white; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 700; }\n    .details[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] { margin: 0; } .details[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0.25rem 0 1rem; color: #666; }\n    .actions[_ngcontent-%COMP%] { display: flex; gap: 0.5rem; }\n    .no-patient[_ngcontent-%COMP%] { text-align: center; padding: 2rem; } .no-patient[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] { font-size: 64px; width: 64px; height: 64px; color: #ccc; }\n    .queue-list[_ngcontent-%COMP%] { display: flex; flex-direction: column; gap: 0.5rem; }\n    .queue-item[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: #f5f5f5; border-radius: 8px; }\n    .position[_ngcontent-%COMP%] { font-weight: 700; color: #666; min-width: 20px; }\n    .token[_ngcontent-%COMP%] { width: 36px; height: 36px; border-radius: 50%; background: #3f51b5; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.875rem; }\n    .info[_ngcontent-%COMP%] { flex: 1; } .info[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] { margin: 0; font-size: 0.875rem; } .info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0; font-size: 0.75rem; color: #666; }\n    .item-actions[_ngcontent-%COMP%] { display: flex; } .empty[_ngcontent-%COMP%] { text-align: center; color: #666; padding: 1rem; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QueueManagementComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-queue-management', template: `
    <app-main-layout>
      <app-page-header title="Queue Management" [breadcrumbs]="[{ label: 'OPD', route: '/opd' }, { label: 'Queue' }]">
        <mat-form-field appearance="outline">
          <mat-label>Select Doctor</mat-label>
          <mat-select [(value)]="selectedDoctorId" (selectionChange)="loadQueue()">
            <mat-option *ngFor="let d of doctors" [value]="d.id">Dr. {{ d.fullName }}</mat-option>
          </mat-select>
        </mat-form-field>
      </app-page-header>

      <div class="queue-container" *ngIf="selectedDoctorId">
        <div class="card current-patient">
          <h3>Current Patient</h3>
          <div *ngIf="currentPatient" class="patient-info">
            <div class="token-large">{{ currentPatient.tokenNumber }}</div>
            <div class="details">
              <h2>{{ currentPatient.patientName }}</h2>
              <p>MRN: {{ currentPatient.mrn }}</p>
              <div class="actions">
                <button mat-raised-button color="primary" (click)="completeConsultation()"><mat-icon>check</mat-icon> Complete</button>
                <button mat-stroked-button (click)="skipPatient()"><mat-icon>skip_next</mat-icon> Skip</button>
              </div>
            </div>
          </div>
          <div *ngIf="!currentPatient" class="no-patient">
            <mat-icon>person_off</mat-icon>
            <p>No patient currently being served</p>
            <button mat-raised-button color="primary" (click)="callNext()" [disabled]="queue.length === 0"><mat-icon>arrow_forward</mat-icon> Call Next</button>
          </div>
        </div>

        <div class="card waiting-queue">
          <h3>Waiting Queue ({{ queue.length }})</h3>
          <div class="queue-list">
            <div class="queue-item" *ngFor="let q of queue; let i = index" draggable="true">
              <span class="position">{{ i + 1 }}</span>
              <div class="token">{{ q.tokenNumber }}</div>
              <div class="info"><h4>{{ q.patientName }}</h4><p>Wait: {{ q.waitTime }} min</p></div>
              <div class="item-actions">
                <button mat-icon-button (click)="callPatient(q)" matTooltip="Call"><mat-icon>volume_up</mat-icon></button>
                <button mat-icon-button (click)="removeFromQueue(q)" matTooltip="Remove"><mat-icon>close</mat-icon></button>
              </div>
            </div>
            <p *ngIf="queue.length === 0" class="empty">No patients waiting</p>
          </div>
        </div>
      </div>
    </app-main-layout>
  `, styles: [".queue-container { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }\n    .card { background: white; padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; }\n    .current-patient .patient-info { display: flex; gap: 1.5rem; align-items: center; }\n    .token-large { width: 100px; height: 100px; border-radius: 50%; background: #3f51b5; color: white; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 700; }\n    .details h2 { margin: 0; } .details p { margin: 0.25rem 0 1rem; color: #666; }\n    .actions { display: flex; gap: 0.5rem; }\n    .no-patient { text-align: center; padding: 2rem; } .no-patient mat-icon { font-size: 64px; width: 64px; height: 64px; color: #ccc; }\n    .queue-list { display: flex; flex-direction: column; gap: 0.5rem; }\n    .queue-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: #f5f5f5; border-radius: 8px; }\n    .position { font-weight: 700; color: #666; min-width: 20px; }\n    .token { width: 36px; height: 36px; border-radius: 50%; background: #3f51b5; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.875rem; }\n    .info { flex: 1; } .info h4 { margin: 0; font-size: 0.875rem; } .info p { margin: 0; font-size: 0.75rem; color: #666; }\n    .item-actions { display: flex; } .empty { text-align: center; color: #666; padding: 1rem; }"] }]
    }], () => [{ type: i1.ApiService }, { type: i2.SignalRService }, { type: i3.NotificationService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(QueueManagementComponent, { className: "QueueManagementComponent", filePath: "app/features/opd/queue-management/queue-management.component.ts", lineNumber: 75 }); })();
//# sourceMappingURL=queue-management.component.js.map