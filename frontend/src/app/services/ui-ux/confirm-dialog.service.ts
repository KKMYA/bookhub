import { Injectable, signal } from '@angular/core';

export type ConfirmDialogType  = 'danger' | 'warning' | 'info' | 'validate';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: ConfirmDialogType;
  onConfirm: () => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  dialog = signal<ConfirmDialogData | null>(null);

  open(data: ConfirmDialogData) {
    this.dialog.set(data);
  }

  close() {
    this.dialog.set(null);
  }

  confirm() {
    const current = this.dialog();

    if (!current) return;

    current.onConfirm();
    this.close();
  }
}
