import { Component, OnInit } from '@angular/core';
import { ApiService, PagedResult } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TenantService, Tenant } from '../../../core/services/tenant.service';

@Component({
  standalone: false,
  selector: 'app-admission-list',
  template: `
    <app-main-layout>
      <app-page-header title="Admissions" [breadcrumbs]="[{ label: 'IPD', route: '/ipd' }, { label: 'Admissions' }]">
        <button mat-raised-button color="primary" routerLink="/ipd/admit"><mat-icon>add</mat-icon> New Admission</button>
      </app-page-header>
      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search by name or MRN..." (search)="onSearch($event)"></app-search-input>
          <mat-form-field appearance="outline"><mat-label>Ward</mat-label>
            <mat-select [(value)]="filterWard" (selectionChange)="load()">
              <mat-option value="">All</mat-option><mat-option *ngFor="let w of wards" [value]="w.id">{{ w.name }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Status</mat-label>
            <mat-select [(value)]="filterStatus" (selectionChange)="load()">
              <mat-option value="">All</mat-option><mat-option value="Admitted">Admitted</mat-option><mat-option value="Discharged">Discharged</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-stroked-button (click)="clearFilters()" *ngIf="hasActiveFilters()">
            <mat-icon>filter_list_off</mat-icon> Clear
          </button>
        </div>
        <table mat-table [dataSource]="admissions" matSort>
          <ng-container matColumnDef="admissionNumber"><th mat-header-cell *matHeaderCellDef>Admission #</th><td mat-cell *matCellDef="let a">{{ a.admissionNumber }}</td></ng-container>
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let a">{{ a.patientName }}</td></ng-container>
          <ng-container matColumnDef="mrn"><th mat-header-cell *matHeaderCellDef>MRN</th><td mat-cell *matCellDef="let a">{{ a.mrn }}</td></ng-container>
          <ng-container matColumnDef="ward"><th mat-header-cell *matHeaderCellDef>Ward</th><td mat-cell *matCellDef="let a">{{ a.wardName }}</td></ng-container>
          <ng-container matColumnDef="bed"><th mat-header-cell *matHeaderCellDef>Bed</th><td mat-cell *matCellDef="let a">{{ a.bedNumber }}</td></ng-container>
          <ng-container matColumnDef="doctor"><th mat-header-cell *matHeaderCellDef>Doctor</th><td mat-cell *matCellDef="let a">Dr. {{ a.doctorName }}</td></ng-container>
          <ng-container matColumnDef="admissionDate"><th mat-header-cell *matHeaderCellDef>Admitted</th><td mat-cell *matCellDef="let a">{{ a.admissionDate | date:'mediumDate' }}</td></ng-container>
          <ng-container matColumnDef="days"><th mat-header-cell *matHeaderCellDef>Days</th><td mat-cell *matCellDef="let a">{{ a.daysAdmitted }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let a"><app-status-badge [status]="a.status"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let a">
              <button mat-icon-button [matMenuTriggerFor]="menu"><mat-icon>more_vert</mat-icon></button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item [routerLink]="['/ipd/admissions', a.id]"><mat-icon>visibility</mat-icon> View Profile</button>
                <button mat-menu-item (click)="printAdmission(a)"><mat-icon>print</mat-icon> Print Admission</button>
                <button mat-menu-item [routerLink]="['/ipd/discharge', a.id]" *ngIf="a.status === 'Admitted'"><mat-icon>logout</mat-icon> Discharge</button>
                <button mat-menu-item (click)="deleteAdmission(a)" class="delete-item"><mat-icon>delete</mat-icon> Delete</button>
              </mat-menu>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <mat-paginator [length]="totalCount" [pageSize]="pageSize" [pageSizeOptions]="[10, 25, 50]" (page)="onPage($event)"></mat-paginator>
      </div>
    </app-main-layout>

    <!-- Print Admission Slip -->
    <div class="print-only" id="printArea">
      <div *ngIf="printing" class="print-sheet">
        <div class="sheet-head">
          <div class="brand">
            <div class="brand-line">
              <img *ngIf="branding?.logoUrl" [src]="branding?.logoUrl" alt="logo" class="brand-logo">
              <span>{{ branding?.name || 'Hospital' }}</span>
            </div>
            <small *ngIf="branding?.website || branding?.phone">{{ branding?.website || '' }}{{ (branding?.website && branding?.phone) ? ' \u2022 ' : '' }}{{ branding?.phone || '' }}</small>
            <small *ngIf="branding?.address">{{ branding?.address }}</small>
          </div>
          <div class="doc-title">
            <h1>Admission Slip</h1>
            <p>Admission # {{ printing.admissionNumber }}</p>
          </div>
        </div>

        <section>
          <h3>Patient Information</h3>
          <div class="grid">
            <div class="field"><label>Patient Name</label><span>{{ printing.patientName }}</span></div>
            <div class="field"><label>MRN</label><span>{{ printing.mrn }}</span></div>
            <div class="field"><label>Admission #</label><span>{{ printing.admissionNumber }}</span></div>
          </div>
        </section>

        <section>
          <h3>Admission Details</h3>
          <div class="grid">
            <div class="field"><label>Doctor</label><span>Dr. {{ printing.doctorName }}</span></div>
            <div class="field"><label>Ward / Bed</label><span>{{ printing.wardName }} / {{ printing.bedNumber }}</span></div>
            <div class="field"><label>Admission Date</label><span>{{ printing.admissionDate | date:'dd MMM yyyy, h:mm a' }}</span></div>
            <div class="field"><label>Type</label><span>{{ printing.type }}</span></div>
            <div class="field list-field"><label>Reason</label><span>{{ printing.admissionReason || '-' }}</span></div>
            <div class="field list-field"><label>Diagnosis</label><span>{{ printing.provisionalDiagnosis || '-' }}</span></div>
          </div>
        </section>

        <div class="signatures">
          <div class="sig-block"><div class="sig-line"></div><p>Patient / Guardian Signature</p></div>
          <div class="sig-block"><div class="sig-line"></div><p>Attending Doctor Signature</p></div>
        </div>

        <div class="foot">
          <span>{{ branding?.name || 'Hospital' }} \u2022 Admission Record</span>
          <span>Printed {{ today | date:'dd MMM yyyy, h:mm a' }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card { background: white; padding: 1.5rem; border-radius: 8px; }
    .filters { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; align-items: center; }
    table { width: 100%; }
    .delete-item { color: #e53935 !important; }

    .print-only { display: none; }
    .print-sheet { max-width: 820px; margin: 0 auto; padding: 28px 36px; font-family: 'Segoe UI', Arial, sans-serif; color: #111; }
    .sheet-head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #102b35; padding-bottom: 14px; margin-bottom: 18px; }
    .brand .brand-line { display: flex; align-items: center; gap: 8px; }
    .brand .brand-logo { max-width: 40px; max-height: 40px; border-radius: 6px; object-fit: contain; }
    .brand span { font-size: 20px; font-weight: 800; color: #102b35; }
    .brand small { display: block; font-size: 11px; color: #64748b; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; }
    .doc-title { text-align: right; }
    .doc-title h1 { margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: .04em; color: #102b35; }
    .doc-title p { margin: 2px 0 0; font-size: 11px; color: #64748b; }

    section { margin-bottom: 16px; }
    section h3 { font-size: 13px; text-transform: uppercase; letter-spacing: .06em; color: #102b35; border-bottom: 1px solid #dce5e5; padding-bottom: 6px; margin: 0 0 10px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px 20px; }
    .field label { display: block; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: .04em; }
    .field span { font-size: 13px; font-weight: 600; }
    .list-field { grid-column: 1 / -1; }

    .signatures { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; }
    .sig-block { text-align: center; width: 45%; }
    .sig-line { border-top: 1px solid #333; margin-bottom: 6px; }
    .sig-block p { font-size: 10px; color: #64748b; margin: 0; text-transform: uppercase; letter-spacing: .04em; }

    .foot { margin-top: 20px; border-top: 1px solid #dce5e5; padding-top: 10px; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; }

    @media print {
      .print-only { display: block !important; position: fixed; top: 0; left: 0; width: 100%; background: white; z-index: 9999; }
      app-main-layout { display: none !important; }
      .print-sheet { max-width: none; padding: 0; }
      :host { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  `]
})
export class AdmissionListComponent implements OnInit {
  admissions: any[] = []; wards: any[] = [];
  columns = ['admissionNumber', 'patient', 'mrn', 'ward', 'bed', 'doctor', 'admissionDate', 'days', 'status', 'actions'];
  totalCount = 0; pageSize = 10; pageIndex = 0; searchTerm = ''; filterWard = ''; filterStatus = '';
  printing: any = null;
  branding: Tenant | null = null;
  today = new Date();

