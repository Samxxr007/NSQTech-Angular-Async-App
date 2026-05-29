import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DataTableComponent, ColumnDef } from '../../../shared/components/data-table/data-table.component';
import { environment } from '../../../../environments/environment';
import { ModalService } from '../../../shared/services/modal.service';
import { ToastService } from '../../../shared/services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, DataTableComponent, ReactiveFormsModule],
  template: `
    <div class="users-container" @fadeIn>
      <div class="page-header">
        <div>
          <h1>User Management</h1>
          <p>Manage platform access, roles, and security settings.</p>
        </div>
        <div class="header-stats">
          <span class="stat-chip primary">{{ users.length }} Total</span>
          <span class="stat-chip success">{{ activeCount }} Active</span>
          <span class="stat-chip warning">{{ inactiveCount }} Inactive</span>
        </div>
      </div>
      
      <app-data-table
        [columns]="columns"
        [data]="paginatedUsers"
        [loading]="loading"
        [totalCount]="users.length"
        [page]="page"
        [pageSize]="pageSize"
        (search)="onSearch($event)"
        (sort)="onSort($event)"
        (pageChange)="onPageChange($event)">
        
        <button toolbar-actions class="btn-primary" (click)="openInviteModal()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Invite User
        </button>
      </app-data-table>
    </div>
  `,
  styles: [`
    .users-container { display: flex; flex-direction: column; gap: 24px; }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      h1 { margin: 0 0 8px 0; font-size: 1.8rem; font-weight: 600; color: var(--text-main); }
      p { margin: 0; opacity: 0.9; font-size: 1rem; color: var(--text-muted); }
      
      .header-stats {
        display: flex;
        gap: 8px;
        margin-top: 4px;
        
        .stat-chip {
          font-size: 0.8rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 20px;
          
          &.primary { color: var(--primary); background: rgba(79, 70, 229, 0.1); }
          &.success { color: #10b981; background: rgba(16, 185, 129, 0.1); }
          &.warning { color: #f59e0b; background: rgba(245, 158, 11, 0.1); }
        }
      }
    }
    .btn-primary { display: inline-flex; align-items: center; gap: 6px; }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [style({ opacity: 0 }), animate('400ms ease-out', style({ opacity: 1 }))]),
    ]),
  ],
})
export class UserManagementComponent implements OnInit {
  http = inject(HttpClient);
  modalService = inject(ModalService);
  toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  
  users: any[] = [];
  loading = false;
  page = 1;
  pageSize = 10;
  currentSearch = '';
  currentSort = { key: 'createdAt', dir: 'desc' as const };

  get activeCount() { return this.users.filter(u => u.isActive).length; }
  get inactiveCount() { return this.users.filter(u => !u.isActive).length; }
  get paginatedUsers() {
    let filtered = [...this.users];
    if (this.currentSearch) {
      const s = this.currentSearch.toLowerCase();
      filtered = filtered.filter(u =>
        u.name?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s)
      );
    }
    const start = (this.page - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  columns: ColumnDef[] = [
    { key: 'name', header: 'Full Name', type: 'text' },
    { key: 'email', header: 'Email Address', type: 'text' },
    { key: 'role', header: 'Role', type: 'badge' },
    { key: 'isActive', header: 'Status', type: 'badge' },
    { key: 'department', header: 'Department', type: 'text' },
    { key: 'createdAt', header: 'Joined', type: 'date' },
    { key: 'lastLogin', header: 'Last Active', type: 'date' },
  ];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.http.get<any>(`${environment.apiUrl}/users`).subscribe({
      next: (res) => {
        this.users = res.map((u: any) => ({
          ...u,
          isActive: u.isActive ? 'Active' : 'Inactive',
          role: u.role === 'admin' ? 'Admin' : 'Officer',
        }));
        setTimeout(() => this.loading = false, 400);
      },
      error: () => this.loading = false
    });
  }

  onSearch(term: string) {
    this.currentSearch = term;
    this.page = 1;
  }

  onSort(sortEvent: any) {
    this.currentSort = sortEvent;
    const { key, dir } = sortEvent;
    this.users.sort((a, b) => {
      const aVal = a[key] || '';
      const bVal = b[key] || '';
      return dir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }

  onPageChange(page: number) {
    this.page = page;
  }

  openInviteModal() {
    this.modalService.open({
      title: 'Invite New User',
      message: 'Enter the email address of the team member you wish to invite. They will receive a secure onboarding link.',
      confirmText: 'Send Invitation',
      type: 'info',
      onConfirm: () => {
        this.toastService.success('Invitation Sent', 'An email has been dispatched to the new user successfully.');
      }
    });
  }
}
