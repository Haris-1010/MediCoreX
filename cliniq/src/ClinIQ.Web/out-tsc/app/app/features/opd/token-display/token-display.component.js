import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/signalr.service";
import * as i2 from "@angular/common";
import * as i3 from "@angular/material/icon";
function TokenDisplayComponent_div_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 5)(1, "div", 6);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 7);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "div", 8)(6, "span", 9);
    i0.ɵɵtext(7, "Now Serving");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "span", 10);
    i0.ɵɵtext(9);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "span", 11);
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const d_r1 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Dr. ", d_r1.name, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("Room ", d_r1.roomNumber, "");
    i0.ɵɵadvance();
    i0.ɵɵclassProp("calling", d_r1.isCalling);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(d_r1.currentToken || "--");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(d_r1.currentPatient || "Waiting");
} }
function TokenDisplayComponent_div_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 12)(1, "mat-icon");
    i0.ɵɵtext(2, "volume_up");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.announcement);
} }
export class TokenDisplayComponent {
    constructor(signalR) {
        this.signalR = signalR;
        this.currentTime = new Date();
        this.doctors = [];
        this.announcement = null;
        this.destroy$ = new Subject();
    }
    ngOnInit() {
        setInterval(() => this.currentTime = new Date(), 1000);
        this.signalR.tokenCalled$.pipe(takeUntil(this.destroy$)).subscribe(data => {
            const doctor = this.doctors.find(d => d.id === data.doctorId);
            if (doctor) {
                doctor.currentToken = data.tokenNumber;
                doctor.currentPatient = data.patientName;
                doctor.isCalling = true;
                setTimeout(() => doctor.isCalling = false, 5000);
            }
            this.announcement = `Token ${data.tokenNumber} - ${data.patientName} - Please proceed to Room ${data.roomNumber}`;
            setTimeout(() => this.announcement = null, 10000);
        });
        this.doctors = [
            { id: '1', name: 'Smith', roomNumber: '101', currentToken: 15, currentPatient: 'John Doe', isCalling: false },
            { id: '2', name: 'Johnson', roomNumber: '102', currentToken: 8, currentPatient: 'Jane Smith', isCalling: false },
            { id: '3', name: 'Williams', roomNumber: '103', currentToken: null, currentPatient: null, isCalling: false }
        ];
    }
    ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }
    static { this.ɵfac = function TokenDisplayComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TokenDisplayComponent)(i0.ɵɵdirectiveInject(i1.SignalRService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: TokenDisplayComponent, selectors: [["app-token-display"]], standalone: false, decls: 10, vars: 6, consts: [[1, "display-container"], [1, "header"], [1, "display-grid"], ["class", "doctor-display", 4, "ngFor", "ngForOf"], ["class", "announcement", 4, "ngIf"], [1, "doctor-display"], [1, "doctor-name"], [1, "room-number"], [1, "current-token"], [1, "label"], [1, "token"], [1, "patient"], [1, "announcement"]], template: function TokenDisplayComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "h1");
            i0.ɵɵtext(3, "OPD Queue Display");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "p");
            i0.ɵɵtext(5);
            i0.ɵɵpipe(6, "date");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(7, "div", 2);
            i0.ɵɵtemplate(8, TokenDisplayComponent_div_8_Template, 12, 6, "div", 3);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(9, TokenDisplayComponent_div_9_Template, 5, 1, "div", 4);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(6, 3, ctx.currentTime, "mediumTime"));
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("ngForOf", ctx.doctors);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.announcement);
        } }, dependencies: [i2.NgForOf, i2.NgIf, i3.MatIcon, i2.DatePipe], styles: [".display-container[_ngcontent-%COMP%] { min-height: 100vh; background: linear-gradient(135deg, #1a237e 0%, #3f51b5 100%); color: white; padding: 2rem; }\n    .header[_ngcontent-%COMP%] { text-align: center; margin-bottom: 2rem; } .header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] { margin: 0; font-size: 2.5rem; } .header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] { margin: 0; font-size: 1.5rem; opacity: 0.8; }\n    .display-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }\n    .doctor-display[_ngcontent-%COMP%] { background: rgba(255,255,255,0.1); border-radius: 16px; padding: 1.5rem; text-align: center; }\n    .doctor-name[_ngcontent-%COMP%] { font-size: 1.5rem; font-weight: 600; } .room-number[_ngcontent-%COMP%] { font-size: 1rem; opacity: 0.8; margin-bottom: 1rem; }\n    .current-token[_ngcontent-%COMP%] { background: rgba(255,255,255,0.2); border-radius: 12px; padding: 1.5rem; }\n    .current-token.calling[_ngcontent-%COMP%] { animation: _ngcontent-%COMP%_pulse 1s infinite; background: #4caf50; }\n    @keyframes _ngcontent-%COMP%_pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }\n    .current-token[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] { display: block; font-size: 0.875rem; opacity: 0.8; }\n    .current-token[_ngcontent-%COMP%]   .token[_ngcontent-%COMP%] { display: block; font-size: 4rem; font-weight: 700; line-height: 1.2; }\n    .current-token[_ngcontent-%COMP%]   .patient[_ngcontent-%COMP%] { display: block; font-size: 1.25rem; }\n    .announcement[_ngcontent-%COMP%] { position: fixed; bottom: 0; left: 0; right: 0; background: #ff9800; padding: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 1.25rem; animation: _ngcontent-%COMP%_slideUp 0.3s; }\n    @keyframes _ngcontent-%COMP%_slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TokenDisplayComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-token-display', template: `
    <div class="display-container">
      <div class="header"><h1>OPD Queue Display</h1><p>{{ currentTime | date:'mediumTime' }}</p></div>
      <div class="display-grid">
        <div class="doctor-display" *ngFor="let d of doctors">
          <div class="doctor-name">Dr. {{ d.name }}</div>
          <div class="room-number">Room {{ d.roomNumber }}</div>
          <div class="current-token" [class.calling]="d.isCalling">
            <span class="label">Now Serving</span>
            <span class="token">{{ d.currentToken || '--' }}</span>
            <span class="patient">{{ d.currentPatient || 'Waiting' }}</span>
          </div>
        </div>
      </div>
      <div class="announcement" *ngIf="announcement">
        <mat-icon>volume_up</mat-icon>
        <span>{{ announcement }}</span>
      </div>
    </div>
  `, styles: [".display-container { min-height: 100vh; background: linear-gradient(135deg, #1a237e 0%, #3f51b5 100%); color: white; padding: 2rem; }\n    .header { text-align: center; margin-bottom: 2rem; } .header h1 { margin: 0; font-size: 2.5rem; } .header p { margin: 0; font-size: 1.5rem; opacity: 0.8; }\n    .display-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }\n    .doctor-display { background: rgba(255,255,255,0.1); border-radius: 16px; padding: 1.5rem; text-align: center; }\n    .doctor-name { font-size: 1.5rem; font-weight: 600; } .room-number { font-size: 1rem; opacity: 0.8; margin-bottom: 1rem; }\n    .current-token { background: rgba(255,255,255,0.2); border-radius: 12px; padding: 1.5rem; }\n    .current-token.calling { animation: pulse 1s infinite; background: #4caf50; }\n    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }\n    .current-token .label { display: block; font-size: 0.875rem; opacity: 0.8; }\n    .current-token .token { display: block; font-size: 4rem; font-weight: 700; line-height: 1.2; }\n    .current-token .patient { display: block; font-size: 1.25rem; }\n    .announcement { position: fixed; bottom: 0; left: 0; right: 0; background: #ff9800; padding: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 1.25rem; animation: slideUp 0.3s; }\n    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }"] }]
    }], () => [{ type: i1.SignalRService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(TokenDisplayComponent, { className: "TokenDisplayComponent", filePath: "app/features/opd/token-display/token-display.component.ts", lineNumber: 43 }); })();
//# sourceMappingURL=token-display.component.js.map