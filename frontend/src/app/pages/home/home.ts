import { afterNextRender, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { BookHome } from '../../models/book.model';
import { Button } from "../../ui/components/button/button";
import { LucideAngularModule, Star } from 'lucide-angular';
import { BookService } from '../../services/http/book/book.service';
import { RouterModule } from '@angular/router';
import { SearchComponent } from '../../ui/components/search/search';
import { SearchEvent, SearchParams } from '../../models/searchParam.model';
import { AuthService } from '../../services/auth/auth.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        // Button,
        LucideAngularModule,
        RouterModule,
        SearchComponent,
    ],
    templateUrl: './home.html'
})

export class Home implements OnInit {
    private bookService = inject(BookService);
    private authService = inject(AuthService);
    private cdr = inject(ChangeDetectorRef);

    readonly Star = Star;
    readonly pageSize: number = 9;

  userIsConnected = signal<boolean>(false);


    loggedIn: boolean = false;
    books: BookHome[] = [];
    currentFilters: SearchParams | null = null;

    public total: number = 0;
    public currentPage: number = 0;
    public totalPages: number = 0;
    public isLoading: boolean = false;

    ngOnInit(): void {
      this.userIsConnected.set(this.authService.isLoggedIn);
      this.loadBooks();

    }

    loadBooks(page: number = this.currentPage): void {
        if (page < 0) {
            return;
        }
        this.isLoading = true;

      const bookObservable = this.currentFilters
            ? this.bookService.searchBooks(this.currentFilters, page, this.pageSize)
            : this.bookService.fetchBooks(page, this.pageSize);

        bookObservable.subscribe({
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

  get showSearch(): boolean {
    return this.userIsConnected();
  }

    handleSearchResults(results: SearchEvent): void {
            this.books = results.results.data;
            this.total = results.results.totalElements;
            // Correction ici : utilise totalPages du serveur ou recalcule
            this.totalPages = results.results.totalElements;
            this.currentPage = 0;
            this.currentFilters = results.filters;
            this.cdr.detectChanges();
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

