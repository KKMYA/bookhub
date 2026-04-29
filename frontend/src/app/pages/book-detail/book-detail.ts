import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../../models/book.model';
import { Observable } from 'rxjs';
import { Button } from "../../ui/components/button/button";
import { LucideAngularModule, Star } from 'lucide-angular';
import { BookService } from '../../services/http/book/book.service';
import { RatingService } from '../../services/http/rating/rating.service';
import { ReservationService } from '../../services/http/reservation/reservation.service';

@Component({
    selector: 'app-book-detail',
    standalone: true,
    imports: [Button, LucideAngularModule],
    templateUrl: './book-detail.html'
})

export class BookDetail implements OnInit {
    private route = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    private bookService = inject(BookService);
    private ratingService = inject(RatingService);
    private reservationService = inject(ReservationService);

    readonly Star = Star;
    readonly commentsPerPage: number = 2;

    bookId: number | null = null;
    currentCommentPage: number = 0;
    comments: BookComment[] = [];
    reserveLoading: boolean = false;
    hasActiveReservation: boolean = false;

    book$!: Observable<Book>;
    book: Book | null = null;

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));

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
                // this.cdr.detectChanges();
            }
        });

        this.ratingService.fetchRatings(0, 2, id).subscribe({
            next: (response) => {
                console.log('Commentaires chargés :', response);

                // this.comments = response;
            },
            error: (error) => {
                console.error('Erreur lors du chargement des commentaires :', error);
                this.comments = [];
            }
        });

        this.currentCommentPage = 0;
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

    get paginatedComments(): BookComment[] {
        const start = this.currentCommentPage * this.commentsPerPage;
        const end = start + this.commentsPerPage;
        return this.comments.slice(start, end);
    }

    get totalCommentPages(): number {
        return Math.ceil(this.comments.length / this.commentsPerPage);
    }

    goToPreviousCommentsPage(): void {
        if (this.currentCommentPage > 0) {
            this.currentCommentPage--;
        }
    }

    goToNextCommentsPage(): void {
        if (this.currentCommentPage + 1 < this.totalCommentPages) {
            this.currentCommentPage++;
        }
    }
}
