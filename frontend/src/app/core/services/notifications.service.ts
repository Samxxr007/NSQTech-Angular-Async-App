import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface NotificationItem {
  id: string;
  userId: string | null;
  type: 'Info' | 'Success' | 'Warning' | 'Error';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface NotificationsResponse {
  data: NotificationItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  unreadCount: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/notifications`;

  notifications = signal<NotificationItem[]>([]);
  unreadCount = computed(() => this.notifications().filter(n => !n.isRead).length);
  loading = signal(false);

  fetchNotifications(limit: number = 10): Observable<NotificationsResponse> {
    this.loading.set(true);
    return this.http.get<NotificationsResponse>(this.apiUrl, {
      params: { page: '1', limit: String(limit) }
    }).pipe(
      tap(res => {
        this.notifications.set(res.data);
        this.loading.set(false);
      })
    );
  }

  markAsRead(id: string): Observable<{ success: boolean }> {
    return this.http.patch<{ success: boolean }>(`${this.apiUrl}/${id}/read`, {}).pipe(
      tap(() => {
        this.notifications.update(notifs =>
          notifs.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
      })
    );
  }

  markAllRead(): Observable<{ success: boolean }> {
    return this.http.patch<{ success: boolean }>(`${this.apiUrl}/mark-all-read`, {}).pipe(
      tap(() => {
        this.notifications.update(notifs =>
          notifs.map(n => ({ ...n, isRead: true }))
        );
      })
    );
  }
}
