import { Component, EventEmitter, Input as InputAngular, Output } from '@angular/core';

@Component({
    selector: 'app-input',
    imports: [],
    templateUrl: './input.html'
})

export class Input {
    @InputAngular() id: string | null = null;
    @InputAngular() name: string | null = null;
    @InputAngular() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' = 'text';
    @InputAngular() placeholder = '';
    @InputAngular() value = '';
    @InputAngular() autocomplete: string | null = null;
    @InputAngular() required = false;
    @InputAngular() disabled = false;
    @InputAngular() className = '';

    @Output() valueChange = new EventEmitter<string>();
    @Output() blurred = new EventEmitter<FocusEvent>();

    get inputClasses(): string {
        const base = 'w-full border border-gray-300 rounded-xl px-4 py-2';
        const custom = this.className.trim() ? ` ${this.className.trim()}` : '';

        return `${base}${custom}`;
    }

    onInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.value = target.value;
        this.valueChange.emit(target.value);
    }

    onBlur(event: FocusEvent): void {
        this.blurred.emit(event);
    }
}
