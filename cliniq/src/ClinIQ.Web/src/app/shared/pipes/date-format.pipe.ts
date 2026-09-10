import { Pipe, PipeTransform } from '@angular/core';
import { TenantService } from '../../core/services/tenant.service';

@Pipe({
  standalone: false,
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  constructor(private tenantService: TenantService) {}

  transform(value: Date | string | null | undefined, format?: string): string {
    if (!value) {
      return '';
    }

    const date = typeof value === 'string' ? new Date(value) : value;

    if (isNaN(date.getTime())) {
      return '';
    }

    if (format) {
      return this.formatWithPattern(date, format);
    }

    return this.tenantService.formatDate(date);
  }

  private formatWithPattern(date: Date, pattern: string): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return pattern
      .replace('dd', day)
      .replace('MM', month)
      .replace('yyyy', year)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }
}
