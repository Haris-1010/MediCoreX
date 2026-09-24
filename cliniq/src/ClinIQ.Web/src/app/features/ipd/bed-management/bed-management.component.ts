import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';

@Component({
  standalone: false,
  selector: 'app-bed-management',
  template: `
    <app-main-layout>
      <app-page-header title="Bed Management" [breadcrumbs]="[{ label: 'IPD', route: '/ipd' }, { label: 'Beds' }]"></app-page-header>

      <div class="beds-page">
        <div class="toolbar">
          <div class="ward-selector">
            <mat-button-toggle-group [(value)]="selectedWard" (change)="loadBeds()">
              <mat-button-toggle *ngFor="let w of wards" [value]="w.id">{{ w.name }}</mat-button-toggle>
            </mat-button-toggle-group>
          </div>

          <div class="legend" *ngIf="selectedWard">
            <span class="legend-item available"><span class="dot"></span> Available {{ getAvailableCount() }}</span>
            <span class="legend-item occupied"><span class="dot"></span> Occupied {{ getOccupiedCount() }}</span>
            <span class="legend-item reserved"><span class="dot"></span> Reserved {{ getReservedCount() }}</span>
            <span class="legend-item maintenance"><span class="dot"></span> Maintenance {{ getMaintenanceCount() }}</span>
          </div>
        </div>

        <div class="empty-state" *ngIf="wards.length === 0">
          <mat-icon>bed</mat-icon>
          <h3>No Wards Found</h3>
          <p>Create wards and rooms first in Ward Management.</p>
          <button mat-raised-button color="primary" routerLink="/ipd/wards">
            <mat-icon>hotel</mat-icon> Go to Ward Management
          </button>
        </div>

        <div class="bed-board" *ngIf="selectedWard">
          <div class="ward-info-header" *ngIf="selectedWardObj">
            <div class="ward-info-left">
              <div class="ward-icon"><mat-icon>meeting_room</mat-icon></div>
              <div>
                <h3>{{ selectedWardObj.name }}</h3>
                <p>{{ selectedWardObj.wardType || 'General' }} Ward · {{ beds.length }} beds</p>
              </div>
            </div>
            <div class="ward-stats">
              <span class="stat available"><mat-icon>check_circle</mat-icon> {{ getAvailableCount() }}</span>
              <span class="stat occupied"><mat-icon>person</mat-icon> {{ getOccupiedCount() }}</span>
              <span class="stat reserved"><mat-icon>schedule</mat-icon> {{ getReservedCount() }}</span>
              <span class="stat maintenance"><mat-icon>build</mat-icon> {{ getMaintenanceCount() }}</span>
            </div>
          </div>

          <div class="bed-grid" *ngIf="beds.length; else noBeds">
            <button type="button"
                    class="bed-card"
                    *ngFor="let b of beds"
                    [ngClass]="'bed-' + b.status.toLowerCase()"
                    (click)="selectBed(b)">
              <div class="bed-top">
                <div class="bed-icon-wrapper">
                  <mat-icon class="bed-icon">bed</mat-icon>
                  <span class="status-indicator"></span>
                </div>
                <span class="status-badge">{{ b.status }}</span>
              </div>

              <div class="bed-info">
                <div class="bed-number">{{ b.bedNumber }}</div>
                <div class="bed-type">{{ b.bedType }}</div>
                <div class="room-badge" *ngIf="b.roomNumber">Room {{ b.roomNumber }}</div>
              </div>

              <div class="patient-info" *ngIf="b.patientName">
                <mat-icon>person</mat-icon>
                <span>{{ b.patientName }}</span>
              </div>
              <div class="free-hint" *ngIf="!b.patientName">
                <mat-icon>touch_app</mat-icon>
                View details
              </div>
            </button>
          </div>
          <ng-template #noBeds>
            <div class="empty-state compact">
              <mat-icon>hotel</mat-icon>
              <h3>No beds in this ward</h3>
              <p>Add rooms and beds from Ward Management.</p>
            </div>
          </ng-template>
        </div>
      </div>
    </app-main-layout>

    <!-- Bed / Patient Detail Dialog -->
    <ng-template #bedDetailDialog>
      <div class="detail-dialog">
        <div class="dialog-header" [ngClass]="'bed-' + selectedBed?.status?.toLowerCase()">
          <div class="header-left">
            <div class="bed-icon-small">
              <mat-icon>bed</mat-icon>
            </div>
            <div class="header-text">
              <h2 mat-dialog-title>{{ selectedBed?.bedNumber }}</h2>
              <p>
                {{ selectedBed?.bedType }}
                <span *ngIf="selectedBed?.roomNumber"> · Room {{ selectedBed?.roomNumber }}</span>
                <span *ngIf="wardLabel()"> · {{ wardLabel() }}</span>
              </p>
            </div>
          </div>
          <span class="status-pill">{{ selectedBed?.status }}</span>
        </div>

        <mat-dialog-content>
          <div class="bed-detail">
            <section class="detail-section">
              <div class="section-title">
                <mat-icon>info</mat-icon>
                <h4>Bed Details</h4>
              </div>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="label">Status</span>
                  <span class="value" [ngClass]="'status-' + selectedBed?.status?.toLowerCase()">
                    <mat-icon class="status-icon">{{ getStatusIcon(selectedBed?.status) }}</mat-icon>
                    {{ selectedBed?.status }}
                  </span>
                </div>
                <div class="detail-item">
                  <span class="label">Bed Type</span>
                  <span class="value">{{ selectedBed?.bedType || '—' }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Room</span>
                  <span class="value">{{ selectedBed?.roomNumber || '—' }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Ward</span>
                  <span class="value">{{ wardLabel() || '—' }}</span>
                </div>
              </div>
            </section>

            <section class="detail-section patient-section" *ngIf="selectedBed?.patientName">
              <div class="patient-banner">
                <div class="patient-avatar">{{ (selectedBed?.patientName || '?')[0] }}</div>
                <div class="patient-banner-text">
                  <strong>{{ selectedBed?.patientName }}</strong>
                  <span *ngIf="selectedBed?.patientMrn">MRN {{ selectedBed?.patientMrn }}</span>
                </div>
                <span class="status-pill soft" *ngIf="selectedBed?.status">{{ selectedBed?.status }}</span>
              </div>

              <div class="section-title">
                <mat-icon>person</mat-icon>
                <h4>Patient Details</h4>
              </div>
              <div class="detail-grid">
                <div class="detail-item" *ngIf="selectedBed?.patientPhone">
                  <span class="label">Phone</span>
                  <span class="value">{{ selectedBed?.patientPhone }}</span>
                </div>
                <div class="detail-item" *ngIf="selectedBed?.patientGender">
                  <span class="label">Gender</span>
                  <span class="value">{{ selectedBed?.patientGender }}</span>
                </div>
                <div class="detail-item" *ngIf="selectedBed?.patientAge">
                  <span class="label">Age</span>
                  <span class="value">{{ selectedBed?.patientAge }}</span>
                </div>
                <div class="detail-item" *ngIf="selectedBed?.doctorName">
                  <span class="label">Attending Doctor</span>
                  <span class="value">Dr. {{ selectedBed?.doctorName }}</span>
                </div>
                <div class="detail-item" *ngIf="selectedBed?.admissionDate">
                  <span class="label">Admitted</span>
                  <span class="value">{{ selectedBed?.admissionDate | date:'mediumDate' }}</span>
                </div>
                <div class="detail-item" *ngIf="selectedBed?.admissionType">
                  <span class="label">Admission Type</span>
                  <span class="value">{{ selectedBed?.admissionType }}</span>
                </div>
                <div class="detail-item full" *ngIf="selectedBed?.provisionalDiagnosis">
                  <span class="label">Provisional Diagnosis</span>
                  <span class="value">{{ selectedBed?.provisionalDiagnosis }}</span>
                </div>
              </div>
            </section>

            <div class="no-patient" *ngIf="!selectedBed?.patientName && selectedBed?.status === 'Available'">
              <mat-icon>bedtime</mat-icon>
              <p>This bed is available for admission</p>
            </div>

            <div class="no-patient muted" *ngIf="!selectedBed?.patientName && selectedBed?.status !== 'Available'">
              <mat-icon>engineering</mat-icon>
              <p>Bed is {{ selectedBed?.status?.toLowerCase() }} — no patient assigned.</p>
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
      </div>
    </ng-template>
  `,
  styles: [`
    .beds-page { display: grid; gap: 1.25rem; }

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .ward-selector { overflow-x: auto; max-width: 100%; }
    .ward-selector ::ng-deep .mat-button-toggle-group { flex-wrap: wrap; }

    .legend {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      padding: 0.5rem 0.75rem;
      background: var(--bg-card, #fff);
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 10px;
    }
    .legend-item {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-secondary, #475569);
    }
    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .legend-item.available .dot { background: var(--status-success, #4caf50); }
    .legend-item.occupied .dot { background: var(--status-error, #f44336); }
    .legend-item.reserved .dot { background: var(--status-warning, #ff9800); }
    .legend-item.maintenance .dot { background: #94a3b8; }

    .empty-state {
      text-align: center;
      padding: 3.5rem 2rem;
      background: var(--bg-card, #fff);
      border-radius: 14px;
      border: 1px solid var(--border-color, #e5e7eb);
    }
    .empty-state.compact { padding: 2.5rem 1.5rem; }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; color: var(--text-muted, #cbd5e1); }
    .empty-state h3 { margin: 1rem 0 0.4rem; color: var(--text-primary, #0f172a); }
    .empty-state p { color: var(--text-muted, #64748b); margin-bottom: 1.25rem; }

    .ward-info-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      background: var(--bg-card, #fff);
      border-radius: 14px;
      border: 1px solid var(--border-color, #e5e7eb);
      box-shadow: 0 1px 3px rgba(15, 23, 42, .04);
      flex-wrap: wrap;
      gap: 1rem;
    }
    .ward-info-left { display: flex; align-items: center; gap: 0.9rem; }
    .ward-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--accent-primary, #3f51b5), var(--accent-secondary, #5c6bc0));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }
    .ward-icon mat-icon { font-size: 24px; width: 24px; height: 24px; }
    .ward-info-left h3 { margin: 0; font-size: 1.15rem; color: var(--text-primary, #0f172a); }
    .ward-info-left p { margin: 0.15rem 0 0; color: var(--text-secondary, #64748b); font-size: 0.82rem; }
    .ward-stats { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .stat {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.4rem 0.7rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
      min-width: 42px;
      justify-content: center;
    }
    .stat mat-icon { font-size: 15px; width: 15px; height: 15px; }
    .stat.available { background: var(--status-success-bg, #e8f5e9); color: var(--status-success, #2e7d32); }
    .stat.occupied { background: var(--status-error-bg, #ffebee); color: var(--status-error, #c62828); }
    .stat.reserved { background: var(--status-warning-bg, #fff3e0); color: var(--status-warning, #ef6c00); }
    .stat.maintenance { background: #f1f5f9; color: #475569; }

    .bed-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }

    .bed-card {
      appearance: none;
      -webkit-appearance: none;
      font: inherit;
      background: var(--bg-card, #fff);
      border-radius: 16px;
      padding: 1rem 1rem 1.1rem;
      cursor: pointer;
      border: 2px solid var(--border-color, #e2e8f0);
      transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      text-align: left;
      min-height: 190px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, .04);
      overflow: hidden;
    }
    .bed-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 24px rgba(15, 23, 42, .1);
    }
    .bed-card:focus-visible { outline: 2px solid var(--accent-primary, #3f51b5); outline-offset: 2px; }

    .bed-available { border-color: #86efac; background: linear-gradient(180deg, #f0fdf4 0%, #fff 70%); }
    .bed-occupied { border-color: #fca5a5; background: linear-gradient(180deg, #fef2f2 0%, #fff 70%); }
    .bed-reserved { border-color: #fdba74; background: linear-gradient(180deg, #fff7ed 0%, #fff 70%); }
    .bed-maintenance { border-color: #cbd5e1; background: linear-gradient(180deg, #f8fafc 0%, #fff 70%); }

    .bed-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.65rem;
    }
    .bed-icon-wrapper { position: relative; width: 56px; height: 56px; display: grid; place-items: center; }
    .bed-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: var(--border-color, #94a3b8);
      transition: transform .15s ease;
    }
    .bed-card:hover .bed-icon { transform: scale(1.06); }
    .bed-available .bed-icon { color: #16a34a; }
    .bed-occupied .bed-icon { color: #dc2626; }
    .bed-reserved .bed-icon { color: #ea580c; }
    .bed-maintenance .bed-icon { color: #64748b; }

    .status-indicator {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 3px solid #fff;
      box-shadow: 0 1px 3px rgba(0,0,0,.15);
    }
    .bed-available .status-indicator { background: #22c55e; }
    .bed-occupied .status-indicator { background: #ef4444; }
    .bed-reserved .status-indicator { background: #f97316; }
    .bed-maintenance .status-indicator { background: #94a3b8; }

    .status-badge {
      padding: 0.2rem 0.55rem;
      border-radius: 999px;
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      white-space: nowrap;
    }
    .bed-available .status-badge { background: #dcfce7; color: #15803d; }
    .bed-occupied .status-badge { background: #fee2e2; color: #b91c1c; }
    .bed-reserved .status-badge { background: #ffedd5; color: #c2410c; }
    .bed-maintenance .status-badge { background: #f1f5f9; color: #475569; }

    .bed-info { flex: 1; }
    .bed-number {
      font-size: 1.35rem;
      font-weight: 750;
      color: var(--text-primary, #0f172a);
      line-height: 1.15;
      letter-spacing: -.02em;
    }
    .bed-type {
      font-size: 0.75rem;
      color: var(--text-muted, #64748b);
      text-transform: capitalize;
      margin-top: 0.1rem;
    }
    .room-badge {
      display: inline-flex;
      margin-top: 0.4rem;
      padding: 0.15rem 0.5rem;
      background: var(--bg-badge, #eef2ff);
      color: var(--accent-primary, #3730a3);
      border-radius: 999px;
      font-size: 0.68rem;
      font-weight: 700;
    }

    .patient-info {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      margin-top: 0.65rem;
      padding: 0.45rem 0.55rem;
      background: rgba(15, 23, 42, .04);
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-primary, #334155);
      min-width: 0;
    }
    .patient-info span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .patient-info mat-icon { font-size: 16px; width: 16px; height: 16px; color: var(--accent-primary, #3f51b5); flex-shrink: 0; }

    .free-hint {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      margin-top: 0.65rem;
      font-size: 0.72rem;
      color: var(--text-muted, #94a3b8);
      opacity: 0;
      transition: opacity .15s ease;
    }
    .bed-card:hover .free-hint { opacity: 1; }
    .free-hint mat-icon { font-size: 14px; width: 14px; height: 14px; }

    /* ── Dialog ───────────────────────────────── */
    .detail-dialog { min-width: min(520px, 86vw); }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1.1rem 1.4rem;
      border-bottom: 1px solid var(--border-color, #e5e7eb);
      background: var(--bg-card, #fff);
    }
    .dialog-header.bed-available { background: #f0fdf4; }
    .dialog-header.bed-occupied { background: #fef2f2; }
    .dialog-header.bed-reserved { background: #fff7ed; }
    .dialog-header.bed-maintenance { background: #f8fafc; }

    .header-left { display: flex; align-items: center; gap: 0.85rem; min-width: 0; }
    .bed-icon-small {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: #e2e8f0;
      color: #475569;
    }
    .bed-available .bed-icon-small { background: #16a34a; color: #fff; }
    .bed-occupied .bed-icon-small { background: #dc2626; color: #fff; }
    .bed-reserved .bed-icon-small { background: #ea580c; color: #fff; }
    .bed-maintenance .bed-icon-small { background: #64748b; color: #fff; }
    .bed-icon-small mat-icon { font-size: 22px; width: 22px; height: 22px; }

    .header-text { min-width: 0; }
    .header-text h2 {
      margin: 0 !important;
      font-size: 1.25rem;
      font-weight: 750;
      color: var(--text-primary, #0f172a);
      letter-spacing: -.02em;
      line-height: 1.2;
    }
    .header-text p {
      margin: 0.15rem 0 0;
      font-size: 0.82rem;
      color: var(--text-muted, #64748b);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .status-pill {
      padding: 0.3rem 0.7rem;
      border-radius: 999px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      white-space: nowrap;
      background: #e2e8f0;
      color: #334155;
      flex-shrink: 0;
    }
    .bed-available ~ .status-pill,
    .dialog-header.bed-available .status-pill { background: #dcfce7; color: #15803d; }
    .dialog-header.bed-occupied .status-pill { background: #fee2e2; color: #b91c1c; }
    .dialog-header.bed-reserved .status-pill { background: #ffedd5; color: #c2410c; }
    .dialog-header.bed-maintenance .status-pill { background: #f1f5f9; color: #475569; }
    .status-pill.soft {
      background: rgba(15, 23, 42, .06);
      color: #475569;
      text-transform: none;
      letter-spacing: 0;
    }

    mat-dialog-content { padding: 1.25rem 1.4rem !important; }
    mat-dialog-actions { padding: 0.9rem 1.4rem 1.1rem !important; gap: 0.5rem; border-top: 1px solid var(--border-color, #e5e7eb); }
    mat-dialog-actions button { min-height: 40px; }

    .bed-detail { display: grid; gap: 1.1rem; }

    .patient-banner {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.9rem 1rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      margin-bottom: 1rem;
    }
    .patient-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3f51b5, #5c6bc0);
      color: #fff;
      display: grid;
      place-items: center;
      font-weight: 700;
      font-size: 1.1rem;
      flex-shrink: 0;
    }
    .patient-banner-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.1rem; }
    .patient-banner-text strong {
      color: var(--text-primary, #0f172a);
      font-size: 0.98rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .patient-banner-text span { color: var(--text-muted, #64748b); font-size: 0.78rem; }

    .section-title {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      margin-bottom: 0.75rem;
    }
    .section-title mat-icon {
      color: var(--accent-primary, #3f51b5);
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    .section-title h4 {
      margin: 0;
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--text-primary, #0f172a);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.65rem;
    }
    .detail-item {
      background: var(--bg-card, #fff);
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 10px;
      padding: 0.65rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      min-width: 0;
    }
    .detail-item.full { grid-column: 1 / -1; }
    .detail-item .label {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-muted, #94a3b8);
    }
    .detail-item .value {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-primary, #0f172a);
      word-break: break-word;
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
    }
    .status-icon { font-size: 16px; width: 16px; height: 16px; }
    .status-available { color: #15803d; }
    .status-occupied { color: #b91c1c; }
    .status-reserved { color: #c2410c; }
    .status-maintenance { color: #475569; }

    .no-patient {
      text-align: center;
      padding: 1.5rem 1rem;
      color: var(--text-muted, #64748b);
      background: var(--bg-hover, #f8fafc);
      border: 1px dashed var(--border-color, #cbd5e1);
      border-radius: 12px;
    }
    .no-patient mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      margin-bottom: 0.5rem;
      color: #16a34a;
    }
    .no-patient.muted mat-icon { color: #94a3b8; }
    .no-patient p { margin: 0; font-size: 0.9rem; }

    @media (max-width: 560px) {
      .detail-grid { grid-template-columns: 1fr; }
      .detail-dialog { min-width: min(100vw - 24px, 520px); }
      .dialog-header { flex-wrap: wrap; }
      mat-dialog-content { padding: 1rem !important; }
      .bed-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
      .toolbar { flex-direction: column; align-items: stretch; }
      .legend { justify-content: center; }
    }
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
      this.wards = Array.isArray(r) ? r : (r?.data || r?.items || []);
      if (this.wards.length > 0) {
        this.selectedWard = this.wards[0].id;
        this.selectedWardObj = this.wards[0];
        this.loadBeds();
      }
    });
  }

  loadBeds() {
    if (this.selectedWard) {
      this.api.get<any[]>(`v1/wards/${this.selectedWard}/beds`).subscribe(r => {
        this.beds = (r || []).map(b => ({
          ...b,
          patientName: b.patientName || b.PatientName || null,
          roomNumber: b.roomNumber || b.RoomNumber || null,
          bedNumber: b.bedNumber || b.BedNumber,
          bedType: b.bedType || b.BedType,
          status: b.status || b.Status,
          wardName: b.wardName || b.WardName || this.selectedWardObj?.name || null
        }));
        this.selectedWardObj = this.wards.find(w => w.id === this.selectedWard);
        this.beds = this.beds.map(b => ({
          ...b,
          wardName: b.wardName || this.selectedWardObj?.name || null
        }));
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

  wardLabel(): string {
    return this.selectedBed?.wardName || this.selectedWardObj?.name || '';
  }

  selectBed(bed: any) {
    this.selectedBed = bed;
    if (!this.selectedBed?.wardName && this.selectedWardObj?.name) {
      this.selectedBed = { ...bed, wardName: this.selectedWardObj.name };
    }
    this.dialog.open(this.bedDetailDialog, {
      width: '560px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'bed-detail-dialog',
      autoFocus: false
    });
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
