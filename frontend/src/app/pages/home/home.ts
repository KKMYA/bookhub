import { Component, inject, OnInit } from '@angular/core';
import { BookHome } from '../../models/book.model';
import { Button } from "../../ui/components/button/button";
import { LucideAngularModule, Star } from 'lucide-angular';
import { Observable } from 'rxjs/internal/Observable';
import { BookService } from '../../service/http/book/bookService';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        AsyncPipe,
        Button,
        LucideAngularModule,
    ],
    templateUrl: './home.html'
})

export class Home implements OnInit {
    readonly Star = Star;
    loggedIn: boolean = false;

    private bookService = inject(BookService);
    books$!: Observable<BookHome[]>;
  public total: number = 0;

    ngOnInit(): void {
        this.books$ =this.bookService.fetchBooks().then((response) => {
          this.books = response.data;
          this.total = response.totalElements;
          console.log("Livres chargés :", this.books);
        });

        this.books$.subscribe(books => console.log(books));
    }

}

