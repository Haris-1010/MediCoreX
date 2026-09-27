import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';

export interface Tenant {
  id: string;
  name: string;
  code: string;
  logo?: string;
  logoUrl?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  settings: TenantSettings;
}

export interface TenantSettings {
  currency: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  appointmentDuration: number;
  workingHours: WorkingHours;
  features: string[];
}

export interface WorkingHours {
  startTime: string;
  endTime: string;
  workingDays: number[];
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  logoUrl?: string;
  website?: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
}

export interface Branding {
  logoUrl?: string;
  name?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  branchId?: string;
  branchName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private currentTenantSubject = new BehaviorSubject<Tenant | null>(null);
  private currentBranchSubject = new BehaviorSubject<Branch | null>(null);
  private branchesSubject = new BehaviorSubject<Branch[]>([]);

  currentTenant$ = this.currentTenantSubject.asObservable();
  currentBranch$ = this.currentBranchSubject.asObservable();
  branches$ = this.branchesSubject.asObservable();

  private effectiveBrandingSubject = new BehaviorSubject<Branding | null>(null);
  effectiveBranding$ = this.effectiveBrandingSubject.asObservable();

  constructor(
    private api: ApiService,
    private storage: StorageService
  ) {}

  loadTenant(): Observable<Tenant> {
    return this.api.get<any>('v1/tenants/current').pipe(
      map(tenant => this.normalizeTenant(tenant)),
      tap(tenant => this.currentTenantSubject.next(tenant))
    );
  }

  loadBranches(): Observable<Branch[]> {
    return this.api.get<Branch[]>('v1/branches').pipe(
      tap(branches => this.branchesSubject.next(branches))
    );
  }

  loadBranding(): Observable<Branding> {
    return this.api.get<any>('v1/branches/current/branding').pipe(
      tap(branding => this.effectiveBrandingSubject.next(branding))
    );
  }

  setCurrentBranch(branch: Branch): void {
    this.currentBranchSubject.next(branch);
    this.storage.setItem(environment.branchKey, branch.id);
  }

  setBranches(branches: Branch[]): void {
    this.branchesSubject.next(branches);
  }

  getCurrentTenant(): Tenant | null {
    return this.currentTenantSubject.value;
  }

  getCurrentBranch(): Branch | null {
    return this.currentBranchSubject.value;
  }

  hasFeature(feature: string): boolean {
    const tenant = this.currentTenantSubject.value;
    return tenant?.settings.features.includes(feature) ?? false;
  }

  getSetting<K extends keyof TenantSettings>(key: K): TenantSettings[K] | null {
    const tenant = this.currentTenantSubject.value;
    return tenant?.settings[key] ?? null;
  }

  formatDate(date: Date): string {
    const format = this.getSetting('dateFormat') || 'dd/MM/yyyy';
    return this.formatDateWithPattern(date, format);
  }

  formatTime(date: Date): string {
    const format = this.getSetting('timeFormat') || 'hh:mm a';
    return this.formatTimeWithPattern(date, format);
  }

  formatCurrency(amount: number): string {
    const currency = this.getSetting('currency') || 'PKR';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(amount);
    } catch {
      return `Rs. ${amount}`;
    }
  }

  getCurrencySymbol(): string {
    const currency = this.getSetting('currency') || 'PKR';
    try {
      const parts = new Intl.NumberFormat('en-US', { style: 'currency', currency }).formatToParts(0);
      const symbolPart = parts.find(p => p.type === 'currency');
      return symbolPart ? symbolPart.value : 'Rs.';
    } catch {
      return 'Rs.';
    }
  }

  private normalizeTenant(tenant: any): Tenant {
    if (!tenant) {
      return {
        id: '',
        name: '',
        code: '',
        settings: {         currency: 'PKR', timezone: 'UTC', dateFormat: 'dd/MM/yyyy', timeFormat: 'hh:mm a', appointmentDuration: 30, workingHours: { startTime: '09:00', endTime: '17:00', workingDays: [1, 2, 3, 4, 5] }, features: [] }
      };
    }
    return {
      id: tenant.id ?? '',
      name: tenant.name ?? '',
      code: tenant.slug ?? '',
      logo: tenant.logoUrl,
      logoUrl: tenant.logoUrl,
      website: tenant.website,
      email: tenant.email,
      phone: tenant.phone,
      address: tenant.address,
      city: tenant.city,
      state: tenant.state,
      country: tenant.country,
      postalCode: tenant.postalCode,
      settings: {
        currency: tenant.currency || 'PKR',
        timezone: tenant.timezone || 'UTC',
        dateFormat: 'dd/MM/yyyy',
        timeFormat: 'hh:mm a',
        appointmentDuration: 30,
        workingHours: { startTime: '09:00', endTime: '17:00', workingDays: [1, 2, 3, 4, 5] },
        features: []
      }
    };
  }

  private formatDateWithPattern(date: Date, pattern: string): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return pattern
      .replace('dd', day)
      .replace('MM', month)
      .replace('yyyy', year);
  }

  private formatTimeWithPattern(date: Date, pattern: string): string {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const h = hours.toString().padStart(2, '0');

    return pattern
      .replace('hh', h)
      .replace('HH', hours.toString().padStart(2, '0'))
      .replace('mm', minutes)
      .replace('a', ampm);
  }
}
