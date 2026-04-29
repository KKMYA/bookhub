import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../../models/book.model';
import { finalize } from 'rxjs';
import { Button } from "../../ui/components/button/button";
import { LucideAngularModule, Star } from 'lucide-angular';
import { BookService } from '../../services/http/book/book.service';
import { RatingService } from '../../services/http/rating/rating.service';
import { Rating } from '../../models/rating.model';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateRatingDto } from '../../models/create-rating.dto';
import { UpdateRatingDto } from '../../models/update-rating.dto';
import { PopupService } from '../../services/ui-ux/popup.service';
import { AuthService } from '../../services/auth/auth.service';
import { ConfirmDialogService } from '../../services/ui-ux/confirm-dialog.service';
import { ReservationService } from '../../services/http/reservation/reservation.service';
import { BookComment } from '../../models/comment.model';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [Button, LucideAngularModule, DatePipe, FormsModule, NgClass],
  templateUrl: './book-detail.html'
})
export class BookDetail implements OnInit {
  // Services Angular et applicatifs
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private bookService = inject(BookService);
  private ratingService = inject(RatingService);
  private authService = inject(AuthService);
  private confirmDialog = inject(ConfirmDialogService);
  private reservationService = inject(ReservationService);

  // Service exposé au template pour afficher les popups
  protected popupService = inject(PopupService);

  // Icône utilisée dans le template
  readonly Star = Star;

  // Utilisateur connecté
  currentUserId: number | null = null;

  // Livre affiché
  book: Book | null = null;
  bookId: number | null = null;
  reserveLoading: boolean = false;
  hasActiveReservation: boolean = false;

  // Variables concernant les commentaires
  // Commentaires affichés
  comments: Rating[] = [];

  // Pagination des commentaires
  ratingsCurrentPage = 0;
  ratingsTotalPages = 0;
  ratingsTotal = 0;
  readonly ratingsPageSize = 10;
  isLoadingRatings = false;

  // Édition d’un commentaire existant
  editingRatingId: number | null = null;
  editComment = '';
  editRating = 0;

  // Création d’un nouveau commentaire
  isSubmittingComment = false;
  newComment = '';
  newRating = 0;

  /**
   * Initialise la page détail :
   * - récupère l'id du livre depuis l'URL ;
   * - récupère l'utilisateur connecté ;
   * - charge le livre ;
   * - charge les commentaires validés avec pagination.
   */
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

    this.loadRatings(0);
  }

  /**
   * Charge les commentaires validés du livre courant.
   *
   * @param page numéro de page demandé
   */
  loadRatings(page: number = this.ratingsCurrentPage): void {
    if (!this.bookId || page < 0) return;

    this.isLoadingRatings = true;

    this.ratingService.fetchRatings(this.bookId, page, this.ratingsPageSize).subscribe({
      next: (response) => {
        this.comments = response.content ?? [];

        this.ratingsTotal = response.totalElements;
        this.ratingsCurrentPage = response.number ?? page;
        this.ratingsTotalPages =
          response.totalPages ?? Math.ceil(response.totalElements / this.ratingsPageSize);

        this.isLoadingRatings = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.comments = [];
        this.isLoadingRatings = false;
        this.cdr.detectChanges();
      }
    });
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

  /**
   * Passe à la page précédente des commentaires.
   */
  goToPreviousRatingsPage(): void {
    if (this.ratingsCurrentPage > 0 && !this.isLoadingRatings) {
      this.loadRatings(this.ratingsCurrentPage - 1);
    }
  }

  /**
   * Passe à la page suivante des commentaires.
   */
  goToNextRatingsPage(): void {
    if (
      this.ratingsCurrentPage + 1 < this.ratingsTotalPages &&
      !this.isLoadingRatings
    ) {
      this.loadRatings(this.ratingsCurrentPage + 1);
    }
  }

  /**
   * Définit la note sélectionnée pour un nouveau commentaire.
   *
   * @param star note choisie entre 1 et 5
   */
  setRating(star: number): void {
    this.newRating = star;
  }

  /**
   * Crée un nouveau commentaire pour le livre courant.
   *
   * Le commentaire n'est pas ajouté directement à la liste,
   * car il repasse par la modération côté backend.
   */
  submitComment(): void {
    if (!this.bookId || !this.newComment.trim() || this.newRating === 0) return;

    const dto: CreateRatingDto = {
      note: this.newRating,
      commentaire: this.newComment.trim(),
    };

    this.isSubmittingComment = true;

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

  /**
   * Active le mode édition pour un commentaire.
   *
   * @param rating commentaire à modifier
   */
  onEditRating(rating: Rating): void {
    this.editingRatingId = rating.idRating;
    this.editComment = rating.commentaire;
    this.editRating = rating.note;
  }

  /**
   * Annule l'édition en cours.
   */
  cancelEdit(): void {
    this.editingRatingId = null;
    this.editComment = '';
    this.editRating = 0;
  }

  /**
   * Enregistre la modification d'un commentaire.
   *
   * Après modification, le commentaire est retiré de la liste publique
   * car il repasse en modération côté backend.
   *
   * @param idRating identifiant du commentaire modifié
   */
  confirmEdit(idRating: number): void {
    if (!idRating || !this.editComment.trim() || this.editRating === 0) return;

    const dto: UpdateRatingDto = {
      note: this.editRating,
      commentaire: this.editComment.trim(),
    };

    this.ratingService.updateRating(idRating, dto).subscribe({
      next: () => {
        const rating = this.comments.find(r => r.idRating === idRating);

        if (rating) {
          rating.note = dto.note;
          rating.commentaire = dto.commentaire;
          rating.moderation = false;
        }
        this.comments = this.comments.filter(r => r.idRating !== idRating);
        this.comments = this.comments.filter(r => r.idRating !== idRating);

        this.cancelEdit();

        this.popupService.show(
          'Commentaire modifié avec succès, ce dernier est désormais en cours de modération',
          'success'
        );

        this.cdr.detectChanges();
      },
      error: () => {
        this.popupService.show(
          'Une erreur est survenue lors de la modification',
          'error'
        );
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Demande confirmation avant suppression d'un commentaire.
   *
   * @param idRating identifiant du commentaire à supprimer
   */
  onDeleteRating(idRating: number): void {
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
            this.comments = this.comments.filter(r => r.idRating !== idRating);
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
}
