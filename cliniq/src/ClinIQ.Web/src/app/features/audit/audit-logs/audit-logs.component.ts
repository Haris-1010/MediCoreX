import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  AuditFilterOptions, AuditLogDetail, AuditLogRow, AuditLogsService, AuditQuery,
} from '../audit-logs.service';
import { NotificationService } from '../../../core/services/notification.service';

interface AuditFilters {
  dateFrom: string;
  dateTo: string;
  location: string;   // '' default scope, 'all', or branch id
  userId: string;
  module: string;
  action: string;
  entityType: string;
  entityId: string;
  status: '' | 'success' | 'failure';
  search: string;
}

/**
 * Administration → Audit Logs. Everything is server-side (filter, sort,
 * page, export); the API re-validates tenant + location + permission on every
 * call, so this screen is presentation only.
 */
@Component({
  standalone: false,
  selector: 'app-audit-logs',
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.scss'],
})
export class AuditLogsComponent implements OnInit, OnDestroy {
  options?: AuditFilterOptions;
  rows: AuditLogRow[] = [];
  total = 0;
  loading = true;
  refreshing = false;
  exporting = false;
  error = '';

  filters: AuditFilters = this.emptyFilters();
  sortBy = 'timestamp';
  sortDescending = true;
  pageIndex = 0;
  pageSize = 25;

  selected?: AuditLogDetail;
  detailLoading = false;

  readonly columns: { key: string; label: string; sortable: boolean }[] = [
    { key: 'timestamp', label: 'Date / Time', sortable: true },
    { key: 'user', label: 'User', sortable: true },
    { key: 'module', label: 'Module', sortable: true },
    { key: 'action', label: 'Action', sortable: true },
    { key: 'entity', label: 'Entity', sortable: true },
    { key: 'location', label: 'Location', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
    { key: 'success', label: 'Status', sortable: true },
  ];

  private readonly text$ = new Subject<void>();
  private subs: Subscription[] = [];
  private seq = 0;

  constructor(
    private audit: AuditLogsService,
    private route: ActivatedRoute,
    private router: Router,
    private notify: NotificationService,
  ) {}

  get activeFilterCount(): number {
    const f = this.filters;
    return [f.dateFrom, f.dateTo, f.userId, f.module, f.action, f.entityType, f.entityId, f.status, f.search]
      .filter(Boolean).length;
  }

  get locationLocked(): boolean { return (this.options?.locations.length ?? 0) <= 1; }

  ngOnInit(): void {
    this.subs.push(this.text$.pipe(debounceTime(450)).subscribe(() => this.apply()));
    this.readUrl(this.route.snapshot.queryParams);

    this.audit.filterOptions().subscribe({
      next: o => {
        this.options = o;
        if (!this.filters.location) {
          const current = o.locations.find(l => l.isCurrent);
          this.filters.location = current ? (current.id ?? 'all') : '';
        }
        this.load();
      },
      error: (e: Error) => { this.error = e.message || 'You do not have access to audit logs.'; this.loading = false; },
    });
  }

  ngOnDestroy(): void { this.subs.forEach(s => s.unsubscribe()); }

  // ---------------------------------------------------------------- filters

  apply(): void {
    if (this.filters.dateFrom && this.filters.dateTo && this.filters.dateFrom > this.filters.dateTo) {
      this.notify.warning('"Date from" must be on or before "Date to".');
      return;
    }
    this.pageIndex = 0;
    this.writeUrl();
    this.load(true);
  }

  textChanged(): void { this.text$.next(); }

  quickRange(days: number): void {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - (days - 1));
    this.filters.dateFrom = this.iso(from);
    this.filters.dateTo = this.iso(to);
    this.apply();
  }

  clearAll(): void {
    const location = this.filters.location;
    this.filters = { ...this.emptyFilters(), location };
    this.apply();
  }

  clear(key: keyof AuditFilters): void {
    (this.filters as any)[key] = '';
    this.apply();
  }

  /** Record history: every event for the same entity. */
  historyOf(row: { entityType: string | null; entityId: string | null }): void {
    if (!row.entityType || !row.entityId) return;
    this.filters = { ...this.emptyFilters(), location: this.filters.location, entityType: row.entityType, entityId: row.entityId };
    this.selected = undefined;
    this.apply();
  }

  // ---------------------------------------------------------------- table

  sort(key: string, sortable: boolean): void {
    if (!sortable) return;
    if (this.sortBy === key) this.sortDescending = !this.sortDescending;
    else { this.sortBy = key; this.sortDescending = key === 'timestamp'; }
    this.pageIndex = 0;
    this.writeUrl();
    this.load(true);
  }

  page(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.writeUrl();
    this.load(true);
  }

  open(row: AuditLogRow): void {
    this.detailLoading = true;
    this.selected = { ...row, tenantId: null, userAgent: null, notes: null, changes: [] };
    this.audit.detail(row.id).subscribe({
      next: d => { this.selected = d; this.detailLoading = false; },
      error: (e: Error) => { this.detailLoading = false; this.notify.error(e.message || 'Unable to load details'); },
    });
  }

  close(): void { this.selected = undefined; }

  @HostListener('document:keydown.escape')
  onEscape(): void { this.close(); }

  export(): void {
    this.exporting = true;
    this.audit.exportCsv(this.query()).subscribe({
      next: () => { this.exporting = false; this.notify.success('Audit export downloaded.'); },
      error: (e: Error) => { this.exporting = false; this.notify.error(e.message || 'Export failed'); },
    });
  }

