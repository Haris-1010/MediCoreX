import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * Shape returned by GET /api/v1/auth/me.
 * `permissions` is already the effective set — roles, user overrides and
 * entitlements have all been applied server-side.
 */
export interface CurrentUserContext {
  userId: string;
  fullName: string;
  email: string;
  mustChangePassword: boolean;
  tenantId: string | null;
  tenantName: string | null;
  branchId: string | null;
  branchName: string | null;
  isSuperAdmin: boolean;
  isOwner: boolean;
  roles: string[];
  permissions: string[];
  enabledModules: string[];
  accessibleBranches: Array<{ id: string; name: string }>;
}

/**
 * Client-side permission state.
 *
 * Everything here is UX only. Hiding a button is a courtesy, not a control —
 * the API rejects the call regardless. Never treat a check in this service as a
 * security boundary.
 */
@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly context = signal<CurrentUserContext | null>(null);
  private inflight$?: Observable<CurrentUserContext>;

  readonly current = this.context.asReadonly();
  readonly isLoaded = computed(() => this.context() !== null);
  readonly isSuperAdmin = computed(() => this.context()?.isSuperAdmin ?? false);
  readonly mustChangePassword = computed(() => this.context()?.mustChangePassword ?? false);

  private readonly permissionSet = computed(() => new Set(this.context()?.permissions ?? []));
  private readonly moduleSet = computed(() => new Set(this.context()?.enabledModules ?? []));

  constructor(private http: HttpClient) {}

  private normalizeKey(value: string): string {
    return value.trim().toLowerCase();
  }

  private getDevFallbackContext(): CurrentUserContext {
    const permissions = [
      'Dashboard.View',
      'Patients.View', 'Patients.Create', 'Patients.Edit', 'Patients.Delete',
      'Appointments.View', 'Appointments.Create', 'Appointments.Edit', 'Appointments.Cancel', 'Appointments.Confirm', 'Appointments.CheckIn',
      'OPD.View', 'IPD.View', 'Emergency.View',
      'Prescriptions.View', 'Prescriptions.Create', 'Prescriptions.Edit', 'Prescriptions.Delete', 'Prescriptions.Dispense', 'Prescriptions.Print',
      'Services.View', 'Services.Create', 'Services.Edit', 'Services.Delete',
      'Billing.View', 'Billing.Create', 'Billing.Edit', 'Billing.Discount', 'Billing.Refund', 'Billing.Cancel', 'Billing.Delete',
      'Payments.View', 'Payments.Create', 'Payments.Refund',
      'Inventory.View', 'Inventory.Manage', 'Inventory.Adjust', 'Inventory.Transfer',
      'Suppliers.View', 'Suppliers.Manage',
      'PurchaseOrders.View', 'PurchaseOrders.Create', 'PurchaseOrders.Approve', 'PurchaseOrders.Receive',
      'Pharmacy.View', 'Pharmacy.Dispense', 'Pharmacy.Sale',
      'Laboratory.View', 'Laboratory.Create', 'Laboratory.Orders.View', 'Laboratory.Sample', 'Laboratory.Results.Edit', 'Laboratory.Verify', 'Laboratory.Reports',
      'Radiology.View', 'Radiology.Create', 'Radiology.Orders.View', 'Radiology.Schedule', 'Radiology.Procedure', 'Radiology.Report', 'Radiology.Verify', 'Radiology.Reports',
      'Doctors.View', 'Staff.View', 'Departments.View', 'Facility.View', 'Wards.View',
      'Reports.View', 'Settings.View', 'Roles.View', 'Users.View',
      'Audit.View', 'Admissions.View', 'Beds.View'
    ];

    const enabledModules = [
      'dashboard', 'patients', 'appointments', 'opd', 'ipd', 'emergency',
      'prescriptions', 'services', 'billing', 'inventory', 'suppliers', 'purchase_orders',
      'pharmacy', 'laboratory', 'radiology',
      'doctors', 'staff', 'departments', 'facility', 'wards', 'reports', 'settings',
      'audit', 'admissions', 'beds'
    ];

    return {
      userId: 'dev-admin',
      fullName: 'Developer Admin',
      email: 'dev@medicorex.local',
      mustChangePassword: false,
      tenantId: 'dev-tenant',
      tenantName: 'Development Tenant',
      branchId: 'dev-branch',
      branchName: 'Development Branch',
      isSuperAdmin: false,
      isOwner: true,
      roles: ['Admin', 'SuperAdmin'],
      permissions,
      enabledModules,
      accessibleBranches: [{ id: 'dev-branch', name: 'Development Branch' }]
    };
  }

  /** Called by the app initializer, and again after login or a branch switch. */
  load(force = false): Observable<CurrentUserContext> {
    if (!force && this.inflight$) {
      return this.inflight$;
    }

    this.inflight$ = this.http
      .get<CurrentUserContext>(`${environment.apiUrl}/v1/auth/me`)
      .pipe(
        map((response: any) =>
          response?.succeeded === false || response?.data == null
            ? (null as unknown as CurrentUserContext)
            : (response.data ?? response) as CurrentUserContext
        ),
        tap((ctx: CurrentUserContext) => this.context.set(ctx)),
        catchError(() => {
          if (!environment.production) {
            const fallback = this.getDevFallbackContext();
            this.context.set(fallback);
            return of(fallback);
          }
          this.context.set(null);
          return of(null as unknown as CurrentUserContext);
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      );

    return this.inflight$;
  }

  clear(): void {
    this.context.set(null);
    this.inflight$ = undefined;
  }

  /** Exact permission check, e.g. 'patients.create'. */
  has(permission: string): boolean {
    if (this.isSuperAdmin()) {
      return true;
    }

    const target = this.normalizeKey(permission);
    return Array.from(this.permissionSet()).some((item) => this.normalizeKey(item) === target);
  }

  hasAny(permissions: string[]): boolean {
    return permissions.some((p) => this.has(p));
  }

  hasAll(permissions: string[]): boolean {
    return permissions.every((p) => this.has(p));
  }

  /** Module/entitlement check. */
  hasModule(module: string): boolean {
    if (this.isSuperAdmin()) {
      return true;
    }

    const target = this.normalizeKey(module);
    return Array.from(this.moduleSet()).some((item) => this.normalizeKey(item) === target);
  }

  /** Names of every feature the user's organization is entitled to. */
  get enabledModules(): string[] {
    return this.context()?.enabledModules ?? [];
  }

  /**
   * The check that actually decides whether a feature is usable: the
   * organization's entitlement AND the user's grant must both pass.
   */
  canUse(module: string, permission: string): boolean {
    return this.hasModule(module) && this.has(permission);
  }

  get tenantId(): string | null {
    return this.context()?.tenantId ?? null;
  }

  get branchId(): string | null {
    return this.context()?.branchId ?? null;
  }
}
