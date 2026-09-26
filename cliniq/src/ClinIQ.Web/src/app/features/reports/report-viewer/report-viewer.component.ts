import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { Subject, Subscription, forkJoin } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  CATEGORY_ACCENTS, ReportCategory, ReportColumn, ReportContext, ReportData, ReportDef,
  ReportQuery, ReportsService, SeriesData,
} from '../reports.service';
import { ReportFormatService } from '../report-format.service';
import { NotificationService } from '../../../core/services/notification.service';

type Preset = 'today' | '7d' | '30d' | 'month' | 'lastMonth' | 'year' | 'custom';

interface FilterState {
  from: string;
  to: string;
  preset: Preset;
  location: string;          // '' = default scope, 'all' = All Locations, else branch id
  doctorId: string;
  departmentId: string;
  status: string;
  gender: string;
  search: string;
}

/**
 * Generic report viewer. Every report returns the same shape (summary,
 * series, columns, rows), so one screen renders all of them. Filters live in
 * the URL — shareable and refresh-safe — and every query is re-validated by
 * the API; the UI never decides what a user may see.
 */
@Component({
  standalone: false,
  selector: 'app-report-viewer',
  templateUrl: './report-viewer.component.html',
  styleUrls: ['./report-viewer.component.scss'],
})
export class ReportViewerComponent implements OnInit, OnDestroy {
  reportId = '';
  def?: ReportDef;
  category?: ReportCategory;
  context?: ReportContext;
  canExport = false;

  data?: ReportData;
  loading = true;
  refreshing = false;
  exporting = false;
  error = '';
  denied = false;

  filters: FilterState = this.defaultFilters();
  sortBy: string | null = null;
  sortDescending = true;
  pageIndex = 0;
  pageSize = 25;

