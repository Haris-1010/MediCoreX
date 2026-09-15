import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../../core/services/api.service';

interface PatientSearchResult {
  id: string;
  mrn: string;
  fullName: string;
  dateOfBirth: Date;
  phone: string;
}

@Component({
  standalone: false,
  selector: 'app-patient-search',
  template: `
    <mat-form-field appearance="outline" class="search-field">
      <mat-label>Search Patient</mat-label>
      <input matInput [formControl]="searchControl" [matAutocomplete]="auto" placeholder="Search by name, MRN, or phone">
      <mat-icon matPrefix>search</mat-icon>
      <mat-autocomplete #auto="matAutocomplete" (optionSelected)="onPatientSelected($event)">
        <mat-option *ngFor="let patient of searchResults" [value]="patient">
          <div class="patient-option">
            <span class="name">{{ patient.fullName }}</span>
            <span class="details">MRN: {{ patient.mrn }} | {{ patient.phone | phone }}</span>
          </div>
        </mat-option>
        <mat-option *ngIf="searchResults.length === 0 && searchControl.value" disabled>
          No patients found
        </mat-option>
      </mat-autocomplete>
    </mat-form-field>
  `,
  styles: [`
    .search-field { width: 100%; }
    .patient-option { display: flex; flex-direction: column; }
    .patient-option .name { font-weight: 500; }
    .patient-option .details { font-size: 0.75rem; color: #666; }
  `]
})
export class PatientSearchComponent implements OnInit, OnDestroy {
  @Output() patientSelected = new EventEmitter<PatientSearchResult>();

  searchControl = new FormControl('');
  searchResults: PatientSearchResult[] = [];
  private destroy$ = new Subject<void>();

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
      switchMap(term => {
        if (typeof term === 'string' && term.length >= 2) {
          return this.api.get<PatientSearchResult[]>('v1/patients/search', { term });
        }
        return [];
      })
    ).subscribe(results => this.searchResults = results);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPatientSelected(event: any): void {
    this.patientSelected.emit(event.option.value);
    this.searchControl.setValue('');
  }
}
