import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-radiology-schedule',
  template: `
    <app-main-layout>
      <app-page-header title="Radiology Schedule" [breadcrumbs]="[{ label: 'Radiology', route: '/radiology' }, { label: 'Schedule' }]">
        <button mat-raised-button color="primary" (click)="showScheduleDialog = true">
          <mat-icon>schedule</mat-icon> Schedule Order
        </button>
      </app-page-header>
      <div class="card">
        <div class="filters">
          <mat-form-field appearance="outline">
            <mat-label>Schedule Date</mat-label>
            <input matInput [matDatepicker]="picker" [(ngModel)]="selectedDate" (dateChange)="load()">
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </div>
        <table mat-table [dataSource]="scheduledItems">
          <ng-container matColumnDef="time"><th mat-header-cell *matHeaderCellDef>Time</th><td mat-cell *matCellDef="let i">{{ i.scheduledAt | date:'shortTime' }}</td></ng-container>
          <ng-container matColumnDef="orderNumber"><th mat-header-cell *matHeaderCellDef>Order #</th><td mat-cell *matCellDef="let i">{{ i.orderNumber }}</td></ng-container>
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let i">{{ i.patientName }}<br><small>{{ i.mrn }}</small></td></ng-container>
          <ng-container matColumnDef="investigation"><th mat-header-cell *matHeaderCellDef>Investigation</th><td mat-cell *matCellDef="let i">{{ i.serviceName }}</td></ng-container>
          <ng-container matColumnDef="modality"><th mat-header-cell *matHeaderCellDef>Modality</th><td mat-cell *matCellDef="let i">{{ i.modality }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let i"><app-status-badge [status]="i.status"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>Actions</th><td mat-cell *matCellDef="let i">
            <button mat-raised-button color="primary" (click)="markArrived(i)" *ngIf="i.status === 'Scheduled'">
              <mat-icon>person</mat-icon> Patient Arrived
            </button>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <div *ngIf="scheduledItems.length === 0" class="empty-state">
          <mat-icon>calendar_month</mat-icon>
          <p>No scheduled studies for this date</p>
        </div>
      </div>

      <!-- Schedule Dialog -->
      <div class="dialog-overlay" *ngIf="showScheduleDialog" (click)="showScheduleDialog = false">
        <div class="dialog" (click)="$event.stopPropagation()">
          <h3>Schedule Radiology Order</h3>
          <div class="dialog-content">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Select Order</mat-label>
              <mat-select [(ngModel)]="selectedOrderId">
                <mat-option *ngFor="let o of unscheduledOrders" [value]="o.id">
                  {{ o.orderNumber }} - {{ o.patientName }} ({{ o.items?.[0]?.serviceName || 'N/A' }})
                </mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Schedule Date & Time</mat-label>
              <input matInput [matDatepicker]="schedulePicker" [matDatepickerFilter]="dateFilter" [(ngModel)]="scheduleDate">
              <mat-datepicker-toggle matIconSuffix [for]="schedulePicker"></mat-datepicker-toggle>
              <mat-datepicker #schedulePicker></mat-datepicker>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Time</mat-label>
              <input matInput type="time" [(ngModel)]="scheduleTime">
            </mat-form-field>
          </div>
          <div class="dialog-actions">
            <button mat-stroked-button (click)="showScheduleDialog = false">Cancel</button>
            <button mat-raised-button color="primary" (click)="scheduleOrder()" [disabled]="!selectedOrderId || !scheduleDate || !scheduleTime || scheduling">
              {{ scheduling ? 'Scheduling...' : 'Schedule' }}
            </button>
          </div>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; }
    .filters { display: flex; gap: 1rem; margin-bottom: 1rem; }
    table { width: 100%; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 2rem; color: var(--text-muted, #999); }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 0.5rem; }
    .dialog-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .dialog { background: var(--bg-card, #fff); border-radius: 12px; padding: 1.5rem; max-width: 500px; width: 90%; }
    .dialog h3 { margin: 0 0 1rem; }
    .dialog-content { margin-bottom: 1rem; }
    .full-width { width: 100%; }
    .dialog-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }
  `]
})
export class RadiologyScheduleComponent implements OnInit {
  scheduledItems: any[] = [];
  unscheduledOrders: any[] = [];
  selectedDate = new Date();
  columns = ['time', 'orderNumber', 'patient', 'investigation', 'modality', 'status', 'actions'];
  showScheduleDialog = false;
  selectedOrderId = '';
  scheduleDate = new Date();
  scheduleTime = '09:00';
  scheduling = false;

  dateFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d ? d >= today : false;
  };

  constructor(private api: ApiService, private notification: NotificationService) {}

  ngOnInit() { this.load(); this.loadUnscheduled(); }

  load() {
    const dateStr = this.selectedDate.toISOString().split('T')[0];
    this.api.get<any[]>('v1/radiology/schedule', { date: dateStr }).subscribe({
      next: r => this.scheduledItems = r,
      error: (err) => this.notification.error(err?.message || 'Failed to load schedule')
    });
  }

  loadUnscheduled() {
    this.api.get<any>('v1/radiology/orders', { status: 'Ordered', pageSize: 100 }).subscribe({
      next: r => {
        const data = r;
        this.unscheduledOrders = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
      },
      error: (err) => { this.notification.error(err?.message || 'Failed to load unscheduled orders'); }
    });
  }

  scheduleOrder() {
    if (!this.selectedOrderId || !this.scheduleDate || !this.scheduleTime) return;
    this.scheduling = true;
    const dateTime = new Date(this.scheduleDate);
    const [hours, minutes] = this.scheduleTime.split(':').map(Number);
    dateTime.setHours(hours, minutes, 0, 0);

    this.api.post(`v1/radiology/orders/${this.selectedOrderId}/schedule`, {
      scheduledAt: dateTime.toISOString()
    }).subscribe({
      next: () => {
        this.notification.success('Order scheduled');
        this.showScheduleDialog = false;
        this.load();
        this.loadUnscheduled();
        this.scheduling = false;
      },
      error: (err) => { this.scheduling = false; this.notification.error(err?.message || 'Failed to schedule order'); }
    });
  }

  markArrived(item: any) {
    this.api.post(`v1/radiology/orders/${item.orderId}/patient-arrived`, {}).subscribe({
      next: () => { this.notification.success('Patient marked as arrived'); this.load(); },
      error: (err) => this.notification.error(err?.message || 'Failed to mark patient arrived')
    });
  }
}
