import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { SignalRService } from '../../../core/services/signalr.service';
import { AudioAnnouncementService } from '../token-generation/audio-announcement.service';
import { TenantService } from '../../../core/services/tenant.service';

interface DoctorDisplay {
  id: string;
  name: string;
  specialization: string;
  roomNumber: string;
  currentToken: number | null;
  currentPatient: string | null;
  isCalling: boolean;
  queueCount: number;
}

@Component({
  standalone: false,
  selector: 'app-token-display',
  template: `
    <div class="display-container">
      <!-- Header -->
      <div class="header">
        <div class="header-left">
          <mat-icon>local_hospital</mat-icon>
          <div>
            <h1>{{ tenant?.name || 'MediCoreX' }}</h1>
            <p class="subtitle">OPD Queue Display</p>
          </div>
        </div>
       <div class="header-right"> 
    <div class="live-badge"><span class="dot"></span> LIVE</div> 
    <p class="time">{{ currentTime | date:'hh:mm:ss a' }}</p> 
    <p class="date">{{ currentTime | date:'EEEE, MMMM d, y' }}</p> 
</div>
      </div>

      <!-- Stats Bar -->
      <div class="stats-bar">
        <div class="stat"><span class="stat-value">{{ totalTokens }}</span><span class="stat-label">Total Tokens</span></div>
        <div class="stat"><span class="stat-value waiting">{{ waitingCount }}</span><span class="stat-label">Waiting</span></div>
        <div class="stat"><span class="stat-value serving">{{ servingCount }}</span><span class="stat-label">Now Serving</span></div>
        <div class="stat"><span class="stat-value completed">{{ completedCount }}</span><span class="stat-label">Completed</span></div>
      </div>

      <!-- Doctor Grid -->
      <div class="display-grid">
        <div class="doctor-card" *ngFor="let d of doctors" [class.calling]="d.isCalling">
          <div class="doctor-header">
            <div class="doctor-avatar">Dr</div>
            <div class="doctor-info">
              <h2>Dr. {{ d.name }}</h2>
              <p>{{ d.specialization }}</p>
            </div>
          </div>

          <div class="room-badge" *ngIf="d.roomNumber">Room {{ d.roomNumber }}</div>

          <div class="token-display" [class.active]="d.currentToken">
            <span class="label">{{ d.isCalling ? 'PLEASE PROCEED' : 'NOW SERVING' }}</span>
            <span class="token-number">{{ d.currentToken || '--' }}</span>
            <span class="patient-name">{{ d.currentPatient || 'No patient' }}</span>
          </div>

          <div class="queue-count" *ngIf="d.queueCount > 0">
            <mat-icon>people</mat-icon>
            {{ d.queueCount }} in queue
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="doctors.length === 0">
        <mat-icon>hourglass_empty</mat-icon>
        <h2>No Active Doctors</h2>
        <p>Doctors with active queues will appear here</p>
      </div>

      <!-- Announcement Banner -->
      <div class="announcement-banner" *ngIf="announcement">
        <div class="announcement-content">
          <mat-icon>volume_up</mat-icon>
          <span class="announcement-text">{{ announcement }}</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>Token Display Board | Auto-refreshes in real-time</p>
      </div>
    </div>
  `,
  styles: [`
    .display-container {
      min-height: 100vh;
      background: #0a1628;
      color: white;
      padding: 1.5rem 2rem;
      display: flex;
      flex-direction: column;
      font-family: 'Segoe UI', Arial, sans-serif;
    }

    /* ── Header ── */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid rgba(255,255,255,0.1);
    }
    .header-left { display: flex; align-items: center; gap: 1rem; }
    .header-left mat-icon { font-size: 44px; width: 44px; height: 44px; color: #64b5f6; }
    .header-left h1 { margin: 0; font-size: 2.25rem; font-weight: 700; color: #ffffff; letter-spacing: 0.5px; }
    .header-left .subtitle { margin: 2px 0 0; font-size: 0.95rem; color: #90caf9; }
    .header-right { text-align: right; }
    .live-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(244,67,54,0.25); padding: 5px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; letter-spacing: 1.5px; margin-bottom: 6px; color: #ef9a9a; border: 1px solid rgba(244,67,54,0.4); }
    .live-badge .dot { width: 9px; height: 9px; background: #f44336; border-radius: 50%; animation: blink 1s infinite; box-shadow: 0 0 6px #f44336; }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
    .header-right .time { margin: 0; font-size: 2rem; font-weight: 700; font-family: 'Courier New', monospace; color: #ffffff; }
    .header-right .date { margin: 2px 0 0; font-size: 0.95rem; color: #90caf9; }

    /* ── Stats Bar ── */
    .stats-bar {
      display: flex;
      gap: 2rem;
      justify-content: center;
      margin-bottom: 1.5rem;
      padding: 0.85rem 2rem;
      background: rgba(255,255,255,0.06);
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.08);
    }
    .stat { text-align: center; min-width: 100px; }
    .stat-value { display: block; font-size: 2.25rem; font-weight: 800; line-height: 1.2; }
    .stat-value.waiting { color: #ffd54f; }
    .stat-value.serving { color: #81c784; }
    .stat-value.completed { color: #90caf9; }
    .stat-label { font-size: 0.8rem; color: #b0bec5; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }

    /* ── Doctor Grid ── */
    .display-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 1.25rem;
      flex: 1;
    }

    .doctor-card {
      background: #132040;
      border-radius: 16px;
      padding: 1.5rem;
      text-align: center;
      transition: all 0.3s ease;
      border: 2px solid rgba(255,255,255,0.08);
    }
    .doctor-card.calling {
      background: #1b3a1b;
      border-color: #4caf50;
      animation: pulseCard 1.5s infinite;
    }
    @keyframes pulseCard {
      0%, 100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.5); }
      50% { box-shadow: 0 0 40px 12px rgba(76, 175, 80, 0.25); }
    }

    .doctor-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem; }
    .doctor-avatar { width: 52px; height: 52px; border-radius: 50%; background: #1e88e5; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem; color: white; flex-shrink: 0; }
    .doctor-info { text-align: left; }
    .doctor-info h2 { margin: 0; font-size: 1.3rem; font-weight: 700; color: #ffffff; }
    .doctor-info p { margin: 2px 0 0; font-size: 0.9rem; color: #90caf9; }

    .room-badge {
      display: inline-block;
      padding: 5px 16px;
      background: rgba(33,150,243,0.2);
      border: 1px solid rgba(33,150,243,0.3);
      border-radius: 20px;
      font-size: 0.85rem;
      color: #90caf9;
      margin-bottom: 0.75rem;
      font-weight: 600;
    }

    .token-display {
      background: rgba(255,255,255,0.06);
      border-radius: 14px;
      padding: 1.25rem 1rem;
      margin-bottom: 0.75rem;
      border: 1px solid rgba(255,255,255,0.05);
    }
    .token-display.active { background: rgba(76, 175, 80, 0.15); border-color: rgba(76,175,80,0.3); }
    .token-display .label { display: block; font-size: 0.8rem; color: #b0bec5; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 0.15rem; font-weight: 600; }
    .token-display .token-number { display: block; font-size: 5rem; font-weight: 900; line-height: 1.1; font-family: 'Courier New', monospace; color: #ffffff; }
    .token-display .patient-name { display: block; font-size: 1.35rem; margin-top: 0.35rem; color: #e0e0e0; font-weight: 600; }

    .doctor-card.calling .token-number { color: #66bb6a; text-shadow: 0 0 20px rgba(76,175,80,0.4); }
    .doctor-card.calling .label { color: #a5d6a7; }

    .queue-count {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: #78909c;
      font-weight: 500;
    }
    .queue-count mat-icon { font-size: 18px; width: 18px; height: 18px; }

    /* ── Empty State ── */
    .empty-state {
      text-align: center;
      padding: 5rem;
      color: #546e7a;
    }
    .empty-state mat-icon { font-size: 80px; width: 80px; height: 80px; opacity: 0.4; }
    .empty-state h2 { margin: 1.5rem 0 0.5rem; color: #78909c; font-size: 1.5rem; }
    .empty-state p { margin: 0; color: #546e7a; font-size: 1rem; }

    /* ── Announcement Banner ── */
    .announcement-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #e65100, #ff8f00);
      padding: 1.15rem 2rem;
      z-index: 1000;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.4);
    }
    .announcement-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
      animation: slideUp 0.3s ease-out;
      text-shadow: 0 1px 4px rgba(0,0,0,0.3);
    }
    .announcement-content mat-icon { font-size: 32px; width: 32px; height: 32px; }
    @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    /* ── Footer ── */
    .footer {
      text-align: center;
      padding: 1rem;
      color: #455a64;
      font-size: 0.8rem;
      border-top: 1px solid rgba(255,255,255,0.05);
      margin-top: 1rem;
    }
  `]
})
export class TokenDisplayComponent implements OnInit, OnDestroy {
  currentTime = new Date();
  doctors: DoctorDisplay[] = [];
  announcement: string | null = null;
  totalTokens = 0;
  waitingCount = 0;
  servingCount = 0;
  completedCount = 0;

