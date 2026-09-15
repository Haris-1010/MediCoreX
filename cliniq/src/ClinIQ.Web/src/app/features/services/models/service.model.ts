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

export const SERVICE_CATEGORIES = [
  { value: 'Consultation', label: 'Consultation' },
  { value: 'Laboratory', label: 'Laboratory' },
  { value: 'Radiology', label: 'Radiology' },
  { value: 'Room', label: 'Room & Bed' },
  { value: 'Surgery', label: 'Surgery' },
  { value: 'Diagnostic', label: 'Diagnostic' },
];

export type ServiceCategory = typeof SERVICE_CATEGORIES[number]['value'];
