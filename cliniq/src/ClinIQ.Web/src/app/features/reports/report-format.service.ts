import { Injectable } from '@angular/core';
import { TenantService } from '../../core/services/tenant.service';

/** One place that turns report values into display text (cards, charts, table). */
@Injectable({ providedIn: 'root' })
export class ReportFormatService {
  private readonly number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
  private readonly compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

  constructor(private tenant: TenantService) {}

  value(value: unknown, format: string): string {
    if (value === null || value === undefined || value === '') return '—';
    const n = typeof value === 'number' ? value : Number(value);
    if (Number.isNaN(n)) return String(value);

    switch (format) {
      case 'currency': return this.tenant.formatCurrency(n);
      case 'percent': return `${this.number.format(n)}%`;
      case 'days': return `${this.number.format(n)} ${n === 1 ? 'day' : 'days'}`;
      case 'hours': return `${this.number.format(n)} h`;
      default: return this.number.format(n);
    }
  }

  /** Short axis labels: 12.5K, 3.2M, with the currency symbol when relevant. */
  axis(value: number, format: string): string {
    const text = Math.abs(value) >= 1000 ? this.compact.format(value) : this.number.format(value);
    if (format === 'currency') return `${this.tenant.getCurrencySymbol()}${text}`;
    if (format === 'percent') return `${text}%`;
    return text;
  }

  cell(value: unknown, type: string): string {
    if (value === null || value === undefined || value === '') return '—';
    switch (type) {
      case 'currency':
      case 'percent':
      case 'number':
        return this.value(value, type);
      case 'date':
        return this.date(value, false);
      case 'datetime':
        return this.date(value, true);
      default:
        return String(value);
    }
  }

  private date(value: unknown, withTime: boolean): string {
    const d = new Date(String(value));
    if (Number.isNaN(d.getTime())) return String(value);
    const hasTime = withTime && (d.getHours() !== 0 || d.getMinutes() !== 0);
    return d.toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      ...(hasTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    });
  }
}
