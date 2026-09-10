import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

@Component({
  standalone: false,
  selector: 'app-date-range-picker',
  template: `
    <mat-form-field appearance="outline" class="date-range-field">
      <mat-label>{{ label }}</mat-label>
      <mat-date-range-input [formGroup]="range" [rangePicker]="picker">
        <input matStartDate formControlName="start" [placeholder]="startPlaceholder">
        <input matEndDate formControlName="end" [placeholder]="endPlaceholder">
      </mat-date-range-input>
      <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-date-range-picker #picker></mat-date-range-picker>
    </mat-form-field>
  `,
  styles: [`
    .date-range-field {
      width: 100%;
      max-width: 300px;
    }
  `]
})
export class DateRangePickerComponent {
  @Input() label: string = 'Date Range';
  @Input() startPlaceholder: string = 'Start date';
  @Input() endPlaceholder: string = 'End date';
  @Output() rangeChange = new EventEmitter<DateRange>();

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });

  ngOnInit(): void {
    this.range.valueChanges.subscribe(value => {
      if (value.start && value.end) {
        this.rangeChange.emit({
          start: value.start,
          end: value.end
        });
      }
    });
  }

  setValue(start: Date | null, end: Date | null): void {
    this.range.setValue({ start, end });
  }

  clear(): void {
    this.range.reset();
  }
}
