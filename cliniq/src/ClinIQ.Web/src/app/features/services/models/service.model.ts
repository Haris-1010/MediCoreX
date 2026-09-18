export interface ClinicalService {
  id: string;
  name: string;
  code: string;
  description?: string;
  categoryId?: string;
  categoryName?: string;
  departmentId?: string;
  departmentName?: string;
  price: number;
  cost?: number;
  minPrice?: number;
  maxPrice?: number;
  isTaxable: boolean;
  taxPercent: number;
  isCoveredByInsurance: boolean;
  insuranceCode?: string;
  durationMinutes?: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  type: number; // ServiceType: 1=General, 2=Laboratory, 3=Radiology
}

export interface ServiceCategoryModel {
  id: string;
  name: string;
  code?: string;
  description?: string;
  parentCategoryId?: string;
  parentCategoryName?: string;
  isActive: boolean;
  displayOrder: number;
  serviceCount: number;
  createdAt: string;
}

export enum ServiceType {
  General = 1,
  Laboratory = 2,
  Radiology = 3
}

export const SERVICE_TYPE_OPTIONS = [
  { value: ServiceType.General, label: 'General' },
  { value: ServiceType.Laboratory, label: 'Laboratory' },
  { value: ServiceType.Radiology, label: 'Radiology' }
];

export const SERVICE_CATEGORIES = [
  { value: 'Consultation', label: 'Consultation' },
  { value: 'Laboratory', label: 'Laboratory' },
  { value: 'Radiology', label: 'Radiology' },
  { value: 'Room', label: 'Room & Bed' },
  { value: 'Surgery', label: 'Surgery' },
  { value: 'Diagnostic', label: 'Diagnostic' },
];

export type ServiceCategory = typeof SERVICE_CATEGORIES[number]['value'];
