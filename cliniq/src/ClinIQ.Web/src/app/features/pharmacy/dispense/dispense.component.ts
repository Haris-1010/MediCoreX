import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TenantService } from '../../../core/services/tenant.service';

@Component({
  standalone: false,
  selector: 'app-dispense',
  template: `
    <app-main-layout>
      <app-page-header title="Dispense Medication" [breadcrumbs]="[{ label: 'Pharmacy', route: '/pharmacy' }, { label: 'Dispense' }]"></app-page-header>

      <div *ngIf="!prescription" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="prescription" class="dispense-page">
        <!-- Prescription Info Card -->
        <div class="section-card">
          <div class="section-header">
            <div class="section-icon"><mat-icon>receipt</mat-icon></div>
            <div>
              <h3 class="section-title">Prescription Info</h3>
              <span class="section-sub">{{ prescription.prescriptionNumber }}</span>
            </div>
            <span class="rx-status" [class.pending]="!prescription.isDispensed">
              {{ prescription.isDispensed ? 'Dispensed' : 'Pending' }}
            </span>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Patient</span>
              <span class="info-value">{{ prescription.patientName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Doctor</span>
              <span class="info-value">Dr. {{ prescription.doctorName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Date</span>
              <span class="info-value">{{ prescription.prescriptionDate | date:'mediumDate' }}</span>
            </div>
            <div class="info-item" *ngIf="prescription.diagnosis">
              <span class="info-label">Diagnosis</span>
              <span class="info-value">{{ prescription.diagnosis }}</span>
            </div>
          </div>
        </div>

        <!-- Medications Table -->
        <div class="section-card">
          <div class="section-header">
            <div class="section-icon"><mat-icon>medication</mat-icon></div>
            <div>
              <h3 class="section-title">Medications</h3>
              <span class="section-sub">{{ prescription.items?.length || 0 }} item(s)</span>
            </div>
          </div>

          <table mat-table [dataSource]="prescription.items" class="med-table">
            <ng-container matColumnDef="medication">
              <th mat-header-cell *matHeaderCellDef>Medication</th>
              <td mat-cell *matCellDef="let m">
                <div class="med-name">
                  <strong>{{ m.medicineName }}</strong>
                  <span class="med-detail" *ngIf="m.strength">{{ m.strength }}</span>
                  <span class="med-detail" *ngIf="m.form">{{ m.form }}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="dosage">
              <th mat-header-cell *matHeaderCellDef>Dosage</th>
              <td mat-cell *matCellDef="let m">{{ m.dosage || '-' }}</td>
            </ng-container>

            <ng-container matColumnDef="frequency">
              <th mat-header-cell *matHeaderCellDef>Frequency</th>
              <td mat-cell *matCellDef="let m">
                <span class="freq-badge">{{ formatFrequency(m.frequency) }}</span>
                <div class="timing-badges" *ngIf="m.morning || m.afternoon || m.evening || m.night">
                  <span class="t-badge" *ngIf="m.morning">M</span>
                  <span class="t-badge" *ngIf="m.afternoon">A</span>
                  <span class="t-badge" *ngIf="m.evening">E</span>
                  <span class="t-badge" *ngIf="m.night">N</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="quantity">
              <th mat-header-cell *matHeaderCellDef>Qty</th>
              <td mat-cell *matCellDef="let m">
                <mat-form-field appearance="outline" class="qty-field">
                  <input matInput type="number" [(ngModel)]="m.dispenseQuantity" [max]="m.quantity" min="1">
                </mat-form-field>
              </td>
            </ng-container>

            <ng-container matColumnDef="unitPrice">
              <th mat-header-cell *matHeaderCellDef>Unit Price</th>
              <td mat-cell *matCellDef="let m">
                <mat-form-field appearance="outline" class="price-field">
                  <input matInput type="number" [(ngModel)]="m.unitPrice" min="0" step="0.01">
                  <span matPrefix>&nbsp;{{ currencySymbol }}&nbsp;</span>
                </mat-form-field>
              </td>
            </ng-container>

            <ng-container matColumnDef="lineTotal">
              <th mat-header-cell *matHeaderCellDef>Total</th>
              <td mat-cell *matCellDef="let m" class="price-cell">
                {{ (m.unitPrice || 0) * (m.dispenseQuantity || 0) | currencyFormat }}
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>

          <!-- Grand Total -->
          <div class="grand-total">
            <span>Grand Total</span>
            <strong>{{ calculateTotal() | currencyFormat }}</strong>
          </div>
        </div>

        <!-- Actions -->
        <div class="action-bar">
          <button mat-stroked-button routerLink="/pharmacy">
            <mat-icon>arrow_back</mat-icon> Back to Pharmacy
          </button>
          <button mat-raised-button color="primary" (click)="dispense()" [disabled]="dispensing">
            <mat-icon *ngIf="!dispensing">check_circle</mat-icon>
            <mat-spinner *ngIf="dispensing" diameter="18"></mat-spinner>
            {{ dispensing ? 'Processing...' : 'Dispense & Generate Invoice' }}
          </button>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .loading-container { display: flex; justify-content: center; padding: 4rem; }

    .dispense-page {
      max-width: 900px;
      margin: 0 auto;
    }

    .section-card {
      background: var(--bg-card, #fff);
      padding: 1rem 1.25rem;
      border-radius: 10px;
      margin-bottom: 0.85rem;
      border: 1px solid var(--border-color, #e0e0e0);
      box-shadow: 0 1px 2px rgba(63, 81, 181, 0.06);
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 0.85rem;
    }

    .section-icon {
      width: 34px; height: 34px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      background: var(--bg-badge, #e8eaf6);
    }
    .section-icon mat-icon { color: var(--accent-primary, #3f51b5); font-size: 18px; width: 18px; height: 18px; }

    .section-title { margin: 0; font-size: 0.95rem; font-weight: 600; color: var(--text-primary, #1a237e); }
    .section-sub { font-size: 0.78rem; color: var(--text-muted, #7986cb); }

    .rx-status {
      margin-left: auto;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      background: var(--status-success-bg, #c8e6c9);
      color: var(--status-success, #2e7d32);
    }
    .rx-status.pending {
      background: var(--status-warning-bg, #fff3e0);
      color: var(--status-warning, #e65100);
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 0.75rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .info-label { font-size: 0.72rem; color: var(--text-muted, #7986cb); text-transform: uppercase; letter-spacing: 0.3px; }
    .info-value { font-size: 0.88rem; font-weight: 500; color: var(--text-primary, #333); }

    .med-table { width: 100%; }

    .med-name { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
    .med-name strong { color: var(--text-primary, #1a237e); }
    .med-detail { font-size: 0.78rem; color: var(--accent-secondary, #5c6bc0); background: var(--bg-badge, #e8eaf6); padding: 1px 6px; border-radius: 4px; }

    .freq-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.78rem;
      background: var(--status-info-bg, #e3f2fd);
      color: var(--status-info, #1565c0);
    }

    .timing-badges { display: flex; gap: 4px; margin-top: 4px; }
    .t-badge {
      width: 20px; height: 20px; border-radius: 50%;
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 0.65rem; font-weight: 700;
      background: var(--bg-badge, #e8eaf6); color: var(--accent-primary, #3f51b5);
    }

    .qty-field { width: 70px; }
    .price-field { width: 100px; }
    ::ng-deep .qty-field .mat-mdc-form-field-subscript-wrapper,
    ::ng-deep .price-field .mat-mdc-form-field-subscript-wrapper { display: none; }
    ::ng-deep .qty-field .mat-mdc-text-field-wrapper,
    ::ng-deep .price-field .mat-mdc-text-field-wrapper { padding: 0 8px; }

    .price-cell { font-weight: 600; color: var(--text-primary, #1a237e); }

    .grand-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: var(--bg-secondary, #f5f6ff);
      border-radius: 8px;
      margin-top: 0.75rem;
      font-size: 1.1rem;
    }
    .grand-total strong { color: var(--text-primary, #1a237e); }

    .action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
    }
  `]
})
export class DispenseComponent implements OnInit {
  prescription: any;
  dispensing = false;
  currencySymbol = '';
  columns = ['medication', 'dosage', 'frequency', 'quantity', 'unitPrice', 'lineTotal'];

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NotificationService,
    private tenantService: TenantService
  ) {
    this.currencySymbol = tenantService.getCurrencySymbol();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('prescriptionId');
    if (id) {
      this.api.getById<any>('v1/pharmacy/prescriptions', id).subscribe({
        next: (r) => {
          this.prescription = r;
          r.items.forEach((i: any) => {
            i.dispenseQuantity = i.quantity || 1;
            i.unitPrice = i.unitPrice || 0;
          });
        },
        error: () => {
          this.notification.error('Failed to load prescription');
          this.router.navigate(['/pharmacy']);
        }
      });
    }
  }

  formatFrequency(freq: string): string {
    const map: Record<string, string> = {
      OnceDaily: 'Once Daily',
      TwiceDaily: 'Twice Daily',
      ThriceDaily: 'Thrice Daily',
      FourTimesDaily: '4x Daily',
      EveryFourHours: 'Every 4h',
      EverySixHours: 'Every 6h',
      EveryEightHours: 'Every 8h',
      EveryTwelveHours: 'Every 12h',
      BeforeMeals: 'Before Meals',
      AfterMeals: 'After Meals',
      AtBedtime: 'At Bedtime',
      AsNeeded: 'As Needed',
      Weekly: 'Weekly',
      Custom: 'Custom'
    };
    return map[freq] || freq || '-';
  }

  calculateTotal(): number {
    return this.prescription?.items.reduce((sum: number, i: any) => sum + ((i.unitPrice || 0) * (i.dispenseQuantity || 0)), 0) || 0;
  }

  dispense() {
    if (!this.prescription?.items?.length) return;
    this.dispensing = true;
    const items = this.prescription.items.map((i: any) => ({
      prescriptionItemId: i.id,
      quantity: i.dispenseQuantity,
      unitPrice: i.unitPrice || 0
    }));
    this.api.post('v1/pharmacy/dispense', { prescriptionId: this.prescription.id, items }).subscribe({
      next: (res: any) => {
        const msg = res?.invoiceNumber
          ? `Dispensed! Invoice ${res.invoiceNumber} created.`
          : 'Medications dispensed successfully.';
        this.notification.success(msg);
        this.router.navigate(['/pharmacy']);
      },
      error: () => { this.dispensing = false; this.notification.error('Failed to dispense'); }
    });
  }
}
