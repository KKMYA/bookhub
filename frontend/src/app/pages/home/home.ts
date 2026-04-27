import { afterNextRender, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { BookHome } from '../../models/book.model';
import { Button } from "../../ui/components/button/button";
import { LucideAngularModule, Star } from 'lucide-angular';
import { BookService } from '../../services/http/book/book.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        Button,
        LucideAngularModule,
        RouterModule,
    ],
    templateUrl: './home.html'
})

export class Home implements OnInit {
    private bookService = inject(BookService);
    private cdr = inject(ChangeDetectorRef);

    readonly Star = Star;
    readonly pageSize: number = 9;

    loggedIn: boolean = false;
    books: BookHome[] = [];

    public total: number = 0;
    public currentPage: number = 0;
    public totalPages: number = 0;
    public isLoading: boolean = false;

    ngOnInit(): void {
      queueMicrotask(() => {
        this.loadBooks();
      });
    }

    loadBooks(page: number = this.currentPage): void {
        if (page < 0) {
            return;
        }
        this.isLoading = true;
        this.bookService.fetchBooks(page, this.pageSize).subscribe({
            next: (response) => {
                this.books = response.data;
                this.total = response.totalElements;
                this.currentPage = page;
                this.totalPages = Math.ceil(this.total / this.pageSize);
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Erreur lors du chargement des livres :', error);
                this.books = [];
                this.total = 0;
                this.totalPages = 0;
            },
            complete: () => {
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    goToPreviousPage(): void {
        if (this.currentPage > 0 && !this.isLoading) {
            this.loadBooks(this.currentPage - 1);
        }
    }

    goToNextPage(): void {
        if (this.currentPage + 1 < this.totalPages && !this.isLoading) {
            this.loadBooks(this.currentPage + 1);
        }
    }
}

