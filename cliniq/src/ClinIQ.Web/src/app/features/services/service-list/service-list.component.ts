import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { ClinicalService } from '../models/service.model';

@Component({
  standalone: false,
  selector: 'app-service-list',
  template: `
    <app-main-layout>
      <app-page-header title="Clinical Services" [breadcrumbs]="[{ label: 'Dashboard', route: '/dashboard' }, { label: 'Services' }]"></app-page-header>
      <div class="card">
        <div class="toolbar">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search services</mat-label>
            <input matInput [(ngModel)]="searchTerm" (keyup)="applyFilter()" placeholder="Search by name...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <button mat-raised-button color="primary" routerLink="add">
            <mat-icon>add</mat-icon> Add Service
          </button>
        </div>
        <table mat-table [dataSource]="filteredServices" matSort>
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th><td mat-cell *matCellDef="let s">{{ s.name }}</td></ng-container>
          <ng-container matColumnDef="category"><th mat-header-cell *matHeaderCellDef mat-sort-header>Category</th><td mat-cell *matCellDef="let s"><mat-chip>{{ getCategoryLabel(s.categoryName) }}</mat-chip></td></ng-container>
          <ng-container matColumnDef="price"><th mat-header-cell *matHeaderCellDef mat-sort-header>Price</th><td mat-cell *matCellDef="let s">{{ s.price | currencyFormat }}</td></ng-container>
          <ng-container matColumnDef="durationMinutes"><th mat-header-cell *matHeaderCellDef mat-sort-header>Duration</th><td mat-cell *matCellDef="let s">{{ s.durationMinutes }} min</td></ng-container>
          <ng-container matColumnDef="isActive"><th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th><td mat-cell *matCellDef="let s"><app-status-badge [status]="s.isActive ? 'Active' : 'Inactive'"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let s"><button mat-icon-button [routerLink]="['edit', s.id]" matTooltip="Edit"><mat-icon>edit</mat-icon></button><button mat-icon-button color="warn" (click)="deleteService(s)" matTooltip="Delete"><mat-icon>delete</mat-icon></button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
      </div>
    </app-main-layout>
  `,
  styles: [`.card { background: white; padding: 1.5rem; border-radius: 8px; } .toolbar { display: flex; gap: 1rem; margin-bottom: 1rem; align-items: center; } .search-field { flex: 1; } table { width: 100%; }`]
})
export class ServiceListComponent implements OnInit {
  services: ClinicalService[] = [];
  filteredServices: ClinicalService[] = [];
  searchTerm = '';
  columns = ['name', 'category', 'price', 'durationMinutes', 'isActive', 'actions'];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.api.get<any>('v1/services').subscribe(res => {
      this.services = res?.data ?? res ?? [];
      this.applyFilter();
    });
  }

  applyFilter() {
    this.filteredServices = this.services.filter(s =>
      !this.searchTerm || s.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  deleteService(service: ClinicalService) {
    if (confirm(`Delete service "${service.name}"?`)) {
      this.api.delete('v1/services', service.id).subscribe(() => this.loadServices());
    }
  }

  getCategoryLabel(name: string | null | undefined): string {
    return name || 'Uncategorized';
  }
}
