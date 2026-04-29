import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { BookDto } from "../../../models/book.model";
import { BookService } from "../../../services/http/book/book.service";
import { ActivatedRoute, Router } from '@angular/router';
import { Check, LucideAngularModule, Pencil, Plus, Trash2, X } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';
import { Rating } from '../../../models/rating.model';
import { RatingService } from '../../../services/http/rating/rating.service';
import { ConfirmDialogService } from '../../../services/ui-ux/confirm-dialog.service';
import { PopupService } from '../../../services/ui-ux/popup.service';



//WIP a deplac
@Component({
  selector: 'app-librarian-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './librarianDashboard.html',
})
export class LibrarianDashboard implements OnInit, OnDestroy {
  private bookService = inject(BookService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  private cdr = inject(ChangeDetectorRef);
  private ratingService = inject(RatingService);
  private confirmDialog = inject(ConfirmDialogService);
  protected popupService = inject(PopupService);

  books = signal<BookDto[]>([]);

  pendingRatings: Rating[] = [];
  isLoadingRatings = false;

  // mode edition
  private route = inject(ActivatedRoute);
  isEditMode = signal(false);
  bookId: number | null = null;

  //pagination
  public total: number = 0;
  public currentPage: number = 0;
  public totalPages: number = 0;
  readonly pageSize: number = 9;
  //pagination ratings
  ratingsCurrentPage = 0;
  ratingsTotal = 0;
  ratingsTotalPages = 0;
  readonly ratingsPageSize = 10;
  // books: BookDto[] = [];
  isLoading = false;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly Plus = Plus;

  ngOnInit(): void {
    this.loadAllBooks();
    this.loadPendingRatings(0);
  }

  loadAllBooks(page: number = this.currentPage): void {
    if (page < 0) {
      return;
    }
    this.isLoading = true;

    this.bookService.fetchBooksForDashboard(page, this.pageSize).subscribe({
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
      },
    });
  }

  onAddBook(): void {
    this.router.navigate(['/api/books/create']);
  }

  onOpenReservations(): void {
    this.router.navigate(['/dashboard/librarian/reservations']);
  }

  onOpenReturns(): void {
    this.router.navigate(['/dashboard/librarian/returns']);
  }

  onEditBook(bookId: number): void {
    this.router.navigate(['/api/books/edit', bookId]);
  }
  deleteBook(id: number) {
    this.confirmDialog.open({
      title: 'Supprimer le livre',
      message: 'Êtes-vous sûr de vouloir supprimer définitivement ce livre ?',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger',
      onConfirm: async () => {
        try {
          await this.bookService.deleteBook(id);
          this.popupService.show('Livre supprimé avec succès', 'success');
          this.loadAllBooks();
        } catch (err) {
          this.popupService.show('Erreur lors de la suppression du livre', 'error');
        }
      }
    });
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
  // GESTION DES AVIS EN ATTENTE DE MODERATION

  // Chargement des avis non modérés
  loadPendingRatings(page: number = this.ratingsCurrentPage): void {
    this.isLoadingRatings = true;

    this.ratingService.fetchPendingRatings(page, this.ratingsPageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.pendingRatings = response.content ?? [];
          this.ratingsTotal = response.totalElements;
          this.ratingsCurrentPage = response.number ?? page;
          this.ratingsTotalPages =
            response.totalPages ?? Math.ceil(response.totalElements / this.ratingsPageSize);
          this.isLoadingRatings = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.pendingRatings = [];
          this.isLoadingRatings = false;
          this.cdr.detectChanges();
        }
      });
  }

  onValidateRating(idRating: number): void {
    if (!idRating) return;

    this.confirmDialog.open({
      title: 'Valider le commentaire',
      message: 'Êtes-vous sûr de vouloir valider le commentaire ?',
      confirmText: 'Valider',
      cancelText: 'Annuler',
      type: 'validate',

      onConfirm: () => {
        this.ratingService.validateRating(idRating).subscribe({
          next: () => {
            this.pendingRatings = this.pendingRatings.filter((r) => r.idRating !== idRating);

            this.popupService.show('Commentaire validé', 'success');
            this.cdr.detectChanges();
          },

          error: () => {
            this.popupService.show('Erreur lors de la validation', 'error');
            this.cdr.detectChanges();
          },
        });
      },
    });
  }

  onDeleteRating(idRating: number) {
    if (!idRating) return;

    this.confirmDialog.open({
      title: 'Supprimer le commentaire',
      message: 'Êtes-vous sûr de vouloir supprimer ce commentaire ?',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger',
      onConfirm: () => {
        this.ratingService.deleteRating(idRating).subscribe({
          next: () => {
            this.pendingRatings = this.pendingRatings.filter((r) => r.idRating !== idRating);

            this.popupService.show('Commentaire supprimé', 'success');

            this.cdr.detectChanges();
          },
          error: () => {
            this.popupService.show('Erreur lors de la suppression', 'error');
            this.cdr.detectChanges();
          },
        });
      },
    });
  }

  // Pagination methods
  goToPreviousRatingsPage(): void {
    if (this.ratingsCurrentPage > 0 && !this.isLoadingRatings) {
      this.loadPendingRatings(this.ratingsCurrentPage - 1);
    }
  }

  goToNextRatingsPage(): void {
    if (this.ratingsCurrentPage + 1 < this.ratingsTotalPages && !this.isLoadingRatings) {
      this.loadPendingRatings(this.ratingsCurrentPage + 1);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly X = X;
  protected readonly Check = Check;
}
