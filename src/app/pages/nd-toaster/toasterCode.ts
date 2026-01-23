export const toastHtml = `<div class="nd-toast-container">
  <div
    role="alert"
    *ngFor="let toast of toastService.toasts; let i = index"
    class="nd-toast"
    [class.success]="toast.type === 'success'"
    [class.error]="toast.type === 'error'"
    [class.warning]="toast.type === 'warning'"
    [class.info]="toast.type === 'info'">
    <span>{{ toast.message }}</span>
    <button class="nd-close-btn" (click)="removeToast(i)">×</button>
  </div>
</div>

`;
export const toastCss = `.nd-toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  z-index: 9999;
}

.nd-toast {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 250px;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  font-size: 14px;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.5s ease-in-out;
}

.success {
  background-color: #4caf50;
}
.error {
  background-color: #ed685f;
}
.warning {
  background-color: #ff9800;
}
.info {
  background-color: #2196f3;
}

.nd-close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;
export const toastTS = `export class ToasterComponent {
  constructor(public toastService: ToastService) {}

  removeToast(index: number) {
    this.toastService.removeToast(index);
  }
}`;
export const toastService = `import { Injectable } from '@angular/core';

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
`;
