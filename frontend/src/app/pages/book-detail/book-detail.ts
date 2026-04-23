import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../../models/book.model';
import { Observable, of } from 'rxjs';
import { Button } from "../../ui/components/button/button";
import { LucideAngularModule, Star } from 'lucide-angular';

@Component({
    selector: 'app-book-detail',
    standalone: true,
    imports: [Button, LucideAngularModule],
    templateUrl: './book-detail.html'
})

export class BookDetail implements OnInit {
    readonly Star = Star;
    readonly commentsPerPage: number = 2;

    bookId: number | null = null;
    currentCommentPage: number = 0;
    comments: BookComment[] = [];

    book$!: Observable<Book>;
    book: Book | null = null;

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));

        if (Number.isNaN(id)) {
            console.error('ID de livre invalide dans la route.');
            return;
        }

        this.bookId = id;

        const exampleBook: Book = {
            idBook: this.bookId,
            isbn: '9782070368228',
            nbExemplaires: 12,
            nbExemplairesDisponibles: 7,
            noteMoyenne: 4.6,
            available: true,
            auteur: 'Antoine de Saint-Exupery',
            titre: 'Le Petit Prince',
            description: 'Un conte poetique et philosophique autour de la rencontre, de l amitie et du sens de la vie.',
            categorieLibelle: 'Roman',
            couvertureUrl: 'https://static.fnac-static.com/multimedia/PE/Images/FR/NR/a6/d8/1d/1956006/1507-1/tsp20260402074953/Le-Petit-Prince.jpg'
        };

        this.book$ = of(exampleBook);
        this.book$.subscribe((book) => {
            this.book = book;
        });

        this.comments = [
            {
                id: 1,
                author: 'Camille',
                rating: 5,
                content: 'Une lecture courte mais marquante. Beaucoup de profondeur malgre la simplicite apparente.'
            },
            {
                id: 2,
                author: 'Noah',
                rating: 4,
                content: 'Tres beau livre, ideal a relire a differents ages. La couverture est aussi tres jolie.'
            },
            {
                id: 3,
                author: 'Lina',
                rating: 5,
                content: 'Je recommande completement. Le style est poetique et les themes restent tres actuels.'
            }
        ];

        this.currentCommentPage = 0;
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
