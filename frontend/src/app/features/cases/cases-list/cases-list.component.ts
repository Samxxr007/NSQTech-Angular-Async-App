import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, ColumnDef } from '../../../shared/components/data-table/data-table.component';
import { CasesService } from '../../../core/services/cases.service';
import { VerificationCase } from '../../../shared/models/case.model';
import { ToastService } from '../../../shared/services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-cases-list',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="cases-container" @fadeIn>
      <div class="page-header">
        <div>
          <h1>Verification Cases</h1>
          <p>Manage and track all background verification requests.</p>
        </div>
      </div>
      
      <app-data-table
        [columns]="columns"
        [data]="cases"
        [loading]="loading"
        [totalCount]="totalCount"
        [page]="page"
        [pageSize]="pageSize"
        (search)="onSearch($event)"
        (sort)="onSort($event)"
        (pageChange)="onPageChange($event)">
        
        <button toolbar-actions class="btn-primary" (click)="onNewCase()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Case
        </button>
      </app-data-table>
    </div>
  `,
  styles: [`
    .cases-container { display: flex; flex-direction: column; gap: 24px; }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      h1 { margin: 0 0 8px 0; font-size: 1.8rem; font-weight: 600; color: var(--text-main); }
      p { margin: 0; opacity: 0.9; font-size: 1rem; color: var(--text-muted); }
    }
    .btn-primary { display: inline-flex; align-items: center; gap: 6px; }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [style({ opacity: 0 }), animate('400ms ease-out', style({ opacity: 1 }))]),
    ]),
  ],
})
export class CasesListComponent implements OnInit {
  casesService = inject(CasesService);
  toastService = inject(ToastService);

  cases: VerificationCase[] = [];
  loading = false;
  totalCount = 0;
  page = 1;
  pageSize = 10;
  
  currentSearch = '';
  currentSort: { key: string; dir: 'asc' | 'desc' } = { key: 'createdAt', dir: 'desc' };

  columns: ColumnDef[] = [
    { key: 'caseNumber', header: 'Case ID', type: 'text' },
    { key: 'candidateName', header: 'Candidate', type: 'text' },
    { key: 'company', header: 'Company', type: 'text' },
    { key: 'verificationType', header: 'Type', type: 'text' },
    { key: 'status', header: 'Status', type: 'badge' },
    { key: 'riskLevel', header: 'Risk', type: 'risk' },
    { key: 'createdAt', header: 'Created', type: 'date' }
  ];

  ngOnInit() {
    this.loadCases();
  }

  loadCases() {
    this.loading = true;
    const params = {
      page: this.page,
      limit: this.pageSize,
      search: this.currentSearch,
      sortBy: this.currentSort.key,
      sortOrder: this.currentSort.dir
    };
    
    this.casesService.getCases(params).subscribe({
      next: (res) => {
        this.cases = res.data;
        this.totalCount = res.total;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onSearch(term: string) {
    this.currentSearch = term;
    this.page = 1;
    this.loadCases();
  }

  onSort(sortEvent: {key: string, dir: 'asc'|'desc'}) {
    this.currentSort = sortEvent;
    this.loadCases();
  }

  onPageChange(page: number) {
    this.page = page;
    this.loadCases();
  }

  onNewCase() {
    this.toastService.info('Coming Soon', 'New case creation will be available in the next release.');
  }
}
