import { Component } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../../core/services/api.service";
import * as i2 from "@angular/router";
import * as i3 from "@angular/common";
import * as i4 from "@angular/material/button";
import * as i5 from "@angular/material/icon";
import * as i6 from "../../../shared/components/page-header/page-header.component";
import * as i7 from "../../../layout/main-layout/main-layout.component";
const _c0 = () => ({ label: "Dashboard", route: "/dashboard" });
const _c1 = () => ({ label: "Appointments", route: "/appointments" });
const _c2 = () => ({ label: "Calendar" });
const _c3 = (a0, a1, a2) => [a0, a1, a2];
function AppointmentCalendarComponent_div_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 10);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const day_r1 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(day_r1);
} }
function AppointmentCalendarComponent_div_25_div_3_div_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 17);
} if (rf & 2) {
    const a_r5 = ctx.$implicit;
    const ctx_r3 = i0.ɵɵnextContext(3);
    i0.ɵɵstyleProp("background", ctx_r3.getStatusColor(a_r5.status));
} }
function AppointmentCalendarComponent_div_25_div_3_span_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 18);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const day_r3 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("+", day_r3.appointments.length - 3, "");
} }
function AppointmentCalendarComponent_div_25_div_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 14);
    i0.ɵɵtemplate(1, AppointmentCalendarComponent_div_25_div_3_div_1_Template, 1, 2, "div", 15)(2, AppointmentCalendarComponent_div_25_div_3_span_2_Template, 2, 1, "span", 16);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const day_r3 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", day_r3.appointments.slice(0, 3));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", day_r3.appointments.length > 3);
} }
function AppointmentCalendarComponent_div_25_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 11);
    i0.ɵɵlistener("click", function AppointmentCalendarComponent_div_25_Template_div_click_0_listener() { const day_r3 = i0.ɵɵrestoreView(_r2).$implicit; const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.selectDate(day_r3)); });
    i0.ɵɵelementStart(1, "span", 12);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(3, AppointmentCalendarComponent_div_25_div_3_Template, 3, 2, "div", 13);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const day_r3 = ctx.$implicit;
    i0.ɵɵclassProp("other-month", !day_r3.currentMonth)("today", day_r3.isToday);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(day_r3.date.getDate());
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", day_r3.appointments == null ? null : day_r3.appointments.length);
} }
export class AppointmentCalendarComponent {
    constructor(api, router) {
        this.api = api;
        this.router = router;
        this.currentDate = new Date();
        this.weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        this.calendarDays = [];
        this.appointments = [];
    }
    ngOnInit() { this.generateCalendar(); this.loadAppointments(); }
    generateCalendar() {
        const year = this.currentDate.getFullYear(), month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1), lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        const endDate = new Date(lastDay);
        endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
        this.calendarDays = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            this.calendarDays.push({ date: new Date(d), currentMonth: d.getMonth() === month, isToday: d.getTime() === today.getTime(), appointments: [] });
        }
    }
    loadAppointments() {
        const start = this.calendarDays[0]?.date, end = this.calendarDays[this.calendarDays.length - 1]?.date;
        if (!start || !end)
            return;
        this.api.get('v1/appointments/calendar', { startDate: start.toISOString(), endDate: end.toISOString() }).subscribe(r => {
            r.forEach(a => {
                const day = this.calendarDays.find(d => d.date.toDateString() === new Date(a.appointmentDate).toDateString());
                if (day)
                    day.appointments.push(a);
            });
        });
    }
    previousMonth() { this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1); this.generateCalendar(); this.loadAppointments(); }
    nextMonth() { this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1); this.generateCalendar(); this.loadAppointments(); }
    goToToday() { this.currentDate = new Date(); this.generateCalendar(); this.loadAppointments(); }
    selectDate(day) {
        if (day.appointments?.length) {
            this.router.navigate(['/appointments'], { queryParams: { date: day.date.toISOString().split('T')[0] } });
        }
        else {
            this.router.navigate(['/appointments/new'], { queryParams: { date: day.date.toISOString().split('T')[0] } });
        }
    }
    getStatusColor(status) {
        const colors = { Scheduled: '#2196f3', Confirmed: '#3f51b5', CheckedIn: '#ff9800', Completed: '#4caf50', Cancelled: '#f44336' };
        return colors[status] || '#9e9e9e';
    }
    static { this.ɵfac = function AppointmentCalendarComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppointmentCalendarComponent)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.Router)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AppointmentCalendarComponent, selectors: [["app-appointment-calendar"]], standalone: false, decls: 26, vars: 14, consts: [["title", "Appointment Calendar", 3, "breadcrumbs"], ["mat-stroked-button", "", "routerLink", "/appointments"], ["mat-raised-button", "", "color", "primary", "routerLink", "/appointments/new"], [1, "card"], [1, "calendar-header"], ["mat-icon-button", "", 3, "click"], ["mat-stroked-button", "", 3, "click"], [1, "calendar-grid"], ["class", "day-header", 4, "ngFor", "ngForOf"], ["class", "calendar-day", 3, "other-month", "today", "click", 4, "ngFor", "ngForOf"], [1, "day-header"], [1, "calendar-day", 3, "click"], [1, "day-number"], ["class", "appointments", 4, "ngIf"], [1, "appointments"], ["class", "appointment-dot", 3, "background", 4, "ngFor", "ngForOf"], ["class", "more", 4, "ngIf"], [1, "appointment-dot"], [1, "more"]], template: function AppointmentCalendarComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "app-main-layout")(1, "app-page-header", 0)(2, "button", 1)(3, "mat-icon");
            i0.ɵɵtext(4, "list");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(5, " List View");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "button", 2)(7, "mat-icon");
            i0.ɵɵtext(8, "add");
            i0.ɵɵelementEnd();
            i0.ɵɵtext(9, " New Appointment");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(10, "div", 3)(11, "div", 4)(12, "button", 5);
            i0.ɵɵlistener("click", function AppointmentCalendarComponent_Template_button_click_12_listener() { return ctx.previousMonth(); });
            i0.ɵɵelementStart(13, "mat-icon");
            i0.ɵɵtext(14, "chevron_left");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(15, "h3");
            i0.ɵɵtext(16);
            i0.ɵɵpipe(17, "date");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "button", 5);
            i0.ɵɵlistener("click", function AppointmentCalendarComponent_Template_button_click_18_listener() { return ctx.nextMonth(); });
            i0.ɵɵelementStart(19, "mat-icon");
            i0.ɵɵtext(20, "chevron_right");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(21, "button", 6);
            i0.ɵɵlistener("click", function AppointmentCalendarComponent_Template_button_click_21_listener() { return ctx.goToToday(); });
            i0.ɵɵtext(22, "Today");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(23, "div", 7);
            i0.ɵɵtemplate(24, AppointmentCalendarComponent_div_24_Template, 2, 1, "div", 8)(25, AppointmentCalendarComponent_div_25_Template, 4, 6, "div", 9);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("breadcrumbs", i0.ɵɵpureFunction3(10, _c3, i0.ɵɵpureFunction0(7, _c0), i0.ɵɵpureFunction0(8, _c1), i0.ɵɵpureFunction0(9, _c2)));
            i0.ɵɵadvance(15);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(17, 4, ctx.currentDate, "MMMM yyyy"));
            i0.ɵɵadvance(8);
            i0.ɵɵproperty("ngForOf", ctx.weekDays);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.calendarDays);
        } }, dependencies: [i3.NgForOf, i3.NgIf, i2.RouterLink, i4.MatButton, i4.MatIconButton, i5.MatIcon, i6.PageHeaderComponent, i7.MainLayoutComponent, i3.DatePipe], styles: [".card[_ngcontent-%COMP%] { background: white; padding: 1.5rem; border-radius: 8px; }\n    .calendar-header[_ngcontent-%COMP%] { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; } .calendar-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] { margin: 0; min-width: 200px; text-align: center; }\n    .calendar-grid[_ngcontent-%COMP%] { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: #e0e0e0; }\n    .day-header[_ngcontent-%COMP%] { background: #f5f5f5; padding: 0.5rem; text-align: center; font-weight: 600; font-size: 0.875rem; }\n    .calendar-day[_ngcontent-%COMP%] { background: white; min-height: 80px; padding: 0.5rem; cursor: pointer; } .calendar-day[_ngcontent-%COMP%]:hover { background: #f5f5f5; }\n    .calendar-day.other-month[_ngcontent-%COMP%] { color: #ccc; } .calendar-day.today[_ngcontent-%COMP%] { background: #e3f2fd; }\n    .day-number[_ngcontent-%COMP%] { font-weight: 500; } .appointments[_ngcontent-%COMP%] { display: flex; gap: 2px; margin-top: 0.25rem; flex-wrap: wrap; }\n    .appointment-dot[_ngcontent-%COMP%] { width: 8px; height: 8px; border-radius: 50%; } .more[_ngcontent-%COMP%] { font-size: 0.625rem; color: #666; }"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppointmentCalendarComponent, [{
        type: Component,
        args: [{ standalone: false, selector: 'app-appointment-calendar', template: `
    <app-main-layout>
      <app-page-header title="Appointment Calendar"
        [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Appointments', route: '/appointments' }, { label: 'Calendar' }]">
        <button mat-stroked-button routerLink="/appointments"><mat-icon>list</mat-icon> List View</button>
        <button mat-raised-button color="primary" routerLink="/appointments/new"><mat-icon>add</mat-icon> New Appointment</button>
      </app-page-header>

      <div class="card">
        <div class="calendar-header">
          <button mat-icon-button (click)="previousMonth()"><mat-icon>chevron_left</mat-icon></button>
          <h3>{{ currentDate | date:'MMMM yyyy' }}</h3>
          <button mat-icon-button (click)="nextMonth()"><mat-icon>chevron_right</mat-icon></button>
          <button mat-stroked-button (click)="goToToday()">Today</button>
        </div>
        <div class="calendar-grid">
          <div class="day-header" *ngFor="let day of weekDays">{{ day }}</div>
          <div class="calendar-day" *ngFor="let day of calendarDays" [class.other-month]="!day.currentMonth" [class.today]="day.isToday" (click)="selectDate(day)">
            <span class="day-number">{{ day.date.getDate() }}</span>
            <div class="appointments" *ngIf="day.appointments?.length">
              <div class="appointment-dot" *ngFor="let a of day.appointments.slice(0, 3)" [style.background]="getStatusColor(a.status)"></div>
              <span *ngIf="day.appointments.length > 3" class="more">+{{ day.appointments.length - 3 }}</span>
            </div>
          </div>
        </div>
      </div>
    </app-main-layout>
  `, styles: [".card { background: white; padding: 1.5rem; border-radius: 8px; }\n    .calendar-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; } .calendar-header h3 { margin: 0; min-width: 200px; text-align: center; }\n    .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: #e0e0e0; }\n    .day-header { background: #f5f5f5; padding: 0.5rem; text-align: center; font-weight: 600; font-size: 0.875rem; }\n    .calendar-day { background: white; min-height: 80px; padding: 0.5rem; cursor: pointer; } .calendar-day:hover { background: #f5f5f5; }\n    .calendar-day.other-month { color: #ccc; } .calendar-day.today { background: #e3f2fd; }\n    .day-number { font-weight: 500; } .appointments { display: flex; gap: 2px; margin-top: 0.25rem; flex-wrap: wrap; }\n    .appointment-dot { width: 8px; height: 8px; border-radius: 50%; } .more { font-size: 0.625rem; color: #666; }"] }]
    }], () => [{ type: i1.ApiService }, { type: i2.Router }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AppointmentCalendarComponent, { className: "AppointmentCalendarComponent", filePath: "app/features/appointments/appointment-calendar/appointment-calendar.component.ts", lineNumber: 45 }); })();
//# sourceMappingURL=appointment-calendar.component.js.map