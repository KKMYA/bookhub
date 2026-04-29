import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../../models/book.model';
import { finalize, Observable, of } from 'rxjs';
import { Button } from "../../ui/components/button/button";
import { LucideAngularModule, Star } from 'lucide-angular';
import { BookService } from '../../services/http/book/book.service';
import { RatingService } from '../../services/http/rating/rating.service';
import { Rating } from '../../models/rating.model';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateRatingDto } from '../../models/create-rating.dto';
import { PopupService } from '../../services/ui-ux/popup.service';
import { AuthService } from '../../services/auth/auth.service';
import { ConfirmDialogService } from '../../services/ui-ux/confirm-dialog.service';
import { ReservationService } from '../../services/http/reservation/reservation.service';

@Component({
    selector: 'app-book-detail',
    standalone: true,
    imports: [Button, LucideAngularModule],
    templateUrl: './book-detail.html'
})
export class BookDetail implements OnInit {
  // Services
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private bookService = inject(BookService);
  private ratingService = inject(RatingService);
  protected popupService = inject(PopupService);
  private authService = inject(AuthService);
  private confirmDialog = inject(ConfirmDialogService);
   private reservationService = inject(ReservationService);

  // Variables concernant un user
  currentUserId: number | null = null;

    bookId: number | null = null;
    currentCommentPage: number = 0;
    comments: BookComment[] = [];
    reserveLoading: boolean = false;
    hasActiveReservation: boolean = false;

    book$!: Observable<Book>;
    book: Book | null = null;
  // Variables concernant les commentaires
  readonly Star = Star;
  editingRatingId: number | null = null;
  isSubmittingComment = false;
  editComment = '';
  editRating = 0;
  newComment: string = '';
  newRating: number = 0;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.currentUserId = this.authService.getUserId();

    if (Number.isNaN(id)) {
      console.error('ID de livre invalide dans la route.');
      return;
    }

    this.bookId = id;

        this.bookService.getBookById(id).subscribe({
            next: (response) => {
                this.hasActiveReservation = response.hasActiveReservation ?? false;

                this.book = response;
            },
            error: (error) => {
                console.error('Erreur lors du chargement du livre :', error);
                this.book = null;
            },
            complete: () => {
                this.cdr.detectChanges();
            }
        });

    // Chargement des commentaires
    this.ratingService.fetchRatings(id, 0, 10).subscribe({
      next: (response) => {
        this.comments = response.content ?? [];
        this.cdr.detectChanges();
        console.log(response.content);
      },
      error: (error) => {
        console.error(error);
        this.comments = [];
      },
    });
  }

  setRating(star: number) {
    this.newRating = star;
  }

  submitComment() {
    if (!this.book || !this.newComment.trim() || this.newRating === 0) return;

    const dto: CreateRatingDto = {
      note: this.newRating,
      commentaire: this.newComment.trim(),
    };

    this.isSubmittingComment = true;

    if (this.bookId != null) {
      this.ratingService
        .createRating(this.bookId, dto)
        .pipe(
          finalize(() => {
            this.isSubmittingComment = false;

            this.cdr.detectChanges();
          }),
        )
        .subscribe({
          next: () => {
            this.newComment = '';
            this.newRating = 0;
            this.popupService.show(
              'Votre commentaire a été envoyé et sera publié après modération.',
              'success',
            );
          },
          error: (err) => {
            console.error('ERROR', err);
            this.popupService.show('Une erreur est survenue.', 'error');
          },
        });
    }
  }

  onEditRating(rating: Rating) {
    this.editingRatingId = rating.idRating;
    this.editComment = rating.commentaire;
    this.editRating = rating.note;
  }

    reserveBook(): void {
        if (this.bookId === null) return;

        if (this.book?.hasActiveReservation) {
            alert('Vous avez déjà une réservation active pour ce livre.');

            return;
        }

        this.reserveLoading = true;

        this.reservationService.createReservation(this.bookId).subscribe({
            next: () => {
                alert('Réservation réussie !');

                this.hasActiveReservation = true;
            },
            error: (error) => {
                console.error('Erreur lors de la réservation :', error);

                alert('Erreur lors de la réservation. Veuillez réessayer plus tard.');
            },
            complete: () => {
                this.reserveLoading = false;

                this.cdr.detectChanges();
            }
        });
    }

    //get paginatedComments(): BookComment[] {
    //    const start = this.currentCommentPage * this.commentsPerPage;
    //    const end = start + this.commentsPerPage;
    //    return this.comments.slice(start, end);
    //}

    get totalCommentPages(): number {
        return Math.ceil(this.comments.length / this.commentsPerPage);
    }

    //get paginatedComments(): BookComment[] {
    //    const start = this.currentCommentPage * this.commentsPerPage;
    //    const end = start + this.commentsPerPage;
    //    return this.comments.slice(start, end);
    //}
  cancelEdit() {
    this.editingRatingId = null;
    this.editComment = '';
    this.editRating = 0;
  }

  // Méthode onClick pour l'édition d'un commentaire
  confirmEdit(idRating: number) {
    if(!idRating || !this.editComment.trim() || this.editRating === 0) return;

    const dto: CreateRatingDto = {
      note: this.editRating,
      commentaire: this.editComment.trim(),
    };

    this.ratingService.updateRating(idRating, dto).subscribe({
      next: () => {
      const rating = this.comments.find(r => r.idRating === idRating);

      if(rating){
        rating.note = dto.note;
        rating.commentaire = dto.commentaire;
        rating.moderation = false;
      }
      this.comments = this.comments.filter(r => r.idRating !== idRating);

      this.cancelEdit();
      this.popupService.show(
        'Commentaire modifié avec succès, ce dernier est désormais en cours de modération',
        'success'
      );
      },
      error: () => {
        this.popupService.show(
          'Une erreur est survenue lors de la modification',
          'error'
        )
      }
    });
  }

  // Méthode onClick pour la suppression d'un commentaire
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
            this.comments = this.comments.filter((r) => r.idRating !== idRating);
            this.popupService.show('Commentaire supprimé', 'success');
          },
          error: () => {
            this.popupService.show('Erreur lors de la suppression', 'error');
          },
        });
      },
    });
  }

  protected readonly RatingService = RatingService;
}
