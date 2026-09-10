import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { SignalRService } from '../../../core/services/signalr.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-queue-management',
  template: `
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
  `,
  styles: [`.queue-container { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .card { background: white; padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; }
    .current-patient .patient-info { display: flex; gap: 1.5rem; align-items: center; }
    .token-large { width: 100px; height: 100px; border-radius: 50%; background: #3f51b5; color: white; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 700; }
    .details h2 { margin: 0; } .details p { margin: 0.25rem 0 1rem; color: #666; }
    .actions { display: flex; gap: 0.5rem; }
    .no-patient { text-align: center; padding: 2rem; } .no-patient mat-icon { font-size: 64px; width: 64px; height: 64px; color: #ccc; }
    .queue-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .queue-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: #f5f5f5; border-radius: 8px; }
    .position { font-weight: 700; color: #666; min-width: 20px; }
    .token { width: 36px; height: 36px; border-radius: 50%; background: #3f51b5; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.875rem; }
    .info { flex: 1; } .info h4 { margin: 0; font-size: 0.875rem; } .info p { margin: 0; font-size: 0.75rem; color: #666; }
    .item-actions { display: flex; } .empty { text-align: center; color: #666; padding: 1rem; }`]
})
export class QueueManagementComponent implements OnInit, OnDestroy {
  doctors: any[] = [];
  selectedDoctorId: string | null = null;
  currentPatient: any = null;
  queue: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(private api: ApiService, private signalR: SignalRService, private notification: NotificationService) {}

  ngOnInit() {
    this.api.get<any[]>('v1/doctors').subscribe(r => this.doctors = r);
    this.signalR.queueUpdate$.pipe(takeUntil(this.destroy$)).subscribe(() => this.loadQueue());
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  loadQueue() {
    if (!this.selectedDoctorId) return;
    this.api.get<any>(`v1/opd/queue/${this.selectedDoctorId}`).subscribe(r => { this.currentPatient = r.currentPatient; this.queue = r.waitingQueue; });
  }

  callNext() { this.signalR.callNextToken(this.selectedDoctorId!).then(() => this.loadQueue()); }
  callPatient(q: any) { this.api.post(`v1/opd/queue/${q.id}/call`, {}).subscribe(() => this.loadQueue()); }
  completeConsultation() { this.api.post(`v1/opd/queue/${this.currentPatient.id}/complete`, {}).subscribe(() => { this.notification.success('Consultation completed'); this.loadQueue(); }); }
  skipPatient() { this.api.post(`v1/opd/queue/${this.currentPatient.id}/skip`, {}).subscribe(() => this.loadQueue()); }
  removeFromQueue(q: any) { this.api.delete('v1/opd/queue', q.id).subscribe(() => this.loadQueue()); }
}
