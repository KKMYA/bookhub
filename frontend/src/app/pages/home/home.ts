import { Component, inject, OnInit} from '@angular/core';
import { Book } from '../../models/book.model';
import { Button } from "../../ui/components/button/button";
import { LucideAngularModule, Star } from 'lucide-angular';
import { Modal } from "../../ui/components/modal/modal";
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
  books!: Book[];
  // books$! : Observable<Book[]>;
  public total: number = 0;

  ngOnInit(): void {
  this.bookService.fetchBooks().then((response) => {
    this.books = response.data;
    this.total = response.totalElements;
    console.log("Livres chargés :", this.books);
  });
  }
}

