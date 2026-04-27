import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from "@angular/core";
import { BookDto } from "../../../models/book.model";
import { BookService } from "../../../services/http/book/book.service";
import { Router } from "@angular/router";
import { LucideAngularModule, Pencil, Plus, Trash2 } from "lucide-angular";
import { Subject } from "rxjs";

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

  books: BookDto[] = [];
  isLoading = false;

  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly Plus = Plus;

  ngOnInit(): void {
    queueMicrotask(() => {
      this.loadAllBooks();
    });
  }

  loadAllBooks(): void {
    this.isLoading = true;

    this.bookService.fetchBooksForDashboard()
      .subscribe({
        next: (res) => {
          this.books = res.data ?? [];
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.books = [];
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  onAddBook(): void {
    this.router.navigate(['/api/books/create']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
