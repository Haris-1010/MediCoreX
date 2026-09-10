import { Component, Input, Output, EventEmitter, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'date' | 'currency' | 'status' | 'actions';
  width?: string;
}

export interface TableAction {
  icon: string;
  label: string;
  action: string;
  color?: string;
  permission?: string;
}

@Component({
  standalone: false,
  selector: 'app-data-table',
  template: `
    <div class="table-container">
      <div class="table-loading" *ngIf="loading">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <table mat-table [dataSource]="dataSource" matSort (matSortChange)="onSort($event)">
        <ng-container *ngFor="let column of columns" [matColumnDef]="column.key">
          <th mat-header-cell *matHeaderCellDef [mat-sort-header]="column.sortable !== false ? column.key : ''"
              [style.width]="column.width">
            {{ column.label }}
          </th>
          <td mat-cell *matCellDef="let row">
            <ng-container [ngSwitch]="column.type">
              <ng-container *ngSwitchCase="'date'">
                {{ row[column.key] | date:'mediumDate' }}
              </ng-container>
              <ng-container *ngSwitchCase="'currency'">
                {{ row[column.key] | currency }}
              </ng-container>
              <ng-container *ngSwitchCase="'status'">
                <app-status-badge [status]="row[column.key]"></app-status-badge>
              </ng-container>
              <ng-container *ngSwitchCase="'actions'">
                <div class="action-buttons">
                  <button mat-icon-button *ngFor="let action of actions"
                          [matTooltip]="action.label"
                          [color]="action.color"
                          (click)="onAction(action.action, row)">
                    <mat-icon>{{ action.icon }}</mat-icon>
                  </button>
                </div>
              </ng-container>
              <ng-container *ngSwitchDefault>
                {{ row[column.key] }}
              </ng-container>
            </ng-container>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"
            [class.clickable]="rowClickable"
            (click)="onRowClick(row)"></tr>

        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell no-data" [attr.colspan]="displayedColumns.length">
            <app-empty-state
              [icon]="emptyIcon"
              [title]="emptyTitle"
              [message]="emptyMessage">
            </app-empty-state>
          </td>
        </tr>
      </table>

      <mat-paginator *ngIf="paginate"
                     [length]="totalCount"
                     [pageSize]="pageSize"
                     [pageIndex]="pageIndex"
                     [pageSizeOptions]="pageSizeOptions"
                     (page)="onPageChange($event)"
                     showFirstLastButtons>
      </mat-paginator>
    </div>
  `,
  styles: [`
    .table-container {
      position: relative;
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }

    .table-loading {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10;
    }

    table {
      width: 100%;
    }

    .mat-mdc-row.clickable {
      cursor: pointer;
    }

    .mat-mdc-row.clickable:hover {
      background: #f5f5f5;
    }

    .action-buttons {
      display: flex;
      gap: 0.25rem;
    }

    .no-data {
      text-align: center;
      padding: 2rem;
    }
  `]
})
export class DataTableComponent implements OnInit, AfterViewInit {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() loading: boolean = false;
  @Input() paginate: boolean = true;
  @Input() totalCount: number = 0;
  @Input() pageSize: number = 10;
  @Input() pageIndex: number = 0;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];
  @Input() rowClickable: boolean = false;
  @Input() emptyIcon: string = 'inbox';
  @Input() emptyTitle: string = 'No data found';
  @Input() emptyMessage: string = 'There are no records to display.';

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() sortChange = new EventEmitter<Sort>();
  @Output() actionClick = new EventEmitter<{ action: string; row: any }>();
  @Output() rowClick = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];

  ngOnInit(): void {
    this.displayedColumns = this.columns.map(c => c.key);
  }

  ngAfterViewInit(): void {
    if (!this.paginate) {
      this.dataSource.paginator = this.paginator;
    }
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(): void {
    this.dataSource.data = this.data;
  }

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }

  onSort(sort: Sort): void {
    this.sortChange.emit(sort);
  }

  onAction(action: string, row: any): void {
    this.actionClick.emit({ action, row });
  }

  onRowClick(row: any): void {
    if (this.rowClickable) {
      this.rowClick.emit(row);
    }
  }
}
