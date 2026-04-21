import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { Link } from "../components/link/link";
import { LucideAngularModule, MenuIcon } from 'lucide-angular';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [Link, LucideAngularModule],
    templateUrl: './header.html',
    styleUrl: './header.css'
})

export class Header {
    readonly MenuIcon = MenuIcon

    readonly menuOpen = signal(false);

    loggedIn = false;

    constructor(private cdr: ChangeDetectorRef) {}

    toggleMenu(): void {
        this.menuOpen.update((value) => !value);
        this.cdr.detectChanges();
    }

    closeMenu(): void {
        this.menuOpen.set(false);
        this.cdr.detectChanges();
    }
}