  private destroy$ = new Subject<void>();
  private announcementTimeout: any;

  tenant: any = null;

  constructor(
    private api: ApiService,
    private signalR: SignalRService,
    private audio: AudioAnnouncementService,
    private tenantService: TenantService
  ) {}

  ngOnInit() {
    // Load tenant name
    this.tenantService.loadTenant().pipe(takeUntil(this.destroy$)).subscribe(t => this.tenant = t);

    // Update clock
    setInterval(() => this.currentTime = new Date(), 1000);

    // Load initial data
    this.loadDoctors();
    this.loadStats();

    // Listen for real-time token calls
    this.signalR.tokenCalled$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      const doctor = this.doctors.find(d => d.id === data.doctorId);
      if (doctor) {
        doctor.currentToken = data.tokenNumber;
        doctor.currentPatient = data.patientName;
        doctor.isCalling = true;

        // Remove calling animation after 8 seconds, but KEEP the patient name
        setTimeout(() => {
          doctor.isCalling = false;
        }, 8000);
      }

      // Show announcement banner with doctor name
      this.announcement = `Token ${data.tokenNumber} - ${data.patientName} - Dr. ${data.doctorName || ''}`;
      if (this.announcementTimeout) clearTimeout(this.announcementTimeout);
      this.announcementTimeout = setTimeout(() => this.announcement = null, 15000);

      // Audio announcement: token, patient name, doctor name
      this.audio.speakToken(data.tokenNumber, data.patientName, data.doctorName || '');

      // Refresh stats only (not doctors - we keep the called patient visible)
      this.loadStats();
    });

    // Listen for queue updates - only refresh stats, don't reset display
    this.signalR.queueUpdate$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadStats();
    });

    // Auto-refresh doctors list every 60 seconds (slow, to not overwrite current display)
    setInterval(() => {
      this.loadDoctors();
      this.loadStats();
    }, 60000);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.announcementTimeout) clearTimeout(this.announcementTimeout);
  }

  loadDoctors() {
    this.api.get<any[]>('v1/opd/active-doctors').subscribe({
      next: (data) => {
        const list = Array.isArray(data) ? data : ((data as any)?.data ?? []);
        const newDoctors = list.map((d: any) => {
          // Preserve existing called patient data if doctor already on screen
          const existing = this.doctors.find(ed => ed.id === d.id);
          return {
            id: d.id,
            name: d.fullName || d.name || 'Unknown',
            specialization: d.specialization || 'General',
            roomNumber: d.roomNumber || '',
            currentToken: existing?.currentToken ?? null,
            currentPatient: existing?.currentPatient ?? null,
            isCalling: existing?.isCalling ?? false,
            queueCount: d.queueCount || 0
          };
        });
        this.doctors = newDoctors;
        this.totalTokens = this.doctors.reduce((sum, d) => sum + d.queueCount, 0);
      },
      error: () => {}
    });
  }

  loadStats() {
    this.api.get<any>('v1/opd/stats').subscribe({
      next: (data) => {
        const stats = (data as any)?.data ?? data;
        if (stats) {
          this.totalTokens = stats.totalPatients || 0;
          this.waitingCount = stats.waitingCount || 0;
          this.servingCount = stats.inProgressCount || 0;
          this.completedCount = stats.completedCount || 0;
        }
      },
      error: () => {}
    });
  }
}
