import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  standalone: false,
  selector: 'app-bed-management',
  template: `
    <app-main-layout>
      <app-page-header title="Bed Management" [breadcrumbs]="[{ label: 'IPD', route: '/ipd' }, { label: 'Beds' }]"></app-page-header>
      
      <div class="ward-selector">
        <mat-button-toggle-group [(value)]="selectedWard" (change)="loadBeds()">
          <mat-button-toggle *ngFor="let w of wards" [value]="w.id">{{ w.name }}</mat-button-toggle>
        </mat-button-toggle-group>
      </div>
      
      <div class="empty-state" *ngIf="wards.length === 0">
        <mat-icon>bed</mat-icon>
        <h3>No Wards Found</h3>
        <p>Create wards and rooms first in Ward Management.</p>
        <button mat-raised-button color="primary" routerLink="/ipd/wards"><mat-icon>hotel</mat-icon> Go to Ward Management</button>
      </div>
      
      <div class="bed-board" *ngIf="selectedWard">
        <!-- Ward info header -->
        <div class="ward-info-header" *ngIf="selectedWardObj">
          <div class="ward-info-left">
            <div class="ward-icon"><mat-icon>meeting_room</mat-icon></div>
            <div>
              <h3>{{ selectedWardObj.name }}</h3>
              <p>{{ selectedWardObj.wardType }} Ward</p>
            </div>
          </div>
          <div class="ward-stats">
            <span class="stat available"><mat-icon>check_circle</mat-icon> {{ getAvailableCount() }} Available</span>
            <span class="stat occupied"><mat-icon>person</mat-icon> {{ getOccupiedCount() }} Occupied</span>
            <span class="stat reserved"><mat-icon>schedule</mat-icon> {{ getReservedCount() }} Reserved</span>
            <span class="stat maintenance"><mat-icon>build</mat-icon> {{ getMaintenanceCount() }} Maintenance</span>
          </div>
        </div>

        <!-- Bed Grid -->
        <div class="bed-grid">
          <div 
            class="bed-card" 
            *ngFor="let b of beds" 
            [ngClass]="'bed-' + b.status.toLowerCase()" 
            (click)="selectBed(b)">
            
            <!-- Bed Icon -->
            <div class="bed-icon-wrapper">
              <mat-icon class="bed-icon">bed</mat-icon>
              <div class="status-indicator"></div>
            </div>
            
            <!-- Bed Info -->
            <div class="bed-info">
              <div class="bed-number">{{ b.bedNumber }}</div>
              <div class="bed-type">{{ b.bedType }}</div>
              <div class="room-badge" *ngIf="b.roomNumber">{{ b.roomNumber }}</div>
            </div>
            
            <!-- Patient Info (if occupied) -->
            <div class="patient-info" *ngIf="b.patientName">
              <mat-icon>person</mat-icon>
              <span>{{ b.patientName }}</span>
            </div>
            
            <!-- Status Badge -->
            <div class="status-badge">{{ b.status }}</div>
            
            <!-- Hover Action Hint -->
            <div class="click-hint"><mat-icon>touch_app</mat-icon> Click for details</div>
          </div>
        </div>
        
        <!-- Legend -->
        <div class="legend">
          <span class="legend-item available"><span class="dot"></span> Available</span>
          <span class="legend-item occupied"><span class="dot"></span> Occupied</span>
          <span class="legend-item reserved"><span class="dot"></span> Reserved</span>
          <span class="legend-item maintenance"><span class="dot"></span> Maintenance</span>
        </div>
      </div>
    </app-main-layout>

    <!-- Bed Detail Dialog -->
    <ng-template #bedDetailDialog>
      <h2 mat-dialog-title>
        <div class="dialog-title-row">
          <div class="bed-icon-small" [ngClass]="'bed-' + selectedBed?.status?.toLowerCase()">
            <mat-icon>bed</mat-icon>
          </div>
          <div>
            <span class="bed-number">{{ selectedBed?.bedNumber }}</span>
            <span class="bed-type">{{ selectedBed?.bedType }}</span>
          </div>
        </div>
      </h2>
      <mat-dialog-content>
        <div class="bed-detail">
          <div class="detail-section">
            <h4><mat-icon>info</mat-icon> Bed Details</h4>
            <div class="detail-row">
              <span class="label">Status:</span>
              <span class="value" [ngClass]="'status-' + selectedBed?.status?.toLowerCase()">
                <mat-icon class="status-icon">{{ getStatusIcon(selectedBed?.status) }}</mat-icon>
                {{ selectedBed?.status }}
              </span>
            </div>
            <div class="detail-row">
              <span class="label">Bed Type:</span>
              <span class="value">{{ selectedBed?.bedType }}</span>
            </div>
            <div class="detail-row" *ngIf="selectedBed?.roomNumber">
              <span class="label">Room:</span>
              <span class="value"><mat-icon>meeting_room</mat-icon> {{ selectedBed?.roomNumber }}</span>
            </div>
            <div class="detail-row" *ngIf="selectedBed?.wardName">
              <span class="label">Ward:</span>
              <span class="value"><mat-icon>local_hospital</mat-icon> {{ selectedBed?.wardName }}</span>
            </div>
          </div>

          <div class="detail-section" *ngIf="selectedBed?.patientName">
            <div class="section-header">
              <h4><mat-icon>person</mat-icon> Patient Information</h4>
            </div>
            <div class="detail-row">
              <span class="label">Patient Name:</span>
              <span class="value">{{ selectedBed?.patientName }}</span>
            </div>
            <div class="detail-row" *ngIf="selectedBed?.patientMrn">
              <span class="label">MRN:</span>
              <span class="value">{{ selectedBed?.patientMrn }}</span>
            </div>
            <div class="detail-row" *ngIf="selectedBed?.patientPhone">
              <span class="label">Phone:</span>
              <span class="value">{{ selectedBed?.patientPhone }}</span>
            </div>
            <div class="detail-row" *ngIf="selectedBed?.patientGender">
              <span class="label">Gender:</span>
              <span class="value">{{ selectedBed?.patientGender }}</span>
            </div>
            <div class="detail-row" *ngIf="selectedBed?.patientAge">
              <span class="label">Age:</span>
              <span class="value">{{ selectedBed?.patientAge }}</span>
            </div>
            <div class="detail-row" *ngIf="selectedBed?.doctorName">
              <span class="label">Attending Doctor:</span>
              <span class="value">Dr. {{ selectedBed?.doctorName }}</span>
            </div>
            <div class="detail-row" *ngIf="selectedBed?.admissionDate">
              <span class="label">Admitted:</span>
              <span class="value">{{ selectedBed?.admissionDate | date:'mediumDate' }}</span>
            </div>
            <div class="detail-row" *ngIf="selectedBed?.admissionType">
              <span class="label">Admission Type:</span>
              <span class="value">{{ selectedBed?.admissionType }}</span>
            </div>
            <div class="detail-row" *ngIf="selectedBed?.provisionalDiagnosis">
              <span class="label">Provisional Diagnosis:</span>
              <span class="value">{{ selectedBed?.provisionalDiagnosis }}</span>
            </div>
          </div>

          <div class="no-patient" *ngIf="!selectedBed?.patientName && selectedBed?.status === 'Available'">
            <mat-icon>bedtime</mat-icon>
            <p>This bed is available for admission</p>
          </div>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Close</button>
        <button mat-raised-button color="primary" *ngIf="selectedBed?.status === 'Available'" (click)="admitToSelectedBed()">
          <mat-icon>person_add</mat-icon> Admit Patient
        </button>
        <button mat-raised-button color="primary" *ngIf="selectedBed?.patientName && selectedBed?.patientId" (click)="viewPatient()">
          <mat-icon>visibility</mat-icon> View Patient
        </button>
        <button mat-raised-button color="accent" *ngIf="selectedBed?.patientName && selectedBed?.admissionId" (click)="viewAdmission()">
          <mat-icon>assignment_ind</mat-icon> View Admission
        </button>
      </mat-dialog-actions>
    </ng-template>
  `,
  styles: [`
    .ward-selector { margin-bottom: 1.5rem; }
    
    .empty-state { text-align: center; padding: 4rem 2rem; background: var(--bg-card, #fff); border-radius: 12px; border: 1px solid var(--border-color, #e0e0e0); }
    .empty-state mat-icon { font-size: 72px; width: 72px; height: 72px; color: var(--text-muted, #ccc); }
    .empty-state h3 { margin: 1rem 0 0.5rem; color: var(--text-primary, #333); }
    .empty-state p { color: var(--text-muted, #888); margin-bottom: 1.5rem; }

    /* Ward Info Header */
    .ward-info-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      background: var(--bg-card, #fff);
      border-radius: 12px;
      border: 1px solid var(--border-color, #e0e0e0);
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .ward-info-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .ward-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      background: linear-gradient(135deg, #3f51b5, #5c6bc0);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .ward-icon mat-icon { font-size: 24px; width: 24px; height: 24px; }
    .ward-info-left h3 { margin: 0; font-size: 1.25rem; color: var(--text-primary, #333); }
    .ward-info-left p { margin: 0; color: var(--text-secondary, #666); font-size: 0.875rem; }
    .ward-stats {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .stat {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.375rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    .stat mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .stat.available { background: #e8f5e9; color: #2e7d32; }
    .stat.occupied { background: #ffebee; color: #c62828; }
    .stat.reserved { background: #fff3e0; color: #ef6c00; }
    .stat.maintenance { background: #f5f5f5; color: #616161; }

    /* Bed Grid */
    .bed-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1rem;
    }

    .bed-card {
      background: var(--bg-card, #fff);
      border-radius: 16px;
      padding: 1.5rem 1rem;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.25s ease;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      min-height: 200px;
    }
    .bed-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg, 0 8px 24px rgba(0,0,0,0.12));
      border-color: var(--accent-primary, #3f51b5);
    }
    .bed-card:focus { outline: none; border-color: var(--accent-primary, #3f51b5); }

    /* Bed Status Variants */
    .bed-available { border-color: #4caf50; background: linear-gradient(180deg, var(--status-success-bg, #f1f8e9) 0%, var(--bg-card, #ffffff) 100%); }
    .bed-available:hover { border-color: #4caf50; }
    .bed-occupied { border-color: #f44336; background: linear-gradient(180deg, var(--status-error-bg, #fce4ec) 0%, var(--bg-card, #ffffff) 100%); }
    .bed-occupied:hover { border-color: #f44336; }
    .bed-reserved { border-color: #ff9800; background: linear-gradient(180deg, var(--status-warning-bg, #fff3e0) 0%, var(--bg-card, #ffffff) 100%); }
    .bed-reserved:hover { border-color: #ff9800; }
    .bed-maintenance { border-color: #9e9e9e; background: linear-gradient(180deg, var(--bg-hover, #f5f5f5) 0%, var(--bg-card, #ffffff) 100%); }
    .bed-maintenance:hover { border-color: #9e9e9e; }

    .bed-icon-wrapper {
      position: relative;
      width: 80px;
      height: 80px;
      margin-bottom: 0.75rem;
    }
    .bed-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #9e9e9e;
      transition: all 0.2s ease;
    }
    .bed-available .bed-icon { color: #4caf50; }
    .bed-occupied .bed-icon { color: #f44336; }
    .bed-reserved .bed-icon { color: #ff9800; }
    .bed-maintenance .bed-icon { color: #9e9e9e; }
    .bed-card:hover .bed-icon {
      transform: scale(1.1);
    }

    .status-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: var(--shadow-md, 0 2px 4px rgba(0,0,0,0.1));
    }
    .bed-available .status-indicator { background: #4caf50; }
    .bed-occupied .status-indicator { background: #f44336; }
    .bed-reserved .status-indicator { background: #ff9800; }
    .bed-maintenance .status-indicator { background: #9e9e9e; }

    .bed-info { margin-bottom: 0.5rem; }
    .bed-number {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a237e;
      line-height: 1.2;
    }
    .bed-type {
      font-size: 0.75rem;
      color: var(--text-muted, #666);
      text-transform: capitalize;
    }
    .room-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      margin-top: 0.375rem;
      padding: 0.125rem 0.5rem;
      background: #e8eaf6;
      color: #3f51b5;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 600;
    }
    .room-badge::before { content: ''; display: inline-block; width: 6px; height: 6px; background: #3f51b5; border-radius: 50%; }

    .patient-info {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.375rem;
      margin-top: 0.5rem;
      padding: 0.5rem;
      background: var(--bg-hover, #f5f5f5);
      border-radius: 8px;
      font-size: 0.8rem;
      color: var(--text-primary, #333);
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .patient-info mat-icon { font-size: 16px; width: 16px; height: 16px; color: #3f51b5; }

    .status-badge {
      position: absolute;
      bottom: 0.75rem;
      left: 50%;
      transform: translateX(-50%);
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.65rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
    .bed-available .status-badge { background: #e8f5e9; color: #2e7d32; }
    .bed-occupied .status-badge { background: #ffebee; color: #c62828; }
    .bed-reserved .status-badge { background: #fff3e0; color: #ef6c00; }
    .bed-maintenance .status-badge { background: #f5f5f5; color: #616161; }

    .click-hint {
      position: absolute;
      bottom: 0.5rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.65rem;
      color: #999;
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: none;
    }
    .bed-card:hover .click-hint { opacity: 1; }
    .click-hint mat-icon { font-size: 14px; width: 14px; height: 14px; }

    .legend {
      display: flex;
      gap: 1.5rem;
      margin-top: 1.5rem;
      padding: 1rem;
      background: var(--bg-card, #fff);
      border-radius: 8px;
      border: 1px solid var(--border-color, #e0e0e0);
      flex-wrap: wrap;
      justify-content: center;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--text-primary, #333);
    }
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .legend-item.available .dot { background: #4caf50; }
    .legend-item.occupied .dot { background: #f44336; }
    .legend-item.reserved .dot { background: #ff9800; }
    .legend-item.maintenance .dot { background: #9e9e9e; }

    /* Dialog Styles */
    .dialog-title-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .bed-icon-small {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .bed-icon-small mat-icon { font-size: 20px; width: 20px; height: 20px; color: white; }
    .bed-available .bed-icon-small { background: linear-gradient(135deg, #4caf50, #66bb6a); }
    .bed-occupied .bed-icon-small { background: linear-gradient(135deg, #f44336, #ef5350); }
    .bed-reserved .bed-icon-small { background: linear-gradient(135deg, #ff9800, #ffb74d); }
    .bed-maintenance .bed-icon-small { background: linear-gradient(135deg, #9e9e9e, #bdbdbd); }
    .dialog-title-row .bed-number { font-size: 1.25rem; font-weight: 700; color: #1a237e; }
    .dialog-title-row .bed-type { font-size: 0.8rem; color: var(--text-muted, #666); text-transform: capitalize; }

    .bed-detail { min-width: 360px; }
    .detail-section { margin-bottom: 1.5rem; }
    .detail-section h4 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0 0 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e8eaf6;
      color: #1a237e;
      font-size: 1rem;
    }
    .detail-section h4 mat-icon { color: #3f51b5; font-size: 20px; width: 20px; height: 20px; }
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.625rem 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .detail-row:last-child { border-bottom: none; }
    .detail-row .label { font-weight: 500; color: var(--text-muted, #666); display: flex; align-items: center; gap: 0.375rem; }
    .detail-row .value { color: var(--text-primary, #333); text-align: right; max-width: 65%; word-break: break-word; }
    .status-icon { font-size: 16px; width: 16px; height: 16px; margin-right: 0.375rem; }
    .status-available { color: #4caf50; font-weight: 600; }
    .status-occupied { color: #f44336; font-weight: 600; }
    .status-reserved { color: #ff9800; font-weight: 600; }
    .status-maintenance { color: #9e9e9e; font-weight: 600; }

    .no-patient {
      text-align: center;
      padding: 2rem;
      color: var(--text-muted, #888);
      background: var(--bg-hover, #f5f5f5);
      border-radius: 8px;
    }
    .no-patient mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 0.75rem; color: #4caf50; }
  `]
})
export class BedManagementComponent implements OnInit {
  @ViewChild('bedDetailDialog') bedDetailDialog!: TemplateRef<any>;
  wards: any[] = []; beds: any[] = []; selectedWard: string | null = null;
  selectedBed: any = null;
  selectedWardObj: any = null;

