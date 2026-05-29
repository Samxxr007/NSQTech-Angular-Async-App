import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast glass-panel" [ngClass]="toast.type" @slideIn>
          <div class="icon">
            @switch (toast.type) {
              @case ('success') { ✅ }
              @case ('error') { ⚠️ }
              @case ('warning') { 🔔 }
              @default { ℹ️ }
            }
          </div>
          <div class="content">
            <h4>{{ toast.title }}</h4>
            <p>{{ toast.message }}</p>
            @if (toast.duration && toast.duration > 0) {
              <div class="progress-bar">
                <div class="progress-fill" [style.animation-duration]="'{{ toast.duration }}ms'"></div>
              </div>
            }
          </div>
          <button class="close-btn" (click)="toastService.remove(toast.id)">✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 9999;
      pointer-events: none;
    }
    
    .toast {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      min-width: 320px;
      max-width: 420px;
      border-radius: 12px;
      border-left: 4px solid transparent;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
      pointer-events: auto;
      transition: transform 0.2s, box-shadow 0.2s;
      
      :host-context(body.theme-dark) & {
        background: rgba(15, 23, 42, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.05);
      }
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      &.success { border-left-color: #10b981; background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(236, 253, 245, 0.95) 100%); :host-context(body.theme-dark) & { background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(16, 185, 129, 0.08) 100%); } }
      &.error { border-left-color: #ef4444; background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 242, 242, 0.95) 100%); :host-context(body.theme-dark) & { background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(239, 68, 68, 0.08) 100%); } }
      &.info { border-left-color: #3b82f6; background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(239, 246, 255, 0.95) 100%); :host-context(body.theme-dark) & { background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(59, 130, 246, 0.08) 100%); } }
      &.warning { border-left-color: #f59e0b; background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 251, 235, 0.95) 100%); :host-context(body.theme-dark) & { background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(245, 158, 11, 0.08) 100%); } }
      
      .icon { 
        font-size: 1.4rem;
        flex-shrink: 0;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .content {
        flex: 1;
        min-width: 0;
        
        h4 { 
          margin: 0 0 4px 0; 
          font-size: 0.95rem; 
          color: var(--text-main); 
          font-weight: 600;
          line-height: 1.3;
        }
        
        p { 
          margin: 0; 
          font-size: 0.85rem; 
          color: var(--text-muted); 
          line-height: 1.4;
        }
        
        .progress-bar {
          height: 3px;
          background: rgba(0, 0, 0, 0.08);
          border-radius: 2px;
          margin-top: 8px;
          overflow: hidden;
          
          .progress-fill {
            height: 100%;
            background: currentColor;
            border-radius: 2px;
            animation: progress linear forwards;
            opacity: 0.3;
          }
        }
      }
      
      .close-btn {
        background: transparent;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 1rem;
        padding: 4px;
        opacity: 0.5;
        transition: all 0.2s;
        border-radius: 4px;
        flex-shrink: 0;
        
        &:hover { 
          opacity: 1;
          background: rgba(0, 0, 0, 0.05);
        }
      }
    }
    
    @keyframes progress {
      from { width: 100%; }
      to { width: 0%; }
    }
  `],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0, 1, 1)', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
