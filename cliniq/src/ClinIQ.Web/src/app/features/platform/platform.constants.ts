export interface PlatformFeature {
  key: string;
  label: string;
  icon: string;
  description: string;
}

export const PLATFORM_FEATURES: PlatformFeature[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', description: 'Overview and quick stats' },
  { key: 'patients', label: 'Patients', icon: 'people', description: 'Patient register and records' },
  { key: 'appointments', label: 'Appointments', icon: 'event', description: 'Scheduling and bookings' },
  { key: 'opd', label: 'OPD', icon: 'local_hospital', description: 'Outpatient department' },
  { key: 'ipd', label: 'IPD', icon: 'bed', description: 'Inpatient department (includes beds, wards, nursing)' },
  { key: 'services', label: 'Services', icon: 'medical_services', description: 'Billable services catalog' },
  { key: 'prescriptions', label: 'Prescriptions', icon: 'receipt_long', description: 'Prescription management' },
  { key: 'billing', label: 'Billing & Invoices', icon: 'receipt_long', description: 'Invoicing and payments' },
  { key: 'insurance', label: 'Insurance', icon: 'health_and_safety', description: 'Insurance and claims' },
  { key: 'pharmacy', label: 'Pharmacy', icon: 'local_pharmacy', description: 'Dispensing and stock' },
  { key: 'inventory', label: 'Inventory', icon: 'inventory_2', description: 'Stock management' },
  { key: 'doctors', label: 'Doctors', icon: 'stethoscope', description: 'Doctor management' },
  { key: 'staff', label: 'Staff', icon: 'badge', description: 'Staff management' },
  { key: 'departments', label: 'Departments', icon: 'apartment', description: 'Department management' },
  { key: 'laboratory', label: 'Laboratory', icon: 'science', description: 'Lab orders, results, and tests' },
  { key: 'radiology', label: 'Radiology', icon: 'medical_information', description: 'Radiology orders and reports' },
  { key: 'users', label: 'Users', icon: 'manage_accounts', description: 'User management' },
  { key: 'roles', label: 'Roles', icon: 'shield', description: 'Role and permission management' },
  { key: 'reports', label: 'Reports', icon: 'bar_chart', description: 'Standard reports and analytics' },
  { key: 'audit_logs', label: 'Audit Logs', icon: 'policy', description: 'Track who did what, when and where' },
  { key: 'settings', label: 'Settings', icon: 'settings', description: 'Organization settings and branding' },
  { key: 'form_designer', label: 'Form Designer', icon: 'edit_note', description: 'Custom form builder' },
];
