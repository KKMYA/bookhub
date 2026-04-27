import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { BookDto } from "../../../models/book.model";
import { BookService } from "../../../services/http/book/book.service";
import { Router } from "@angular/router";
import { LucideAngularModule, Pencil, Plus, Trash2 } from "lucide-angular";
import { Subject } from "rxjs";

@Component({
  selector: 'app-librarian-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './librarianDashboard.html'
})


export class LibrarianDashboard implements OnInit {

  private bookService = inject(BookService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  private cdr = inject(ChangeDetectorRef);
  books: BookDto[] = [];
  isLoading = false;

  // Icônes
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly Plus = Plus;

  ngOnInit(): void {
    this.loadAllBooks();
  }
loadAllBooks(): void {
    this.isLoading = true;
    // this.books = [
    //   {
    //         "idBook": 2,
    //         "titre": "Dune",
    //         "auteur": "Frank Herbert",
    //         "noteMoyenne": 4.5,
    //         "couvertureUrl": "https://images.com/dune.jpg",
    //         "categoryLibelle": "Science-Fiction",
    //         "isbn": "978-0441013593",
    //         "description": "Un classique de la science-fiction qui explore les thèmes du pouvoir, de la religion et de l'écologie sur la planète désertique Arrakis.",
    //         "nbExemplaires": 5,
    //         "nbExemplairesDisponibles": 3
    //   },

    // ];
    //this.isLoading = false
    this.bookService.fetchBooksForDashboard().subscribe({
      next: (res) => {
        this.books = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => this.isLoading = false
    });
  }

  onAddBook(): void {
    this.router.navigate(['/librarian/books/new']);
  }

  // onEditBook(id: number): void {
  //   this.router.navigate(['/librarian/books/edit', id]);
  // }

  // onDeleteBook(id: number): void {
  //   if (confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
  //     // Appelle ton service de suppression ici
  //     console.log('Suppression du livre', id);
  //     // this.bookService.deleteBook(id).subscribe(...)
  //   }
  // }
ngOnDestroy(): void {
    // On actionne l'interrupteur
    this.destroy$.next();
    this.destroy$.complete();
  }
}
