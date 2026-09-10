import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  standalone: false,
  selector: 'app-appointment-calendar',
  template: `
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
  `,
  styles: [`.card { background: white; padding: 1.5rem; border-radius: 8px; }
    .calendar-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; } .calendar-header h3 { margin: 0; min-width: 200px; text-align: center; }
    .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: #e0e0e0; }
    .day-header { background: #f5f5f5; padding: 0.5rem; text-align: center; font-weight: 600; font-size: 0.875rem; }
    .calendar-day { background: white; min-height: 80px; padding: 0.5rem; cursor: pointer; } .calendar-day:hover { background: #f5f5f5; }
    .calendar-day.other-month { color: #ccc; } .calendar-day.today { background: #e3f2fd; }
    .day-number { font-weight: 500; } .appointments { display: flex; gap: 2px; margin-top: 0.25rem; flex-wrap: wrap; }
    .appointment-dot { width: 8px; height: 8px; border-radius: 50%; } .more { font-size: 0.625rem; color: #666; }`]
})
export class AppointmentCalendarComponent implements OnInit {
  currentDate = new Date();
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: any[] = [];
  appointments: any[] = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() { this.generateCalendar(); this.loadAppointments(); }

  private normalizeList<T>(value: any): T[] {
    if (Array.isArray(value)) return value as T[];
    if (!value || typeof value !== 'object') return [];
    if (Array.isArray(value.items)) return value.items as T[];
    if (Array.isArray(value.data)) return value.data as T[];
    if (Array.isArray(value.results)) return value.results as T[];
    if (Array.isArray(value.appointments)) return value.appointments as T[];
    return [];
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear(), month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1), lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay); startDate.setDate(startDate.getDate() - firstDay.getDay());
    const endDate = new Date(lastDay); endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    this.calendarDays = [];
    const today = new Date(); today.setHours(0, 0, 0, 0);
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      this.calendarDays.push({ date: new Date(d), currentMonth: d.getMonth() === month, isToday: d.getTime() === today.getTime(), appointments: [] });
    }
  }

  loadAppointments() {
    const start = this.calendarDays[0]?.date, end = this.calendarDays[this.calendarDays.length - 1]?.date;
    if (!start || !end) return;
    this.api.get<any[]>('v1/appointments/calendar', { start: start.toISOString(), end: end.toISOString() }).subscribe(r => {
      const items = this.normalizeList<any>(r);
      items.forEach(a => {
        const day = this.calendarDays.find(d => d.date.toDateString() === new Date(a.appointmentDate).toDateString());
        if (day) day.appointments.push(a);
      });
    });
  }

  previousMonth() { this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1); this.generateCalendar(); this.loadAppointments(); }
  nextMonth() { this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1); this.generateCalendar(); this.loadAppointments(); }
  goToToday() { this.currentDate = new Date(); this.generateCalendar(); this.loadAppointments(); }
  selectDate(day: any) {
    if (day.appointments?.length) {
      this.router.navigate(['/appointments'], { queryParams: { date: day.date.toISOString().split('T')[0] } });
    } else {
      this.router.navigate(['/appointments/new'], { queryParams: { date: day.date.toISOString().split('T')[0] } });
    }
  }
  getStatusColor(status: string): string {
    const colors: any = { Scheduled: '#2196f3', Confirmed: '#3f51b5', CheckedIn: '#ff9800', Completed: '#4caf50', Cancelled: '#f44336' };
    return colors[status] || '#9e9e9e';
  }
}