  constructor(private api: ApiService, private router: Router, private dialog: MatDialog) {}

  ngOnInit() {
    this.api.get<any>('v1/wards').subscribe(r => {
      this.wards = Array.isArray(r) ? r : [];
      if (this.wards.length > 0) {
        this.selectedWard = this.wards[0].id;
        this.loadBeds();
      }
    });
  }

  loadBeds() { 
    if (this.selectedWard) {
      this.api.get<any[]>(`v1/wards/${this.selectedWard}/beds`).subscribe(r => {
        this.beds = r;
        this.selectedWardObj = this.wards.find(w => w.id === this.selectedWard);
      });
    }
  }

  getAvailableCount(): number { return this.beds.filter(b => b.status === 'Available').length; }
  getOccupiedCount(): number { return this.beds.filter(b => b.status === 'Occupied').length; }
  getReservedCount(): number { return this.beds.filter(b => b.status === 'Reserved').length; }
  getMaintenanceCount(): number { return this.beds.filter(b => b.status === 'Maintenance').length; }

  getStatusIcon(status: string): string {
    switch (status?.toLowerCase()) {
      case 'available': return 'check_circle';
      case 'occupied': return 'person';
      case 'reserved': return 'schedule';
      case 'maintenance': return 'build';
      default: return 'help';
    }
  }

  selectBed(bed: any) {
    this.selectedBed = bed;
    this.dialog.open(this.bedDetailDialog, { width: '480px', panelClass: 'bed-detail-dialog' });
  }

  admitToSelectedBed() {
    if (this.selectedBed) {
      this.dialog.closeAll();
      this.router.navigate(['/ipd/admit'], { queryParams: { bedId: this.selectedBed.id } });
    }
  }

  viewPatient() {
    if (this.selectedBed?.patientId) {
      this.dialog.closeAll();
      this.router.navigate(['/patients', this.selectedBed.patientId]);
    }
  }

  viewAdmission() {
    if (this.selectedBed?.admissionId) {
      this.dialog.closeAll();
      this.router.navigate(['/ipd/admissions', this.selectedBed.admissionId]);
    }
  }
}