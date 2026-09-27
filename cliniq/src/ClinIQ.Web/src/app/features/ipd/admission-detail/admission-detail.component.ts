import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TenantService, Tenant, Branding } from '../../../core/services/tenant.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  standalone: false,
  selector: 'app-admission-detail',
  template: `
    <app-main-layout>
      <app-page-header [title]="'Admission ' + (admission?.admissionNumber || '')" [breadcrumbs]="[{ label: 'IPD', route: '/ipd' }, { label: 'Admissions', route: '/ipd/admissions' }, { label: admission?.admissionNumber || '' }]">
        <button mat-stroked-button (click)="print()"><mat-icon>print</mat-icon> Print</button>
        <button mat-stroked-button color="primary" [routerLink]="['/prescriptions/new']" [queryParams]="{ admissionId: admission?.id, patientId: admission?.patientId }" *ngIf="admission?.status === 'Admitted'"><mat-icon>medication</mat-icon> Prescribe</button>
        <button mat-stroked-button color="warn" (click)="deleteAdmission()" *ngIf="admission?.status === 'Admitted'"><mat-icon>delete</mat-icon> Delete</button>
        <button mat-raised-button color="primary" [routerLink]="['/ipd/discharge', admission?.id]" *ngIf="admission?.status === 'Admitted'"><mat-icon>logout</mat-icon> Discharge</button>
      </app-page-header>

      <div class="profile-grid" *ngIf="admission">
        <!-- Patient Info -->
        <div class="card">
          <h3><mat-icon>person</mat-icon> Patient Information</h3>
          <div class="info-row"><span>Patient Name</span><strong>{{ admission.patientName }}</strong></div>
          <div class="info-row"><span>MRN</span><strong>{{ admission.mrn }}</strong></div>
        </div>

        <!-- Admission Info -->
        <div class="card">
          <h3><mat-icon>assignment_ind</mat-icon> Admission Details</h3>
          <div class="info-row"><span>Admission #</span><strong>{{ admission.admissionNumber }}</strong></div>
          <div class="info-row"><span>Status</span><app-status-badge [status]="admission.status"></app-status-badge></div>
          <div class="info-row"><span>Type</span><strong>{{ admission.type }}</strong></div>
          <div class="info-row"><span>Date</span><strong>{{ admission.admissionDate | date:'medium' }}</strong></div>
          <div class="info-row"><span>Days Admitted</span><strong>{{ admission.daysAdmitted }} days</strong></div>
          <div class="info-row" *ngIf="admission.dischargeDate"><span>Discharge Date</span><strong>{{ admission.dischargeDate | date:'medium' }}</strong></div>
        </div>

        <!-- Location -->
        <div class="card">
          <h3><mat-icon>hotel</mat-icon> Location</h3>
          <div class="info-row"><span>Ward</span><strong>{{ admission.wardName || '-' }}</strong></div>
          <div class="info-row"><span>Room</span><strong>{{ admission.roomNumber || '-' }}</strong></div>
          <div class="info-row"><span>Bed</span><strong>{{ admission.bedNumber || '-' }}</strong></div>
        </div>

        <!-- Doctor -->
        <div class="card">
          <h3><mat-icon>medical_services</mat-icon> Doctor</h3>
          <div class="info-row"><span>Attending Doctor</span><strong>Dr. {{ admission.doctorName }}</strong></div>
        </div>

        <!-- Clinical -->
        <div class="card full-width">
          <h3><mat-icon>description</mat-icon> Clinical Information</h3>
          <div class="info-row"><span>Admission Reason</span><strong>{{ admission.admissionReason || '-' }}</strong></div>
          <div class="info-row"><span>Provisional Diagnosis</span><strong>{{ admission.provisionalDiagnosis || '-' }}</strong></div>
          <div class="info-row" *ngIf="admission.finalDiagnosis"><span>Final Diagnosis</span><strong>{{ admission.finalDiagnosis }}</strong></div>
          <div class="info-row"><span>Notes</span><strong>{{ admission.notes || '-' }}</strong></div>
        </div>

        <!-- Discharge Info -->
        <div class="card full-width" *ngIf="admission.status === 'Discharged'">
          <h3><mat-icon>logout</mat-icon> Discharge Information</h3>
          <div class="info-row"><span>Discharge Summary</span><strong>{{ admission.dischargeSummary || '-' }}</strong></div>
          <div class="info-row"><span>Instructions</span><strong>{{ admission.dischargeInstructions || '-' }}</strong></div>
        </div>

        <!-- Bed Allocation History -->
        <div class="card full-width">
          <h3><mat-icon>history</mat-icon> Bed Allocation History</h3>
          <table mat-table [dataSource]="allocationHistory" class="full-width" *ngIf="allocationHistory.length > 0">
            <ng-container matColumnDef="bed"><th mat-header-cell *matHeaderCellDef>Bed</th><td mat-cell *matCellDef="let h">{{ h.bed }}</td></ng-container>
            <ng-container matColumnDef="ward"><th mat-header-cell *matHeaderCellDef>Ward</th><td mat-cell *matCellDef="let h">{{ h.ward }}</td></ng-container>
            <ng-container matColumnDef="allocatedAt"><th mat-header-cell *matHeaderCellDef>Allocated</th><td mat-cell *matCellDef="let h">{{ h.allocatedAt | date:'medium' }}</td></ng-container>
            <ng-container matColumnDef="releasedAt"><th mat-header-cell *matHeaderCellDef>Released</th><td mat-cell *matCellDef="let h">{{ h.releasedAt ? (h.releasedAt | date:'medium') : 'Current' }}</td></ng-container>
            <ng-container matColumnDef="duration"><th mat-header-cell *matHeaderCellDef>Duration</th><td mat-cell *matCellDef="let h">{{ h.duration }}</td></ng-container>
            <tr mat-header-row *matHeaderRowDef="historyColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: historyColumns;"></tr>
          </table>
          <p *ngIf="allocationHistory.length === 0" class="no-data">No allocation history.</p>
        </div>

        <!-- Billing -->
        <div class="card full-width">
          <h3><mat-icon>receipt_long</mat-icon> Billing</h3>

          <table mat-table [dataSource]="bedCharges" class="full-width" *ngIf="bedCharges.length > 0">
            <ng-container matColumnDef="bedNumber">
              <th mat-header-cell *matHeaderCellDef>Bed</th>
              <td mat-cell *matCellDef="let c">{{ c.bedNumber }}</td>
            </ng-container>
            <ng-container matColumnDef="wardName">
              <th mat-header-cell *matHeaderCellDef>Ward</th>
              <td mat-cell *matCellDef="let c">{{ c.wardName }}</td>
            </ng-container>
            <ng-container matColumnDef="fromDate">
              <th mat-header-cell *matHeaderCellDef>From</th>
              <td mat-cell *matCellDef="let c">{{ c.fromDate | date:'mediumDate' }}</td>
            </ng-container>
            <ng-container matColumnDef="toDate">
              <th mat-header-cell *matHeaderCellDef>To</th>
              <td mat-cell *matCellDef="let c">{{ c.toDate | date:'mediumDate' }}</td>
            </ng-container>
            <ng-container matColumnDef="days">
              <th mat-header-cell *matHeaderCellDef>Days</th>
              <td mat-cell *matCellDef="let c">{{ c.days }}</td>
            </ng-container>
            <ng-container matColumnDef="dailyRate">
              <th mat-header-cell *matHeaderCellDef>Rate/Day</th>
              <td mat-cell *matCellDef="let c">{{ c.dailyRate | currencyFormat }}</td>
            </ng-container>
            <ng-container matColumnDef="totalCharge">
              <th mat-header-cell *matHeaderCellDef>Total</th>
              <td mat-cell *matCellDef="let c">{{ c.totalCharge | currencyFormat }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="billingColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: billingColumns;"></tr>
          </table>
          <p *ngIf="bedCharges.length === 0" class="no-data">No bed charges yet.</p>

          <div class="billing-summary" *ngIf="bedCharges.length > 0">
            <div class="billing-summary-item">
              <div class="label">Total Bed Charges</div>
              <div class="value">{{ totalBedCharges | currencyFormat }}</div>
            </div>
            <div class="billing-summary-item">
              <div class="label">Deposit Deducted</div>
              <div class="value paid">{{ depositAmount | currencyFormat }}</div>
            </div>
            <div class="billing-summary-item" *ngIf="refundAmount > 0">
              <div class="label">Refund Due</div>
              <div class="value refund">{{ refundAmount | currencyFormat }}</div>
            </div>
            <div class="billing-summary-item" *ngIf="outstandingAmount > 0">
              <div class="label">Outstanding Amount</div>
              <div class="value outstanding">{{ outstandingAmount | currencyFormat }}</div>
            </div>
          </div>

          <div class="invoice-info" *ngIf="existingInvoice">
            <div><span class="label">Invoice Number:</span> <strong class="value">{{ existingInvoice.invoiceNumber }}</strong></div>
            <div><span class="label">Invoice Date:</span> <strong class="value">{{ existingInvoice.invoiceDate | date:'medium' }}</strong></div>
            <div><span class="label">Total Amount:</span> <strong class="value">{{ existingInvoice.totalAmount | currency }}</strong></div>
            <div><span class="label">Status:</span> <strong class="value">{{ existingInvoice.status }}</strong></div>
          </div>

          <div style="margin-top: 1rem;">
            <button mat-raised-button color="primary" (click)="generateBill()" [disabled]="generatingBill || existingInvoice" *ngIf="bedCharges.length > 0">
              <mat-icon>receipt</mat-icon>
              {{ generatingBill ? 'Generating...' : 'Generate Bill' }}
            </button>
          </div>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .profile-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
    .card { background: var(--bg-card, #fff); padding: 1.5rem; border-radius: 8px; }
    .card h3 { margin: 0 0 1rem; display: flex; align-items: center; gap: 0.5rem; font-size: 1rem; color: var(--text-primary, #333); }
    .card h3 mat-icon { font-size: 20px; width: 20px; height: 20px; color: var(--accent-primary, #3f51b5); }
    .full-width { grid-column: 1 / -1; }
    .info-row { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0; border-bottom: 1px solid var(--border-color, #f0f0f0); }
    .info-row:last-child { border-bottom: none; }
    .info-row span { color: var(--text-muted, #888); font-size: 0.85rem; }
    .info-row strong { color: var(--text-primary, #333); text-align: right; max-width: 60%; }
    .mono { font-family: monospace; font-size: 0.8rem; }
    .no-data { text-align: center; color: var(--text-muted, #aaa); padding: 1rem; }
    .full-width table { width: 100%; }
    .billing-summary { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem; padding-top: 1rem; border-top: 2px solid var(--border-color, #f0f0f0); }
    .billing-summary-item { text-align: center; padding: 0.75rem; background: var(--bg-hover, #f8f9fa); border-radius: 6px; }
    .billing-summary-item .label { font-size: 0.8rem; color: var(--text-muted, #888); margin-bottom: 0.25rem; }
    .billing-summary-item .value { font-size: 1.25rem; font-weight: 600; color: var(--text-primary, #333); }
    .billing-summary-item .value.outstanding { color: #f44336; }
    .billing-summary-item .value.paid { color: #4caf50; }
    .billing-summary-item .value.refund { color: #ff9800; }
    .invoice-info { background: #e8f5e9; padding: 1rem; border-radius: 6px; margin-top: 1rem; border-left: 4px solid #4caf50; }
    .invoice-info .label { font-size: 0.8rem; color: #2e7d32; }
    .invoice-info .value { font-weight: 600; color: #2e7d32; }
  `]
})
export class AdmissionDetailComponent implements OnInit {
  admission: any = null;
  allocationHistory: any[] = [];
  historyColumns = ['bed', 'ward', 'allocatedAt', 'releasedAt', 'duration'];
  branding: Branding | null = null;

