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
  { key: 'ipd', label: 'IPD', icon: 'bed', description: 'Inpatient department' },
  { key: 'beds', label: 'Beds', icon: 'hotel', description: 'Bed management' },
  { key: 'wards', label: 'Wards', icon: 'meeting_room', description: 'Ward management' },
  { key: 'rooms', label: 'Rooms', icon: 'door_front', description: 'Room management' },
  { key: 'emr', label: 'EMR', icon: 'folder_shared', description: 'Electronic medical records' },
  { key: 'prescriptions', label: 'Prescriptions', icon: ' prescription', description: 'Prescription management' },
  { key: 'billing', label: 'Billing', icon: 'receipt_long', description: 'Invoicing and payments' },
  { key: 'insurance', label: 'Insurance', icon: 'health_and_safety', description: 'Insurance and claims' },
  { key: 'pharmacy', label: 'Pharmacy', icon: 'local_pharmacy', description: 'Dispensing and stock' },
  { key: 'inventory', label: 'Inventory', icon: 'inventory_2', description: 'Stock management' },
  { key: 'procurement', label: 'Procurement', icon: 'shopping_cart', description: 'Purchase orders' },
  { key: 'doctors', label: 'Doctors', icon: 'medical_services', description: 'Doctor management' },
  { key: 'staff', label: 'Staff', icon: 'badge', description: 'Staff management' },
  { key: 'departments', label: 'Departments', icon: 'apartment', description: 'Department management' },
  { key: 'reports', label: 'Reports', icon: 'bar_chart', description: 'Standard reports' },
  { key: 'form_designer', label: 'Form Designer', icon: 'edit_note', description: 'Custom form builder' },
  { key: 'vital_forms', label: 'Vital Forms', icon: 'favorite', description: 'Vital signs forms' },
  { key: 'sms', label: 'SMS', icon: 'sms', description: 'SMS notifications' },
  { key: 'whatsapp', label: 'WhatsApp', icon: 'chat', description: 'WhatsApp notifications' },
  { key: 'telemedicine', label: 'Telemedicine', icon: 'videocam', description: 'Video consultations' },
  { key: 'attendance', label: 'Attendance', icon: 'how_to_reg', description: 'Staff attendance' },
  { key: 'integrations', label: 'Integrations', icon: 'hub', description: 'Third-party integrations' },
  { key: 'api', label: 'API Access', icon: 'api', description: 'API access for integrations' },
  { key: 'advanced_analytics', label: 'Advanced Analytics', icon: 'analytics', description: 'Advanced reporting and analytics' },
  { key: 'multi_branch', label: 'Multi-Branch', icon: 'domain', description: 'Multiple branch support' },
  { key: 'custom_roles', label: 'Custom Roles', icon: 'admin_panel_settings', description: 'Custom role definitions' },
  { key: 'audit_logs', label: 'Audit Logs', icon: 'history', description: 'System audit trail' },
];
