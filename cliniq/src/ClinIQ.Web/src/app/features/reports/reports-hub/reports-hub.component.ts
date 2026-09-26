import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CATEGORY_ACCENTS, ReportCategory, ReportContext, ReportDef, ReportsService } from '../reports.service';

/**
 * Report Center: every report the caller may open, grouped by department.
 * The list comes from the API, which already filters by permission,
 * entitlement and location access — nothing here is a security decision.
 */
@Component({
  standalone: false,
  selector: 'app-reports-hub',
  template: `
    <app-main-layout>
      <section class="hero">
        <div class="hero-grid" aria-hidden="true"></div>
        <div class="hero-body">
          <nav class="crumbs"><a routerLink="/dashboard">Dashboard</a><mat-icon>chevron_right</mat-icon><span>Reports</span></nav>
          <h1>Report Center</h1>
          <p class="lede">Operational, clinical and financial reporting — scoped to the locations you can access.</p>

          <div class="hero-meta" *ngIf="!loading">
            <span class="chip location">
              <mat-icon>{{ context?.currentLocation?.id ? 'location_on' : 'public' }}</mat-icon>
              {{ context?.currentLocation?.name || 'Current location' }}
            </span>
            <span class="chip"><mat-icon>assessment</mat-icon>{{ reportCount }} reports</span>
            <span class="chip" *ngIf="canExport"><mat-icon>download</mat-icon>Export enabled</span>
          </div>
        </div>

        <label class="search" *ngIf="!loading && reportCount > 0">
          <mat-icon>search</mat-icon>
          <input type="search" placeholder="Find a report — e.g. revenue, expiry, doctor"
                 [(ngModel)]="query" (ngModelChange)="applySearch()" aria-label="Search reports">
          <kbd *ngIf="!query">/</kbd>
          <button *ngIf="query" type="button" class="clear" (click)="query=''; applySearch()" aria-label="Clear search"><mat-icon>close</mat-icon></button>
        </label>
      </section>

      <div class="state" *ngIf="loading">
        <div class="skeleton-grid">
          <div class="skeleton" *ngFor="let s of [1,2,3,4,5,6]"></div>
        </div>
      </div>

      <div class="state message" *ngIf="!loading && error">
        <mat-icon>lock</mat-icon>
        <div><strong>Reports are unavailable</strong><p>{{ error }}</p></div>
      </div>

      <div class="state message" *ngIf="!loading && !error && reportCount === 0">
        <mat-icon>visibility_off</mat-icon>
        <div><strong>No reports available</strong><p>Your role does not include access to any report yet. Ask an administrator for report permissions.</p></div>
      </div>

      <section class="quick" *ngIf="!loading && !query && quickPicks.length">
        <h2><mat-icon>bolt</mat-icon>Quick picks</h2>
        <div class="quick-list">
          <a *ngFor="let q of quickPicks; let i = index" class="qp" [routerLink]="['/reports', q.id]" [queryParams]="q.params"
             [style.--accent]="accent(q.category)" [style.animation-delay.ms]="i * 40">
            <span class="qp-icon"><mat-icon>{{ q.icon }}</mat-icon></span>
            <span class="qp-text"><strong>{{ q.label }}</strong><small>{{ q.hint }}</small></span>
          </a>
        </div>
      </section>

      <section class="recent" *ngIf="!loading && !query && recent.length">
        <h2><mat-icon>history</mat-icon>Recently viewed</h2>
        <div class="recent-list">
          <a *ngFor="let r of recent" [routerLink]="['/reports', r.report.id]" [style.--accent]="accent(r.category)">
            <mat-icon>{{ r.report.icon }}</mat-icon>{{ r.report.name }}
          </a>
        </div>
      </section>

      <nav class="jump" *ngIf="!loading && visible.length > 1">
        <a *ngFor="let c of visible" (click)="scrollTo(c.id)" [style.--accent]="accent(c.id)">
          <mat-icon>{{ c.icon }}</mat-icon>{{ c.name }}<span>{{ c.reports.length }}</span>
        </a>
      </nav>

      <section class="category" *ngFor="let c of visible; let ci = index" [id]="'cat-' + c.id"
               [style.--accent]="accent(c.id)" [style.animation-delay.ms]="ci * 70">
        <header>
          <div class="cat-icon"><mat-icon>{{ c.icon }}</mat-icon></div>
          <div>
            <h2>{{ c.name }}</h2>
            <p>{{ c.description }}</p>
          </div>
          <span class="count">{{ c.reports.length }}</span>
        </header>

        <div class="tiles">
          <a class="tile" *ngFor="let r of c.reports; let ri = index" [routerLink]="['/reports', r.id]"
             [style.animation-delay.ms]="ci * 70 + ri * 35">
            <span class="tile-icon"><mat-icon>{{ r.icon }}</mat-icon></span>
            <span class="tile-body">
              <span class="tile-name">{{ r.name }}</span>
              <span class="tile-desc">{{ r.description }}</span>
              <span class="tags">
                <span class="tag money" *ngIf="r.financial"><mat-icon>payments</mat-icon>Financial</span>
                <span class="tag" *ngIf="r.allLocationsOnly"><mat-icon>public</mat-icon>All locations</span>
                <span class="tag" *ngIf="r.audit"><mat-icon>shield</mat-icon>Audit</span>
                <span class="tag muted" *ngIf="!r.usesDateRange"><mat-icon>schedule</mat-icon>Live snapshot</span>
              </span>
            </span>
            <mat-icon class="go">arrow_forward</mat-icon>
          </a>
        </div>
      </section>

      <div class="state message" *ngIf="!loading && reportCount > 0 && visible.length === 0">
        <mat-icon>search_off</mat-icon>
        <div><strong>No report matches "{{ query }}"</strong><p>Try a module name such as billing, stock or appointments.</p></div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    :host { display: block; }

    .hero {
      position: relative; overflow: hidden; border-radius: 18px; padding: 28px 28px 24px;
      margin-bottom: 22px; border: 1px solid var(--border-color, #e2e8f0);
      background:
        radial-gradient(1200px 300px at 100% 0%, rgba(99, 102, 241, 0.14), transparent 60%),
        radial-gradient(600px 240px at 0% 100%, rgba(14, 165, 164, 0.10), transparent 60%),
        var(--bg-card, #fff);
      display: flex; gap: 24px; align-items: flex-end; justify-content: space-between; flex-wrap: wrap;
    }
    .hero-grid {
      position: absolute; inset: 0; pointer-events: none; opacity: 0.55;
      background-image:
        linear-gradient(var(--border-color, #e2e8f0) 1px, transparent 1px),
        linear-gradient(90deg, var(--border-color, #e2e8f0) 1px, transparent 1px);
      background-size: 28px 28px;
      mask-image: linear-gradient(115deg, transparent 35%, #000 100%);
      -webkit-mask-image: linear-gradient(115deg, transparent 35%, #000 100%);
    }
    .hero-body { position: relative; max-width: 640px; }
    .crumbs { display: flex; align-items: center; gap: 2px; font-size: 0.78rem; color: var(--text-muted, #64748b); margin-bottom: 10px; }
    .crumbs a { color: var(--accent-primary, #667eea); text-decoration: none; }
    .crumbs mat-icon { font-size: 16px; width: 16px; height: 16px; }
    h1 { margin: 0; font-size: 2rem; letter-spacing: -0.03em; font-weight: 750; color: var(--text-primary, #1e293b); }
    .lede { margin: 6px 0 0; color: var(--text-secondary, #475569); font-size: 0.95rem; }
    .hero-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
    .chip {
      display: inline-flex; align-items: center; gap: 6px; padding: 5px 11px; border-radius: 999px;
      font-size: 0.78rem; font-weight: 600; color: var(--text-secondary, #475569);
      background: var(--bg-hover, #f1f5f9); border: 1px solid var(--border-color, #e2e8f0);
    }
    .chip mat-icon { font-size: 15px; width: 15px; height: 15px; }
    .chip.location { color: var(--accent-primary, #667eea); background: rgba(102, 126, 234, 0.1); border-color: rgba(102, 126, 234, 0.25); }

    .search {
      position: relative; display: flex; align-items: center; gap: 8px; width: min(420px, 100%);
      padding: 0 12px; height: 46px; border-radius: 12px; cursor: text;
      background: var(--bg-input, #fff); border: 1px solid var(--border-color, #e2e8f0);
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04); transition: border-color .15s, box-shadow .15s;
    }
    .search:focus-within { border-color: var(--accent-primary, #667eea); box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.14); }
    .search mat-icon { color: var(--text-muted, #64748b); }
    .search input { flex: 1; border: 0; outline: 0; background: transparent; font: inherit; font-size: 0.92rem; color: var(--text-primary, #1e293b); }
    .search kbd {
      font: inherit; font-size: 0.72rem; padding: 1px 7px; border-radius: 5px; color: var(--text-muted, #64748b);
      border: 1px solid var(--border-color, #e2e8f0); border-bottom-width: 2px;
    }
    .clear { border: 0; background: transparent; cursor: pointer; display: flex; padding: 2px; color: var(--text-muted, #64748b); }

    .quick, .recent { margin-bottom: 20px; }
    .quick h2, .recent h2 {
      display: flex; align-items: center; gap: 6px; margin: 0 0 10px; font-size: 0.8rem; font-weight: 700;
      letter-spacing: .06em; text-transform: uppercase; color: var(--text-muted, #64748b);
    }
    .quick h2 mat-icon, .recent h2 mat-icon { font-size: 17px; width: 17px; height: 17px; }
    .quick-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 10px; }
    .qp {
      display: flex; align-items: center; gap: 11px; padding: 12px 14px; border-radius: 13px; text-decoration: none;
      background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 9%, var(--bg-card, #fff)), var(--bg-card, #fff));
      border: 1px solid color-mix(in srgb, var(--accent) 22%, var(--border-color, #e2e8f0));
      transition: transform .15s, box-shadow .15s; animation: fade .4s ease-out both;
    }
    .qp:hover { transform: translateY(-2px); box-shadow: 0 12px 26px -14px var(--accent); }
    .qp-icon { width: 36px; height: 36px; border-radius: 10px; display: grid; place-items: center; flex-shrink: 0; color: #fff; background: var(--accent); }
    .qp-icon mat-icon { font-size: 19px; width: 19px; height: 19px; }
    .qp-text { display: flex; flex-direction: column; min-width: 0; }
    .qp-text strong { font-size: 0.86rem; color: var(--text-primary, #1e293b); }
    .qp-text small { font-size: 0.73rem; color: var(--text-muted, #64748b); }
    .recent-list { display: flex; flex-wrap: wrap; gap: 8px; }
    .recent-list a {
      display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px; border-radius: 10px; text-decoration: none;
      font-size: 0.8rem; font-weight: 600; color: var(--text-primary, #1e293b); background: var(--bg-card, #fff);
      border: 1px solid var(--border-color, #e2e8f0); transition: border-color .15s;
    }
    .recent-list a:hover { border-color: var(--accent); }
    .recent-list mat-icon { font-size: 17px; width: 17px; height: 17px; color: var(--accent); }

    .jump { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 18px; scrollbar-width: thin; }
    .jump a {
      display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; cursor: pointer;
      padding: 7px 12px; border-radius: 10px; font-size: 0.8rem; font-weight: 600;
      color: var(--text-secondary, #475569); background: var(--bg-card, #fff);
      border: 1px solid var(--border-color, #e2e8f0); transition: border-color .15s, color .15s;
    }
    .jump a:hover { color: var(--accent); border-color: var(--accent); }
    .jump mat-icon { font-size: 17px; width: 17px; height: 17px; color: var(--accent); }
    .jump span { font-size: 0.7rem; color: var(--text-muted, #64748b); background: var(--bg-hover, #f1f5f9); padding: 0 6px; border-radius: 6px; }

    .category { margin-bottom: 26px; animation: fade 0.5s ease-out both; scroll-margin-top: 80px; }
    @keyframes fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
    .category header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .cat-icon {
      width: 38px; height: 38px; border-radius: 11px; display: grid; place-items: center; flex-shrink: 0;
      color: var(--accent); background: color-mix(in srgb, var(--accent) 13%, transparent);
    }
    .category h2 { margin: 0; font-size: 1.02rem; font-weight: 700; color: var(--text-primary, #1e293b); }
    .category header p { margin: 1px 0 0; font-size: 0.8rem; color: var(--text-muted, #64748b); }
    .count {
      margin-left: auto; font-size: 0.75rem; font-weight: 700; color: var(--accent);
      background: color-mix(in srgb, var(--accent) 11%, transparent); padding: 2px 9px; border-radius: 999px;
    }

    .tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
    .tile {
      position: relative; display: flex; gap: 12px; align-items: flex-start; padding: 16px 16px 14px;
      border-radius: 14px; text-decoration: none; background: var(--bg-card, #fff);
      border: 1px solid var(--border-color, #e2e8f0); overflow: hidden;
      transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
      animation: fade 0.45s ease-out both;
    }
    .tile::before {
      content: ''; position: absolute; left: 0; top: 14px; bottom: 14px; width: 3px; border-radius: 0 3px 3px 0;
      background: var(--accent); transform: scaleY(0.35); opacity: 0.5; transition: transform .2s, opacity .2s;
    }
    .tile:hover, .tile:focus-visible {
      transform: translateY(-2px); border-color: color-mix(in srgb, var(--accent) 45%, var(--border-color, #e2e8f0));
      box-shadow: 0 14px 30px -12px color-mix(in srgb, var(--accent) 45%, transparent); outline: none;
    }
    .tile:hover::before, .tile:focus-visible::before { transform: scaleY(1); opacity: 1; }
    .tile-icon {
      width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center; flex-shrink: 0;
      color: var(--accent); background: color-mix(in srgb, var(--accent) 10%, var(--bg-card, #fff));
      border: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
    }
    .tile-body { display: flex; flex-direction: column; gap: 3px; min-width: 0; flex: 1; }
    .tile-name { font-weight: 700; font-size: 0.93rem; color: var(--text-primary, #1e293b); }
    .tile-desc { font-size: 0.8rem; line-height: 1.4; color: var(--text-secondary, #475569); }
    .tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 7px; }
    .tag {
      display: inline-flex; align-items: center; gap: 3px; font-size: 0.68rem; font-weight: 600;
      padding: 2px 7px; border-radius: 6px; color: var(--text-secondary, #475569); background: var(--bg-hover, #f1f5f9);
    }
    .tag mat-icon { font-size: 12px; width: 12px; height: 12px; }
    .tag.money { color: #047857; background: rgba(16, 185, 129, 0.12); }
    .tag.muted { color: var(--text-muted, #64748b); }
    .go {
      color: var(--accent); opacity: 0; transform: translateX(-6px); transition: opacity .18s, transform .18s; align-self: center;
    }
    .tile:hover .go, .tile:focus-visible .go { opacity: 1; transform: none; }

    .state { margin-top: 8px; }
    .skeleton-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
    .skeleton {
      height: 104px; border-radius: 14px; border: 1px solid var(--border-color, #e2e8f0);
      background: linear-gradient(90deg, var(--bg-card, #fff) 0%, var(--bg-hover, #f1f5f9) 50%, var(--bg-card, #fff) 100%);
      background-size: 200% 100%; animation: shimmer 1.3s linear infinite;
    }
    @keyframes shimmer { to { background-position: -200% 0; } }
    .message {
      display: flex; gap: 14px; align-items: flex-start; padding: 20px; border-radius: 14px;
      background: var(--bg-card, #fff); border: 1px dashed var(--border-color, #e2e8f0); color: var(--text-secondary, #475569);
    }
    .message mat-icon { color: var(--text-muted, #64748b); }
    .message strong { color: var(--text-primary, #1e293b); }
    .message p { margin: 4px 0 0; font-size: 0.85rem; }

    :host-context(.dark-theme) .tag.money { color: #6ee7b7; }

    @media (max-width: 640px) {
      .hero { padding: 20px 18px; }
      h1 { font-size: 1.6rem; }
      .tiles { grid-template-columns: 1fr; }
      .go { opacity: 1; transform: none; }
    }
    @media (prefers-reduced-motion: reduce) {
      .category, .tile, .skeleton { animation: none !important; }
    }
  `],
  host: { '(document:keydown)': 'onKey($event)' },
})
export class ReportsHubComponent implements OnInit {
  categories: ReportCategory[] = [];
  visible: ReportCategory[] = [];
  context?: ReportContext;
  canExport = false;
  loading = true;
  error = '';
  query = '';
  quickPicks: { id: string; category: string; label: string; hint: string; icon: string; params: Record<string, string> }[] = [];
  recent: { report: ReportDef; category: string }[] = [];

