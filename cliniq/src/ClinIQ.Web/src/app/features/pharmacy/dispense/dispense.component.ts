import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: false,
  selector: 'app-dispense',
  template: `
    <app-main-layout>
      <app-page-header title="Dispense Medication" [breadcrumbs]="[{ label: 'Pharmacy', route: '/pharmacy' }, { label: 'Dispense' }]"></app-page-header>
      <div class="dispense-grid" *ngIf="prescription">
        <div class="card patient-info">
          <h3>Patient Information</h3>
          <div class="info-row"><span>Name:</span><strong>{{ prescription.patientName }}</strong></div>
          <div class="info-row"><span>MRN:</span><strong>{{ prescription.mrn }}</strong></div>
          <div class="info-row"><span>Doctor:</span><strong>Dr. {{ prescription.doctorName }}</strong></div>
          <div class="info-row"><span>Date:</span><strong>{{ prescription.date | date:'mediumDate' }}</strong></div>
        </div>
        <div class="card medications">
          <h3>Medications</h3>
          <table mat-table [dataSource]="prescription.items">
            <ng-container matColumnDef="medication"><th mat-header-cell *matHeaderCellDef>Medication</th><td mat-cell *matCellDef="let m">{{ m.medicationName }}</td></ng-container>
            <ng-container matColumnDef="dosage"><th mat-header-cell *matHeaderCellDef>Dosage</th><td mat-cell *matCellDef="let m">{{ m.dosage }}</td></ng-container>
            <ng-container matColumnDef="frequency"><th mat-header-cell *matHeaderCellDef>Frequency</th><td mat-cell *matCellDef="let m">{{ m.frequency }}</td></ng-container>
            <ng-container matColumnDef="quantity"><th mat-header-cell *matHeaderCellDef>Qty</th><td mat-cell *matCellDef="let m"><input matInput type="number" [(ngModel)]="m.dispenseQuantity" [max]="m.prescribedQuantity" class="qty-input"></td></ng-container>
            <ng-container matColumnDef="stock"><th mat-header-cell *matHeaderCellDef>Stock</th><td mat-cell *matCellDef="let m" [class.low]="m.stockQuantity < m.prescribedQuantity">{{ m.stockQuantity }}</td></ng-container>
            <ng-container matColumnDef="price"><th mat-header-cell *matHeaderCellDef>Price</th><td mat-cell *matCellDef="let m">{{ m.unitPrice * m.dispenseQuantity | currency }}</td></ng-container>
            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>
          <div class="totals"><span>Total:</span><strong>{{ calculateTotal() | currency }}</strong></div>
          <div class="form-actions">
            <button mat-stroked-button routerLink="/pharmacy">Cancel</button>
            <button mat-raised-button color="primary" (click)="dispense()" [disabled]="dispensing">{{ dispensing ? 'Processing...' : 'Dispense & Bill' }}</button>
          </div>
        </div>
      </div>
    </app-main-layout>
  `,
  styles: [`.dispense-grid { display: grid; grid-template-columns: 300px 1fr; gap: 1.5rem; }
    .card { background: white; padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; }
    .info-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee; } .info-row span { color: #666; }
    table { width: 100%; } .qty-input { width: 60px; text-align: center; } .low { color: #f44336; }
    .totals { display: flex; justify-content: flex-end; gap: 1rem; padding: 1rem; font-size: 1.25rem; }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }`]
})
export class DispenseComponent implements OnInit {
  prescription: any; dispensing = false;
  columns = ['medication', 'dosage', 'frequency', 'quantity', 'stock', 'price'];

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router, private notification: NotificationService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('prescriptionId');
    if (id) this.api.getById<any>('v1/pharmacy/prescriptions', id).subscribe(r => { this.prescription = r; r.items.forEach((i: any) => i.dispenseQuantity = i.prescribedQuantity); });
  }

  calculateTotal(): number { return this.prescription?.items.reduce((sum: number, i: any) => sum + (i.unitPrice * i.dispenseQuantity), 0) || 0; }

  dispense() {
    this.dispensing = true;
    const data = { prescriptionId: this.prescription.id, items: this.prescription.items.map((i: any) => ({ medicationId: i.medicationId, quantity: i.dispenseQuantity })) };
    this.api.post('v1/pharmacy/dispense', data).subscribe({
      next: () => { this.notification.success('Medications dispensed'); this.router.navigate(['/pharmacy']); },
      error: () => this.dispensing = false
    });
  }
}
