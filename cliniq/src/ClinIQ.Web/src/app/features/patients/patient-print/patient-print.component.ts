import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../../core/services/api.service';
import { TenantService, Tenant } from '../../../core/services/tenant.service';
import { PrintBrandHeaderComponent } from '../../../shared/components/print-brand-header/print-brand-header.component';
import { SharedModule } from '../../../shared/shared.module';

interface PatientPrint {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: Date;
  age: number;
  gender: string;
  maritalStatus: string;
  occupation: string;
  nationality: string;
  nationalId: string;
  phone: string;
  alternatePhone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  status: string;
  createdAt: Date;
  lastVisit: Date;
}

@Component({
  standalone: true,
  selector: 'app-patient-print',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, PrintBrandHeaderComponent, SharedModule],
  templateUrl: './patient-print.component.html',
  styles: [`
    :host { display: block; background: white; color: #111; font-family: 'Segoe UI', Arial, sans-serif; }
    .print-sheet { max-width: 820px; margin: 0 auto; padding: 28px 36px; }

    .doc-title { text-align: right; margin-bottom: 24px; }
    .doc-title h1 { margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: .04em; color: #1a237e; }
    .doc-title p { margin: 2px 0 0; font-size: 11px; color: #64748b; }

    .ident { display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: center; margin-bottom: 20px; }
    .avatar { width: 74px; height: 74px; border-radius: 50%; background: #1a237e; color: #fff; display: grid; place-items: center; font-size: 26px; font-weight: 700; }
    .ident h2 { margin: 0 0 4px; font-size: 22px; }
    .chips { display: flex; gap: 8px; flex-wrap: wrap; font-size: 12px; }
    .chip { padding: 2px 10px; border-radius: 999px; background: #eef5f5; color: #164b4f; font-weight: 600; }
    .chip.blood { background: #fdecea; color: #b42318; }

    section { margin-bottom: 16px; }
    section h3 { font-size: 13px; text-transform: uppercase; letter-spacing: .06em; color: #1a237e; border-bottom: 1px solid #dce5e5; padding-bottom: 6px; margin: 0 0 10px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px 20px; }
    .field label { display: block; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: .04em; }
    .field span { font-size: 13px; font-weight: 600; }
    .list-field { grid-column: 1 / -1; }
    .tags { display: flex; gap: 6px; flex-wrap: wrap; }
    .tag { font-size: 12px; background: #f6f8f8; border: 1px solid #dce5e5; border-radius: 6px; padding: 2px 10px; }
    .tag.empty { color: #94a3b8; }

    .foot { margin-top: 26px; border-top: 1px solid #dce5e5; padding-top: 10px; display: flex; justify-content: space-between; font-size: 11px; color: #64748b; }

    .no-print { position: fixed; top: 14px; right: 14px; z-index: 10; display: flex; gap: 8px; }
    @media print {
      .no-print { display: none !important; }
      :host { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .print-sheet { max-width: none; padding: 0; }
    }
  `]
})
export class PatientPrintComponent implements OnInit {
  patient: PatientPrint | null = null;
  branding: Tenant | null = null;
  loading = true;
  issuedAt: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private tenantService: TenantService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.getById<PatientPrint>('v1/patients', id).subscribe({
        next: patient => {
          this.patient = patient;
          this.patient.allergies = this.toArray(patient.allergies);
          this.patient.chronicConditions = this.toArray(patient.chronicConditions);
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
    }
    this.tenantService.loadTenant().subscribe(tenant => this.branding = tenant);
  }

  private toArray(value: any): string[] {
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object') return Object.keys(value);
    return [];
  }

  getInitials(): string {
    if (!this.patient) return '';
    const name = (this.patient.fullName
      || `${this.patient.firstName || ''} ${this.patient.lastName || ''}`.trim()).trim();
    if (!name) return '';
    const parts = name.split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  formatDate(value: Date | string | null | undefined): string {
    if (!value) return '—';
    const d = new Date(value);
    return isNaN(d.getTime()) ? String(value) : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  print(): void {
    window.print();
  }
}