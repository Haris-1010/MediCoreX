import { Pipe, PipeTransform } from '@angular/core';
import { TenantService } from '../../core/services/tenant.service';

@Pipe({
  standalone: false,
  name: 'currencySymbol'
})
export class CurrencySymbolPipe implements PipeTransform {
  constructor(private tenantService: TenantService) {}

  transform(): string {
    return this.tenantService.getCurrencySymbol();
  }
}
