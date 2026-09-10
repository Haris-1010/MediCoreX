import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  standalone: false,
  selector: 'app-reminder-notes',
  template: `
    <div class="reminder-notes">
      <div class="notes-header">
        <div class="last-edited">Last Edited on: {{ lastEdited | date:'M/d/yyyy h:mm:ss a' }}</div>
      </div>

      <div class="toolbar">
        <button class="toolbar-btn" title="Bold" (click)="formatText('bold')">
          <mat-icon>format_bold</mat-icon>
        </button>
        <button class="toolbar-btn" title="Italic" (click)="formatText('italic')">
          <mat-icon>format_italic</mat-icon>
        </button>
        <button class="toolbar-btn" title="Underline" (click)="formatText('underline')">
          <mat-icon>format_underlined</mat-icon>
        </button>
        <button class="toolbar-btn" title="Strikethrough" (click)="formatText('strikethrough')">
          <mat-icon>strikethrough_s</mat-icon>
        </button>
        <div class="toolbar-divider"></div>
        <select class="font-select" [(ngModel)]="selectedFont">
          <option value="Helvetica">Helvetica</option>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
        </select>
        <div class="toolbar-divider"></div>
        <button class="toolbar-btn" title="Font Color" (click)="toggleColorPicker()">
          <mat-icon [style.color]="fontColor">format_color_text</mat-icon>
        </button>
        <div class="toolbar-divider"></div>
        <button class="toolbar-btn" title="Unordered List" (click)="formatText('insertUnorderedList')">
          <mat-icon>format_list_bulleted</mat-icon>
        </button>
        <button class="toolbar-btn" title="Ordered List" (click)="formatText('insertOrderedList')">
          <mat-icon>format_list_numbered</mat-icon>
        </button>
        <button class="toolbar-btn" title="Align Left" (click)="formatText('justifyLeft')">
          <mat-icon>format_align_left</mat-icon>
        </button>
        <button class="toolbar-btn" title="Align Center" (click)="formatText('justifyCenter')">
          <mat-icon>format_align_center</mat-icon>
        </button>
        <button class="toolbar-btn" title="Align Right" (click)="formatText('justifyRight')">
          <mat-icon>format_align_right</mat-icon>
        </button>
      </div>

      <div class="notes-editor"
           #editor
           contenteditable="true"
           [attr.data-placeholder]="'Please Write Notes Here...'"
           (input)="onContentChange($event)"
           (blur)="saveNotes()">
      </div>

      <div class="color-picker" *ngIf="showColorPicker">
        <div class="color-option" *ngFor="let color of colorOptions"
             [style.background]="color"
             (click)="setColor(color)">
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reminder-notes {
      min-height: 200px;
    }

    .notes-header {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 0.75rem;
    }

    .last-edited {
      font-size: 0.75rem;
      color: #999;
    }

    .toolbar {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem;
      background: #f8f9fa;
      border: 1px solid #e0e0e0;
      border-bottom: none;
      border-radius: 4px 4px 0 0;
      flex-wrap: wrap;
    }

    .toolbar-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      border-radius: 4px;
      cursor: pointer;
      color: #555;
      transition: background 0.2s;
    }

    .toolbar-btn:hover {
      background: #e0e0e0;
    }

    .toolbar-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .toolbar-divider {
      width: 1px;
      height: 24px;
      background: #ddd;
      margin: 0 0.25rem;
    }

    .font-select {
      padding: 0.25rem 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.8rem;
      background: white;
      color: #555;
      outline: none;
    }

    .notes-editor {
      min-height: 150px;
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 0 0 4px 4px;
      outline: none;
      font-size: 0.9rem;
      line-height: 1.6;
      color: #333;
    }

    .notes-editor:empty:before {
      content: attr(data-placeholder);
      color: #999;
    }

    .notes-editor:focus {
      border-color: #1a237e;
    }

    .color-picker {
      position: absolute;
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 0.5rem;
      display: flex;
      gap: 0.25rem;
      flex-wrap: wrap;
      max-width: 150px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      z-index: 100;
    }

    .color-option {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      cursor: pointer;
      border: 1px solid #ddd;
    }

    .color-option:hover {
      transform: scale(1.1);
    }
  `]
})
export class ReminderNotesComponent implements OnInit {
  notes = '';
  lastEdited = new Date();
  selectedFont = 'Helvetica';
  fontColor = '#333333';
  showColorPicker = false;

  colorOptions = [
    '#000000', '#434343', '#666666', '#999999', '#cccccc',
    '#ea4335', '#ff6d01', '#fbbc04', '#34a853', '#4285f4',
    '#a142f4', '#ff6d01', '#1a237e', '#c62828', '#2e7d32'
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.api.get<any>('v1/dashboard/notes').subscribe({
      next: (data) => {
        if (data && data.content) {
          this.notes = data.content;
          this.lastEdited = new Date(data.lastEdited || Date.now());
        }
      },
      error: () => {}
    });
  }

  onContentChange(event: Event): void {
    const target = event.target as HTMLElement;
    this.notes = target.innerHTML;
    this.lastEdited = new Date();
  }

  saveNotes(): void {
    this.api.post('v1/dashboard/notes', {
      content: this.notes,
      lastEdited: this.lastEdited
    }).subscribe({
      next: () => {},
      error: () => {}
    });
  }

  formatText(command: string): void {
    document.execCommand(command, false, '');
  }

  toggleColorPicker(): void {
    this.showColorPicker = !this.showColorPicker;
  }

  setColor(color: string): void {
    this.fontColor = color;
    document.execCommand('foreColor', false, color);
    this.showColorPicker = false;
  }
}
