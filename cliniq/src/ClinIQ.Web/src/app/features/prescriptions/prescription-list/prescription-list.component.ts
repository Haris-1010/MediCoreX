import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  standalone: false,
  selector: 'app-prescription-list',
  template: `
    <app-main-layout>
      <app-page-header title="Prescriptions"
        [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Prescriptions' }]">
        <button mat-raised-button color="primary" (click)="addPrescription()" *appHasPermission="'Prescriptions.Create'">
          <mat-icon>add</mat-icon> New Prescription
        </button>
      </app-page-header>

      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search prescriptions..." (search)="onSearch($event)"></app-search-input>
          <mat-form-field appearance="outline" class="status-filter">
            <mat-label>Status</mat-label>
            <mat-select [(value)]="statusFilter" (selectionChange)="onFilterChange()">
              <mat-option value="">All</mat-option>
              <mat-option value="pending">Pending</mat-option>
              <mat-option value="dispensed">Dispensed</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div *ngIf="loading" class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <div *ngIf="!loading && prescriptions.length === 0" class="empty-state">
          <mat-icon class="empty-icon">receipt_long</mat-icon>
          <h3>No Prescriptions</h3>
          <p>Get started by creating the first prescription.</p>
          <button mat-raised-button color="primary" (click)="addPrescription()" *appHasPermission="'Prescriptions.Create'">
            <mat-icon>add</mat-icon> New Prescription
          </button>
        </div>

        <table mat-table [dataSource]="prescriptions" *ngIf="!loading && prescriptions.length > 0" class="full-width-table">
          <ng-container matColumnDef="prescriptionNumber">
            <th mat-header-cell *matHeaderCellDef> Rx # </th>
            <td mat-cell *matCellDef="let rx"> {{ rx.prescriptionNumber }} </td>
          </ng-container>

          <ng-container matColumnDef="patientName">
            <th mat-header-cell *matHeaderCellDef> Patient </th>
            <td mat-cell *matCellDef="let rx"> {{ rx.patientName }} </td>
          </ng-container>

          <ng-container matColumnDef="doctorName">
            <th mat-header-cell *matHeaderCellDef> Doctor </th>
            <td mat-cell *matCellDef="let rx"> {{ rx.doctorName }} </td>
          </ng-container>

          <ng-container matColumnDef="prescriptionDate">
            <th mat-header-cell *matHeaderCellDef> Date </th>
            <td mat-cell *matCellDef="let rx"> {{ rx.prescriptionDate | date:'mediumDate' }} </td>
          </ng-container>

          <ng-container matColumnDef="itemsCount">
            <th mat-header-cell *matHeaderCellDef> Medicines </th>
            <td mat-cell *matCellDef="let rx"> {{ rx.itemsCount }} </td>
          </ng-container>

          <ng-container matColumnDef="isDispensed">
            <th mat-header-cell *matHeaderCellDef> Status </th>
            <td mat-cell *matCellDef="let rx">
              <span class="status-badge" [class.dispensed]="rx.isDispensed" [class.pending]="!rx.isDispensed">
                {{ rx.isDispensed ? 'Dispensed' : 'Pending' }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let rx" (click)="$event.stopPropagation()">
              <button mat-icon-button [matMenuTriggerFor]="menu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="viewPrescription(rx)">
                  <mat-icon>visibility</mat-icon> View Details
                </button>
                <button mat-menu-item (click)="editPrescription(rx)" *appHasPermission="'Prescriptions.Edit'">
                  <mat-icon>edit</mat-icon> Edit
                </button>
                <button mat-menu-item (click)="printPrescription(rx)" *appHasPermission="'Prescriptions.Print'">
                  <mat-icon>print</mat-icon> Print
                </button>
                <ng-container *appHasPermission="'Prescriptions.Dispense'">
                  <button mat-menu-item (click)="dispensePrescription(rx)" *ngIf="!rx.isDispensed">
                    <mat-icon>check_circle</mat-icon> Dispense
                  </button>
                </ng-container>
                <mat-divider></mat-divider>
                <button mat-menu-item (click)="deletePrescription(rx)" class="delete-action" *appHasPermission="'Prescriptions.Delete'">
                  <mat-icon color="warn">delete</mat-icon> Delete
                </button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;" class="prescription-row" (click)="viewPrescription(row)"></tr>
        </table>

        <mat-paginator
          *ngIf="totalCount > 0"
          [length]="totalCount"
          [pageSize]="pageSize"
          [pageIndex]="pageIndex"
          [pageSizeOptions]="[10, 25, 50, 100]"
          (page)="onPageChange($event)"
          showFirstLastButtons>
        </mat-paginator>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .filters { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; }
    .status-filter { width: 150px; }
    .loading-container { display: flex; justify-content: center; padding: 3rem; }
    .empty-state { text-align: center; padding: 3rem 1rem; color: var(--text-muted, #64748b); }
    .empty-icon { font-size: 64px; width: 64px; height: 64px; color: var(--text-muted, #94a3b8); margin-bottom: 1rem; }
    .full-width-table { width: 100%; }
    .prescription-row { cursor: pointer; }
    .prescription-row:hover { background: var(--bg-hover, #f5f5f5); }
    .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 0.75rem; font-weight: 500; }
    .status-badge.dispensed { background: var(--status-success-bg, #e8f5e9); color: var(--status-success, #2e7d32); }
    .status-badge.pending { background: var(--status-warning-bg, #fff3e0); color: var(--status-warning, #e65100); }
    .delete-action { color: var(--status-error, #f44336); }
  `]
})
export class PrescriptionListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  prescriptions: any[] = [];
  loading = false;
  searchTerm = '';
  statusFilter = '';
  columns = ['prescriptionNumber', 'patientName', 'doctorName', 'prescriptionDate', 'itemsCount', 'isDispensed', 'actions'];

  totalCount = 0;
  pageSize = 25;
  pageIndex = 0;

  constructor(
    private api: ApiService,
    private router: Router,
    private dialog: MatDialog,
    private notification: NotificationService
  ) {}

  ngOnInit() { this.loadPrescriptions(); }

  loadPrescriptions() {
    this.loading = true;
    this.api.get<any>('v1/prescriptions', {
      pageNumber: this.pageIndex + 1,
      pageSize: this.pageSize,
      searchTerm: this.searchTerm,
      status: this.statusFilter
    }).subscribe({
      next: (result) => {
        if (result && result.items) {
          this.prescriptions = result.items;
          this.totalCount = result.totalCount || 0;
        } else {
          this.prescriptions = Array.isArray(result) ? result : [];
          this.totalCount = this.prescriptions.length;
        }
        this.loading = false;
      },
      error: () => { this.loading = false; this.notification.error('Failed to load prescriptions'); }
    });
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.pageIndex = 0;
    this.loadPrescriptions();
  }

  onFilterChange() {
    this.pageIndex = 0;
    this.loadPrescriptions();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPrescriptions();
  }

  addPrescription() { this.router.navigate(['/prescriptions/new']); }

  viewPrescription(rx: any) { this.router.navigate(['/prescriptions', rx.id]); }

  editPrescription(rx: any) { this.router.navigate(['/prescriptions/edit', rx.id]); }

  printPrescription(rx: any) { window.open(`/prescriptions/print/${rx.id}`, '_blank'); }

  dispensePrescription(rx: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Dispense Prescription', message: `Mark prescription ${rx.prescriptionNumber} as dispensed?`, confirmText: 'Dispense', cancelText: 'Cancel' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.post(`v1/prescriptions/${rx.id}/dispense`, {}).subscribe({
          next: () => { this.notification.success('Prescription dispensed'); this.loadPrescriptions(); },
          error: () => { this.notification.error('Failed to dispense prescription'); }
        });
      }
    });
  }

  deletePrescription(rx: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Prescription', message: `Are you sure you want to delete prescription ${rx.prescriptionNumber}? This cannot be undone.`, confirmText: 'Delete', cancelText: 'Cancel', confirmColor: 'warn' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.delete('v1/prescriptions', rx.id).subscribe({
          next: () => { this.notification.success('Prescription deleted successfully'); this.loadPrescriptions(); },
          error: () => { this.notification.error('Failed to delete prescription'); }
        });
      }
    });
  }
}
