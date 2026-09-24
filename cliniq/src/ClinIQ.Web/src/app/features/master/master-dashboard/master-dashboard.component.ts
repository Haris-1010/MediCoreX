import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

interface MasterStatus {
  systemPaused: boolean;
  organizations: { total: number; active: number; paused: number };
  platformAdmins: { total: number; active: number; paused: number };
}

interface OrgItem { id: string; name: string; email: string; isActive: boolean; createdAt: string; }
interface AdminItem { id: string; firstName: string; lastName: string; email: string; isActive: boolean; isMaster: boolean; lastLoginAt: string | null; }

@Component({
  standalone: false,
  selector: 'app-master-dashboard',
  templateUrl: './master-dashboard.component.html',
  styleUrls: ['./master-dashboard.component.scss']
})
export class MasterDashboardComponent implements OnInit, AfterViewInit {
  status: MasterStatus | null = null;
  loading = true;
  actionLoading = false;
  currentUser: any;

  orgColumns = ['name', 'email', 'createdAt', 'status', 'actions'];
  adminColumns = ['name', 'email', 'lastLoginAt', 'status', 'actions'];
  orgsSource = new MatTableDataSource<OrgItem>([]);
  adminsSource = new MatTableDataSource<AdminItem>([]);

  @ViewChild('orgPaginator') orgPaginator!: MatPaginator;
  @ViewChild('adminPaginator') adminPaginator!: MatPaginator;

  private baseUrl = `${environment.apiUrl}/v1/master`;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {
    this.currentUser = this.auth.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  ngAfterViewInit(): void {
    this.bindPaginators();
  }

  private bindPaginators(): void {
    if (this.orgPaginator) this.orgsSource.paginator = this.orgPaginator;
    if (this.adminPaginator) this.adminsSource.paginator = this.adminPaginator;
  }

  loadAll(): void {
    this.loading = true;
    this.http.get<MasterStatus>(`${this.baseUrl}/status`).subscribe({
      next: s => { this.status = s; this.loading = false; setTimeout(() => this.bindPaginators()); },
      error: () => { this.loading = false; this.notification.error('Failed to load master status.'); }
    });
    this.http.get<OrgItem[]>(`${this.baseUrl}/organizations`).subscribe({
      next: list => {
        this.orgsSource.data = list || [];
        setTimeout(() => this.bindPaginators());
      },
      error: () => {}
    });
    this.http.get<AdminItem[]>(`${this.baseUrl}/admins`).subscribe({
      next: list => {
        this.adminsSource.data = list || [];
        setTimeout(() => this.bindPaginators());
      },
      error: () => {}
    });
  }

  toggleSystem(): void {
    const endpoint = this.status?.systemPaused ? 'resume-system' : 'pause-system';
    const label = this.status?.systemPaused ? 'Resume' : 'Pause';
    if (!confirm(`Are you sure you want to ${label.toLowerCase()} the entire system?`)) return;

    this.actionLoading = true;
    this.http.post<{ message: string }>(`${this.baseUrl}/${endpoint}`, {}).subscribe({
      next: res => {
        this.actionLoading = false;
        this.notification.success(res.message);
        this.loadAll();
      },
      error: err => {
        this.actionLoading = false;
        this.notification.error(err?.error?.message || 'Operation failed.');
      }
    });
  }

  toggleOrg(org: OrgItem): void {
    const endpoint = org.isActive ? 'pause' : 'resume';
    this.http.post<{ message: string }>(`${this.baseUrl}/organizations/${org.id}/${endpoint}`, {}).subscribe({
      next: res => { this.notification.success(res.message); this.loadAll(); },
      error: err => this.notification.error(err?.error?.message || 'Operation failed.')
    });
  }

  bulkOrgs(action: 'pause-all' | 'resume-all'): void {
    const label = action === 'pause-all' ? 'pause ALL organizations' : 'resume ALL organizations';
    if (!confirm(`Are you sure you want to ${label}?`)) return;

    this.actionLoading = true;
    this.http.post<{ message: string }>(`${this.baseUrl}/organizations/${action}`, {}).subscribe({
      next: res => { this.actionLoading = false; this.notification.success(res.message); this.loadAll(); },
      error: err => { this.actionLoading = false; this.notification.error(err?.error?.message || 'Operation failed.'); }
    });
  }

  toggleAdmin(admin: AdminItem): void {
    if (admin.isMaster) { this.notification.error('Cannot modify the master account.'); return; }
    const endpoint = admin.isActive ? 'pause' : 'resume';
    this.http.post<{ message: string }>(`${this.baseUrl}/admins/${admin.id}/${endpoint}`, {}).subscribe({
      next: res => { this.notification.success(res.message); this.loadAll(); },
      error: err => this.notification.error(err?.error?.message || 'Operation failed.')
    });
  }

  bulkAdmins(action: 'pause-all' | 'resume-all'): void {
    const label = action === 'pause-all' ? 'pause ALL platform admins' : 'resume ALL platform admins';
    if (!confirm(`Are you sure you want to ${label}?`)) return;

    this.actionLoading = true;
    this.http.post<{ message: string }>(`${this.baseUrl}/admins/${action}`, {}).subscribe({
      next: res => { this.actionLoading = false; this.notification.success(res.message); this.loadAll(); },
      error: err => { this.actionLoading = false; this.notification.error(err?.error?.message || 'Operation failed.'); }
    });
  }

  logout(): void {
    this.auth.logout();
  }
}
