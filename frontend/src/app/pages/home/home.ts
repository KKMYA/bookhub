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

    // books: Book[] = [
    //     {
    //         id: 1,
    //         title: 'Le Seigneur des Anneaux',
    //         author: 'J.R.R. Tolkien',
    //         rating: 4.5,
    //         imageUrl: 'https://m.media-amazon.com/images/I/71ADh-KokpL._AC_UF1000,1000_QL80_.jpg',
    //         available: true
    //     },
    //     {
    //         id: 2,
    //         title: 'Le Seigneur des Anneaux',
    //         author: 'J.R.R. Tolkien',
    //         rating: 4.5,
    //         imageUrl: 'https://m.media-amazon.com/images/I/71ADh-KokpL._AC_UF1000,1000_QL80_.jpg',
    //         available: true
    //     },
    //     {
    //         id: 3,
    //         title: 'Le Seigneur des Anneaux',
    //         author: 'J.R.R. Tolkien',
    //         rating: 4.5,
    //         imageUrl: 'https://m.media-amazon.com/images/I/71ADh-KokpL._AC_UF1000,1000_QL80_.jpg',
    //         available: true
    //     },
    //     {
    //         id: 4,
    //         title: 'Le Seigneur des Anneaux',
    //         author: 'J.R.R. Tolkien',
    //         rating: 4.5,
    //         imageUrl: 'https://m.media-amazon.com/images/I/71ADh-KokpL._AC_UF1000,1000_QL80_.jpg',
    //         available: true
    //     },
    //     {
    //         id: 5,
    //         title: 'Le Seigneur des Anneaux',
    //         author: 'J.R.R. Tolkien',
    //         rating: 4.5,
    //         imageUrl: 'https://m.media-amazon.com/images/I/71ADh-KokpL._AC_UF1000,1000_QL80_.jpg',
    //         available: true
    //     },
    //     {
    //         id: 6,
    //         title: 'Le Seigneur des Anneaux',
    //         author: 'J.R.R. Tolkien',
    //         rating: 4.5,
    //         imageUrl: 'https://m.media-amazon.com/images/I/71ADh-KokpL._AC_UF1000,1000_QL80_.jpg',
    //         available: true
    //     },
    //     {
    //         id: 7,
    //         title: 'Le Seigneur des Anneaux',
    //         author: 'J.R.R. Tolkien',
    //         rating: 4.5,
    //         imageUrl: 'https://m.media-amazon.com/images/I/71ADh-KokpL._AC_UF1000,1000_QL80_.jpg',
    //         available: true
    //     },
    // ]

  private bookService = inject(BookService);
  books!: Book[];
  books$! : Observable<Book[]>;

//   ngOnInit(): void {
// console.log("Initialisation du composant Home...");
//   this.bookService.getBooks().subscribe({
//     next: (data) => console.log("Données reçues du back !", data),
//     error: (err) => console.error("L'appel a échoué :", err)
//   });

//   // this.books$ = this.bookService.getBooks();
//   }

//Test de la méthode getBooks() du service BookService avec un suscribe
ngOnInit(): void {
  console.log("Tentative d'appel au service...");

  this.bookService.getBooks().subscribe({
    next: (data) => {
      console.log("OUI ! Données reçues :", data);
      this.books = data;
    },
    error: (err) => {
      console.error("ERREUR RÉSEAU :", err);
    }
  });
}
}

