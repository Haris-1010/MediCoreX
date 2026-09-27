import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService, PagedResult } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TenantService, Branding } from '../../../core/services/tenant.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

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
                <button mat-menu-item (click)="printRecord(a)"><mat-icon>print</mat-icon> Print {{ a.status === 'Discharged' ? 'Discharge' : 'Admission' }}</button>
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
  `,
  styles: [`
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; }
    .filters { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; align-items: center; }
    table { width: 100%; }
    .delete-item { color: #e53935 !important; }
  `]
})
export class AdmissionListComponent implements OnInit {
  admissions: any[] = []; wards: any[] = [];
  columns = ['admissionNumber', 'patient', 'mrn', 'ward', 'bed', 'doctor', 'admissionDate', 'days', 'status', 'actions'];
  totalCount = 0; pageSize = 10; pageIndex = 0; searchTerm = ''; filterWard = ''; filterStatus = '';
  branding: Branding | null = null;

  constructor(private api: ApiService, private notification: NotificationService, private tenantService: TenantService, private dialog: MatDialog, private router: Router) {}

  ngOnInit() { this.load(); this.api.get<any>('v1/wards').subscribe(r => this.wards = Array.isArray(r) ? r : []); this.tenantService.loadBranding().subscribe(t => this.branding = t); }

  load() {
    this.api.get<PagedResult<any>>('v1/admissions', { pageNumber: this.pageIndex + 1, pageSize: this.pageSize, searchTerm: this.searchTerm, wardId: this.filterWard, status: this.filterStatus })
      .subscribe(r => { this.admissions = r.items; this.totalCount = r.totalCount; });
  }

  onSearch(term: string) { this.searchTerm = term; this.pageIndex = 0; this.load(); }
  onPage(e: any) { this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.load(); }
  hasActiveFilters(): boolean { return !!(this.searchTerm || this.filterWard || this.filterStatus); }
  clearFilters() { this.searchTerm = ''; this.filterWard = ''; this.filterStatus = ''; this.pageIndex = 0; this.load(); }

  printRecord(a: any) {
    const url = a.status === 'Discharged' 
      ? `/ipd/admissions/discharge-print/${a.id}`
      : `/ipd/admissions/print/${a.id}`;
    window.open(url, '_blank');
  }

  deleteAdmission(a: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Delete Admission', message: `Are you sure you want to delete admission ${a.admissionNumber} for ${a.patientName}? This action cannot be undone.`, confirmText: 'Delete', confirmColor: 'warn' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.delete('v1/admissions', a.id).subscribe({
          next: () => { this.notification.success('Admission deleted'); this.load(); }
        });
      }
    });
  }
}