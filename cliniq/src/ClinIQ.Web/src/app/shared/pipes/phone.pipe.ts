import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: false,
  name: 'phone'
})
export class PhonePipe implements PipeTransform {
  transform(value: string | null | undefined, format: string = 'default'): string {
    if (!value) {
      return '';
    }

    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');

    switch (format) {
      case 'us':
        return this.formatUS(digits);
      case 'international':
        return this.formatInternational(digits);
      case 'local':
        return this.formatLocal(digits);
      default:
        return this.formatDefault(digits);
    }
  }

  private formatUS(digits: string): string {
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    if (digits.length === 11 && digits.startsWith('1')) {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    return digits;
  }

  private formatInternational(digits: string): string {
    if (digits.length >= 10) {
      const countryCode = digits.slice(0, digits.length - 10);
      const rest = digits.slice(-10);
      return `+${countryCode} ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`;
    }
    return digits;
  }

  private formatLocal(digits: string): string {
    if (digits.length === 10) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return digits;
  }

  private formatDefault(digits: string): string {
    // Auto-detect and format
    if (digits.length === 10) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    if (digits.length === 11) {
      return `+${digits.slice(0, 1)} ${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    if (digits.length > 11) {
      const countryCode = digits.slice(0, digits.length - 10);
      const rest = digits.slice(-10);
      return `+${countryCode} ${rest.slice(0, 3)}-${rest.slice(3, 6)}-${rest.slice(6)}`;
    }
    return digits;
  }
}
