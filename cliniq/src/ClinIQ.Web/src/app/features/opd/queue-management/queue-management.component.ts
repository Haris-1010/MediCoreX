import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { SignalRService } from '../../../core/services/signalr.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AudioAnnouncementService } from '../token-generation/audio-announcement.service';

@Component({
  standalone: false,
  selector: 'app-queue-management',
  template: `
    <app-main-layout>
      <app-page-header title="Queue Management" [breadcrumbs]="[{ label: 'OPD', route: '/opd' }, { label: 'Queue' }]">
        <mat-form-field appearance="outline" class="doctor-select">
          <mat-label>Select Doctor</mat-label>
          <mat-select [(value)]="selectedDoctorId" (selectionChange)="loadQueue()">
            <mat-option *ngFor="let d of doctors" [value]="d.id">Dr. {{ d.fullName }}</mat-option>
          </mat-select>
        </mat-form-field>
      </app-page-header>

      <div class="queue-container" *ngIf="selectedDoctorId">
        <!-- Current Patient -->
        <div class="card current-patient">
          <div class="card-title">
            <mat-icon>person</mat-icon>
            <h3>Current Patient</h3>
          </div>

          <div *ngIf="currentPatient" class="patient-info">
            <div class="token-circle-large">
              {{ currentPatient.tokenNumber }}
            </div>
            <div class="details">
              <h2>{{ currentPatient.patientName }}</h2>
              <p class="mrn">MRN: {{ currentPatient.mrn }}</p>
              <p class="wait" *ngIf="currentPatient.waitTime">Wait time: {{ currentPatient.waitTime }} min</p>
              <div class="actions">
                <button mat-raised-button color="primary" (click)="completeConsultation()">
                  <mat-icon>check</mat-icon> Complete
                </button>
                <button mat-stroked-button (click)="skipPatient()">
                  <mat-icon>skip_next</mat-icon> Skip
                </button>
                <button mat-stroked-button (click)="recallPatient()" matTooltip="Recall this patient">
                  <mat-icon>replay</mat-icon> Recall
                </button>
              </div>
            </div>
          </div>

          <div *ngIf="!currentPatient" class="no-patient">
            <mat-icon>person_off</mat-icon>
            <p>No patient currently being served</p>
            <button mat-raised-button color="primary" (click)="callNext()" [disabled]="waitingQueue.length === 0">
              <mat-icon>volume_up</mat-icon> Call Next Patient
            </button>
          </div>
        </div>

        <!-- Waiting Queue -->
        <div class="card waiting-queue">
          <div class="card-title">
            <mat-icon>queue</mat-icon>
            <h3>Waiting Queue ({{ waitingQueue.length }})</h3>
          </div>

          <div class="queue-list">
            <div class="queue-item" *ngFor="let q of waitingQueue; let i = index">
              <span class="position">{{ i + 1 }}</span>
              <div class="token-circle">
                {{ q.tokenNumber }}
              </div>
              <div class="info">
                <h4>{{ q.patientName }}</h4>
                <p>Wait: {{ q.waitTime || 0 }} min</p>
              </div>
              <div class="item-actions">
                <button mat-icon-button (click)="callPatient(q)" matTooltip="Call patient">
                  <mat-icon>volume_up</mat-icon>
                </button>
                <button mat-icon-button (click)="removeFromQueue(q)" matTooltip="Remove from queue" class="remove-btn">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
            </div>

            <div class="empty" *ngIf="waitingQueue.length === 0">
              <mat-icon>inbox</mat-icon>
              <p>No patients waiting</p>
            </div>
          </div>
        </div>
      </div>

      <!-- No doctor selected -->
      <div class="select-doctor" *ngIf="!selectedDoctorId">
        <mat-icon>person_search</mat-icon>
        <h2>Select a Doctor</h2>
        <p>Choose a doctor from the dropdown above to manage their queue</p>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .doctor-select { width: 250px; }

    .queue-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .card {
      background: var(--bg-card, #fff);
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      overflow: hidden;
    }

    .card-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border-color, #f0f0f0);
    }
    .card-title mat-icon { color: #3f51b5; }
    .card-title h3 { margin: 0; font-size: 1rem; }

    /* Current Patient */
    .patient-info {
      display: flex;
      gap: 1.5rem;
      align-items: center;
      padding: 1.5rem;
    }

    .token-circle-large {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1a237e, #3f51b5);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .details h2 { margin: 0; font-size: 1.25rem; }
    .details .mrn { margin: 0.25rem 0; color: var(--text-muted, #888); font-size: 0.85rem; }
    .details .wait { margin: 0 0 1rem; color: #f57c00; font-size: 0.8rem; }
    .actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }

    .no-patient {
      text-align: center;
      padding: 3rem;
    }
    .no-patient mat-icon { font-size: 64px; width: 64px; height: 64px; color: var(--text-muted, #ddd); }
    .no-patient p { color: var(--text-muted, #888); margin: 1rem 0; }

    /* Waiting Queue */
    .queue-list { padding: 0.75rem; max-height: 500px; overflow-y: auto; }

    .queue-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      border-radius: 8px;
      margin-bottom: 0.5rem;
      background: var(--table-header-bg, #f8f9fa);
      transition: background 0.15s;
    }
    .queue-item:hover { background: var(--bg-hover, #f0f0f0); }

    .position {
      font-weight: 700;
      color: var(--text-muted, #aaa);
      min-width: 24px;
      text-align: center;
      font-size: 0.85rem;
    }

    .token-circle {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #e8eaf6;
      color: #3f51b5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
      flex-shrink: 0;
    }

    .info { flex: 1; }
    .info h4 { margin: 0; font-size: 0.9rem; }
    .info p { margin: 0.15rem 0 0; font-size: 0.75rem; color: var(--text-muted, #888); }

    .item-actions { display: flex; }
    .remove-btn { color: #e53935; }

    .empty {
      text-align: center;
      padding: 2rem;
      color: var(--text-muted, #aaa);
    }
    .empty mat-icon { font-size: 48px; width: 48px; height: 48px; }
    .empty p { margin: 0.5rem 0 0; }

    .select-doctor {
      text-align: center;
      padding: 4rem;
      color: var(--text-muted, #aaa);
    }
    .select-doctor mat-icon { font-size: 80px; width: 80px; height: 80px; }
    .select-doctor h2 { margin: 1rem 0 0.5rem; color: var(--text-secondary, #555); }
    .select-doctor p { margin: 0; }
  `]
})
export class QueueManagementComponent implements OnInit, OnDestroy {
  doctors: any[] = [];
  selectedDoctorId: string | null = null;
  currentPatient: any = null;
  waitingQueue: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private api: ApiService,
    private signalR: SignalRService,
    private notification: NotificationService,
    private audio: AudioAnnouncementService
  ) {}

  ngOnInit() {
    this.api.get<any[]>('v1/opd/available-doctors').subscribe({
      next: (r) => this.doctors = Array.isArray(r) ? r : ((r as any)?.data ?? [])
    });

    this.signalR.queueUpdate$.pipe(takeUntil(this.destroy$)).subscribe(() => this.loadQueue());
    this.signalR.tokenCalled$.pipe(takeUntil(this.destroy$)).subscribe(() => this.loadQueue());
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

  loadQueue() {
    if (!this.selectedDoctorId) return;
    this.api.get<any>(`v1/opd/queue/${this.selectedDoctorId}`).subscribe({
      next: (r) => {
        const data = (r as any)?.data ?? r;
        this.currentPatient = data?.currentPatient || null;
        this.waitingQueue = data?.waitingQueue || [];

        // Audio announcement for current patient
        if (this.currentPatient) {
          const doctor = this.doctors.find(d => d.id === this.selectedDoctorId);
          this.audio.speakToken(
            this.currentPatient.tokenNumber,
            this.currentPatient.patientName,
            ''
          );
        }
      }
    });
  }

  callNext() {
    if (!this.selectedDoctorId) return;
    this.signalR.callNextToken(this.selectedDoctorId).then(() => {
      setTimeout(() => this.loadQueue(), 500);
    });
  }

  callPatient(q: any) {
    this.api.post(`v1/opd/queue/${q.id}/call`, {}).subscribe(() => {
      this.notification.success(`Token #${q.tokenNumber} called`);
      this.loadQueue();
    });
  }

  completeConsultation() {
    if (!this.currentPatient) return;
    this.api.post(`v1/opd/queue/${this.currentPatient.id}/complete`, {}).subscribe(() => {
      this.notification.success('Consultation completed');
      this.loadQueue();
    });
  }

  skipPatient() {
    if (!this.currentPatient) return;
    this.api.post(`v1/opd/queue/${this.currentPatient.id}/skip`, {}).subscribe(() => {
      this.notification.info('Patient skipped');
      this.loadQueue();
    });
  }

  recallPatient() {
    if (!this.currentPatient) return;
    this.signalR.recallToken(this.currentPatient.id).then(() => {
      this.notification.info('Patient recalled');
      setTimeout(() => this.loadQueue(), 500);
    });
  }

  removeFromQueue(q: any) {
    this.api.delete('v1/opd/queue', q.id).subscribe(() => {
      this.notification.info('Removed from queue');
      this.loadQueue();
    });
  }
}
