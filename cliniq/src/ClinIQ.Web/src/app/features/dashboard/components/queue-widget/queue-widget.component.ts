import { Component, Input } from '@angular/core';

interface QueueItem {
  id: string;
  tokenNumber: number;
  patientName: string;
  doctorName: string;
  status: string;
  waitTime: number;
}

@Component({
  standalone: false,
  selector: 'app-queue-widget',
  template: `
    <div class="queue-widget">
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <div *ngIf="!loading && queueItems.length === 0" class="empty-state">
        <mat-icon>how_to_reg</mat-icon>
        <span>No patients in queue</span>
      </div>

      <div class="queue-list" *ngIf="!loading && queueItems.length > 0">
        <div class="queue-item" *ngFor="let item of queueItems" [class.current]="item.status === 'InProgress'">
          <div class="token-number">
            {{ item.tokenNumber }}
          </div>
          <div class="queue-details">
            <div class="patient-name">{{ item.patientName }}</div>
            <div class="doctor-name">{{ item.doctorName }}</div>
          </div>
          <div class="queue-meta">
            <app-status-badge [status]="item.status"></app-status-badge>
            <span class="wait-time">{{ item.waitTime }} min</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .queue-widget {
      min-height: 200px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      color: #666;
    }

    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ccc;
      margin-bottom: 0.5rem;
    }

    .queue-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .queue-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      border-radius: 8px;
      background: #f5f5f5;
      transition: all 0.2s;
    }

    .queue-item.current {
      background: #e3f2fd;
      border-left: 3px solid #3f51b5;
    }

    .token-number {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #3f51b5;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.875rem;
    }

    .queue-details {
      flex: 1;
    }

    .patient-name {
      font-weight: 500;
    }

    .doctor-name {
      font-size: 0.75rem;
      color: #666;
    }

    .queue-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }

    .wait-time {
      font-size: 0.75rem;
      color: #666;
    }
  `]
})
export class QueueWidgetComponent {
  @Input() queueItems: QueueItem[] = [];
  @Input() loading: boolean = false;
}