  copy(value: string | null): void {
    if (!value) return;
    navigator.clipboard?.writeText(value).then(() => this.notify.info('Copied to clipboard'));
  }

  // ---------------------------------------------------------------- display helpers

  label(action: string): string {
    return action.toLowerCase().split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  tone(action: string, success: boolean | null = true): string {
    if (success === false || /FAILED|DENIED/.test(action)) return 'danger';
    if (/DELETE|REMOVED|REVOKED|CANCELLED|DEACTIVATED|REJECTED|REFUNDED|WRITTEN_OFF|DECEASED|NO_SHOW/.test(action)) return 'danger';
    if (/^REPORT_/.test(action)) return 'violet';
    if (/LOGIN|LOGOUT/.test(action)) return 'slate';
    if (/PASSWORD|PERMISSION|ROLE|ACCESS|SUBSCRIPTION/.test(action)) return 'warning';
    if (/CREATE|ADDED|GRANTED|RECEIVED|ACTIVATED|RESTORE|VERIFIED|COMPLETED|PAID|DISPENSED|APPROVED|IN$/.test(action)) return 'success';
    return 'info';
  }

  icon(action: string): string {
    if (/LOGIN_FAILED/.test(action)) return 'gpp_bad';
    if (/LOGIN/.test(action)) return 'login';
    if (/LOGOUT/.test(action)) return 'logout';
    if (/REPORT_EXPORTED/.test(action)) return 'download';
    if (/REPORT_GENERATED/.test(action)) return 'insights';
    if (/PASSWORD/.test(action)) return 'key';
    if (/PERMISSION|ROLE/.test(action)) return 'admin_panel_settings';
    if (/ACCESS/.test(action)) return 'share_location';
    if (/CREATE|ADDED|RECEIVED/.test(action)) return 'add_circle';
    if (/DELETE|REMOVED/.test(action)) return 'delete';
    if (/VERIFIED/.test(action)) return 'verified';
    if (/CANCELLED|REJECTED/.test(action)) return 'cancel';
    if (/STOCK/.test(action)) return 'inventory_2';
    if (/PAYMENT|INVOICE|REFUND/.test(action)) return 'payments';
    return 'edit';
  }

  initials(name: string | null): string {
    return (name ?? 'System').split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();
  }

  isChanged(c: { before: string | null; after: string | null }): boolean { return c.before !== c.after; }

  trackRow = (_: number, r: AuditLogRow) => r.id;

  // ---------------------------------------------------------------- data

  private load(soft = false): void {
    const seq = ++this.seq;
    if (soft && this.rows.length) this.refreshing = true; else this.loading = true;

    this.audit.list(this.query()).subscribe({
      next: page => {
        if (seq !== this.seq) return;
        this.rows = page.items;
        this.total = page.totalCount;
        this.error = '';
        this.loading = this.refreshing = false;
      },
      error: (e: Error) => {
        if (seq !== this.seq) return;
        this.error = e.message || 'Unable to load audit logs.';
        this.loading = this.refreshing = false;
      },
    });
  }

  private query(): AuditQuery {
    const f = this.filters;
    return {
      pageNumber: this.pageIndex + 1,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortDescending: this.sortDescending,
      dateFrom: f.dateFrom || null,
      dateTo: f.dateTo || null,
      userId: f.userId || null,
      locationId: f.location && f.location !== 'all' ? f.location : null,
      allLocations: f.location === 'all' ? true : undefined,
      module: f.module || null,
      action: f.action || null,
      entityType: f.entityType || null,
      entityId: f.entityId.trim() || null,
      success: f.status === 'success' ? true : f.status === 'failure' ? false : null,
      searchTerm: f.search.trim() || null,
    };
  }

  private readUrl(p: Params): void {
    this.filters = {
      dateFrom: p['from'] ?? '', dateTo: p['to'] ?? '', location: p['loc'] ?? '',
      userId: p['user'] ?? '', module: p['module'] ?? '', action: p['action'] ?? '',
      entityType: p['entity'] ?? '', entityId: p['entityId'] ?? '',
      status: (['success', 'failure'].includes(p['status']) ? p['status'] : '') as AuditFilters['status'],
      search: p['q'] ?? '',
    };
    this.sortBy = p['sort'] ?? 'timestamp';
    this.sortDescending = p['dir'] !== 'asc';
    this.pageIndex = Math.max(0, (Number(p['page']) || 1) - 1);
    this.pageSize = [10, 25, 50, 100].includes(Number(p['size'])) ? Number(p['size']) : 25;
  }

  private writeUrl(): void {
    const f = this.filters;
    const current = this.options?.locations.find(l => l.isCurrent);
    const defaultLoc = current ? (current.id ?? 'all') : '';
    this.router.navigate([], {
      relativeTo: this.route, replaceUrl: true,
      queryParams: {
        from: f.dateFrom || null, to: f.dateTo || null,
        loc: f.location && f.location !== defaultLoc ? f.location : null,
        user: f.userId || null, module: f.module || null, action: f.action || null,
        entity: f.entityType || null, entityId: f.entityId || null, status: f.status || null,
        q: f.search || null,
        sort: this.sortBy !== 'timestamp' ? this.sortBy : null,
        dir: this.sortDescending ? null : 'asc',
        page: this.pageIndex > 0 ? this.pageIndex + 1 : null,
        size: this.pageSize !== 25 ? this.pageSize : null,
      },
    });
  }

  private emptyFilters(): AuditFilters {
    return { dateFrom: '', dateTo: '', location: '', userId: '', module: '', action: '', entityType: '', entityId: '', status: '', search: '' };
  }

  private iso(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
