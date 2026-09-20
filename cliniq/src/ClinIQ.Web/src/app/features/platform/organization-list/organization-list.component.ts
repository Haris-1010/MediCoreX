import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
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

    .filter-bar { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
    .search { width: min(320px, 100%); }

    .org-tile { background: var(--bg-card, white); border: 1px solid var(--border-color, #dce5e5); border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 18px; transition: box-shadow .18s, border-color .18s; cursor: pointer; }
    .org-tile:hover { box-shadow: 0 8px 24px rgba(16,43,53,.08); border-color: var(--accent-primary, #b7c9c9); }

    .org-avatar { width: 54px; height: 54px; border-radius: 12px; background: #102b35; color: #f0b35b; display: grid; place-items: center; font-size: 22px; flex-shrink: 0; }

    .org-info { flex: 1; min-width: 0; }
    .org-info h3 { margin: 0 0 2px; font-size: 16px; color: var(--text-primary, #172033); }
    .org-info .meta { color: var(--text-muted, #64748b); font-size: 13px; display: flex; gap: 14px; flex-wrap: wrap; }
    .org-info .meta span { display: inline-flex; align-items: center; gap: 5px; }

    .stat-cell { text-align: center; min-width: 64px; color: var(--text-primary, #102b35); }
    .stat-cell strong { display: block; font-size: 18px; }
    .stat-cell small { color: var(--text-muted, #64748b); font-size: 11px; text-transform: uppercase; letter-spacing: .04em; }

    .status-chip { padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
    .status-chip.active { background: var(--badge-success-bg, #e5f6ec); color: var(--badge-success-text, #18794e); }
    .status-chip.inactive { background: var(--badge-danger-bg, #fdecea); color: var(--badge-danger-text, #b42318); }

    .tile-actions { display: flex; gap: 4px; }
    .empty { text-align: center; padding: 60px 20px; color: var(--text-muted, #64748b); background: var(--bg-card, white); border: 1px dashed var(--border-color, #cbd5d5); border-radius: 12px; }
    .loading { display: grid; place-items: center; padding: 60px; }

    @media (max-width: 640px) {
      .org-tile { flex-wrap: wrap; }
      .tile-actions { width: 100%; justify-content: flex-end; }
      .stat-cell { min-width: 0; flex: 1; }
    }
  `]
})
export class OrganizationListComponent implements OnInit {
  organizations: OrganizationRow[] = [];
  filtered: OrganizationRow[] = [];
  loading = true;
  searchTerm = '';
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
    this.filtered = term
      ? this.organizations.filter(o =>
          (o.name || '').toLowerCase().includes(term) ||
          (o.code || '').toLowerCase().includes(term) ||
          (o.contactEmail || '').toLowerCase().includes(term))
      : [...this.organizations];
  }

  openDetail(org: OrganizationRow): void {
    this.router.navigate(['/platform/organizations', org.id]);
  }

  createNew(): void {
    this.router.navigate(['/platform/organizations/new']);
  }

  toggleActive(org: OrganizationRow): void {
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
