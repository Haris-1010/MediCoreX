import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { SeriesData } from '../reports.service';
import { ReportFormatService } from '../report-format.service';

/** Ranked horizontal bars for a categorical breakdown ("By Doctor", "By Status"). */
@Component({
  standalone: false,
  selector: 'app-bar-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ol class="bars" *ngIf="rows.length; else empty">
      <li *ngFor="let r of rows; let i = index" [style.animation-delay.ms]="i * 45" [title]="r.label + ': ' + r.display">
        <div class="meta">
          <span class="label">{{ r.label }}</span>
          <span class="value">{{ r.display }}</span>
          <span class="share" *ngIf="r.share">{{ r.share }}%</span>
        </div>
        <div class="track">
          <div class="fill" [style.width.%]="r.width" [style.background]="color" [style.opacity]="1 - i * 0.055"></div>
        </div>
      </li>
    </ol>
    <ng-template #empty><div class="empty">Nothing to break down yet</div></ng-template>
  `,
  styles: [`
    :host { display: block; }
    .bars { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 11px; }
    li { animation: rise 0.45s ease-out both; }
    @keyframes rise { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
    .meta { display: flex; align-items: baseline; gap: 8px; font-size: 0.8rem; margin-bottom: 4px; }
    .label {
      flex: 1; min-width: 0; color: var(--text-primary, #1e293b); font-weight: 500;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .value { font-weight: 700; color: var(--text-primary, #1e293b); font-variant-numeric: tabular-nums; }
    .share { width: 42px; text-align: right; color: var(--text-muted, #64748b); font-size: 0.72rem; font-variant-numeric: tabular-nums; }
    .track { height: 8px; border-radius: 6px; background: var(--bg-hover, #f1f5f9); overflow: hidden; }
    .fill { height: 100%; border-radius: 6px; transform-origin: left; animation: grow 0.7s cubic-bezier(.2,.7,.2,1) both; }
    @keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
    .empty { color: var(--text-muted, #64748b); font-size: 0.85rem; padding: 24px 0; text-align: center; }
  `],
})
export class BarListComponent implements OnChanges {
  @Input() series?: SeriesData;
  @Input() color = '#6366f1';

  rows: { label: string; display: string; width: number; share: string }[] = [];

  constructor(private fmt: ReportFormatService) {}

  ngOnChanges(): void {
    const points = (this.series?.points ?? []).map(p => ({ label: p.label, value: Number(p.value) || 0 }));
    const max = Math.max(...points.map(p => p.value), 0);
    // Percent series (e.g. ward occupancy) are shares already; others are parts of a whole.
    const isPercent = this.series?.format === 'percent';
    const total = points.reduce((sum, p) => sum + p.value, 0);

    this.rows = points.map(p => ({
      label: p.label,
      display: this.fmt.value(p.value, this.series?.format ?? 'number'),
      width: max > 0 ? Math.max(2, (p.value / max) * 100) : 0,
      share: isPercent ? '' : total > 0 ? ((p.value / total) * 100).toFixed(p.value / total < 0.1 ? 1 : 0) : '0',
    }));
  }
}
