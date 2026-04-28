import { Injectable, signal } from '@angular/core';

type PopupType = 'success' | 'error' | 'warning';

@Injectable({ providedIn: 'root' })
export class PopupService {

  message = signal<string | null>(null);
  type = signal<PopupType | null>(null);

  show(msg: string, type: PopupType) {
    this.message.set(msg);
    this.type.set(type);

    setTimeout(() => {
      this.message.set(null);
      this.type.set(null);
    }, 3000);
  }
}
