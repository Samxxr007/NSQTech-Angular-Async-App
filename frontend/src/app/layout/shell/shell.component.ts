import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <aside class="sidebar" [class.collapsed]="isCollapsed" [@sidebarExpand]="isCollapsed ? 'collapsed' : 'expanded'">
        <div class="sidebar-header">
          <div class="logo">
            <span class="icon">M</span>
            @if (!isCollapsed) {
              <span class="brand-text">MPloyChek</span>
            }
          </div>
          <button class="toggle-btn" (click)="toggleSidebar()" [attr.aria-label]="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'">
            <span [@rotateIcon]="isCollapsed ? 'rotated' : 'default'">☰</span>
          </button>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item" [class.active]="" #dashboardLink="routerLinkActive">
            <span class="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </span>
            <span class="label">Dashboard</span>
          </a>
          <a routerLink="/cases" routerLinkActive="active" class="nav-item" #casesLink="routerLinkActive">
            <span class="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </span>
            <span class="label">Verifications</span>
          </a>
          
          @if (isAdmin()) {
            <div class="nav-divider"></div>
            <a routerLink="/admin/users" routerLinkActive="active" class="nav-item" #adminLink="routerLinkActive">
              <span class="nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </span>
              <span class="label">Team & Users</span>
            </a>
          }
        </nav>

        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">{{ user()?.name?.charAt(0) || 'U' }}</div>
            @if (!isCollapsed) {
              <div class="user-details">
                <span class="name">{{ user()?.name }}</span>
                <span class="role-badge" [class.admin]="isAdmin()">{{ isAdmin() ? 'Admin' : 'Officer' }}</span>
              </div>
            }
          </div>
          <button class="logout-btn" title="Logout" (click)="logout()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </aside>

      <main class="main-content">
        <header class="topbar">
          <div class="page-title">
            <h2>{{ getPageTitle() }}</h2>
          </div>
          <div class="topbar-actions">
            <div class="search-input">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Search (Ctrl+K)..." (keydown)="onSearchKey($event)" />
            </div>
            <button class="icon-btn theme-toggle" (click)="toggleTheme()" [title]="isDark() ? 'Light Mode' : 'Dark Mode'">
              @if (isDark()) {
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              } @else {
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              }
            </button>
            <div class="notification-wrapper">
              <button class="icon-btn notifications" title="Notifications" (click)="toggleNotifications()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                @if (notifService.unreadCount() > 0) {
                  <span class="badge">{{ notifService.unreadCount() }}</span>
                }
              </button>
              @if (showNotifs) {
                <div class="notification-dropdown glass-panel" @fadeScale>
                  <div class="notif-header">
                    <h4>Notifications</h4>
                    <button (click)="markAllRead()">Mark all as read</button>
                  </div>
                  <div class="notif-list">
                    @if (notifService.loading()) {
                      @for (i of [1,2,3]; track i) {
                        <div class="notif-item">
                          <div class="skeleton" style="width: 100%; height: 48px;"></div>
                        </div>
                      }
                    } @else if (notifService.notifications().length === 0) {
                      <div class="notif-empty">
                        <p>No notifications</p>
                      </div>
                    } @else {
                      @for (notif of notifService.notifications(); track notif.id) {
                        <div class="notif-item" [class.unread]="!notif.isRead" (click)="onNotifClick(notif)">
                          <div class="notif-indicator" [class]="notif.type.toLowerCase()"></div>
                          <div class="notif-content">
                            <div class="notif-title-row">
                              <span class="notif-title">{{ notif.title }}</span>
                              <span class="notif-priority" [class]="notif.priority.toLowerCase()">{{ notif.priority }}</span>
                            </div>
                            <p class="notif-message">{{ notif.message }}</p>
                            <span class="notif-time">{{ notif.createdAt | date:'shortTime' }}</span>
                          </div>
                        </div>
                      }
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        </header>
        <div class="content-area" [@routeAnimation]>
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styleUrls: ['./shell.component.scss'],
  animations: [
    trigger('fadeScale', [
      transition(':enter', [style({ opacity: 0, transform: 'scale(0.95) translateY(-8px)' }), animate('200ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))]),
      transition(':leave', [animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.95) translateY(-8px)' }))]),
    ]),
    trigger('sidebarExpand', [
      transition('* => *', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')),
    ]),
    trigger('rotateIcon', [
      transition('* => *', animate('300ms ease')),
    ]),
    trigger('routeAnimation', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateY(8px)' }),
        animate('300ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class ShellComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  notifService = inject(NotificationsService);
  router = inject(Router);

  user = this.authService.user;
  isAdmin = this.authService.isAdmin;
  isDark = this.themeService.isDark;
  
  isCollapsed = false;
  showNotifs = false;
  private routerSub: Subscription | null = null;

  ngOnInit() {
    this.notifService.fetchNotifications(10);

    // Close notification dropdown on route change
    this.routerSub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      this.showNotifs = false;
    });
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleNotifications() {
    this.showNotifs = !this.showNotifs;
    if (this.showNotifs) {
      this.notifService.fetchNotifications(10);
    }
  }

  markAllRead() {
    this.notifService.markAllRead().subscribe();
  }

  onNotifClick(notif: any) {
    if (!notif.isRead) {
      this.notifService.markAsRead(notif.id).subscribe();
    }
  }

  onSearchKey(event: KeyboardEvent) {
    // Future: wire to global search
  }

  logout() {
    this.authService.logout();
  }

  getPageTitle(): string {
    const url = this.router.url;
    if (url.includes('dashboard')) return 'Dashboard Overview';
    if (url.includes('cases')) return 'Verification Cases';
    if (url.includes('admin/users')) return 'User Management';
    return 'MPloyChek Platform';
  }
}
