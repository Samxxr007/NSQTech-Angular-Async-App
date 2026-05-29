import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  total: number;
  byStatus: Record<string, number>;
  byRiskLevel: Record<string, number>;
  byVerificationType: Record<string, number>;
  byCompany: Record<string, number>;
  monthlyGrowth: {
    labels: string[];
    values: number[];
    completedValues: number[];
  };
}

@Injectable({ providedIn: 'root' })
export class DashboardStatsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cases/stats`;

  stats = signal<DashboardStats | null>(null);
  loading = signal(false);

  fetchStats(): Observable<DashboardStats> {
    this.loading.set(true);
    return this.http.get<DashboardStats>(this.apiUrl).pipe(
      tap(res => {
        this.stats.set(res);
        this.loading.set(false);
      })
    );
  }
}
