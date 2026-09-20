import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ApiService, PagedResult } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: Date;
  age: number | null;
  gender: string;
  phone: string;
  email: string;
  bloodGroup: string;
  lastVisit: Date;
  status: string;
}

@Component({
  standalone: false,
  selector: 'app-patient-list',
  template: `
    <app-main-layout>
      <app-page-header
        title="Patients"
        subtitle="Manage patient records"
        [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Patients' }]">
        <button mat-raised-button color="primary" routerLink="new" *appHasPermission="'Patients.Create'">
          <mat-icon>add</mat-icon>
          New Patient
        </button>
      </app-page-header>

      <div class="card">
        <div class="filters">
          <app-search-input
            placeholder="Search patients..."
            (search)="onSearch($event)">
          </app-search-input>

          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select [(value)]="filterStatus" (selectionChange)="loadPatients()">
              <mat-option value="">All</mat-option>
              <mat-option value="Active">Active</mat-option>
              <mat-option value="Inactive">Inactive</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Gender</mat-label>
            <mat-select [(value)]="filterGender" (selectionChange)="loadPatients()">
              <mat-option value="">All</mat-option>
              <mat-option value="Male">Male</mat-option>
              <mat-option value="Female">Female</mat-option>
              <mat-option value="Other">Other</mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-stroked-button (click)="clearFilters()" *ngIf="hasActiveFilters()">
            <mat-icon>filter_list_off</mat-icon> Clear Filters
          </button>
        </div>

        <table mat-table [dataSource]="patients" matSort (matSortChange)="onSort($event)">
          <ng-container matColumnDef="mrn">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>MRN</th>
            <td mat-cell *matCellDef="let patient">{{ patient.mrn }}</td>
          </ng-container>

          <ng-container matColumnDef="fullName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
            <td mat-cell *matCellDef="let patient">
              <div class="patient-name">
                <span class="name">{{ patient.fullName }}</span>
                <span class="email">{{ patient.email }}</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="dateOfBirth">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Date of Birth</th>
            <td mat-cell *matCellDef="let patient">{{ patient.dateOfBirth | date:'mediumDate' }}</td>
          </ng-container>

          <ng-container matColumnDef="age">
            <th mat-header-cell *matHeaderCellDef>Age</th>
            <td mat-cell *matCellDef="let patient">{{ patient.age != null ? patient.age + ' yrs' : '—' }}</td>
          </ng-container>

          <ng-container matColumnDef="gender">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Gender</th>
            <td mat-cell *matCellDef="let patient">{{ patient.gender }}</td>
          </ng-container>

          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef>Phone</th>
            <td mat-cell *matCellDef="let patient">{{ patient.phone | phone }}</td>
          </ng-container>

          <ng-container matColumnDef="bloodGroup">
            <th mat-header-cell *matHeaderCellDef>Blood Group</th>
            <td mat-cell *matCellDef="let patient">
              <span class="blood-group">{{ patient.bloodGroup }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="lastVisit">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Last Visit</th>
            <td mat-cell *matCellDef="let patient">
              {{ patient.lastVisit ? (patient.lastVisit | date:'mediumDate') : 'Never' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let patient">
              <app-status-badge [status]="patient.status"></app-status-badge>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let patient" (click)="$event.stopPropagation()">
              <button mat-icon-button [matMenuTriggerFor]="actionMenu" [matMenuTriggerData]="{patient: patient}">
                <mat-icon>more_vert</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"
              class="patient-row"
              (click)="viewPatient(row)"></tr>

          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell no-data" [attr.colspan]="displayedColumns.length">
              <app-empty-state
                icon="people"
                title="No patients found"
                message="Try adjusting your search or filters"
                actionText="Add Patient"
                actionIcon="add"
                (action)="router.navigate(['/patients/new'])">
              </app-empty-state>
            </td>
          </tr>
        </table>

        <mat-menu #actionMenu="matMenu">
          <ng-template matMenuContent let-patient="patient">
            <button mat-menu-item (click)="viewPatient(patient)">
              <mat-icon>visibility</mat-icon>
              <span>View Details</span>
            </button>
            <button mat-menu-item [routerLink]="[patient.id, 'edit']" *appHasPermission="'Patients.Edit'">
              <mat-icon>edit</mat-icon>
              <span>Edit</span>
            </button>
            <button mat-menu-item (click)="printPatient(patient)" *appHasPermission="'Patients.View'">
              <mat-icon>print</mat-icon>
              <span>Print</span>
            </button>
            <button mat-menu-item (click)="bookAppointment(patient)" *appHasPermission="'Appointments.Create'">
              <mat-icon>event</mat-icon>
              <span>Book Appointment</span>
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="deletePatient(patient)" class="delete-action" *appHasPermission="'Patients.Delete'">
              <mat-icon color="warn">delete</mat-icon>
              <span>Delete</span>
            </button>
          </ng-template>
        </mat-menu>

        <mat-paginator
          [length]="totalCount"
          [pageSize]="pageSize"
          [pageIndex]="pageIndex"
          [pageSizeOptions]="[10, 25, 50, 100]"
          (page)="onPageChange($event)"
          showFirstLastButtons>
        </mat-paginator>
      </div>
    </app-main-layout>
  `,
  styles: [`
    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .filters mat-form-field {
      width: 150px;
    }

    table {
      width: 100%;
    }

    .patient-row {
      cursor: pointer;
    }

    .patient-row:hover {
      background: var(--bg-hover, #f5f5f5);
    }

    .patient-name {
      display: flex;
      flex-direction: column;
    }

    .patient-name .name {
      font-weight: 500;
    }

    .patient-name .email {
      font-size: 0.75rem;
      color: var(--text-secondary, #666);
    }

    .blood-group {
      background: #ffebee;
      color: #c62828;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .no-data {
      text-align: center;
      padding: 2rem;
    }

    .delete-action {
      color: #f44336;
    }
  `]
})
export class PatientListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  patients: Patient[] = [];
  displayedColumns = ['mrn', 'fullName', 'dateOfBirth', 'age', 'gender', 'phone', 'bloodGroup', 'lastVisit', 'status', 'actions'];

  totalCount = 0;
  pageSize = 10;
  pageIndex = 0;
  searchTerm = '';
  sortBy = 'fullName';
  sortDescending = false;
  filterStatus = '';
  filterGender = '';

  loading = false;

  constructor(
    public router: Router,
    private api: ApiService,
    private dialog: MatDialog,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;

    this.api.get<PagedResult<Patient>>('v1/patients', {
      pageNumber: this.pageIndex + 1,
      pageSize: this.pageSize,
      searchTerm: this.searchTerm,
      sortBy: this.sortBy,
      sortDescending: this.sortDescending,
      status: this.filterStatus,
      gender: this.filterGender
    }).subscribe({
      next: (result) => {
        this.patients = result.items;
        this.totalCount = result.totalCount;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.pageIndex = 0;
    this.loadPatients();
  }

  onSort(sort: Sort): void {
    this.sortBy = sort.active;
    this.sortDescending = sort.direction === 'desc';
    this.loadPatients();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPatients();
  }

  viewPatient(patient: Patient): void {
    this.router.navigate(['/patients', patient.id]);
  }

  printPatient(patient: Patient): void {
    window.open(`/patients/${patient.id}/print`, '_blank');
  }

  bookAppointment(patient: Patient): void {
    this.router.navigate(['/appointments/new'], {
      queryParams: { patientId: patient.id }
    });
  }

  deletePatient(patient: Patient): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Patient',
        message: `Are you sure you want to delete ${patient.fullName}? This action cannot be undone.`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.api.delete('v1/patients', patient.id).subscribe({
          next: () => {
            this.notification.success('Patient deleted successfully');
            this.loadPatients();
          }
        });
      }
    });
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.filterStatus || this.filterGender);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterStatus = '';
    this.filterGender = '';
    this.pageIndex = 0;
    this.loadPatients();
  }
}