  /** One-click starting points; only those the user can open are shown. */
  private static readonly QUICK: { id: string; label: string; hint: string; icon: string; params: Record<string, string> }[] = [
    { id: 'appointments', label: "Today's appointments", hint: 'Who is booked today', icon: 'event', params: { range: 'today' } },
    { id: 'management', label: 'This month at a glance', hint: 'Patients, visits, revenue', icon: 'insights', params: { range: 'month' } },
    { id: 'payments', label: "Today's collections", hint: 'Cash and card received today', icon: 'point_of_sale', params: { range: 'today' } },
    { id: 'billing', label: "This month's revenue", hint: 'Invoices and dues', icon: 'receipt_long', params: { range: 'month' } },
    { id: 'beds', label: 'Bed occupancy now', hint: 'Free and occupied beds', icon: 'bed', params: {} },
    { id: 'inventory', label: 'Low stock', hint: 'Items to reorder', icon: 'production_quantity_limits', params: { status: 'Low Stock' } },
    { id: 'stock-expiry', label: 'Expiring in 30 days', hint: 'Batches to use or return', icon: 'event_busy', params: { status: 'Within 30 days' } },
    { id: 'doctor-activity', label: 'Doctor activity', hint: 'This month, per doctor', icon: 'assignment_ind', params: { range: 'month' } },
  ];

