import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  standalone: false,
  selector: 'app-pharmacy-dashboard',
  template: `
    <app-main-layout>
      <app-page-header title="Pharmacy" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Pharmacy' }]"></app-page-header>
      <div class="stats-grid">
        <div class="stat-card"><mat-icon>receipt</mat-icon><div><h3>{{ stats.pendingPrescriptions }}</h3><p>Pending</p></div></div>
        <div class="stat-card"><mat-icon>check_circle</mat-icon><div><h3>{{ stats.dispensedToday }}</h3><p>Dispensed Today</p></div></div>
        <div class="stat-card"><mat-icon>attach_money</mat-icon><div><h3>{{ stats.todaySales | currency }}</h3><p>Today's Sales</p></div></div>
      </div>
      <div class="card">
        <h3>Pending Prescriptions</h3>
        <table mat-table [dataSource]="prescriptions">
          <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let p">{{ p.patientName }}</td></ng-container>
          <ng-container matColumnDef="doctor"><th mat-header-cell *matHeaderCellDef>Doctor</th><td mat-cell *matCellDef="let p">Dr. {{ p.doctorName }}</td></ng-container>
          <ng-container matColumnDef="items"><th mat-header-cell *matHeaderCellDef>Items</th><td mat-cell *matCellDef="let p">{{ p.itemCount }} items</td></ng-container>
          <ng-container matColumnDef="time"><th mat-header-cell *matHeaderCellDef>Time</th><td mat-cell *matCellDef="let p">{{ p.createdAt | date:'shortTime' }}</td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let p"><button mat-raised-button color="primary" [routerLink]="['dispense', p.id]">Dispense</button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
      </div>
    </app-main-layout>
  `,
  styles: [`.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { display: flex; align-items: center; gap: 1rem; background: white; padding: 1.5rem; border-radius: 8px; }
    .stat-card mat-icon { font-size: 40px; width: 40px; height: 40px; color: #3f51b5; } .stat-card h3 { margin: 0; font-size: 1.75rem; } .stat-card p { margin: 0; color: #666; }
    .card { background: white; padding: 1.5rem; border-radius: 8px; } .card h3 { margin: 0 0 1rem; } table { width: 100%; }`]
})
export class PharmacyDashboardComponent implements OnInit {
  stats = { pendingPrescriptions: 0, dispensedToday: 0, todaySales: 0 };
  prescriptions: any[] = [];
  columns = ['patient', 'doctor', 'items', 'time', 'actions'];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<any>('v1/pharmacy/stats').subscribe(r => this.stats = r);
    this.api.get<any[]>('v1/pharmacy/pending').subscribe(r => this.prescriptions = r);
  }
}
