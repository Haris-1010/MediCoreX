import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PagedResult, QueryParams } from '../../core/services/api.service';

export interface AuditLogRow {
  id: string;
  timestamp: string;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  module: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  entityName: string | null;
  description: string | null;
  branchId: string | null;
  locationName: string | null;
  success: boolean | null;
  failureReason: string | null;
  ipAddress: string | null;
  requestPath: string | null;
  requestMethod: string | null;
  correlationId: string | null;
}

export interface AuditLogDetail extends AuditLogRow {
  tenantId: string | null;
  userAgent: string | null;
  notes: string | null;
  changes: { field: string; before: string | null; after: string | null }[];
}

export interface AuditFilterOptions {
  modules: string[];
  actions: string[];
  entities: string[];
  users: { id: string; name: string | null; email: string | null }[];
  locations: { id: string | null; name: string; isCurrent: boolean }[];
  canExport: boolean;
}

export interface AuditQuery {
  pageNumber?: number;
  pageSize?: number;
  dateFrom?: string | null;
  dateTo?: string | null;
  userId?: string | null;
  locationId?: string | null;
  allLocations?: boolean;
  module?: string | null;
  action?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  success?: boolean | null;
  searchTerm?: string | null;
  sortBy?: string | null;
  sortDescending?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuditLogsService {
  constructor(private api: ApiService) {}

  list(query: AuditQuery): Observable<PagedResult<AuditLogRow>> {
    return this.api.get<PagedResult<AuditLogRow>>('v1/auditlogs', query as QueryParams);
  }

  detail(id: string): Observable<AuditLogDetail> {
    return this.api.get<AuditLogDetail>(`v1/auditlogs/${id}`);
  }

  filterOptions(): Observable<AuditFilterOptions> {
    return this.api.get<AuditFilterOptions>('v1/auditlogs/filter-options');
  }

  exportCsv(query: AuditQuery): Observable<void> {
    const { pageNumber, pageSize, sortBy, sortDescending, ...rest } = query;
    return this.api.downloadFile('v1/auditlogs/export', rest as QueryParams, 'audit-logs.csv');
  }
}
