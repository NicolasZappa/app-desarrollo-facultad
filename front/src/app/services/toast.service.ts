import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private nextId = 0;

  success(message: string): void {
    this.add({ type: 'success', message });
  }

  error(message: string): void {
    this.add({ type: 'error', message });
  }

  info(message: string): void {
    this.add({ type: 'info', message });
  }

  remove(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  private add(t: Omit<Toast, 'id'>): void {
    const id = this.nextId++;
    this.toasts.update(list => [...list, { id, ...t }]);
    setTimeout(() => this.remove(id), 4000);
  }
}
