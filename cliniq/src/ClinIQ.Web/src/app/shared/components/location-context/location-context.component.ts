import { Component, effect, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TenantService } from '../../../core/services/tenant.service';
import { PermissionService } from '../../../core/services/permission.service';
import { StorageService } from '../../../core/services/storage.service';
import { environment } from '../../../../environments/environment';

/**
 * Global location (branch) context strip.
 *
 * Shown under the app chrome whenever the user can see more than one
 * location — makes it obvious whether numbers/lists are scoped to a single
 * site or the whole organization. UX only; the API enforces scope via
 * X-Branch-Id + JWT claims.
 */
@Component({
  standalone: false,
  selector: 'app-location-context',
  template: `
    <div class="location-context" *ngIf="visible" role="status" aria-live="polite">
      <mat-icon class="ctx-icon">{{ isAllLocations ? 'public' : 'location_on' }}</mat-icon>
      <span class="ctx-label">{{ label }}</span>
      <span class="ctx-hint">{{ hint }}</span>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .location-context {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.75rem;
      margin-bottom: 1rem;
      background: var(--bg-badge, #eef2ff);
      border: 1px solid var(--border-color, #e0e7ff);
      border-radius: 8px;
      font-size: 0.75rem;
      color: var(--text-secondary, #475569);
      min-height: 32px;
    }

    .ctx-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: var(--accent-primary, #667eea);
      flex-shrink: 0;
    }

    .ctx-label {
      font-weight: 600;
      color: var(--text-primary, #334155);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 240px;
    }

    .ctx-hint {
      color: var(--text-muted, #94a3b8);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @media (max-width: 768px) {
      .ctx-hint {
        display: none;
      }
    }
  `]
})
export class LocationContextComponent implements OnInit, OnDestroy {
  visible = false;
  isAllLocations = false;
  label = '';
  hint = '';

  private branchCount = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private tenantService: TenantService,
    private permissions: PermissionService,
    private storage: StorageService
  ) {
    effect(() => {
      // Track permission context (signal) so label/visibility update after /me.
      this.permissions.current();
      this.refresh();
    });
  }

  ngOnInit(): void {
    this.refresh();

    this.tenantService.currentBranch$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.refresh());

    this.tenantService.branches$
      .pipe(takeUntil(this.destroy$))
      .subscribe(branches => {
        this.branchCount = branches.length;
        this.refresh();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private refresh(): void {
    const stored = this.storage.getItem<string>(environment.branchKey);
    this.isAllLocations = stored === 'all';

    const ctx = this.permissions.current();
    const hasAll = !!(ctx?.hasAllLocationAccess || ctx?.isSuperAdmin);
    const accessible = ctx?.accessibleBranches?.length ?? 0;
    const branchCount = Math.max(accessible, this.branchCount);

    // Hide for single-location users — nothing to disambiguate.
    this.visible = branchCount > 1 || (hasAll && branchCount > 0);
    if (!this.visible) return;

    if (this.isAllLocations) {
      this.label = 'All Locations';
      this.hint = 'Showing organization-wide data';
      return;
    }

    const current = this.tenantService.getCurrentBranch();
    this.label = current?.name || ctx?.branchName || 'Current location';
    this.hint = 'Scoped to this location';
  }
}
