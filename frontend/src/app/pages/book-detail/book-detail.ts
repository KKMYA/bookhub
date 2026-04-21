import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-book-detail',
    imports: [],
    templateUrl: './book-detail.html'
})

export class BookDetail implements OnInit {
    bookId!: number;

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.bookId = +this.route.snapshot.params['id'];
    }
}
