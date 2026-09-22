import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

export interface QueueToken {
  id: string;
  tokenNumber: number;
  patientName: string;
  mrn: string;
  doctorName: string;
  status: string;
  queueDate: string;
  joinedAt?: string | null;
  calledAt?: string | null;
  consultationFee?: number;
  totalAmount?: number;
  paymentMethod?: string;
  invoiceNumber?: string;
  priority?: number;
  services?: { itemName: string; amount: number; quantity: number }[];
}

@Component({
  selector: 'app-token-list',
  standalone: false,
  template: `
    <app-main-layout>
      <app-page-header title="Token List" [breadcrumbs]="[{ label: 'OPD', route: '/opd' }, { label: 'Tokens' }]">
        <button mat-raised-button color="primary" routerLink="/opd/token"><mat-icon>add_circle</mat-icon> New Token</button>
      </app-page-header>

      <div class="token-list-container">
        @if (loading()) {
          <div class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
            <p class="loading-text">Loading tokens...</p>
          </div>
        }

        @if (!loading() && errorMessage()) {
          <div class="error-container">
            <mat-icon class="error-icon">error_outline</mat-icon>
            <p>{{ errorMessage() }}</p>
            <button mat-raised-button color="primary" (click)="loadTokens()">Retry</button>
          </div>
        }

        @if (!loading() && tokens().length === 0 && !errorMessage()) {
          <div class="empty-container">
            <mat-icon class="empty-icon">confirmation_number</mat-icon>
            <p>No tokens found for today.</p>
            <p class="empty-sub">Tokens will appear here as they are generated.</p>
          </div>
        }

        @if (!loading() && tokens().length > 0) {
          <div class="table-wrapper">
            <table mat-table [dataSource]="tokens()">
              <ng-container matColumnDef="tokenNumber">
                <th mat-header-cell *matHeaderCellDef>Token #</th>
                <td mat-cell *matCellDef="let token" class="token-number-cell">{{ token.tokenNumber }}</td>
              </ng-container>

              <ng-container matColumnDef="patientName">
                <th mat-header-cell *matHeaderCellDef>Patient</th>
                <td mat-cell *matCellDef="let token">{{ token.patientName }}</td>
              </ng-container>

              <ng-container matColumnDef="mrn">
                <th mat-header-cell *matHeaderCellDef>MRN</th>
                <td mat-cell *matCellDef="let token">{{ token.mrn || '—' }}</td>
              </ng-container>

              <ng-container matColumnDef="doctorName">
                <th mat-header-cell *matHeaderCellDef>Doctor</th>
                <td mat-cell *matCellDef="let token">{{ token.doctorName }}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let token">
                  <span class="status-badge" [ngClass]="getStatusClass(token.status)">{{ token.status }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="joinedAt">
                <th mat-header-cell *matHeaderCellDef>Joined At</th>
                <td mat-cell *matCellDef="let token">
                  @if (token.joinedAt) {
                    <span>{{ token.joinedAt | date:'short' }}</span>
                  } @else {
                    <span>—</span>
                  }
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let token">
                  <button mat-icon-button matTooltip="Print" (click)="printToken(token)">
                    <mat-icon>print</mat-icon>
                  </button>
                  <button mat-icon-button matTooltip="Call" (click)="callPatient(token)">
                    <mat-icon>phone</mat-icon>
                  </button>
                  <button mat-icon-button matTooltip="Complete" (click)="completeConsultation(token)">
                    <mat-icon>check_circle</mat-icon>
                  </button>
                  @if (!isCompleted(token)) {
                    <button mat-icon-button matTooltip="Edit" (click)="editToken(token)">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" matTooltip="Remove" (click)="deleteToken(token)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  }
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <div class="summary-section">
            <div class="summary-item">
              <span class="summary-label">Total Tokens:</span>
              <span class="summary-value">{{ tokens().length }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label waiting">Waiting:</span>
              <span class="summary-value">{{ getWaitingCount() }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label consultation">In Consultation:</span>
              <span class="summary-value">{{ getInConsultationCount() }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label completed">Completed:</span>
              <span class="summary-value">{{ getCompletedCount() }}</span>
            </div>
          </div>
        }
      </div>
    </app-main-layout>
  `,
  styles: [`
    .token-list-container { padding: 1.5rem; }
    .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; gap: 1rem; }
    .loading-text { color: var(--text-muted); font-size: 0.9rem; }
    .error-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; gap: 1rem; }
    .error-icon { font-size: 48px; width: 48px; height: 48px; color: var(--danger); }
    .empty-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; gap: 0.5rem; }
    .empty-icon { font-size: 64px; width: 64px; height: 64px; color: var(--text-muted); opacity: 0.5; }
    .empty-sub { color: var(--text-muted); font-size: 0.85rem; }
    .table-wrapper { overflow-x: auto; border-radius: 8px; border: 1px solid var(--border-color); }
    .token-number-cell { font-weight: 600; color: var(--accent-primary); }
    .status-badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; white-space: nowrap; }
    .status-waiting { background: var(--badge-warning-bg); color: var(--badge-warning-text); }
    .status-called { background: var(--badge-info-bg); color: var(--badge-info-text); }
    .status-in-consultation { background: var(--badge-success-bg); color: var(--badge-success-text); }
    .status-completed { background: var(--bg-badge); color: var(--text-muted); }
    .status-cancelled { background: var(--badge-danger-bg); color: var(--badge-danger-text); }
    .summary-section { display: flex; gap: 2rem; margin-top: 1.5rem; padding: 1rem 1.5rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; }
    .summary-item { display: flex; align-items: center; gap: 0.5rem; }
    .summary-label { font-size: 0.85rem; color: var(--text-secondary); font-weight: 500; }
    .summary-label.waiting { color: var(--warning); }
    .summary-label.consultation { color: var(--success); }
    .summary-label.completed { color: var(--text-muted); }
    .summary-value { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); }
    @media (max-width: 768px) { .summary-section { flex-direction: column; gap: 0.75rem; } }
  `]
})
export class TokenListComponent implements OnInit, OnDestroy {
  tokens = signal<QueueToken[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  displayedColumns = ['tokenNumber', 'patientName', 'mrn', 'doctorName', 'status', 'joinedAt', 'actions'];

  private destroy$ = new Subject<void>();

  constructor(
    private api: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTokens();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTokens(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.api
      .get<any>('v1/opd/current-queue')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          const list = Array.isArray(res) ? res : (res?.data || res?.result || []);
          this.tokens.set(
            list.map((t: any) => ({
              id: t.id?.toString() || '',
              tokenNumber: t.tokenNumber || 0,
              patientName: t.patientName || 'Unknown',
              mrn: t.patientMRN || t.mrn || '',
              doctorName: t.doctorName || 'Unknown',
              status: t.status || 'Waiting',
              queueDate: t.queueDate || new Date().toLocaleDateString(),
              joinedAt: t.joinedAt,
              calledAt: t.calledAt,
              consultationFee: t.consultationFee,
              totalAmount: t.totalAmount,
              paymentMethod: t.paymentMethod,
              invoiceNumber: t.invoiceNumber,
              priority: t.priority,
              services: t.services || [],
            })) || []
          );
          this.loading.set(false);
        },
        error: (err: any) => {
          console.error('Failed to load tokens:', err);
          this.errorMessage.set('Failed to load tokens. Please try again.');
          this.loading.set(false);
        },
      });
  }

  getStatusClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (s.includes('called')) return 'status-called';
    if (s.includes('in consultation') || s.includes('in-consultation')) return 'status-in-consultation';
    if (s.includes('completed')) return 'status-completed';
    if (s.includes('waiting')) return 'status-waiting';
    if (s.includes('cancelled')) return 'status-cancelled';
    return '';
  }

  isCompleted(token: QueueToken): boolean {
    return (token.status || '').toLowerCase().includes('completed');
  }

  getWaitingCount(): number {
    return this.tokens().filter(t => t.status.toLowerCase().includes('waiting')).length;
  }

  getInConsultationCount(): number {
    return this.tokens().filter(t => t.status.toLowerCase().includes('in consultation') || t.status.toLowerCase().includes('in-consultation')).length;
  }

  getCompletedCount(): number {
    return this.tokens().filter(t => t.status.toLowerCase().includes('completed')).length;
  }

  private escapeHtml(value: unknown): string {
    return String(value ?? '').replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[ch] as string));
  }

  printToken(token: QueueToken): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printedAt = token.joinedAt ? new Date(token.joinedAt).toLocaleString() : new Date().toLocaleString();
    const statusClass = this.getStatusClass(token.status);

    const services = token.services || [];
    const servicesHtml = services.length > 0
      ? `<div class="detail-row" style="flex-direction:column;gap:4px;"><span style="font-weight:600;">Services:</span>${services.map((s: any) => `<span style="padding-left:12px;">${this.escapeHtml(s.itemName)} × ${s.quantity || 1} — Rs. ${s.amount}</span>`).join('')}</div>`
      : '';

    printWindow.document.write(`
      <html>
      <head>
        <title>Token Receipt - Token #${token.tokenNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .receipt { max-width: 300px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
          .token-number { font-size: 24px; font-weight: bold; color: #2563eb; margin: 10px 0; }
          .patient-info { margin: 15px 0; }
          .doctor-info { margin: 15px 0; font-size: 14px; color: #666; }
          .details { margin: 15px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 5px 0; }
          .status { padding: 5px 10px; border-radius: 4px; color: white; font-size: 12px; margin-top: 10px; }
          .status-waiting { background: #f59e0b; }
          .status-called { background: #3b82f6; }
          .status-in-consultation { background: #10b981; }
          .status-completed { background: #6b7280; }
          .status-cancelled { background: #ef4444; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h3>MediCoreX - Token Receipt</h3>
            <div class="token-number">Token #${token.tokenNumber}</div>
          </div>
          <div class="patient-info">
            <strong>Patient:</strong> ${this.escapeHtml(token.patientName)}<br>
            <strong>MRN:</strong> ${this.escapeHtml(token.mrn)}
          </div>
          <div class="doctor-info">
            <strong>Doctor:</strong> ${this.escapeHtml(token.doctorName)}
          </div>
          <div class="details">
            <div class="detail-row">
              <span>Queue Date:</span><span>${this.escapeHtml(token.queueDate)}</span>
            </div>
            <div class="detail-row">
              <span>Joined At:</span><span>${this.escapeHtml(printedAt)}</span>
            </div>
            <div class="detail-row">
              <span>Status:</span><span class="status ${statusClass}">${this.escapeHtml(token.status)}</span>
            </div>
            ${servicesHtml}
          </div>
          <div class="footer" style="margin-top: 20px; font-size: 12px; color: #666; text-align: center;">
            Generated by MediCoreX Hospital Management System
          </div>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  }

  callPatient(token: QueueToken): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Call Patient',
        message: `Call token #${token.tokenNumber} for ${token.patientName}?`,
        confirmText: 'Call Patient',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.api.post<any>(`v1/opd/queue/${token.id}/call`, {}).subscribe({
        next: () => this.loadTokens(),
        error: (err: any) => console.error('Failed to call patient:', err)
      });
    });
  }

  completeConsultation(token: QueueToken): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Complete Consultation',
        message: `Mark token #${token.tokenNumber} as completed?`,
        confirmText: 'Yes, Complete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.api.post<any>(`v1/opd/queue/${token.id}/complete`, {}).subscribe({
        next: () => {
          this.loadTokens();
        },
        error: (err: any) => {
          console.error('Failed to complete consultation:', err);
        }
      });
    });
  }

  editToken(token: QueueToken): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Edit Token',
        message: `Editing token #${token.tokenNumber} is not available in this view yet.`,
        confirmText: 'OK',
        cancelText: 'Close'
      }
    });
  }

  deleteToken(token: QueueToken): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Remove from Queue',
        message: `Remove token #${token.tokenNumber} from the queue permanently?`,
        confirmText: 'Yes, Remove',
        cancelText: 'Cancel',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.api.delete<any>('v1/opd/queue', token.id).subscribe({
        next: () => {
          this.loadTokens();
        },
        error: (err: any) => {
          console.error('Failed to remove token:', err);
        }
      });
    });
  }
}
