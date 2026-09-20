import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AdmissionPrintComponent } from '../../../features/ipd/print/admission-print/admission-print.component';
import { DischargePrintComponent } from '../../../features/ipd/print/discharge-print/discharge-print.component';
import { NursingPrintComponent } from '../../../features/ipd/print/nursing-print/nursing-print.component';

export interface PrintDialogData {
  componentType: 'admission' | 'discharge' | 'nursing';
  data: any;
  branding: any;
}

@Component({
  standalone: true,
  selector: 'app-print-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, AdmissionPrintComponent, DischargePrintComponent, NursingPrintComponent],
  template: `
    <div class="print-dialog" #printContent>
      <ng-container *ngIf="data.componentType === 'admission'">
        <app-admission-print [data]="data.data" [branding]="data.branding"></app-admission-print>
      </ng-container>
      <ng-container *ngIf="data.componentType === 'discharge'">
        <app-discharge-print [data]="data.data" [branding]="data.branding"></app-discharge-print>
      </ng-container>
      <ng-container *ngIf="data.componentType === 'nursing'">
        <app-nursing-print [data]="data.data" [branding]="data.branding"></app-nursing-print>
      </ng-container>
    </div>
    <div class="dialog-actions no-print" style="position: sticky; bottom: 0; background: var(--bg-card, #fff); padding: 16px; border-top: 1px solid var(--border-color, #e0e0e0); display: flex; justify-content: flex-end; gap: 8px;">
      <button mat-stroked-button (click)="onCancel()"><mat-icon>close</mat-icon> Cancel</button>
      <button mat-raised-button color="primary" (click)="onPrint()"><mat-icon>print</mat-icon> Print</button>
    </div>
  `,
  styles: [`
    .print-dialog { max-height: 80vh; overflow-y: auto; }
    @media print {
      .no-print { display: none !important; }
      .print-dialog { max-height: none; }
    }
  `]
})
export class PrintDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PrintDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PrintDialogData
  ) {}

  ngOnInit() {}

  onPrint() {
    setTimeout(() => {
      window.print();
      this.dialogRef.close(true);
    }, 300);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}