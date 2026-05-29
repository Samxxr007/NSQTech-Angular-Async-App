import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuditLogEntry {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId: string | null;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface AuditResponse {
  data: AuditLogEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class AuditService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/audit`;

  auditLogs = signal<AuditLogEntry[]>([]);
  loading = signal(false);

  fetchAuditLogs(page: number = 1, limit: number = 8): Observable<AuditResponse> {
    this.loading.set(true);
    return this.http.get<AuditResponse>(this.apiUrl, {
      params: new HttpParams().set('page', String(page)).set('limit', String(limit))
    }).pipe(
      tap(res => {
        this.auditLogs.set(res.data);
        this.loading.set(false);
      })
    );
  }
}
