import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ColumnDef {
  key: string;
  header: string;
  type?: 'text' | 'badge' | 'date' | 'risk' | 'action';
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="table-card card">
      
      <!-- Toolbar -->
      <div class="table-toolbar">
        <div class="search-box">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" [(ngModel)]="searchTerm" (input)="onSearchChange()" placeholder="Search records..." />
        </div>
        <div class="actions">
          <ng-content select="[toolbar-actions]"></ng-content>
        </div>
      </div>

      <!-- Table Wrapper -->
      <div class="table-responsive">
        <table class="enterprise-table">
          <thead>
            <tr>
              @for (col of columns; track col.key) {
                <th (click)="onSort(col.key)" [class.sortable]="true">
                  {{ col.header }}
                  @if (sortKey === col.key) {
                    <span class="sort-icon">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
                  }
                </th>
              }
            </tr>
          </thead>
          
          <tbody>
            @if (loading) {
              @for (i of skeletonRows; track i) {
                <tr>
                  @for (col of columns; track col.key) {
                    <td><div class="skeleton" style="height: 18px; width: 75%;"></div></td>
                  }
                </tr>
              }
            } @else if (data.length === 0) {
              <tr>
                <td [attr.colspan]="columns.length" class="empty-state">
                  <div class="empty-content">
                    <div class="empty-illustration">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                    </div>
                    <h4>No records found</h4>
                    <p>We couldn't find anything matching your search criteria. Try adjusting your filters.</p>
                  </div>
                </td>
              </tr>
            } @else {
              @for (row of data; track row.id) {
                <tr class="data-row">
                  @for (col of columns; track col.key) {
                    <td>
                      @switch (col.type) {
                        @case ('badge') {
                          <span class="status-chip" [ngClass]="getBadgeClass(col.key, row[col.key])">
                            <span class="chip-dot"></span>
                            {{ row[col.key] }}
                          </span>
                        }
                        @case ('risk') {
                          <span class="risk-badge" [ngClass]="'risk-' + (row[col.key] | lowercase)">{{ row[col.key] }}</span>
                        }
                        @case ('date') {
                          @if (row[col.key]) {
                            <span class="date-cell">{{ row[col.key] | date:'mediumDate' }}</span>
                          } @else {
                            <span class="text-muted">—</span>
                          }
                        }
                        @default {
                          <span class="text-cell">{{ row[col.key] }}</span>
                        }
                      }
                    </td>
                  }
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <span class="page-info">Showing {{ data.length }} of {{ totalCount }} records</span>
        <div class="page-controls">
          <button [disabled]="page === 1" (click)="onPageChange(page - 1)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            Previous
          </button>
          <span class="current-page">Page {{ page }}</span>
          <button [disabled]="page * pageSize >= totalCount" (click)="onPageChange(page + 1)">
            Next
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {
  @Input() columns: ColumnDef[] = [];
  @Input() data: any[] = [];
  @Input() loading = false;
  @Input() totalCount = 0;
  @Input() page = 1;
  @Input() pageSize = 10;
  
  @Output() search = new EventEmitter<string>();
  @Output() sort = new EventEmitter<{key: string, dir: 'asc'|'desc'}>();
  @Output() pageChange = new EventEmitter<number>();

  searchTerm = '';
  sortKey = 'createdAt';
  sortDir: 'asc' | 'desc' = 'desc';
  skeletonRows = [1, 2, 3, 4, 5];

  private searchTimeout: any;

  getBadgeClass(key: string, value: string): string {
    if (key === 'isActive' || key === 'status') {
      const v = (value || '').toLowerCase();
      if (v === 'active' || v === 'completed') return 'chip-success';
      if (v === 'inactive' || v === 'failed') return 'chip-danger';
      if (v === 'pending' || v === 'inprogress') return 'chip-warning';
      if (v === 'onhold') return 'chip-neutral';
    }
    if (key === 'role') {
      const v = (value || '').toLowerCase();
      if (v === 'admin') return 'chip-primary';
      return 'chip-info';
    }
    return 'chip-neutral';
  }

  onSearchChange() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.search.emit(this.searchTerm);
    }, 400);
  }

  onSort(key: string) {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
    this.sort.emit({ key: this.sortKey, dir: this.sortDir });
  }

  onPageChange(newPage: number) {
    this.pageChange.emit(newPage);
  }
}
