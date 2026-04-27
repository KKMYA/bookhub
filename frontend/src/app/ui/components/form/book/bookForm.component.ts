import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../../../../services/http/book/book.service';
import { CategoryService } from '../../../../services/http/category/category.service';
import { CategoryFilter } from '../../../../models/category.model';
import { Router } from '@angular/router';


//WIP a deplacer
type ToastState = { show: boolean, message: string, type: 'success' | 'error' };
@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './bookForm.component.html',
})

export class BookFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  toast = signal<ToastState>({ show: false, message: '', type: 'success' });

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
          noteMoyenne: 0
        };
        await this.bookService.createBook(payload);

        this.toast.set({ show: true, message: 'Livre enregistré !', type: 'success' });

        setTimeout(() => {
          this.toast.update(t => ({ ...t, show: false }));
          this.router.navigate(['/dashboard/librarian']);
        }, 2000);
        this.bookForm.reset({ nbExemplaires: 1, nbExemplairesDisponibles: 1 });
        this.router.navigate(['/dashboard/librarian']);


      } catch (err) {
       this.toast.set({
          show: true,
          message: 'Erreur lors de l\'ajout. Vérifiez l\'ISBN ou la connexion.',
          type: 'error'
        });
        setTimeout(() => {
          this.toast.update(t => ({ ...t, show: false }));
        }, 5000);
        console.error("Erreur lors de l'ajout du livre", err);
      } finally {
        this.isLoading = false;
      }
    }
  }
}
