import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'app-search-input',
  template: `
    <mat-form-field [appearance]="appearance" class="search-field">
      <mat-label>{{ placeholder }}</mat-label>
      <input matInput [formControl]="searchControl" [attr.maxlength]="maxLength">
      <mat-icon matPrefix>search</mat-icon>
      <button mat-icon-button matSuffix *ngIf="searchControl.value" (click)="clear()">
        <mat-icon>close</mat-icon>
      </button>
    </mat-form-field>
  `,
  styles: [`
    .search-field {
      width: 100%;
      max-width: 300px;
    }
  `]
})
export class SearchInputComponent implements OnInit, OnDestroy {
  @Input() placeholder: string = 'Search...';
  @Input() debounceMs: number = 300;
  @Input() maxLength: number = 100;
  @Input() appearance: 'fill' | 'outline' = 'outline';
  @Input() initialValue: string = '';
  @Output() search = new EventEmitter<string>();

  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    if (this.initialValue) {
      this.searchControl.setValue(this.initialValue);
    }

    this.searchControl.valueChanges.pipe(
      debounceTime(this.debounceMs),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.search.emit(value || '');
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clear(): void {
    this.searchControl.setValue('');
  }
}
