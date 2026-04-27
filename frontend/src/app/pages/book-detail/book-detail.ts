import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../../models/book.model';
import { Observable } from 'rxjs';
import { Button } from "../../ui/components/button/button";
import { LucideAngularModule, Star } from 'lucide-angular';
import { BookService } from '../../services/http/book/book.service';
import { RatingService } from '../../services/http/rating/rating.service';
import { Rating } from '../../models/rating.model';
import { DatePipe } from '@angular/common';
import { response } from 'express';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [Button, LucideAngularModule, DatePipe],
  templateUrl: './book-detail.html',
})
export class BookDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  private bookService = inject(BookService);
  private ratingService = inject(RatingService);

  readonly Star = Star;

  bookId: number | null = null;
  comments: Rating[] = [];
  averageRating: number | null = null;

  book$!: Observable<Book>;
  book: Book | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (Number.isNaN(id)) {
      console.error('ID de livre invalide dans la route.');
      return;
    }

    this.bookId = id;

    // Chargement du livre
    this.bookService.getBookById(id).subscribe({
      next: (response) => {
        this.book = response;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du livre :', error);
        this.book = null;
      },
      complete: () => {
        this.cdr.detectChanges();
      },
    });

    // Chargement des commentaires
    this.ratingService.fetchRatings(id, 0, 10).subscribe({
      next: (response) => {

        this.comments = response.content ?? [];
        this.cdr.detectChanges();
        console.log(response.content)

      },
      error: (error) => {
        console.error(error);
        this.comments = [];
      }
    });
  }
}
