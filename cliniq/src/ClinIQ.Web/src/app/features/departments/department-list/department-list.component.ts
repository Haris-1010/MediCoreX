import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  standalone: false,
  selector: 'app-department-list',
  template: `
    <app-main-layout>
      <app-page-header title="Departments" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Departments' }]">
        <button mat-raised-button color="primary" (click)="addDepartment()">
          <mat-icon>add</mat-icon> Add Department
        </button>
      </app-page-header>

      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search departments..." (search)="onSearch($event)"></app-search-input>
          <button mat-stroked-button (click)="clearFilters()" *ngIf="searchTerm">
            <mat-icon>filter_list_off</mat-icon> Clear
          </button>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && filteredDepartments.length === 0" class="empty-state">
          <mat-icon class="empty-icon">business</mat-icon>
          <h3>No Departments</h3>
          <p>Get started by creating your first department.</p>
          <button mat-raised-button color="primary" (click)="addDepartment()">
            <mat-icon>add</mat-icon> Add Department
          </button>
        </div>

        <!-- Table -->
        <table mat-table [dataSource]="filteredDepartments" *ngIf="!loading && filteredDepartments.length > 0">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Department Name</th>
            <td mat-cell *matCellDef="let d">
              <div class="dept-name">
                <div class="dept-avatar">{{ d.name.charAt(0) }}</div>
                <div>
                  <div class="dept-title">{{ d.name }}</div>
                  <div class="dept-code">{{ d.code }}</div>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let d">{{ d.description || '—' }}</td>
          </ng-container>

          <ng-container matColumnDef="head">
            <th mat-header-cell *matHeaderCellDef>Head of Department</th>
            <td mat-cell *matCellDef="let d">{{ d.headOfDepartment || '—' }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let d">
              <span class="status-chip" [class.active]="d.isActive" [class.inactive]="!d.isActive">
                {{ d.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let d">
              <button mat-icon-button [matMenuTriggerFor]="menu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="editDepartment(d)">
                  <mat-icon>edit</mat-icon> Edit
                </button>
                <button mat-menu-item (click)="deleteDepartment(d)" class="delete-action">
                  <mat-icon color="warn">delete</mat-icon> Delete
                </button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; }
    .filters { display: flex; gap: 1rem; margin-bottom: 1rem; align-items: center; }
    table { width: 100%; }

    .loading-container { display: flex; justify-content: center; padding: 3rem; }

    .empty-state { text-align: center; padding: 3rem; color: var(--text-muted, #666); }
    .empty-icon { font-size: 48px; width: 48px; height: 48px; color: #ccc; margin-bottom: 1rem; }
    .empty-state h3 { margin: 0 0 0.5rem; color: var(--text-primary, #333); }
    .empty-state p { margin: 0 0 1.5rem; }

    .dept-name { display: flex; align-items: center; gap: 0.75rem; }
    .dept-avatar {
      width: 36px; height: 36px; border-radius: 8px;
      background: linear-gradient(135deg, #1a237e, #0d47a1);
      color: white; display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.9rem;
    }
    .dept-title { font-weight: 600; font-size: 0.9rem; }
    .dept-code { font-size: 0.75rem; color: var(--text-muted, #999); }

    .status-chip {
      display: inline-block; padding: 0.15rem 0.6rem; border-radius: 12px;
      font-size: 0.75rem; font-weight: 600;
    }
    .status-chip.active { background: var(--status-success-bg, #e8f5e9); color: var(--status-success, #2e7d32); }
    .status-chip.inactive { background: var(--status-error-bg, #ffebee); color: var(--status-error, #c62828); }
  `]
})
export class DepartmentListComponent implements OnInit {
  departments: any[] = [];
  filteredDepartments: any[] = [];
  loading = false;
  searchTerm = '';
  columns = ['name', 'description', 'head', 'status', 'actions'];

  constructor(
    private api: ApiService,
    private router: Router,
    private dialog: MatDialog,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.api.get<any[]>('v1/departments').subscribe({
      next: (data) => {
        this.departments = data;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notification.error('Failed to load departments');
      }
    });
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.applyFilter();
  }

  applyFilter() {
    if (!this.searchTerm) {
      this.filteredDepartments = [...this.departments];
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredDepartments = this.departments.filter(d =>
      d.name.toLowerCase().includes(term) ||
      (d.code && d.code.toLowerCase().includes(term)) ||
      (d.description && d.description.toLowerCase().includes(term))
    );
  }

  clearFilters() {
    this.searchTerm = '';
    this.filteredDepartments = [...this.departments];
  }

  addDepartment() {
    this.router.navigate(['/departments/new']);
  }

  editDepartment(dept: any) {
    this.router.navigate(['/departments/edit', dept.id]);
  }

  deleteDepartment(dept: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Department',
        message: `Are you sure you want to delete "${dept.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.delete('v1/departments', dept.id).subscribe({
          next: () => {
            this.notification.success('Department deleted successfully');
            this.load();
          },
          error: () => {
            this.notification.error('Failed to delete department');
          }
        });
      }
    });
  }
}
