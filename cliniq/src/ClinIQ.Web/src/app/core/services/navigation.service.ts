import { Injectable, computed, inject } from '@angular/core';
import { PermissionService } from './permission.service';

export interface NavItem {
  label: string;
  icon: string;
  route?: string;
  /** Subscription feature key. Omit for always-available items. */
  module?: string;
  /** Permission needed to see the item at all (usually the *.view one). */
  permission?: string;
  children?: NavItem[];
  /** UI state: whether an expandable group is open. */
  expanded?: boolean;
}

/**
 * Full navigation tree. Items are filtered, never conditionally constructed, so
 * there is exactly one place to read when asking "why can this user see X".
 */
const NAV: NavItem[] = [
  { label: 'Dashboard', icon: 'home', route: '/dashboard', module: 'dashboard' },

  { label: 'Patients', icon: 'people', route: '/patients', permission: 'patients.view' },

  { label: 'OPD Visits', icon: 'assignment', route: '/opd', permission: 'opd.view' },

  { label: 'Prescriptions', icon: 'receipt_long', route: '/prescriptions', permission: 'prescriptions.view' },

  { label: 'Pharmacy', icon: 'description', route: '/pharmacy', permission: 'pharmacy.view' },

  {
    label: 'Appointments', icon: 'event', permission: 'appointments.view',
    children: [
      { label: 'Calendar', icon: 'calendar_month', route: '/appointments/calendar', permission: 'appointments.view' },
      { label: 'List', icon: 'list', route: '/appointments', permission: 'appointments.view' },
    ],
  },

  { label: 'Invoices', icon: 'receipt_long', route: '/billing/invoices', permission: 'billing.view' },

  { label: 'Payments', icon: 'money_off', route: '/billing', permission: 'payments.view' },

  { label: 'Treatment Plans', icon: 'medical_services', route: '/opd', permission: 'opd.view' },

  { label: 'Vaccinations', icon: 'vaccines', route: '/laboratory', permission: 'laboratory.view' },

  {
    label: 'Inpatient (IPD)', icon: 'bed',
    children: [
      { label: 'Admissions', icon: 'assignment_ind', route: '/ipd/admissions', permission: 'admissions.view' },
      { label: 'Bed Board', icon: 'grid_view', route: '/ipd/beds', permission: 'beds.view' },
      { label: 'Wards', icon: 'meeting_room', route: '/wards', permission: 'wards.view' },
    ],
  },

  { label: 'Reports', icon: 'folder', route: '/reports', permission: 'reports.view' },

  { label: 'Emergency', icon: 'home_repair_service', route: '/emergency', permission: 'emergency.view' },

  { label: 'Insurance', icon: 'health_and_safety', route: '/billing', permission: 'insurance.view' },

  { label: 'Queue Management', icon: 'queue', route: '/opd/queue', permission: 'opd.view' },

  {
    label: 'Administration', icon: 'admin_panel_settings',
    children: [
      { label: 'Users', icon: 'manage_accounts', route: '/settings/users', permission: 'users.view' },
      { label: 'Roles', icon: 'badge', route: '/settings/roles', permission: 'roles.view' },
      { label: 'Departments', icon: 'apartment', route: '/departments', permission: 'departments.view' },
      { label: 'Doctors', icon: 'medical_services', route: '/doctors', permission: 'doctors.view' },
      { label: 'Settings', icon: 'settings', route: '/settings', permission: 'settings.view' },
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly permissions = inject(PermissionService);

  /**
   * Sidebar tree with anything unreachable removed. A parent whose children all
   * get filtered out is dropped too, so there are no dead expandable groups.
   */
  readonly menu = computed<NavItem[]>(() => {
    this.permissions.current(); // subscribe to context changes
    const tree = this.filter(NAV);

    // The Platform group is for the SaaS operator, never a tenant user.
    return this.permissions.isSuperAdmin()
      ? tree
      : tree.filter((i) => i.label !== 'Platform');
  });

  private filter(items: NavItem[]): NavItem[] {
    const result: NavItem[] = [];

    for (const item of items) {
      if (item.module && !this.permissions.hasModule(item.module)) continue;
      if (item.permission && !this.permissions.has(item.permission)) continue;

      if (item.children?.length) {
        const children = this.filter(item.children);
        if (children.length === 0) continue; // no reachable child = noise
        result.push({ ...item, children });
      } else if (item.route) {
        result.push(item);
      }
    }

    return result;
  }
}