  constructor(private api: ApiService, private notification: NotificationService, private tenantService: TenantService) {}

  ngOnInit() { this.load(); this.api.get<any>('v1/wards').subscribe(r => this.wards = Array.isArray(r) ? r : []); this.tenantService.loadTenant().subscribe(t => this.branding = t); }

  load() {
    this.api.get<PagedResult<any>>('v1/admissions', { pageNumber: this.pageIndex + 1, pageSize: this.pageSize, searchTerm: this.searchTerm, wardId: this.filterWard, status: this.filterStatus })
      .subscribe(r => { this.admissions = r.items; this.totalCount = r.totalCount; });
  }

  onSearch(term: string) { this.searchTerm = term; this.pageIndex = 0; this.load(); }
  onPage(e: any) { this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.load(); }
  hasActiveFilters(): boolean { return !!(this.searchTerm || this.filterWard || this.filterStatus); }
  clearFilters() { this.searchTerm = ''; this.filterWard = ''; this.filterStatus = ''; this.pageIndex = 0; this.load(); }

  printAdmission(a: any) {
    this.printing = a;
    setTimeout(() => { window.print(); this.printing = null; }, 300);
  }

  deleteAdmission(a: any) {
    if (!confirm(`Delete admission ${a.admissionNumber} for ${a.patientName}?`)) return;
    this.api.delete('v1/admissions', a.id).subscribe({
      next: () => { this.notification.success('Admission deleted'); this.load(); }
    });
  }
}