  billingData: any = null;
  bedCharges: any[] = [];
  billingColumns = ['bedNumber', 'wardName', 'fromDate', 'toDate', 'days', 'dailyRate', 'totalCharge'];
  totalBedCharges: number = 0;
  depositAmount: number = 0;
  outstandingAmount: number = 0;
  refundAmount: number = 0;
  existingInvoice: any = null;
  invoiceItems: any[] = [];
  generatingBill: boolean = false;
  admissionId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private notification: NotificationService,
    private tenantService: TenantService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.admissionId = this.route.snapshot.paramMap.get('id') || '';
    if (this.admissionId) {
      this.api.getById<any>('v1/admissions', this.admissionId).subscribe(r => this.admission = r);
      this.api.get<any>(`v1/admissions/${this.admissionId}/allocation-history`).subscribe({
        next: (r) => { this.allocationHistory = Array.isArray(r) ? r : []; }
      });
      this.loadBillingData();
    }
    this.tenantService.loadBranding().subscribe(branding => this.branding = branding);
  }

  loadBillingData() {
    if (!this.admissionId) return;
    this.api.get<any>(`v1/admissions/${this.admissionId}/billing`).subscribe({
      next: (data) => {
        this.billingData = data;
        this.bedCharges = data.bedCharges || [];
        this.totalBedCharges = data.totalBedCharges || 0;
        this.depositAmount = data.depositAmount || 0;
        this.existingInvoice = data.existingInvoice || null;
        this.invoiceItems = data.invoiceItems || [];
        this.outstandingAmount = Math.max(0, this.totalBedCharges - this.depositAmount);
        this.refundAmount = Math.max(0, this.depositAmount - this.totalBedCharges);
        if (this.existingInvoice) {
          this.outstandingAmount = this.existingInvoice.outstandingAmount || 0;
          this.depositAmount = this.existingInvoice.paidAmount || this.depositAmount;
          this.refundAmount = Math.max(0, (this.existingInvoice.paidAmount || 0) - this.totalBedCharges);
        }
      },
      error: (err) => { console.error('Failed to load billing data', err); }
    });
  }

  generateBill() {
    if (!this.admissionId || this.generatingBill) return;
    this.generatingBill = true;
    this.api.post<any>(`v1/admissions/${this.admissionId}/generate-bill`, {}).subscribe({
      next: (result) => {
        this.generatingBill = false;
        this.notification.success(`Bill generated successfully! Invoice #${result.invoiceNumber}`);
        this.loadBillingData();
      },
      error: (err) => {
        this.generatingBill = false;
        this.notification.error('Failed to generate bill: ' + (err.message || 'Unknown error'));
      }
    });
  }

  print() {
    if (!this.admission) return;
    const url = this.admission.status === 'Discharged' 
      ? `/ipd/admissions/discharge-print/${this.admission.id}`
      : `/ipd/admissions/print/${this.admission.id}`;
    window.open(url, '_blank');
  }

  deleteAdmission() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Delete Admission', message: `Are you sure you want to delete admission ${this.admission.admissionNumber}? This action cannot be undone.`, confirmText: 'Delete', confirmColor: 'warn' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.delete('v1/admissions', this.admission.id).subscribe({
          next: () => { this.notification.success('Admission deleted'); this.router.navigate(['/ipd/admissions']); }
        });
      }
    });
  }
}