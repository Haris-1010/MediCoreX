import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService, PagedResult } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PermissionService } from '../../../core/services/permission.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  standalone: false,
  selector: 'app-doctor-list',
  template: `
    <app-main-layout>
      <app-page-header title="Doctors" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Doctors' }]">
        <button mat-raised-button color="primary" routerLink="new"><mat-icon>add</mat-icon> Add Doctor</button>
      </app-page-header>
      <div class="card">
        <div class="filters">
          <app-search-input placeholder="Search doctors..." (search)="onSearch($event)"></app-search-input>
          <mat-form-field appearance="outline" *ngIf="canViewDepartments"><mat-label>Department</mat-label><mat-select [(value)]="filterDept" (selectionChange)="load()"><mat-option value="">All</mat-option><mat-option *ngFor="let d of departments" [value]="d.id">{{ d.name }}</mat-option></mat-select></mat-form-field>
          <button mat-stroked-button (click)="clearFilters()" *ngIf="hasActiveFilters()">
            <mat-icon>filter_list_off</mat-icon> Clear Filters
          </button>
        </div>
        <div class="doctor-grid">
          <div class="doctor-card" *ngFor="let d of doctors" (click)="gotoEdit(d)">
            <div class="avatar">{{ d.initials || 'DR' }}</div>
            <div class="info"><h4>Dr. {{ d.fullName }}</h4><p class="spec">{{ d.specialization }}</p><p class="dept">{{ d.departmentName || 'General' }}</p></div>
            <div class="meta"><span class="phone"><mat-icon>phone</mat-icon> {{ (d.phoneNumber || d.phone || 'N/A') | phone }}</span><app-status-badge [status]="d.status"></app-status-badge>
              <button mat-icon-button color="warn" aria-label="Delete doctor" (click)="onDeleteDoctor($event, d.id)"><mat-icon>delete</mat-icon></button>
            </div>
          </div>
        </div>
        <mat-paginator [length]="totalCount" [pageSize]="pageSize" [pageSizeOptions]="[12, 24, 48]" (page)="onPage($event)"></mat-paginator>
      </div>
    </app-main-layout>
  `,
  styles: [`.card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; } .filters { display: flex; gap: 1rem; margin-bottom: 1rem; }
    .doctor-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
    .doctor-card { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--bg-hover, #f5f5f5); border-radius: 8px; cursor: pointer; }
    .doctor-card:hover { background: var(--bg-hover, #e8eaf6); }
    .avatar { width: 50px; height: 50px; border-radius: 50%; background: var(--accent-primary, #3f51b5); color: var(--text-inverse, white); display: flex; align-items: center; justify-content: center; font-weight: 600; }
    .info { flex: 1; } .info h4 { margin: 0; } .spec { margin: 0; color: var(--accent-primary, #3f51b5); font-size: 0.875rem; } .dept { margin: 0; color: var(--text-muted, #666); font-size: 0.75rem; }
    .meta { display: flex; flex-direction: column; align-items: flex-end; gap: 0.25rem; }
    .phone { display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; color: var(--text-muted, #666); } .phone mat-icon { font-size: 14px; width: 14px; height: 14px; }`]
})
export class DoctorListComponent implements OnInit {
  doctors: any[] = []; departments: any[] = [];
  totalCount = 0; pageSize = 12; pageIndex = 0; searchTerm = ''; filterDept = '';
  deletingIds = new Set<string>();
  canViewDepartments = false;

  constructor(private api: ApiService, private router: Router, private notification: NotificationService, private permissions: PermissionService, private dialog: MatDialog) {}

  ngOnInit() {
    this.canViewDepartments = this.permissions.has('departments.view');
    this.load();
    if (this.canViewDepartments) {
      this.api.get<any[]>('v1/departments').subscribe(r => this.departments = r);
    }
  }

  load() {
    this.api.get<PagedResult<any>>('v1/doctors', { pageNumber: this.pageIndex + 1, pageSize: this.pageSize, searchTerm: this.searchTerm, departmentId: this.filterDept })
      .subscribe(r => { this.doctors = r.items; this.totalCount = r.totalCount; });
  }

  onSearch(term: string) { this.searchTerm = term; this.pageIndex = 0; this.load(); }
  onPage(e: any) { this.pageIndex = e.pageIndex; this.pageSize = e.pageSize; this.load(); }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.filterDept);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterDept = '';
    this.pageIndex = 0;
    this.load();
  }

  gotoEdit(d: any) {
    this.router.navigate(['/doctors', d.id, 'edit']);
  }

  onDeleteDoctor(e: Event, id: string) {
    e.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Delete Doctor', message: 'Are you sure you want to delete this doctor? This action cannot be undone.', confirmText: 'Delete', confirmColor: 'warn' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.deletingIds.has(id)) return;
        this.deletingIds.add(id);
        this.api.delete(`v1/doctors`, id).subscribe({
          next: () => {
            this.deletingIds.delete(id);
            this.doctors = this.doctors.filter(d => d.id !== id);
            try { this.notification.success('Doctor deleted'); } catch { }
          },
          error: () => {
            this.deletingIds.delete(id);
            try { this.notification.error('Delete failed'); } catch { alert('Delete failed'); }
          }
        });
      }
    });
  }
}
