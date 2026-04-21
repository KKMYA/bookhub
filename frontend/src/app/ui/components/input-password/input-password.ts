import { Component, EventEmitter, Input as InputAngular, Output, signal } from '@angular/core';
import { EyeIcon, EyeOffIcon, LucideAngularModule } from 'lucide-angular';
import { Input } from '../input/input';

@Component({
    selector: 'app-input-password',
    imports: [Input, LucideAngularModule],
    templateUrl: './input-password.html'
})
export class PasswordInput {
    readonly EyeIcon = EyeIcon;
    readonly EyeOffIcon = EyeOffIcon;

    @InputAngular() id: string | null = null;
    @InputAngular() name: string | null = null;
    @InputAngular() placeholder = '';
    @InputAngular() value = '';
    @InputAngular() autocomplete: string | null = 'current-password';
    @InputAngular() required = false;
    @InputAngular() disabled = false;
    @InputAngular() className = '';

    @Output() valueChange = new EventEmitter<string>();
    @Output() blurred = new EventEmitter<FocusEvent>();

    private readonly showPassword = signal(false);

    get isPasswordVisible(): boolean {
        return this.showPassword();
    }

    get currentType(): 'text' | 'password' {
        return this.isPasswordVisible ? 'text' : 'password';
    }

    get inputClassName(): string {
        const custom = this.className.trim();
        return custom ? `${custom} pr-11` : 'pr-11';
    }

    get toggleAriaLabel(): string {
        return this.isPasswordVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe';
    }

    onValueChange(value: string): void {
        this.value = value;
        this.valueChange.emit(value);
    }

    onBlur(event: FocusEvent): void {
        this.blurred.emit(event);
    }

    toggleVisibility(): void {
        if (this.disabled) {
            return;
        }

        this.showPassword.update((current) => !current);
    }
}