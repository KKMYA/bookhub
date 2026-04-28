import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ConfirmDialogService } from '../../../services/ui-ux/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [NgClass],
  templateUrl: './confirm-dialog.html'
})
export class ConfirmDialog {
  protected confirmDialog = inject(ConfirmDialogService);
}
