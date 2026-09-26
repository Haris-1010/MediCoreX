import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { ApiService, QueryParams } from '../../core/services/api.service';

export interface ReportFilterDef {
  key: 'doctorId' | 'departmentId' | 'status' | 'gender' | 'search' | string;
  label: string;
  type: 'doctor' | 'department' | 'select' | 'text';
  options?: string[] | null;
}

export interface ReportDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  financial: boolean;
  audit: boolean;
  allLocationsOnly: boolean;
  usesDateRange: boolean;
  filters: ReportFilterDef[];
}

export interface ReportCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  reports: ReportDef[];
}

export interface ReportCatalog {
  categories: ReportCategory[];
  canExport: boolean;
}

export interface LocationOption {
  id: string | null;
  name: string;
  isCurrent: boolean;
}

export interface ReportContext {
  currentLocation: { id: string | null; name: string };
  canSeeAllLocations: boolean;
  locations: LocationOption[];
  departments: { id: string; name: string; locationId: string | null }[];
  doctors: { id: string; name: string }[];
}

export interface SummaryValue {
  key: string;
  label: string;
  value: number | string | null;
  format: 'number' | 'currency' | 'percent' | 'days' | 'hours' | string;
  tone?: 'primary' | 'success' | 'warning' | 'danger' | null;
}

export interface SeriesData {
  name: string;
  kind: 'trend' | 'breakdown';
  format: string;
  points: { label: string; value: number }[];
}

export interface ReportColumn {
  key: string;
  label: string;
  type: 'text' | 'number' | 'currency' | 'percent' | 'date' | 'datetime' | 'status' | string;
  sortable: boolean;
}

export interface ReportData {
  reportKey: string;
  reportName: string;
  locationScope: { locationId: string | null; name: string };
  period: { start: string; end: string };
  summary: SummaryValue[];
  series: SeriesData[];
  columns: ReportColumn[];
  rows: Record<string, any>[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  sortBy: string | null;
  sortDescending: boolean;
  generatedAt: string;
}

export interface ReportQuery {
  startDate?: string;
  endDate?: string;
  locationId?: string | null;
  allLocations?: boolean;
  pageNumber?: number;
  pageSize?: number;
  doctorId?: string | null;
  departmentId?: string | null;
  status?: string | null;
  gender?: string | null;
  search?: string | null;
  sortBy?: string | null;
  sortDescending?: boolean;
}

/** Visual identity per report category (hub + viewer accents). */
export const CATEGORY_ACCENTS: Record<string, string> = {
  management: '#6366f1',
  patients: '#0ea5a4',
  clinical: '#e11d74',
  doctors: '#d97706',
  finance: '#059669',
  inventory: '#0284c7',
  administration: '#64748b',
};

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private catalog$?: Observable<ReportCatalog>;
  private context$?: Observable<ReportContext>;

  constructor(private api: ApiService) {}

  /** Cached per session; the catalog only changes with permissions. */
  catalog(refresh = false): Observable<ReportCatalog> {
    if (refresh || !this.catalog$) {
      this.catalog$ = this.api.get<ReportCatalog>('v1/reports').pipe(shareReplay({ bufferSize: 1, refCount: false }));
    }
    return this.catalog$;
  }

  context(refresh = false): Observable<ReportContext> {
    if (refresh || !this.context$) {
      this.context$ = this.api.get<ReportContext>('v1/reports/context').pipe(shareReplay({ bufferSize: 1, refCount: false }));
    }
    return this.context$;
  }

  report(reportId: string, query: ReportQuery): Observable<ReportData> {
    return this.api.get<ReportData>(`v1/reports/${encodeURIComponent(reportId)}`, query as QueryParams);
  }

  exportCsv(reportId: string, query: ReportQuery): Observable<void> {
    const { pageNumber, pageSize, ...rest } = query;
    return this.api.downloadFile(`v1/reports/${encodeURIComponent(reportId)}/export`, rest as QueryParams, `${reportId}.csv`);
  }

  /** Drop the caches after a location switch or re-login. */
  reset(): void {
    this.catalog$ = undefined;
    this.context$ = undefined;
  }
}
