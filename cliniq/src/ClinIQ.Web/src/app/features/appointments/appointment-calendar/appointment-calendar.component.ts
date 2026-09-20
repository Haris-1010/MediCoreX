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
          <div class="legend">
            <span class="legend-item"><span class="dot" style="background:#2196f3"></span>Scheduled</span>
            <span class="legend-item"><span class="dot" style="background:#ff9800"></span>Checked In</span>
            <span class="legend-item"><span class="dot" style="background:#4caf50"></span>Completed</span>
            <span class="legend-item"><span class="dot" style="background:#f44336"></span>Cancelled</span>
          </div>
        </div>
        <div class="calendar-grid">
          <div class="day-header" *ngFor="let day of weekDays">{{ day }}</div>
          <div class="calendar-day" *ngFor="let day of calendarDays"
               [class.other-month]="!day.currentMonth"
               [class.today]="day.isToday"
               [class.has-appointments]="day.appointments?.length"
               (click)="selectDate(day)">
            <span class="day-number">{{ day.date.getDate() }}</span>
            <div class="day-appointments" *ngIf="day.appointments?.length">
              <div class="apt-chip" *ngFor="let a of day.appointments.slice(0, 3)"
                   [style.border-left-color]="getStatusColor(a.status)">
                <div class="apt-info">
                  <span class="apt-time">{{ a.startTime || '00:00' }}</span>
                  <span class="apt-name">{{ a.patientName || a.title }}</span>
                  <span class="apt-doctor" *ngIf="a.doctorName">Dr. {{ a.doctorName }}</span>
                </div>
              </div>
              <div class="more-count" *ngIf="day.appointments.length > 3">
                +{{ day.appointments.length - 3 }} more
              </div>
            </div>
          </div>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; }

    .calendar-header {
      display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap;
    }
    .calendar-header h3 { margin: 0; min-width: 200px; text-align: center; font-size: 1.1rem; color: #1a237e; }

    .legend {
      margin-left: auto; display: flex; gap: 1rem; font-size: 0.75rem; color: var(--text-muted, #666);
    }
    .legend-item { display: flex; align-items: center; gap: 4px; }
    .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }

    .calendar-grid {
      display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: #e0e0e0; border-radius: 8px; overflow: hidden;
    }

    .day-header {
      background: #1a237e; color: white; padding: 0.5rem; text-align: center;
      font-weight: 600; font-size: 0.8rem; text-transform: uppercase;
    }

    .calendar-day {
      background: var(--bg-card, #fff); min-height: 100px; padding: 0.4rem; cursor: pointer;
      transition: background 0.15s;
    }
    .calendar-day:hover { background: var(--bg-hover, #f5f5f5); }
    .calendar-day.other-month { background: var(--bg-hover, #f5f5f5); }
    .calendar-day.other-month .day-number { color: #bbb; }
    .calendar-day.today { background: #e3f2fd; }
    .calendar-day.today .day-number { color: #1565c0; font-weight: 700; }
    .calendar-day.has-appointments { background: var(--bg-muted, #f5f5f5); }

    .day-number { font-weight: 500; font-size: 0.85rem; display: block; margin-bottom: 2px; }

    .day-appointments { display: flex; flex-direction: column; gap: 2px; }

    .apt-chip {
      display: flex; align-items: center; gap: 4px;
      padding: 2px 4px; border-radius: 3px;
      border-left: 3px solid #2196f3;
      background: var(--bg-muted, #f5f5f5);
      font-size: 0.65rem;
      line-height: 1.3;
      overflow: hidden;
    }
    .apt-info { display: flex; flex-direction: column; overflow: hidden; }
    .apt-time { font-weight: 600; color: #3f51b5; }
    .apt-name { color: var(--text-primary, #333); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .apt-doctor { color: #7986cb; font-size: 0.6rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    .more-count {
      font-size: 0.65rem; color: #5c6bc0; font-weight: 600; padding: 1px 4px;
    }
  `]
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
        const day = this.calendarDays.find(d => d.date.toDateString() === new Date(a.appointmentDate || a.start).toDateString());
        if (day) {
          const startTime = a.start ? new Date(a.start) : null;
          day.appointments.push({
            ...a,
            startTime: startTime ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : '',
            patientName: a.title ? a.title.split(' - ')[0] : a.patientName || '',
            doctorName: a.title ? a.title.split(' - ')[1] : a.doctorName || ''
          });
        }
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
