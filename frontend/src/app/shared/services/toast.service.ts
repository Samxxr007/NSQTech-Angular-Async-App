import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(toast: Omit<Toast, 'id'>) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id, duration: toast.duration || 5000 };
    
    this.toasts.update(t => [...t, newToast]);

    if (newToast.duration > 0) {
      setTimeout(() => this.remove(id), newToast.duration);
    }
  }

  success(title: string, message: string) {
    this.show({ type: 'success', title, message });
  }

  error(title: string, message: string) {
    this.show({ type: 'error', title, message });
  }

  info(title: string, message: string) {
    this.show({ type: 'info', title, message });
  }

  remove(id: string) {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }
}
