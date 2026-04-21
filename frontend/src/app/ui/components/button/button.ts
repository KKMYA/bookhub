import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-button',
    imports: [],
    templateUrl: './button.html'
})


export class Button {
    @Input() disabled: boolean = false;
    @Input() type: 'button' | 'submit' | 'reset' = 'button';
}
