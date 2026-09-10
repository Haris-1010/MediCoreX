import { Pipe, PipeTransform } from '@angular/core';
import { TenantService } from '../../core/services/tenant.service';

@Pipe({
  standalone: false,
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {
  constructor(private tenantService: TenantService) {}

  transform(value: number | null | undefined, currency?: string): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (currency) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(value);
    }

    return this.tenantService.formatCurrency(value);
  }
}
