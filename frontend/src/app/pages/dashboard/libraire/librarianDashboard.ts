import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { BookDto } from "../../../models/book.model";
import { BookService } from "../../../services/http/book/book.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LucideAngularModule, Pencil, Plus, Trash2 } from "lucide-angular";
import { Subject } from "rxjs";



//WIP a deplacer
type ToastState = { show: boolean, message: string, type: 'success' | 'error' };
@Component({
  selector: 'app-librarian-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './librarianDashboard.html'
})
export class LibrarianDashboard implements OnInit, OnDestroy {

  private bookService = inject(BookService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  private cdr = inject(ChangeDetectorRef);
  books = signal<BookDto[]>([]);
  toast = signal<ToastState>({ show: false, message: '', type: 'success' });

// mode edition
private route = inject(ActivatedRoute);
  isEditMode = signal(false);
  bookId: number | null = null;


  //pagination
    public total: number = 0;
    public currentPage: number = 0;
    public totalPages: number = 0;
    readonly pageSize: number = 9;

  // books: BookDto[] = [];
  isLoading = false;

  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly Plus = Plus;

  ngOnInit(): void {
      this.loadAllBooks();
  }


  loadAllBooks(page: number = this.currentPage): void {
    if (page < 0) {
      return;
    }
    this.isLoading = true;

    this.bookService.fetchBooksForDashboard()
      .subscribe({
        next: (res) => {

          this.isLoading = false;
          this.books.set(res.data ?? []);
          this.total = res.totalElements;
          this.currentPage = page;
          this.totalPages = Math.ceil(this.total / this.pageSize);
          this.cdr.detectChanges();
        },
        error: () => {
          this.books.set([]);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  onAddBook(): void {
    this.router.navigate(['/api/books/create']);
  }
  onEditBook(bookId: number): void {
    this.router.navigate(['/api/books/edit', bookId]);
  }
  async deleteBook(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      try {
        await this.bookService.deleteBook(id);
        this.toast.set({ show: true, message: 'Livre supprimé !', type: 'success' });
        this.loadAllBooks(); // On rafraîchit la liste
      } catch (err) {
        this.toast.set({ show: true, message: 'Erreur lors de la suppression', type: 'error' });
      }
    }
  }


  // Pagination methods
    goToPreviousPage(): void {
        if (this.currentPage > 0 && !this.isLoading) {
            this.loadAllBooks(this.currentPage - 1);
        }
    }

    goToNextPage(): void {
        if (this.currentPage + 1 < this.totalPages && !this.isLoading) {
            this.loadAllBooks(this.currentPage + 1);
        }
    }



  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
