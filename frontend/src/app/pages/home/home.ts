import { Component, inject, OnInit } from '@angular/core';
import { BookHome } from '../../models/book.model';
import { Button } from "../../ui/components/button/button";
import { LucideAngularModule, Star } from 'lucide-angular';
import { BookService } from '../../service/http/book/bookService';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        Button,
        LucideAngularModule,
    ],
    templateUrl: './home.html'
})

export class Home implements OnInit {
    readonly Star = Star;
    loggedIn: boolean = false;
    readonly pageSize: number = 9;

    private bookService = inject(BookService);
    books: BookHome[] = [];
    public total: number = 0;
    public currentPage: number = 0;
    public totalPages: number = 0;
    public isLoading: boolean = false;

    ngOnInit(): void {
        this.loadBooks();
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
            },
            error: (error) => {
                console.error('Erreur lors du chargement des livres :', error);
                this.books = [];
                this.total = 0;
                this.totalPages = 0;
            },
            complete: () => {
                this.isLoading = false;
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

