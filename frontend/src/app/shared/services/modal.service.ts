import { Injectable, signal, Type } from '@angular/core';

export interface ModalConfig {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type: 'info' | 'danger' | 'warning' | 'form';
  onConfirm: () => void;
  onCancel?: () => void;
  component?: Type<any>;
  componentData?: any;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  currentModal = signal<ModalConfig | null>(null);

  open(config: ModalConfig) {
    this.currentModal.set({
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      size: 'md',
      ...config
    });
  }

  close() {
    this.currentModal.set(null);
  }

  confirm() {
    const modal = this.currentModal();
    if (modal) {
      modal.onConfirm();
      this.close();
    }
  }

  cancel() {
    const modal = this.currentModal();
    if (modal?.onCancel) {
      modal.onCancel();
    }
    this.close();
  }
}
