import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService, PagedResult } from '../../../core/services/api.service';
import { PermissionService } from '../../../core/services/permission.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  standalone: false,
  selector: 'app-staff-list',
  template: `
    <app-main-layout>
      <app-page-header title="Staff Management" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Staff' }]">
        <button mat-raised-button color="primary" (click)="addStaff()"><mat-icon>add</mat-icon> Add Staff</button>
      </app-page-header>
      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search staff..." (search)="onSearch($event)"></app-search-input>
          <mat-form-field appearance="outline" *ngIf="canViewRoles"><mat-label>Role</mat-label><mat-select [(value)]="filterRole" (selectionChange)="load()"><mat-option value="">All</mat-option><mat-option *ngFor="let r of roles" [value]="r.name">{{ r.name }}</mat-option></mat-select></mat-form-field>
          <button mat-stroked-button (click)="clearFilters()" *ngIf="hasActiveFilters()">
            <mat-icon>filter_list_off</mat-icon> Clear Filters
          </button>
        </div>
        <table mat-table [dataSource]="staff">
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Name</th><td mat-cell *matCellDef="let s">{{ s.fullName }}</td></ng-container>
          <ng-container matColumnDef="email"><th mat-header-cell *matHeaderCellDef>Email</th><td mat-cell *matCellDef="let s">{{ s.email }}</td></ng-container>
          <ng-container matColumnDef="role"><th mat-header-cell *matHeaderCellDef>Role</th><td mat-cell *matCellDef="let s">{{ s.role }}</td></ng-container>
          <ng-container matColumnDef="department"><th mat-header-cell *matHeaderCellDef>Department</th><td mat-cell *matCellDef="let s">{{ s.departmentName }}</td></ng-container>
          <ng-container matColumnDef="phone"><th mat-header-cell *matHeaderCellDef>Phone</th><td mat-cell *matCellDef="let s">{{ s.phone | phone }}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let s"><app-status-badge [status]="s.status"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>Actions</th><td mat-cell *matCellDef="let s">
            <button mat-icon-button color="primary" (click)="editStaff(s.id)" title="Edit staff"><mat-icon>edit</mat-icon></button>
            <button mat-icon-button color="warn" (click)="deleteStaff(s.id)" title="Delete staff"><mat-icon>delete</mat-icon></button>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <mat-paginator [length]="totalCount" [pageSize]="pageSize" [pageSizeOptions]="[10, 25, 50]" (page)="onPage($event)"></mat-paginator>
      </div>
    </app-main-layout>
  `,
  styles: [`.card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; } .filters { display: flex; gap: 1rem; margin-bottom: 1rem; } table { width: 100%; }`]
})
export class StaffListComponent implements OnInit {
  staff: any[] = [];
  columns = ['name', 'email', 'role', 'department', 'phone', 'status', 'actions'];
  totalCount = 0; pageSize = 10; pageIndex = 0; searchTerm = ''; filterRole = '';
  roles: any[] = [];
  canViewRoles = false;

  constructor(private api: ApiService, private router: Router, private permissions: PermissionService, private dialog: MatDialog) {}

  ngOnInit() {
    this.canViewRoles = this.permissions.has('roles.view');
    this.load();
    if (this.canViewRoles) {
      this.loadRoles();
    }
  }

  ngAfterViewInit() {}

  loadRoles() {
    this.api.get<any[]>('v1/roles').subscribe({ next: r => this.roles = (r || []).filter(role => !role.isSystemRole), error: () => this.roles = [] });
  }

  load() {
    this.api.get<PagedResult<any>>('v1/staff', { pageNumber: this.pageIndex + 1, pageSize: this.pageSize, searchTerm: this.searchTerm, role: this.filterRole })
      .subscribe(r => { this.staff = r.items; this.totalCount = r.totalCount; });
  }

  onSearch(term: string) { this.searchTerm = term; this.pageIndex = 0; this.load(); }
  onPage(e: any) { this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.load(); }
  addStaff() { this.router.navigate(['/staff/new']); }
  editStaff(id: string) { this.router.navigate(['/staff/edit', id]); }

  deleteStaff(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Delete Staff', message: 'Are you sure you want to delete this staff member? This action cannot be undone.', confirmText: 'Delete', confirmColor: 'warn' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.delete<any>('v1/staff', id).subscribe({
          next: () => this.load(),
          error: () => alert('Failed to delete staff member')
        });
      }
    });
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.filterRole);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterRole = '';
    this.pageIndex = 0;
    this.load();
  }


}
