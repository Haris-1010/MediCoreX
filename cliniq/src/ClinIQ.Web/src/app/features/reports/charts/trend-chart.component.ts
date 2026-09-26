import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef,
  Input, OnChanges, OnDestroy, ViewChild,
} from '@angular/core';
import { SeriesData } from '../reports.service';
import { ReportFormatService } from '../report-format.service';

interface Plotted {
  name: string;
  color: string;
  line: string;
  area: string;
  points: { x: number; y: number; value: number }[];
}

/**
 * Dependency-free SVG trend chart (one or two date series on a shared axis).
 * Drawn in real pixels from a ResizeObserver, so text never stretches.
 */
@Component({
  standalone: false,
  selector: 'app-trend-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chart" #host (mouseleave)="hover = -1">
      <svg *ngIf="width > 0" [attr.width]="width" [attr.height]="height" role="img" [attr.aria-label]="ariaLabel">
        <defs>
          <linearGradient *ngFor="let s of plotted; let i = index" [attr.id]="gradientId(i)" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" [attr.stop-color]="s.color" stop-opacity="0.22"></stop>
            <stop offset="100%" [attr.stop-color]="s.color" stop-opacity="0"></stop>
          </linearGradient>
        </defs>

        <g class="grid">
          <ng-container *ngFor="let t of ticks">
            <line [attr.x1]="padL" [attr.x2]="width - padR" [attr.y1]="t.y" [attr.y2]="t.y"></line>
            <text [attr.x]="padL - 8" [attr.y]="t.y + 4" text-anchor="end">{{ t.label }}</text>
          </ng-container>
        </g>

        <g class="x-labels">
          <text *ngFor="let l of xLabels" [attr.x]="l.x" [attr.y]="height - 6" text-anchor="middle">{{ l.label }}</text>
        </g>

        <ng-container *ngFor="let s of plotted; let i = index">
          <path *ngIf="i === 0" [attr.d]="s.area" [attr.fill]="'url(#' + gradientId(i) + ')'"></path>
          <path [attr.d]="s.line" fill="none" [attr.stroke]="s.color" stroke-width="2.25"
                stroke-linejoin="round" stroke-linecap="round" [attr.stroke-dasharray]="i === 1 ? '5 4' : null"
                [class.draw]="i === 0"></path>
        </ng-container>

        <g *ngIf="hover >= 0">
          <line class="guide" [attr.x1]="plotted[0].points[hover].x" [attr.x2]="plotted[0].points[hover].x"
                [attr.y1]="padT" [attr.y2]="height - padB"></line>
          <circle *ngFor="let s of plotted" [attr.cx]="s.points[hover].x" [attr.cy]="s.points[hover].y" r="4.5"
                  [attr.stroke]="s.color" class="dot"></circle>
        </g>

        <rect class="hit" [attr.x]="padL" [attr.y]="padT" [attr.width]="width - padL - padR"
              [attr.height]="height - padT - padB" (mousemove)="onMove($event)"></rect>
      </svg>

      <div class="tooltip" *ngIf="hover >= 0" [style.left.px]="tooltipX" [class.flip]="tooltipFlip">
        <div class="tt-label">{{ labels[hover] }}</div>
        <div class="tt-row" *ngFor="let s of plotted">
          <span class="swatch" [style.background]="s.color"></span>
          <span class="tt-name">{{ s.name }}</span>
          <strong>{{ fmt.value(s.points[hover].value, format) }}</strong>
        </div>
      </div>

      <div class="empty" *ngIf="isEmpty">No activity in this period</div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .chart { position: relative; height: 240px; }
    svg { display: block; overflow: visible; }
    .grid line { stroke: var(--border-color, #e2e8f0); stroke-dasharray: 2 4; }
    .grid text, .x-labels text {
      fill: var(--text-muted, #64748b); font-size: 11px; font-variant-numeric: tabular-nums;
    }
    .draw { stroke-dasharray: 3000; animation: draw 1s cubic-bezier(.2,.7,.2,1) both; }
    @keyframes draw { from { stroke-dashoffset: 3000; } to { stroke-dashoffset: 0; } }
    .guide { stroke: var(--text-muted, #94a3b8); stroke-width: 1; stroke-dasharray: 3 3; }
    .dot { fill: var(--bg-card, #fff); stroke-width: 2.5; }
    .hit { fill: transparent; cursor: crosshair; }
    .tooltip {
      position: absolute; top: 8px; transform: translateX(12px); pointer-events: none;
      background: var(--bg-card, #fff); border: 1px solid var(--border-color, #e2e8f0);
      border-radius: 10px; padding: 8px 10px; min-width: 150px;
      box-shadow: 0 10px 28px rgba(15, 23, 42, 0.16); font-size: 12px; z-index: 2;
    }
    .tooltip.flip { transform: translateX(calc(-100% - 12px)); }
    .tt-label { color: var(--text-muted, #64748b); font-weight: 600; margin-bottom: 4px; }
    .tt-row { display: flex; align-items: center; gap: 6px; color: var(--text-primary, #1e293b); }
    .tt-row strong { margin-left: auto; font-variant-numeric: tabular-nums; }
    .tt-name { color: var(--text-secondary, #475569); }
    .swatch { width: 8px; height: 8px; border-radius: 2px; }
    .empty {
      position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
      color: var(--text-muted, #64748b); font-size: 0.85rem;
    }
  `],
})
export class TrendChartComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() series: SeriesData[] = [];
  @Input() colors: string[] = ['#6366f1', '#0ea5a4'];
  @ViewChild('host', { static: true }) host!: ElementRef<HTMLDivElement>;

  private static seq = 0;
  private readonly uid = ++TrendChartComponent.seq;
  private observer?: ResizeObserver;

  width = 0;
  readonly height = 240;
  readonly padL = 56;
  readonly padR = 16;
  readonly padT = 12;
  readonly padB = 28;

  plotted: Plotted[] = [];
  ticks: { y: number; label: string }[] = [];
  xLabels: { x: number; label: string }[] = [];
  labels: string[] = [];
  hover = -1;
  tooltipX = 0;
  tooltipFlip = false;
  isEmpty = false;

  constructor(public fmt: ReportFormatService, private cdr: ChangeDetectorRef) {}

  get format(): string { return this.series[0]?.format ?? 'number'; }
  get ariaLabel(): string { return this.series.map(s => s.name).join(' and ') + ' trend'; }
  gradientId(i: number): string { return `trend-${this.uid}-${i}`; }

  ngAfterViewInit(): void {
    this.observer = new ResizeObserver(entries => {
      const w = Math.floor(entries[0].contentRect.width);
      if (w !== this.width) {
        this.width = w;
        this.layout();
        this.cdr.markForCheck();
      }
    });
    this.observer.observe(this.host.nativeElement);
  }

  ngOnChanges(): void { this.layout(); }

  ngOnDestroy(): void { this.observer?.disconnect(); }

  onMove(event: MouseEvent): void {
    const n = this.labels.length;
    if (!n) return;
    const rect = this.host.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const step = n > 1 ? (this.width - this.padL - this.padR) / (n - 1) : 0;
    const index = step ? Math.round((x - this.padL) / step) : 0;
    this.hover = Math.max(0, Math.min(n - 1, index));
    this.tooltipX = this.plotted[0].points[this.hover].x;
    this.tooltipFlip = this.tooltipX > this.width * 0.62;
  }

  private layout(): void {
    this.hover = -1;
    const base = this.series[0];
    if (!base || this.width === 0) { this.plotted = []; return; }

    this.labels = base.points.map(p => this.prettyLabel(p.label));
    const all = this.series.flatMap(s => s.points.map(p => Number(p.value) || 0));
    this.isEmpty = all.every(v => v === 0);
    const peak = Math.max(...all, 0);
    // Counts get whole-number ticks: with 4 intervals, a max of 4 or 8 keeps every tick an integer.
    const max = this.format === 'number' && peak <= 8 ? (peak <= 4 ? 4 : 8) : this.niceMax(peak);

    const innerW = this.width - this.padL - this.padR;
    const innerH = this.height - this.padT - this.padB;
    const n = base.points.length;
    const xAt = (i: number) => this.padL + (n > 1 ? (innerW * i) / (n - 1) : innerW / 2);
    const yAt = (v: number) => this.padT + innerH - (max > 0 ? (v / max) * innerH : 0);

    this.ticks = [0, 0.25, 0.5, 0.75, 1].map(f => ({ y: yAt(max * f), label: this.fmt.axis(max * f, this.format) }));

    const every = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(innerW / 90))));
    this.xLabels = base.points
      .map((p, i) => ({ x: xAt(i), label: this.prettyLabel(p.label), i }))
      .filter(l => l.i % every === 0 || l.i === n - 1)
      .filter((l, idx, arr) => idx === arr.length - 1 || arr[idx + 1].x - l.x > 44);

    this.plotted = this.series.map((s, si) => {
      const pts = s.points.map((p, i) => ({ x: xAt(i), y: yAt(Number(p.value) || 0), value: Number(p.value) || 0 }));
      const line = this.smooth(pts);
      const area = pts.length
        ? `${line} L ${pts[pts.length - 1].x} ${yAt(0)} L ${pts[0].x} ${yAt(0)} Z`
        : '';
      return { name: s.name, color: this.colors[si % this.colors.length], line, area, points: pts };
    });
  }

  /** Monotone-ish cubic smoothing: gentle curves that never overshoot wildly. */
  private smooth(pts: { x: number; y: number }[]): string {
    if (pts.length === 0) return '';
    if (pts.length < 3) return pts.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ');
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      const t = 0.18;
      const c1x = p1.x + (p2.x - p0.x) * t, c1y = p1.y + (p2.y - p0.y) * t;
      const c2x = p2.x - (p3.x - p1.x) * t, c2y = p2.y - (p3.y - p1.y) * t;
      const lo = Math.max(p1.y, p2.y), hi = Math.min(p1.y, p2.y);
      d += ` C ${c1x} ${Math.min(lo, Math.max(hi, c1y))}, ${c2x} ${Math.min(lo, Math.max(hi, c2y))}, ${p2.x} ${p2.y}`;
    }
    return d;
  }

  private niceMax(v: number): number {
    if (v <= 0) return 4;
    const mag = Math.pow(10, Math.floor(Math.log10(v)));
    const step = [1, 2, 2.5, 5, 10].find(s => s * mag >= v) ?? 10;
    return step * mag;
  }

  private prettyLabel(label: string): string {
    if (/^\d{4}-\d{2}-\d{2}$/.test(label)) {
      const d = new Date(label + 'T00:00:00');
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    }
    if (/^\d{4}-\d{2}$/.test(label)) {
      const d = new Date(label + '-01T00:00:00');
      return d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
    }
    return label;
  }
}
