import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  standalone: false,
  selector: 'app-bed-management',
  template: `
    <app-main-layout>
      <app-page-header title="Bed Management" [breadcrumbs]="[{ label: 'IPD', route: '/ipd' }, { label: 'Beds' }]"></app-page-header>
      <div class="ward-selector">
        <mat-button-toggle-group [(value)]="selectedWard" (change)="loadBeds()">
          <mat-button-toggle *ngFor="let w of wards" [value]="w.id">{{ w.name }}</mat-button-toggle>
        </mat-button-toggle-group>
      </div>
      <div class="bed-grid" *ngIf="selectedWard">
        <div class="bed" *ngFor="let b of beds" [ngClass]="'bed-' + b.status.toLowerCase()" (click)="selectBed(b)">
          <span class="bed-number">{{ b.bedNumber }}</span>
          <span class="bed-type">{{ b.bedType }}</span>
          <div class="patient-info" *ngIf="b.patientName"><mat-icon>person</mat-icon>{{ b.patientName }}</div>
        </div>
      </div>
      <div class="legend">
        <span class="legend-item"><span class="dot available"></span> Available</span>
        <span class="legend-item"><span class="dot occupied"></span> Occupied</span>
        <span class="legend-item"><span class="dot reserved"></span> Reserved</span>
        <span class="legend-item"><span class="dot maintenance"></span> Maintenance</span>
      </div>
    </app-main-layout>
  `,
  styles: [`.ward-selector { margin-bottom: 1.5rem; }
    .bed-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; }
    .bed { background: white; padding: 1rem; border-radius: 8px; text-align: center; cursor: pointer; border: 2px solid transparent; transition: all 0.2s; }
    .bed:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    .bed-available { border-color: #4caf50; } .bed-occupied { border-color: #f44336; background: #ffebee; }
    .bed-reserved { border-color: #ff9800; background: #fff3e0; } .bed-maintenance { border-color: #9e9e9e; background: #f5f5f5; }
    .bed-number { display: block; font-size: 1.5rem; font-weight: 700; } .bed-type { display: block; font-size: 0.75rem; color: #666; }
    .patient-info { display: flex; align-items: center; justify-content: center; gap: 0.25rem; margin-top: 0.5rem; font-size: 0.875rem; }
    .patient-info mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .legend { display: flex; gap: 1.5rem; margin-top: 1.5rem; padding: 1rem; background: white; border-radius: 8px; }
    .legend-item { display: flex; align-items: center; gap: 0.5rem; } .dot { width: 12px; height: 12px; border-radius: 50%; }
    .dot.available { background: #4caf50; } .dot.occupied { background: #f44336; } .dot.reserved { background: #ff9800; } .dot.maintenance { background: #9e9e9e; }`]
})
export class BedManagementComponent implements OnInit {
  wards: any[] = []; beds: any[] = []; selectedWard: string | null = null;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() { this.api.get<any[]>('v1/wards').subscribe(r => { this.wards = r; if (r.length) { this.selectedWard = r[0].id; this.loadBeds(); } }); }

  loadBeds() { if (this.selectedWard) this.api.get<any[]>(`v1/wards/${this.selectedWard}/beds`).subscribe(r => this.beds = r); }
  selectBed(bed: any) {
    if (bed.status === 'Available') {
      if (confirm(`Admit patient to bed ${bed.bedNumber}?`)) {
        this.router.navigate(['/ipd/admit'], { queryParams: { bedId: bed.id } });
      }
    } else if (bed.patientName) {
      alert(`Bed ${bed.bedNumber}\nType: ${bed.bedType}\nStatus: ${bed.status}\nPatient: ${bed.patientName}`);
    } else {
      alert(`Bed ${bed.bedNumber}\nType: ${bed.bedType}\nStatus: ${bed.status}`);
    }
  }
}
