import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { DashboardStatsService } from '../../core/services/dashboard-stats.service';
import { CasesService } from '../../core/services/cases.service';
import { AuditService } from '../../core/services/audit.service';
import { ToastService } from '../../shared/services/toast.service';
import { animate, style, transition, trigger, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective],
  template: `
    <div class="dashboard-container">
      
      <!-- Top Banner -->
      <div class="welcome-banner glass-panel" @fadeIn>
        <div class="banner-content">
          <div class="banner-text">
            <h1>Enterprise Analytics Dashboard</h1>
            <p>Real-time insights and verification pipelines at a glance.</p>
          </div>
        </div>
        <div class="banner-actions">
          <button class="btn-banner" (click)="downloadReport()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Generate Report
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid" @staggerIn>
        @for (stat of statsCards; track stat.title) {
          <div class="stat-card card" @slideUpDelayed>
            <div class="stat-header">
              <div class="stat-icon" [ngClass]="stat.colorClass">
                <span [innerHTML]="stat.svgIcon"></span>
              </div>
              <span class="trend" [class.positive]="stat.trend > 0" [class.negative]="stat.trend < 0">
                @if (stat.trend > 0) { ↑ } @else { ↓ }
                {{ Math.abs(stat.trend) }}%
              </span>
            </div>
            <div class="stat-content">
              <h3>{{ stat.title }}</h3>
              <div class="value">
                @if (loading) { <div class="skeleton" style="width: 80px; height: 36px;"></div> }
                @else { {{ animatedValues[stat.title] || 0 | number }} }
              </div>
              @if (stat.progress) {
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" [style.width.%]="stat.progress" [ngClass]="stat.colorClass"></div>
                </div>
              }
            </div>
          </div>
        }
      </div>

      <!-- Charts Section -->
      <div class="charts-grid" @fadeIn>
        <div class="chart-card card col-span-2">
          <div class="chart-header">
            <h3>Verification Pipeline Growth (12 Months)</h3>
            <span class="chart-subtitle">Created vs Completed verifications</span>
          </div>
          <div class="chart-wrapper line-chart">
            @if (loading) { <div class="skeleton" style="width: 100%; height: 280px;"></div> }
            @else {
              <div echarts [options]="lineChartOptions" class="echarts-container"></div>
            }
          </div>
        </div>

        <div class="chart-card card">
          <div class="chart-header">
            <h3>Verification Status</h3>
            <span class="chart-subtitle">Current distribution</span>
          </div>
          <div class="chart-wrapper donut-chart">
            @if (loading) { <div class="skeleton" style="width: 100%; height: 280px;"></div> }
            @else {
              <div echarts [options]="donutChartOptions" class="echarts-container"></div>
            }
          </div>
        </div>
      </div>

      <!-- Activity Widgets -->
      <div class="widgets-grid" @fadeIn>
        <div class="widget-card card">
          <div class="widget-header">
            <h3>Recent Verification Requests</h3>
            <span class="widget-count">{{ recentRequests.length }} cases</span>
          </div>
          <div class="recent-table">
            @if (loading) {
              @for (i of [1,2,3,4,5]; track i) {
                <div class="table-row skeleton" style="height: 52px; margin-bottom: 8px; border-radius: 8px;"></div>
              }
            } @else {
              @for (req of recentRequests; track req.id) {
                <div class="table-row">
                  <div class="req-info">
                    <span class="req-name">{{ req.candidateName }}</span>
                    <span class="req-company">{{ req.company }}</span>
                  </div>
                  <div class="req-meta">
                    <span class="req-type">{{ req.verificationType }}</span>
                    <span class="req-status" [ngClass]="getStatusClass(req.status)">
                      {{ req.status }}
                    </span>
                  </div>
                </div>
              }
            }
          </div>
        </div>

        <div class="widget-card card">
          <div class="widget-header">
            <h3>Audit Activity Timeline</h3>
            <span class="widget-count">Live feed</span>
          </div>
          <div class="timeline">
            @if (loading) {
              @for (i of [1,2,3,4]; track i) {
                <div class="timeline-item skeleton" style="height: 60px; margin-bottom: 16px; border-radius: 8px;"></div>
              }
            } @else {
              @for (log of auditLogs; track log.id) {
                <div class="timeline-item">
                  <div class="timeline-marker" [ngClass]="getAuditActionClass(log.action)"></div>
                  <div class="timeline-content">
                    <div class="timeline-top">
                      <span class="action-badge" [ngClass]="getAuditActionClass(log.action)">{{ formatAction(log.action) }}</span>
                      <span class="time">{{ log.timestamp | date:'shortTime' }}</span>
                    </div>
                    <p>{{ log.details }}</p>
                    <span class="user-email">{{ log.userEmail }}</span>
                  </div>
                </div>
              }
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [style({ opacity: 0 }), animate('500ms ease-out', style({ opacity: 1 }))]),
    ]),
    trigger('slideUpDelayed', [
      transition(':enter', [style({ opacity: 0, transform: 'translateY(24px)' }), animate('500ms 100ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))]),
    ]),
    trigger('staggerIn', [
      transition('* => *', [
        query('@slideUpDelayed', stagger('80ms', []), { optional: true }),
      ]),
    ]),
  ],
})
export class DashboardComponent implements OnInit {
  statsService = inject(DashboardStatsService);
  casesService = inject(CasesService);
  auditService = inject(AuditService);
  toastService = inject(ToastService);
  
  Math = Math;
  loading = true;
  animatedValues: { [key: string]: number } = {};
  
  statsCards = [
    { title: 'Total Verifications', value: 0, svgIcon: '📋', colorClass: 'primary', trend: 15.2, progress: 100 },
    { title: 'Pending Approval', value: 0, svgIcon: '⏳', colorClass: 'warning', trend: -4.1, progress: 45 },
    { title: 'Completed Checks', value: 0, svgIcon: '✅', colorClass: 'success', trend: 12.8, progress: 75 },
    { title: 'Critical Risk Alerts', value: 0, svgIcon: '⚠️', colorClass: 'danger', trend: -18.5, progress: 15 },
  ];

  donutChartOptions: EChartsOption = {};
  lineChartOptions: EChartsOption = {};
  
  recentRequests: any[] = [];
  auditLogs: any[] = [];

  ngOnInit() {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.loading = true;

    // Fetch stats and cases in parallel
    this.statsService.fetchStats().subscribe({
      next: (stats) => {
        this.statsCards[0].value = stats.total;
        this.statsCards[1].value = (stats.byStatus['Pending'] || 0) + (stats.byStatus['InProgress'] || 0);
        this.statsCards[2].value = stats.byStatus['Completed'] || 0;
        this.statsCards[3].value = (stats.byRiskLevel['Critical'] || 0) + (stats.byRiskLevel['High'] || 0);

        // Status chart
        this.donutChartOptions = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            textStyle: { fontSize: 12, fontFamily: 'Inter' }
          },
          series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 8,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: { show: false },
            emphasis: {
              label: { show: true, fontSize: 14, fontWeight: 'bold' }
            },
            data: Object.keys(stats.byStatus).map((key, index) => ({
              value: stats.byStatus[key],
              name: key,
              itemStyle: { color: this.getChartColors(Object.keys(stats.byStatus))[index] }
            }))
          }]
        };

        // Monthly growth line chart
        this.lineChartOptions = {
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' }
          },
          legend: {
            data: ['Created', 'Completed'],
            top: 0,
            textStyle: { fontSize: 12, fontFamily: 'Inter' }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: stats.monthlyGrowth.labels,
            axisLine: { lineStyle: { color: '#e5e7eb' } },
            axisLabel: { fontSize: 11, fontFamily: 'Inter' }
          },
          yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { lineStyle: { color: 'rgba(0,0,0,0.05)' } },
            axisLabel: { fontSize: 11, fontFamily: 'Inter' }
          },
          series: [
            {
              name: 'Created',
              type: 'line',
              smooth: true,
              data: stats.monthlyGrowth.values,
              itemStyle: { color: '#4f46e5' },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(79, 70, 229, 0.3)' },
                    { offset: 1, color: 'rgba(79, 70, 229, 0.05)' }
                  ]
                }
              },
              lineStyle: { width: 3 }
            },
            {
              name: 'Completed',
              type: 'line',
              smooth: true,
              data: stats.monthlyGrowth.completedValues,
              itemStyle: { color: '#10b981' },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
                    { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
                  ]
                }
              },
              lineStyle: { width: 3 }
            }
          ]
        };

        this.animateCounters();
      }
    });

    // Fetch recent cases
    this.casesService.getCases({ limit: 6, sortBy: 'createdAt', sortOrder: 'desc' }).subscribe({
      next: (res) => {
        this.recentRequests = res.data.slice(0, 6);
      }
    });

    // Fetch audit logs
    this.auditService.fetchAuditLogs(1, 6).subscribe({
      next: (res) => {
        this.auditLogs = res.data;
      }
    });

    // Set loading false after a delay to let concurrent requests finish
    setTimeout(() => {
      this.loading = false;
    }, 1200);
  }

  animateCounters() {
    setTimeout(() => {
      this.statsCards.forEach((stat, index) => {
        setTimeout(() => {
          this.animateValue(stat.title, 0, stat.value, 1500);
        }, index * 100);
      });
    }, 300);
  }

  animateValue(title: string, start: number, end: number, duration: number) {
    const range = end - start;
    if (range === 0) { this.animatedValues[title] = end; return; }
    const startTime = performance.now();
    
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      this.animatedValues[title] = Math.floor(start + range * easeProgress);
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        this.animatedValues[title] = end;
      }
    };
    
    requestAnimationFrame(step);
  }

  getChartColors(statuses: string[]): string[] {
    const colorMap: Record<string, string> = {
      'Pending': '#f59e0b',
      'InProgress': '#3b82f6',
      'Completed': '#10b981',
      'Failed': '#ef4444',
      'OnHold': '#64748b',
    };
    return statuses.map(s => colorMap[s] || '#64748b');
  }

  getStatusClass(status: string): string {
    const classMap: Record<string, string> = {
      'Pending': 'status-pending',
      'InProgress': 'status-progress',
      'Completed': 'status-completed',
      'Failed': 'status-failed',
      'OnHold': 'status-onhold',
    };
    return classMap[status] || 'status-pending';
  }

  getAuditActionClass(action: string): string {
    if (action.includes('Login') || action.includes('View')) return 'action-info';
    if (action.includes('Create') || action.includes('Toggle')) return 'action-create';
    if (action.includes('Update')) return 'action-update';
    if (action.includes('Delete')) return 'action-delete';
    return 'action-info';
  }

  formatAction(action: string): string {
    return action.replace(/([A-Z])/g, ' $1').trim();
  }

  downloadReport() {
    this.toastService.info('Report Generation Started', 'Your audit report is being compiled and will be ready for download shortly.');
    setTimeout(() => {
      this.toastService.success('Report Ready', 'Audit_Report_Q2.pdf is ready for download.');
    }, 2500);
  }
}
