import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule, XIcon } from 'lucide-angular';

@Component({
    selector: 'app-modal',
    imports: [LucideAngularModule],
    templateUrl: './modal.html',
})

export class Modal { 
    protected readonly XIcon = XIcon;

    @Input() triggerLabel = 'Ouvrir';
    @Input() title = 'Modal';
    @Input() confirmLabel = 'Confirmer';
    @Input() cancelLabel = 'Annuler';
    @Input() showConfirmButton = true;
    @Input() showCancelButton = true;
    @Input() confirmDisabled = false;
    @Input() closeOnBackdropClick = true;

    @Input() open = false;

    @Output() openChange = new EventEmitter<boolean>();
    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    openModal(): void {
        this.setOpen(true);
    }

    closeModal(): void {
        this.setOpen(false);
        this.cancel.emit();
    }

    onBackdropClick(event: MouseEvent): void {
        if (!this.closeOnBackdropClick) {
            return;
        }

        if (event.target === event.currentTarget) {
            this.closeModal();
        }
    }

    onConfirm(): void {
        this.confirm.emit();
        this.setOpen(false);
    }

    private setOpen(value: boolean): void {
        this.open = value;
        this.openChange.emit(value);
    }
}