  readonly presets: { key: Preset; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: '7d', label: '7 days' },
    { key: '30d', label: '30 days' },
    { key: 'month', label: 'This month' },
    { key: 'lastMonth', label: 'Last month' },
    { key: 'year', label: 'This year' },
    { key: 'custom', label: 'Custom' },
  ];

  showMoreFilters = false;

  trendGroups: { format: string; series: SeriesData[] }[] = [];

  /** Plain-language explanations for the figures people ask about most. */
  private static readonly KPI_HINTS: Record<string, string> = {
    revenue: 'Total of non-cancelled invoices dated in this period.',
    collected: 'Money actually received (payments, excluding refunds) in this period.',
    net: 'Collected minus refunds.',
    outstanding: 'Unpaid balance on invoices dated in this period.',
    receivables: 'Everything still owed across all open invoices, regardless of date.',
    refunds: 'Money returned to patients in this period.',
    refunded: 'Refunded amounts on invoices dated in this period.',
    discounts: 'Discounts given on invoices dated in this period.',
    occupancy: 'Occupied beds as a share of all beds right now.',
    avgLos: 'Average days between admission and discharge, for patients discharged in this period.',
    tat: 'Average hours from order to completion, for orders completed in this period.',
    returning: 'Patients registered before this period who had a visit during it.',
    completionRate: 'Completed appointments as a share of all appointments in this period.',
    dispenseRate: 'Dispensed prescriptions as a share of all prescriptions in this period.',
    stockValue: 'Current stock × purchase price.',
    retailValue: 'Current stock × selling price.',
    atRiskValue: 'Stock value in batches that expire within 90 days.',
    linkedRevenue: 'Invoices linked to the doctor through a visit or appointment.',
    revenueLinked: 'Invoices linked to the doctor through a visit or appointment.',
    activeUsers: 'Different people who did something recorded in the audit trail.',
  };

  kpiHint(key: string): string { return ReportViewerComponent.KPI_HINTS[key] ?? ''; }

  get selectFilterCount(): number {
    return (this.def?.filters ?? []).filter(f => f.key !== 'search').length;
  }

  get activeSelectFilters(): number {
    const f = this.filters;
    return [f.doctorId, f.departmentId, f.status, f.gender].filter(Boolean).length;
  }

  get related() {
    return (this.category?.reports ?? []).filter(r => r.id !== this.def?.id).slice(0, 4);
  }

  /** e.g. "Showing 12 invoices for All Locations, 01 Sept – 26 Sept 2026 · Status: Paid." */
  get story(): string {
    if (!this.data || !this.def) return '';
    const n = this.data.totalCount;
    const noun = n === 1 ? 'record' : 'records';
    const period = this.def.usesDateRange ? `, ${this.periodLabel}` : ' as of now';
    const parts: string[] = [];
    if (this.filters.doctorId) parts.push(`Doctor: ${this.doctorName(this.filters.doctorId)}`);
    if (this.filters.departmentId) parts.push(`Department: ${this.departmentName(this.filters.departmentId)}`);
    if (this.filters.status) parts.push(`${this.statusFilter?.label ?? 'Status'}: ${this.statusLabel(this.filters.status)}`);
    if (this.filters.gender) parts.push(`Gender: ${this.filters.gender}`);
    if (this.filters.search.trim()) parts.push(`matching "${this.filters.search.trim()}"`);
    return `Showing ${n.toLocaleString()} ${noun} for ${this.data.locationScope.name}${period}` +
      (parts.length ? ` · ${parts.join(' · ')}` : '') + '.';
  }
  breakdowns: SeriesData[] = [];

  private readonly search$ = new Subject<string>();
  private subs: Subscription[] = [];
  private requestSeq = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reports: ReportsService,
    public fmt: ReportFormatService,
    private notify: NotificationService,
  ) {}

  get accent(): string { return CATEGORY_ACCENTS[this.category?.id ?? ''] ?? '#6366f1'; }
  get palette(): string[] { return [this.accent, '#94a3b8']; }
  get hasFilter(): (key: string) => boolean { return (key) => !!this.def?.filters?.some(f => f.key === key); }
  get statusFilter() { return this.def?.filters?.find(f => f.key === 'status'); }
  get genderFilter() { return this.def?.filters?.find(f => f.key === 'gender'); }
  get locationLocked(): boolean { return (this.context?.locations.length ?? 0) <= 1; }
  get activeFilterCount(): number {
    const f = this.filters;
    return [f.doctorId, f.departmentId, f.status, f.gender, f.search].filter(Boolean).length;
  }
  get periodLabel(): string {
    if (!this.data || !this.def?.usesDateRange) return 'Live snapshot';
    const o: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    const s = new Date(this.data.period.start).toLocaleDateString('en-GB', o);
    const e = new Date(this.data.period.end).toLocaleDateString('en-GB', o);
    return s === e ? s : `${s} – ${e}`;
  }

  ngOnInit(): void {
    this.subs.push(this.search$.pipe(debounceTime(450)).subscribe(() => this.apply()));

    this.subs.push(this.route.paramMap.subscribe(params => {
      this.reportId = params.get('reportId') ?? '';
      this.loading = true;
      this.error = '';
      this.denied = false;
      this.data = undefined;

      forkJoin({ catalog: this.reports.catalog(), context: this.reports.context(true) }).subscribe({
        next: ({ catalog, context }) => {
          this.context = context;
          this.canExport = catalog.canExport;
          this.category = catalog.categories.find(c => c.reports.some(r => r.id === this.reportId));
          this.def = this.category?.reports.find(r => r.id === this.reportId);
          if (!this.def) {
            this.denied = true;
            this.error = 'This report does not exist or is not available to your role.';
            this.loading = false;
            return;
          }
          this.readUrl(this.route.snapshot.queryParams);
          this.showMoreFilters = this.activeSelectFilters > 0;
          this.rememberRecent(this.reportId);
          this.load();
        },
        error: (e: Error) => { this.fail(e); },
      });
    }));
  }

  ngOnDestroy(): void { this.subs.forEach(s => s.unsubscribe()); }

  // ------------------------------------------------------------------ filters

  choosePreset(preset: Preset): void {
    this.filters.preset = preset;
    if (preset !== 'custom') {
      const { from, to } = this.rangeFor(preset);
      this.filters.from = from;
      this.filters.to = to;
      this.apply();
    }
  }

  customDateChanged(): void {
    this.filters.preset = 'custom';
    if (this.filters.from && this.filters.to) this.apply();
  }

  searchChanged(value: string): void {
    this.filters.search = value;
    this.search$.next(value);
  }

  apply(): void {
    if (this.def?.usesDateRange && this.filters.from > this.filters.to) {
      this.notify.warning('The start date must be on or before the end date.');
      return;
    }
    this.pageIndex = 0;
    this.writeUrl();
    this.load(true);
  }

  resetFilters(): void {
    const location = this.filters.location;
    this.filters = { ...this.defaultFilters(), location };
    this.apply();
  }

  clearFilter(key: keyof FilterState): void {
    (this.filters as any)[key] = '';
    this.apply();
  }

  // ------------------------------------------------------------------ table

  /** Sort actually applied by the server (the default one when the user chose none). */
  get appliedSort(): string | null { return this.data?.sortBy ?? this.sortBy; }
  get appliedDescending(): boolean { return this.data?.sortDescending ?? this.sortDescending; }

  sort(col: ReportColumn): void {
    if (!col.sortable) return;
    if (this.appliedSort === col.key) { this.sortBy = col.key; this.sortDescending = !this.appliedDescending; }
    else { this.sortBy = col.key; this.sortDescending = !['text', 'status'].includes(col.type); }
    this.pageIndex = 0;
    this.writeUrl();
    this.load(true);
  }

  page(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.writeUrl();
    this.load(true);
  }

  isNumeric(col: ReportColumn): boolean { return ['number', 'currency', 'percent'].includes(col.type); }

  tone(value: unknown): string {
    const v = String(value ?? '').toLowerCase();
    if (!v) return 'neutral';
    if (/(cancel|fail|reject|expired|out of stock|deceased|noshow|no show|overdue|written|refund|blocked|outofservice|inactive|critical)/.test(v)) return 'danger';
    if (/(pending|scheduled|partial|low stock|in progress|near expiry|draft|unbilled|requested|ready|reserved|cleaning|maintenance|urgent|ordered|advance)/.test(v)) return 'warning';
    if (/(complet|paid|active|verified|dispensed|available|in stock|success|received|billed|discharged|approved|settled|finalized|payment|closed|routine)/.test(v)) return 'success';
    if (/(occupied|admitted|treatment|confirmed|checked|transfer|purchase|sale|adjust)/.test(v)) return 'info';
    return 'neutral';
  }

  trackRow = (i: number) => i;

  // ------------------------------------------------------------------ actions

  refresh(): void { this.load(true); }

  exportCsv(): void {
    if (!this.def) return;
    this.exporting = true;
    this.reports.exportCsv(this.def.id, this.buildQuery()).subscribe({
      next: () => { this.exporting = false; this.notify.success('Export ready — the CSV opens in Excel.'); },
      error: (e: Error) => { this.exporting = false; this.notify.error(e.message || 'Export failed'); },
    });
  }

  print(): void { window.print(); }

  /** Per-browser convenience for the Report Center's "Recently viewed" row. */
  private rememberRecent(id: string): void {
    try {
      const key = 'medicorex.reports.recent';
      const list: string[] = JSON.parse(localStorage.getItem(key) || '[]');
      localStorage.setItem(key, JSON.stringify([id, ...list.filter(x => x !== id)].slice(0, 6)));
    } catch { /* storage unavailable — nothing to remember */ }
  }

  // ------------------------------------------------------------------ data

  private load(soft = false): void {
    if (!this.def) return;
    const seq = ++this.requestSeq;
    if (soft && this.data) this.refreshing = true; else this.loading = true;

    this.reports.report(this.def.id, this.buildQuery()).subscribe({
      next: data => {
        if (seq !== this.requestSeq) return; // a newer request owns the screen
        this.data = data;
        this.splitSeries(data.series);
        this.error = '';
        this.denied = false;
        this.loading = this.refreshing = false;
      },
      error: (e: Error) => { if (seq === this.requestSeq) this.fail(e); },
    });
  }

  private fail(e: Error): void {
    const message = e?.message || 'Unable to load this report.';
    this.denied = /permission|access|forbidden|not have/i.test(message);
    this.error = message;
    this.loading = this.refreshing = false;
  }

  private splitSeries(series: SeriesData[]): void {
    // Trends sharing a unit (e.g. Revenue + Collections) overlay on one chart,
    // at most two per chart so the comparison stays readable.
    this.trendGroups = [];
    for (const s of series.filter(x => x.kind === 'trend')) {
      const group = this.trendGroups.find(g => g.format === s.format && g.series.length < 2);
      if (group) group.series.push(s);
      else this.trendGroups.push({ format: s.format, series: [s] });
    }
    this.breakdowns = series.filter(s => s.kind === 'breakdown' && s.points.length > 0);
  }

  private buildQuery(): ReportQuery {
    const f = this.filters;
    const q: ReportQuery = {
      pageNumber: this.pageIndex + 1,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortDescending: this.sortDescending,
    };
    if (this.def?.usesDateRange) { q.startDate = f.from; q.endDate = f.to; }
    if (f.location === 'all') q.allLocations = true;
    else if (f.location) q.locationId = f.location;
    if (f.doctorId) q.doctorId = f.doctorId;
    if (f.departmentId) q.departmentId = f.departmentId;
    if (f.status) q.status = f.status;
    if (f.gender) q.gender = f.gender;
    if (f.search.trim()) q.search = f.search.trim();
    return q;
  }

  // ------------------------------------------------------------------ URL state

  private readUrl(p: Params): void {
    const d = this.defaultFilters();
    const preset = (p['range'] as Preset) || d.preset;
    const range = preset === 'custom' ? { from: p['from'] || d.from, to: p['to'] || d.to } : this.rangeFor(preset);
    this.filters = {
      ...d,
      ...range,
      preset,
      location: p['loc'] ?? this.defaultLocation(),
      doctorId: p['doctor'] ?? '',
      departmentId: p['dept'] ?? '',
      status: p['status'] ?? '',
      gender: p['gender'] ?? '',
      search: p['q'] ?? '',
    };
    this.sortBy = p['sort'] ?? null;
    this.sortDescending = p['dir'] !== 'asc';
    this.pageIndex = Math.max(0, (Number(p['page']) || 1) - 1);
    this.pageSize = [10, 25, 50, 100].includes(Number(p['size'])) ? Number(p['size']) : 25;
  }

  private writeUrl(): void {
    const f = this.filters;
    const queryParams: Params = {
      range: f.preset !== '30d' ? f.preset : null,
      from: f.preset === 'custom' ? f.from : null,
      to: f.preset === 'custom' ? f.to : null,
      loc: f.location && f.location !== this.defaultLocation() ? f.location : null,
      doctor: f.doctorId || null,
      dept: f.departmentId || null,
      status: f.status || null,
      gender: f.gender || null,
      q: f.search.trim() || null,
      sort: this.sortBy || null,
      dir: this.sortBy ? (this.sortDescending ? 'desc' : 'asc') : null,
      page: this.pageIndex > 0 ? this.pageIndex + 1 : null,
      size: this.pageSize !== 25 ? this.pageSize : null,
    };
    this.router.navigate([], { relativeTo: this.route, queryParams, replaceUrl: true });
  }

  /** The location the API would pick anyway, expressed as a selector value. */
  private defaultLocation(): string {
    const current = this.context?.currentLocation;
    if (!current) return '';
    return current.id ?? (this.context?.canSeeAllLocations ? 'all' : '');
  }

  private defaultFilters(): FilterState {
    const { from, to } = this.rangeFor('30d');
    return { from, to, preset: '30d', location: '', doctorId: '', departmentId: '', status: '', gender: '', search: '' };
  }

  private rangeFor(preset: Preset): { from: string; to: string } {
    const today = new Date();
    const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const days = (n: number) => { const d = new Date(today); d.setDate(d.getDate() - n); return d; };
    switch (preset) {
      case 'today': return { from: iso(today), to: iso(today) };
      case '7d': return { from: iso(days(6)), to: iso(today) };
      case 'month': return { from: iso(new Date(today.getFullYear(), today.getMonth(), 1)), to: iso(today) };
      case 'lastMonth': return {
        from: iso(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
        to: iso(new Date(today.getFullYear(), today.getMonth(), 0)),
      };
      case 'year': return { from: iso(new Date(today.getFullYear(), 0, 1)), to: iso(today) };
      default: return { from: iso(days(29)), to: iso(today) };
    }
  }

  statusLabel(value: string): string {
    return value.replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  doctorName(id: string): string { return this.context?.doctors.find(d => d.id === id)?.name ?? 'Doctor'; }
  departmentName(id: string): string { return this.context?.departments.find(d => d.id === id)?.name ?? 'Department'; }
}
