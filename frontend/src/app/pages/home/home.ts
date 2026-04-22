import { Component } from '@angular/core';
import { Book } from '../../models/book.model';
import { Button } from "../../ui/components/button/button";
import { LucideAngularModule, Star } from 'lucide-angular';
import { Modal } from "../../ui/components/modal/modal";

@Component({
    selector: 'app-home',
    imports: [
        Button,
        LucideAngularModule,
    ],
    templateUrl: './home.html'
})

export class Home {
    readonly Star = Star;

    loggedIn: boolean = false;

    books: Book[] = [
        {
            id: 1,
            title: 'Le Seigneur des Anneaux',
            author: 'J.R.R. Tolkien',
            rating: 4.5,
            imageUrl: 'https://m.media-amazon.com/images/I/71ADh-KokpL._AC_UF1000,1000_QL80_.jpg',
            available: true
        },
        {
            id: 2,
            title: 'Le Seigneur des Anneaux',
            author: 'J.R.R. Tolkien',
            rating: 4.5,
            imageUrl: 'https://m.media-amazon.com/images/I/71ADh-KokpL._AC_UF1000,1000_QL80_.jpg',
            available: true
        },
        {
            id: 3,
            title: 'Le Seigneur des Anneaux',
            author: 'J.R.R. Tolkien',
            rating: 4.5,
            imageUrl: 'https://m.media-amazon.com/images/I/71ADh-KokpL._AC_UF1000,1000_QL80_.jpg',
            available: true
        },
        {
            id: 4,
            title: 'Le Seigneur des Anneaux',
            author: 'J.R.R. Tolkien',
            rating: 4.5,
            imageUrl: 'https://m.media-amazon.com/images/I/71ADh-KokpL._AC_UF1000,1000_QL80_.jpg',
            available: true
        },
        {
            id: 5,
            title: 'Le Seigneur des Anneaux',
            author: 'J.R.R. Tolkien',
            rating: 4.5,
            imageUrl: 'https://m.media-amazon.com/images/I/71ADh-KokpL._AC_UF1000,1000_QL80_.jpg',
            available: true
        },
        {
            id: 6,
            title: 'Le Seigneur des Anneaux',
            author: 'J.R.R. Tolkien',
            rating: 4.5,
            imageUrl: 'https://m.media-amazon.com/images/I/71ADh-KokpL._AC_UF1000,1000_QL80_.jpg',
            available: true
        },
        {
            id: 7,
            title: 'Le Seigneur des Anneaux',
            author: 'J.R.R. Tolkien',
            rating: 4.5,
            imageUrl: 'https://m.media-amazon.com/images/I/71ADh-KokpL._AC_UF1000,1000_QL80_.jpg',
            available: true
        },
    ]
}
