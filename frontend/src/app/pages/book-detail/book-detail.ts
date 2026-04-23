import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../service/http/book/bookService';
import { Book } from '../../models/book.model';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-book-detail',
    imports: [],
    templateUrl: './book-detail.html'
})

export class BookDetail implements OnInit {
    bookId!: number;
    
    private bookService = inject(BookService);
    book$!: Observable<Book>;

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.bookId = +this.route.snapshot.params['id'];

        
        this.book$ = this.bookService.getBookById(this.bookId);
        
        this.book$.subscribe(book => console.log(book));
    }
}
