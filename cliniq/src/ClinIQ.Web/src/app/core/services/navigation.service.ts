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

  { label: 'Patients', icon: 'people', route: '/patients', module: 'patients', permission: 'patients.view' },

  {
    label: 'Appointments', icon: 'event', module: 'appointments', permission: 'appointments.view',
    children: [
      { label: 'Calendar', icon: 'calendar_month', route: '/appointments/calendar', module: 'appointments', permission: 'appointments.view' },
      { label: 'All Appointments', icon: 'list', route: '/appointments', module: 'appointments', permission: 'appointments.view' },
    ],
  },

  { label: 'Prescriptions', icon: 'receipt_long', route: '/prescriptions', module: 'prescriptions', permission: 'prescriptions.view' },

  {
    label: 'OPD', icon: 'local_hospital', module: 'opd', permission: 'opd.view',
    children: [
      { label: 'Dashboard', icon: 'dashboard', route: '/opd', module: 'opd', permission: 'opd.view' },
      { label: 'Queue Management', icon: 'queue', route: '/opd/queue', module: 'opd', permission: 'opd.view' },
      { label: 'Token Display', icon: 'confirmation_number', route: '/opd/display', module: 'opd', permission: 'opd.view' },
      { label: 'Token Generation', icon: 'receipt_long', route: '/opd/token', module: 'opd', permission: 'opd.view' },
    ],
  },

  {
    label: 'IPD', icon: 'bed', module: 'ipd', permission: 'ipd.view',
    children: [
      { label: 'Dashboard', icon: 'dashboard', route: '/ipd', module: 'ipd', permission: 'ipd.view' },
      { label: 'Admissions', icon: 'assignment_ind', route: '/ipd/admissions', module: 'ipd', permission: 'admissions.view' },
      { label: 'Wards', icon: 'hotel', route: '/ipd/wards', module: 'ipd', permission: 'ipd.view' },
      { label: 'Rooms', icon: 'meeting_room', route: '/ipd/rooms', module: 'ipd', permission: 'ipd.view' },
      { label: 'Bed Board', icon: 'grid_view', route: '/ipd/beds', module: 'ipd', permission: 'ipd.view' },
      { label: 'Nursing Station', icon: 'local_hospital', route: '/ipd/nursing', module: 'ipd', permission: 'ipd.view' },
    ],
  },

  { label: 'Pharmacy', icon: 'local_pharmacy', route: '/pharmacy', module: 'pharmacy', permission: 'pharmacy.view' },

  {
    label: 'Diagnostics', icon: 'diagnostic', module: 'diagnostics',
    children: [
      { label: 'Laboratory', icon: 'science', route: '/laboratory', module: 'laboratory', permission: 'laboratory.view' },
      { label: 'Radiology', icon: 'medical_information', route: '/radiology', module: 'radiology', permission: 'radiology.view' },
    ],
  },

  {
    label: 'Billing', icon: 'payments', module: 'billing', permission: 'billing.view',
    children: [
      { label: 'Invoices', icon: 'receipt_long', route: '/billing/invoices', module: 'billing', permission: 'billing.view' },
      { label: 'Payments', icon: 'payments', route: '/billing/payments', module: 'billing', permission: 'payments.view' },
      { label: 'Discounts', icon: 'local_offer', route: '/billing/discounts', module: 'billing', permission: 'billing.view' },
    ],
  },

  { label: 'Insurance', icon: 'health_and_safety', route: '/insurance', module: 'insurance', permission: 'insurance.view' },

  {
    label: 'Inventory', icon: 'inventory_2', module: 'inventory', permission: 'inventory.view',
    children: [
      { label: 'Items', icon: 'inventory', route: '/inventory', module: 'inventory', permission: 'inventory.view' },
      { label: 'Suppliers', icon: 'local_shipping', route: '/inventory/suppliers', module: 'inventory', permission: 'inventory.view' },
      { label: 'Purchase Orders', icon: 'shopping_cart', route: '/inventory/purchase-orders', module: 'inventory', permission: 'inventory.view' },
    ],
  },

  { label: 'Reports', icon: 'bar_chart', route: '/reports', module: 'reports', permission: 'reports.view' },

  {
    label: 'Administration', icon: 'admin_panel_settings',
    children: [
      { label: 'Services', icon: 'miscellaneous_services', route: '/services', module: 'services', permission: 'services.view' },
      { label: 'Doctors', icon: 'medical_services', route: '/doctors' },
      { label: 'Departments', icon: 'apartment', route: '/departments' },
      { label: 'Users', icon: 'manage_accounts', route: '/settings/users', permission: 'users.view' },
      { label: 'Roles', icon: 'badge', route: '/settings/roles', permission: 'roles.view' },
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
