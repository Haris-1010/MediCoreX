import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { SignalRService } from '../../core/services/signalr.service';
import { PermissionService } from '../../core/services/permission.service';
import { TenantService } from '../../core/services/tenant.service';
import { StorageService } from '../../core/services/storage.service';
import { environment } from '../../../environments/environment';

interface DashboardStats {
  totalPatients: number;
  totalAppointments: number;
  lowStockItems: number;
  amountReceivables: number;
}

interface TodayAppointment {
  id: string;
  patientName: string;
  doctorName: string;
  time: string;
  status: string;
  type: string;
}

@Component({
  standalone: false,
  selector: 'app-dashboard',
  template: `
    <app-main-layout>
      <!-- Location-aware page header -->
      <div class="dashboard-heading">
        <div class="heading-text">
          <h1>Dashboard</h1>
          <p class="heading-sub">{{ locationSubtitle }}</p>
        </div>
        <div class="location-chip" *ngIf="showLocationChip" [class.all-locations]="isAllLocations">
          <mat-icon>{{ isAllLocations ? 'public' : 'location_on' }}</mat-icon>
          <span>{{ locationLabel }}</span>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <app-stats-card
          title="Total Patient"
          [value]="stats.totalPatients"
          icon="person"
          color="primary"
          [subtitle]="statsScopeSuffix('Patients cared for since day one')">
        </app-stats-card>

        <app-stats-card
          title="Today's Appointments"
          [value]="stats.totalAppointments"
          icon="event"
          color="accent"
          [subtitle]="statsScopeSuffix('Appointments scheduled today')">
        </app-stats-card>

        <app-stats-card
          title="Low Stock Items"
          [value]="stats.lowStockItems"
          icon="warning"
          color="warn"
          subtitle="Items below reorder level">
        </app-stats-card>

        <app-stats-card
          title="Amount Receivables"
          [value]="stats.amountReceivables"
          [isCurrency]="true"
          icon="account_balance"
          color="success"
          [subtitle]="statsScopeSuffix('Keep Record of your balance payments')">
        </app-stats-card>
      </div>

      <!-- No Permissions Message -->
      <div class="no-permissions" *ngIf="permissionsReady && !canViewPatients && !canViewAppointments && !canViewInventory && !canViewReports">
        <mat-icon>info</mat-icon>
        <h3>Welcome to ClinIQ</h3>
        <p>You don't have access to view dashboard data yet. Please contact your administrator to assign appropriate permissions.</p>
      </div>

      <!-- Main Content -->
      <div class="dashboard-grid">
        <!-- Today's Appointments -->
        <div class="card appointments-card" *ngIf="canViewAppointments">
          <div class="card-header">
            <h3>
              <mat-icon class="card-icon">event</mat-icon>
              Today's Appointments
            </h3>
          </div>
          <app-appointment-widget [appointments]="todayAppointments" [loading]="loadingAppointments">
          </app-appointment-widget>
        </div>

        <!-- New Patient List -->
        <div class="card new-patient-card" *ngIf="canViewPatients">
          <div class="card-header">
            <h3>
              <mat-icon class="card-icon">people</mat-icon>
              New Patient List
            </h3>
          </div>
          <app-new-patient-list [loading]="loadingPatients">
          </app-new-patient-list>
        </div>

        <!-- Monthly Revenue Chart -->
        <div class="card growth-card">
          <div class="card-header">
            <h3>
              <mat-icon class="card-icon">paid</mat-icon>
              Monthly Revenue
            </h3>
          </div>
          <app-patient-growth-chart>
          </app-patient-growth-chart>
        </div>

        <div class="card inventory-card" *ngIf="canViewInventory">
          <app-inventory-overview></app-inventory-overview>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .dashboard-heading {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1.25rem;
      flex-wrap: wrap;
    }

    .heading-text h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary, #333);
    }

    .heading-sub {
      margin: 0.25rem 0 0;
      color: var(--text-muted, #666);
      font-size: 0.875rem;
    }

    .location-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.35rem 0.75rem;
      background: var(--bg-badge, #eef2ff);
      border: 1px solid var(--border-color, #e0e7ff);
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-primary, #334155);
    }

    .location-chip.all-locations {
      background: #ecfdf5;
      border-color: #a7f3d0;
      color: #065f46;
    }

    .location-chip mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: var(--accent-primary, #667eea);
    }

    .location-chip.all-locations mat-icon {
      color: #059669;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 1.25rem;
      margin-bottom: 1.5rem;
      align-items: stretch;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: minmax(280px, auto);
      gap: 1.25rem;
    }

    .card {
      background: var(--bg-card, #ffffff);
      border-radius: 8px;
      box-shadow: var(--shadow-md, 0 1px 3px rgba(0, 0, 0, 0.08));
      padding: 1.25rem;
      border: 1px solid var(--border-color, #e8e8e8);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .growth-card {
      grid-row: span 1;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border-color, #f0f0f0);
      flex-shrink: 0;
    }

    .card-header h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary, #1a237e);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .card-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: var(--accent-primary, #1a237e);
    }

    .no-permissions {
      text-align: center;
      padding: 3rem 1rem;
      background: var(--bg-card, #fff);
      border-radius: 8px;
      box-shadow: var(--shadow-md, 0 1px 3px rgba(0, 0, 0, 0.08));
      border: 1px solid var(--border-color, #e8e8e8);
      color: var(--text-secondary, #64748b);
    }

    .no-permissions mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--text-muted, #94a3b8);
      margin-bottom: 1rem;
    }

    .no-permissions h3 {
      margin: 0 0 0.5rem;
      color: var(--text-primary, #334155);
    }

    .no-permissions p {
      margin: 0;
      max-width: 400px;
      margin: 0 auto;
    }

    @media (max-width: 1200px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 992px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats = {
    totalPatients: 0,
    totalAppointments: 0,
    lowStockItems: 0,
    amountReceivables: 0
  };

  todayAppointments: TodayAppointment[] = [];
  loadingAppointments = true;
  loadingPatients = true;

  canViewPatients = false;
  canViewAppointments = false;
  canViewReports = false;
  canViewInventory = false;
  permissionsReady = false;

  showLocationChip = false;
  isAllLocations = false;
  locationLabel = '';
  locationSubtitle = 'Organization overview';

  private destroy$ = new Subject<void>();

  constructor(
    private api: ApiService,
    private authService: AuthService,
    private signalR: SignalRService,
    private permissions: PermissionService,
    private tenantService: TenantService,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.refreshLocationContext();

    this.tenantService.currentBranch$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.refreshLocationContext());

    this.tenantService.branches$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.refreshLocationContext());

    if (this.permissions.isLoaded()) {
      this.checkPermissions();
      this.loadDashboardData();
    } else {
      const interval = setInterval(() => {
        if (this.permissions.isLoaded()) {
          clearInterval(interval);
          this.checkPermissions();
          this.loadDashboardData();
        }
      }, 50);
      setTimeout(() => {
        clearInterval(interval);
        if (!this.permissionsReady) {
          this.loadingAppointments = false;
        }
      }, 5000);
    }

    this.setupRealtimeUpdates();
  }

  private refreshLocationContext(): void {
    const stored = this.storage.getItem<string>(environment.branchKey);
    this.isAllLocations = stored === 'all';

    const ctx = this.permissions.current();
    const hasAll = !!(ctx?.hasAllLocationAccess || ctx?.isSuperAdmin);
    const branchCount = ctx?.accessibleBranches?.length
      ?? 0;

    this.showLocationChip = branchCount > 1 || (hasAll && branchCount > 0);

    if (this.isAllLocations) {
      this.locationLabel = 'All Locations';
      this.locationSubtitle = 'Organization-wide metrics across all locations';
      return;
    }

    const current = this.tenantService.getCurrentBranch();
    this.locationLabel = current?.name || ctx?.branchName || '';
    this.locationSubtitle = this.showLocationChip && this.locationLabel
      ? `Metrics for ${this.locationLabel}`
      : 'Organization overview';
  }

  private checkPermissions(): void {
    this.canViewPatients = this.permissions.has('patients.view');
    this.canViewAppointments = this.permissions.has('appointments.view');
    this.canViewReports = this.permissions.has('reports.view') || this.permissions.has('dashboard.view');
    this.canViewInventory = this.permissions.has('inventory.view');
    this.permissionsReady = true;
    this.refreshLocationContext();
  }

  statsScopeSuffix(base: string): string {
    if (!this.showLocationChip) return base;
    if (this.isAllLocations) return `${base} · All Locations`;
    if (this.locationLabel) return `${base} · ${this.locationLabel}`;
    return base;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(): void {
    if (this.canViewReports || this.canViewPatients) {
      this.loadStats();
    }
    if (this.canViewAppointments) {
      this.loadTodayAppointments();
    } else {
      this.loadingAppointments = false;
    }
    if (!this.canViewPatients) {
      this.loadingPatients = false;
    }
  }

  loadStats(): void {
    this.api.get<DashboardStats>('v1/dashboard/stats').subscribe({
      next: (data) => {
        this.stats = {
          totalPatients: data.totalPatients,
          totalAppointments: (data as any).totalAppointments ?? (data as any).todayAppointments ?? 0,
          lowStockItems: (data as any).lowStockItems ?? 0,
          amountReceivables: (data as any).amountReceivables ?? 0
        };
      },
      error: () => {}
    });
  }

  loadTodayAppointments(): void {
    this.loadingAppointments = true;
    const today = new Date();
    const date = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');

    this.api.get<any>('v1/appointments', { date, pageSize: 100 }).subscribe({
      next: (data) => {
        const items = Array.isArray(data) ? data : (data?.items || []);
        this.todayAppointments = items.map((appointment: any) => ({
          id: appointment.id,
          patientName: appointment.patientName || 'Unknown patient',
          doctorName: appointment.doctorName || 'Unassigned',
          time: this.formatTime(appointment.startTime || ''),
          status: appointment.status || 'Scheduled',
          type: appointment.type || appointment.appointmentType || 'Appointment'
        }));
        this.loadingAppointments = false;
      },
      error: () => {
        this.loadingAppointments = false;
        this.todayAppointments = [];
      }
    });
  }

  formatTime(time: string): string {
    if (!time) return '';
    if (time.includes(':')) {
      const [hours, minutes] = time.split(':');
      const h = parseInt(hours, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      return `${h % 12 || 12}:${minutes} ${ampm}`;
    }
    return time;
  }

  private setupRealtimeUpdates(): void {
    this.signalR.queueUpdate$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.canViewAppointments) {
        this.loadTodayAppointments();
      }
    });
  }
}