  constructor(private reports: ReportsService) {}

  get reportCount(): number {
    return this.categories.reduce((n, c) => n + c.reports.length, 0);
  }

  ngOnInit(): void {
    forkJoin({ catalog: this.reports.catalog(true), context: this.reports.context(true) }).subscribe({
      next: ({ catalog, context }) => {
        this.categories = catalog.categories;
        this.canExport = catalog.canExport;
        this.context = context;
        this.applySearch();
        this.buildShortcuts();
        this.loading = false;
      },
      error: (e: Error) => {
        this.error = e.message || 'You do not have access to reports.';
        this.loading = false;
      },
    });
  }

  private buildShortcuts(): void {
    const index = new Map<string, { report: ReportDef; category: string }>();
    for (const c of this.categories) for (const r of c.reports) index.set(r.id, { report: r, category: c.id });

    this.quickPicks = ReportsHubComponent.QUICK
      .filter(q => index.has(q.id))
      .map(q => ({ ...q, category: index.get(q.id)!.category }))
      .slice(0, 6);

    let ids: string[] = [];
    try { ids = JSON.parse(localStorage.getItem('medicorex.reports.recent') || '[]'); } catch { ids = []; }
    this.recent = ids.map(id => index.get(id)).filter((x): x is { report: ReportDef; category: string } => !!x).slice(0, 5);
  }

  accent(categoryId: string): string {
    return CATEGORY_ACCENTS[categoryId] ?? '#6366f1';
  }

  applySearch(): void {
    const q = this.query.trim().toLowerCase();
    this.visible = !q
      ? this.categories
      : this.categories
          .map(c => ({
            ...c,
            reports: c.reports.filter(r =>
              `${r.name} ${r.description} ${c.name}`.toLowerCase().includes(q)),
          }))
          .filter(c => c.reports.length > 0);
  }

  scrollTo(id: string): void {
    document.getElementById('cat-' + id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /** "/" focuses the search, like most report portals. */
  onKey(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
      event.preventDefault();
      (document.querySelector('app-reports-hub .search input') as HTMLInputElement | null)?.focus();
    }
  }
}
