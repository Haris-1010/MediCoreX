import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from '../../../../environments/environment';
import { NotificationService } from '../../../core/services/notification.service';

export interface OrganizationRow {
  id: string;
  name: string;
  code?: string;
  contactEmail?: string;
  isActive: boolean;
  userCount: number;
  branchCount: number;
  createdAt: string;
  enabledFeatures?: string[];
}

@Component({
  standalone: false,
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styles: [`
    .org-list { display: grid; gap: 16px; }

    .filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      background: var(--bg-card, white);
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 12px;
      padding: 14px 16px;
    }
    .filters { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; flex: 1; min-width: 0; }
    .search { width: min(320px, 100%); flex: 1; min-width: 200px; }
    .status-filter { width: 160px; }

    .table-card {
      background: var(--bg-card, white);
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 12px;
      overflow: hidden;
    }

    .org-table { width: 100%; min-width: 720px; }
    .org-table th.mat-header-cell {
      padding: 12px 14px;
      color: var(--text-muted, #64748b);
      font-weight: 600;
      font-size: 11.5px;
      text-transform: uppercase;
      letter-spacing: .05em;
      border-bottom: 1px solid var(--border-color, #e5e7eb);
      background: #f8fafc;
      white-space: nowrap;
    }
    .org-table td.mat-cell {
      padding: 14px;
      border-bottom: 1px solid #f1f5f9;
      color: var(--text-primary, #334155);
      font-size: 14px;
      vertical-align: middle;
    }
    .org-table tr.mat-mdc-row { cursor: pointer; transition: background .12s ease; }
    .org-table tr.mat-mdc-row:hover { background: #fffbeb; }
    .org-table tr.mat-mdc-row:last-child td.mat-cell { border-bottom: none; }
    .org-table .strong { font-weight: 600; color: var(--text-primary, #102b35); display: block; }
    .org-table .sub { color: var(--text-muted, #94a3b8); font-size: 12px; }

    .stat-cell { text-align: center; color: var(--text-primary, #102b35); font-weight: 600; }

    .status-chip { padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; white-space: nowrap; }
    .status-chip.active { background: var(--badge-success-bg, #e5f6ec); color: var(--badge-success-text, #18794e); }
    .status-chip.inactive { background: var(--badge-danger-bg, #fdecea); color: var(--badge-danger-text, #b42318); }

    .actions-cell { text-align: right; white-space: nowrap; }
    .actions-cell button { font-size: 13px; }

    .empty { text-align: center; padding: 48px 20px; color: var(--text-muted, #64748b); }
    .empty mat-icon { font-size: 40px; width: 40px; height: 40px; opacity: .5; display: block; margin: 0 auto 8px; }
    .loading { display: grid; place-items: center; padding: 60px; background: var(--bg-card, white); border: 1px solid var(--border-color, #e5e7eb); border-radius: 12px; }

    ::ng-deep .org-table .mat-mdc-paginator {
      border-top: 1px solid var(--border-color, #e5e7eb);
      background: transparent;
    }
    ::ng-deep .org-table .mat-mdc-paginator-range-label,
    ::ng-deep .org-table .mat-mdc-paginator-page-size {
      color: var(--text-muted, #64748b);
      font-size: 13px;
    }

    @media (max-width: 640px) {
      .filter-bar { flex-direction: column; align-items: stretch; }
      .filters { flex-direction: column; align-items: stretch; }
      .search, .status-filter { width: 100%; }
    }
  `]
})
export class OrganizationListComponent implements OnInit {
  organizations: OrganizationRow[] = [];
  loading = true;
  searchTerm = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  displayedColumns = ['name', 'code', 'email', 'users', 'branches', 'status', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<OrganizationRow>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private readonly endpoint = `${environment.apiUrl}/v1/platform/organizations`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadOrganizations();
  }

  loadOrganizations(): void {
    this.loading = true;
    this.http.get<{ items: OrganizationRow[] }>(this.endpoint).subscribe({
      next: response => {
        this.organizations = response.items || [];
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notification.error('Unable to load organizations.');
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    let rows = [...this.organizations];

    if (this.statusFilter !== 'all') {
      const wantActive = this.statusFilter === 'active';
      rows = rows.filter(o => o.isActive === wantActive);
    }

    if (term) {
      rows = rows.filter(o =>
        (o.name || '').toLowerCase().includes(term) ||
        (o.code || '').toLowerCase().includes(term) ||
        (o.contactEmail || '').toLowerCase().includes(term));
    }

    this.dataSource.data = rows;
    // Paginator lives inside *ngIf — re-bind after the view settles.
    setTimeout(() => {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
        this.paginator.pageIndex = 0;
      }
    });
  }

  openDetail(org: OrganizationRow): void {
    this.router.navigate(['/platform/organizations', org.id]);
  }

  createNew(): void {
    this.router.navigate(['/platform/organizations/new']);
  }

  toggleActive(org: OrganizationRow, event?: Event): void {
    event?.stopPropagation();
    const action = org.isActive ? 'suspend' : 'activate';
    this.http.post(`${this.endpoint}/${org.id}/${action}`, {}).subscribe({
      next: () => {
        this.notification.success(`${org.name} ${org.isActive ? 'deactivated' : 'activated'}.`);
        this.loadOrganizations();
      },
      error: error => this.notification.error(error.error?.message || 'Status could not be changed.')
    });
  }
}
