import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-link',
    imports: [
        RouterModule
    ],
    templateUrl: './link.html'
})

export class Link {

    @Input() href = '';


}
