import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../../../../services/http/book/book.service';
import { CategoryService } from '../../../../services/http/category/category.service';
import { CategoryFilter } from '../../../../models/category.model';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './bookForm.component.html',
})
export class AddBookComponent implements OnInit {
  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  private categoryService = inject(CategoryService);

  bookForm: FormGroup;
  categories: CategoryFilter[] = [];
  isLoading = false;

  constructor() {
    this.bookForm = this.fb.group({
      titre: ['', [Validators.required, Validators.maxLength(255)]],
      auteur: ['', [Validators.required, Validators.maxLength(150)]],
      isbn: ['', [Validators.required, Validators.pattern(/^(978|979)?\d{10}(\d{3})?$/)]],
      description: ['', [Validators.maxLength(2000)]],
      // Regex pour URL
      couvertureUrl: ['', [Validators.pattern(/^(http|https):\/\/.*/)]],
      nbExemplaires: [1, [Validators.required, Validators.min(0)]],
      nbExemplairesDisponibles: [1, [Validators.required, Validators.min(0)]],
      categoryLibelle: ['', [Validators.required]]
    });
  }

  async ngOnInit() {
    try {
      // On récupère les catégories pour le menu déroulant
      this.categories = await this.categoryService.fetchCategories();
    } catch (err) {
      console.error("Erreur catégories", err);
    }
  }

  // Petit helper pour savoir si un champ est invalide dans le HTML
  isInvalid(field: string): boolean {
    const control = this.bookForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  async onSubmit() {
    if (this.bookForm.valid) {
      this.isLoading = true;
      try {
        const payload = {
          ...this.bookForm.value,
          noteMoyenne: 0 // On initialise la note à 0 pour un nouveau livre
        };
        await this.bookService.createBook(payload);
        this.bookForm.reset({ nbExemplaires: 1, nbExemplairesDisponibles: 1 });
        alert('Livre enregistré !');
      } catch (err) {
        alert('Erreur lors de l\'enregistrement');
      } finally {
        this.isLoading = false;
      }
    }
  }
}
