import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './token-list.component.html',
  styleUrl: './token-list.component.css'
})
export class TokenListComponent implements OnInit {
  tokens = signal<QueueToken[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  displayedColumns = ['tokenNumber', 'patientName', 'mrn', 'doctorName', 'status', 'joinedAt', 'actions'];

  constructor(
    private api: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTokens();
  }

  loadTokens(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.api
      .get<any>('v1/opd/current-queue')
      .pipe(takeUntilDestroyed())
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
