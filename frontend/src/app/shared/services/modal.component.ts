import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from './modal.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (modalService.currentModal(); as modal) {
      <div class="modal-overlay" @fade>
        <div class="modal-dialog glass-panel" [ngClass]="modal.size" @scaleIn>
          
          <div class="modal-header" [ngClass]="modal.type">
            @if (modal.type !== 'form') {
              <div class="icon-circle">
                @if (modal.type === 'danger') { ⚠️ }
                @else if (modal.type === 'warning') { 🔔 }
                @else { ℹ️ }
              </div>
            }
            <h3>{{ modal.title }}</h3>
            <button class="close-icon" (click)="modalService.cancel()">✕</button>
          </div>
          
          <div class="modal-body" [ngClass]="modal.type">
            @if (modal.message) { <p>{{ modal.message }}</p> }
            @if (modal.component) {
              <ng-container *ngComponentOutlet="modal.component; inputs: modal.componentData"></ng-container>
            }
            <ng-content></ng-content>
          </div>
          
          @if (modal.type !== 'form') {
            <div class="modal-actions">
              <button class="btn-cancel" (click)="modalService.cancel()">{{ modal.cancelText }}</button>
              <button class="btn-confirm" [ngClass]="modal.type" (click)="modalService.confirm()">{{ modal.confirmText }}</button>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .modal-dialog {
      width: 100%;
      max-width: 450px;
      padding: 32px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1);
      
      :host-context(body.theme-dark) & {
        background: rgba(15, 23, 42, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.05);
      }
      
      &.sm { max-width: 380px; }
      &.lg { max-width: 600px; }
      &.xl { max-width: 800px; }
    }
    
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      margin-bottom: 24px;
      position: relative;
      
      .icon-circle {
        width: 56px; height: 56px;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.5rem;
        margin-bottom: 16px;
        background: var(--bg-main);
      }
      
      h3 { margin: 0; font-size: 1.25rem; font-weight: 600; color: var(--text-main); }
      
      .close-icon {
        position: absolute;
        right: 0;
        top: 0;
        background: transparent;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        font-size: 1.25rem;
        padding: 8px;
        opacity: 0.5;
        transition: all 0.2s;
        border-radius: 8px;
        
        &:hover { 
          opacity: 1;
          background: rgba(0, 0, 0, 0.05);
        }
      }
      
      &.danger .icon-circle { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
      &.warning .icon-circle { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
      &.info .icon-circle { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
      &.form { justify-content: space-between; text-align: left; }
    }
    
    .modal-body {
      color: var(--text-muted);
      margin-bottom: 32px;
      font-size: 0.95rem;
      line-height: 1.6;
      
      &.form { text-align: left; }
    }
    
    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      
      button {
        padding: 12px 28px;
        border-radius: 10px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        font-size: 0.95rem;
        
        &.btn-cancel {
          background: var(--bg-main);
          color: var(--text-main);
          border: 1px solid var(--border-light);
          &:hover { background: var(--border-light); transform: translateY(-1px); }
        }
        
        &.btn-confirm {
          color: white;
          &.info { background: var(--primary); &:hover { background: var(--primary-hover); transform: translateY(-1px); } }
          &.danger { background: #ef4444; &:hover { background: #dc2626; transform: translateY(-1px); } }
          &.warning { background: #f59e0b; &:hover { background: #d97706; transform: translateY(-1px); } }
        }
      }
    }
  `],
  animations: [
    trigger('fade', [
      transition(':enter', [ style({ opacity: 0 }), animate('200ms ease-out', style({ opacity: 1 })) ]),
      transition(':leave', [ animate('150ms ease-in', style({ opacity: 0 })) ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [ style({ transform: 'scale(0.92)', opacity: 0 }), animate('300ms cubic-bezier(0.16, 1, 0.3, 1)', style({ transform: 'scale(1)', opacity: 1 })) ]),
      transition(':leave', [ animate('200ms cubic-bezier(0.4, 0, 1, 1)', style({ transform: 'scale(0.92)', opacity: 0 })) ])
    ])
  ]
})
export class ModalComponent {
  modalService = inject(ModalService);
}
