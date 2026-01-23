import { Injectable } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
interface Toast {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    toasts: Toast[] = [];

  success(message: string) {
    this.addToast(message, 'success');
  }

  error(message: string) {
    this.addToast(message, 'error');
  }

  warning(message: string) {
    this.addToast(message, 'warning');
  }

  info(message: string) {
    this.addToast(message, 'info');
  }

  private addToast(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info'
  ) {
    this.toasts.push({ message, type });

    // Auto remove after 3 seconds
    setTimeout(() => {
      this.toasts.shift();
    }, 3000);
  }

  removeToast(index: number) {
    this.toasts.splice(index, 1);
  }
}
