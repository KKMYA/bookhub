import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../../../../services/http/book/book.service';
import { CategoryService } from '../../../../services/http/category/category.service';
import { CategoryFilter } from '../../../../models/category.model';
import { ActivatedRoute, Router } from '@angular/router';
import { stockValidator } from '../../../utils/validator';
import { PopupService } from '../../../../services/ui-ux/popup.service';
import { ConfirmDialogService } from '../../../../services/ui-ux/confirm-dialog.service';
import { error } from 'console';
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
  private route = inject(ActivatedRoute);
  private confirmDialog = inject(ConfirmDialogService);
  protected popupService = inject(PopupService);

  bookForm: FormGroup;
  categories: CategoryFilter[] = [];
  isLoading = false;

  constructor() {
    this.bookForm = this.fb.group({
      titre: ['', [Validators.required, Validators.maxLength(255)]],
      auteur: ['', [Validators.required, Validators.maxLength(150)]],
      isbn: ['', [Validators.required ]],
      description: ['', [Validators.maxLength(2000)]],
      couvertureUrl: ['', [Validators.pattern(/^(http|https):\/\/.*/)]],
      nbExemplaires: [1, [Validators.required, Validators.min(0)]],
      nbExemplairesDisponibles: [1, [Validators.required, Validators.min(0)]],
      categoryLibelle: ['', [Validators.required]]
    },{
      validators: stockValidator
    });
  }

  async ngOnInit() {

    try {
      this.categories = await this.categoryService.fetchCategories();
    } catch (err) {
    this.popupService.show("Impossible de charger les catégories", "error");
      console.error("Erreur catégories", err);
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {

      this.loadBookToForm(+id);
    }
  }
  goBack(): void {
    this.router.navigate(['/dashboard/librarian']);
  }

  loadBookToForm(id: number) {
    this.bookService.getBookById(id).subscribe({

      next: (book) => {
        console.log("Livre reçu de l'API :", book);
        this.bookForm.patchValue(book);
      },
      error: () => console.error("Impossible de récupérer le livre")
    });
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
        couvertureUrl: this.bookForm.value.couvertureUrl?.trim() || null,
        description: this.bookForm.value.description?.trim() || null,
        isbn: this.bookForm.value.isbn.replace(/\s/g, ''),
          noteMoyenne: 0
        };
        await this.bookService.createBook(payload);
        this.popupService.show('Livre enregistré avec succès !', 'success');
        this.bookForm.reset({ nbExemplaires: 1, nbExemplairesDisponibles: 1 });
        this.router.navigate(['/dashboard/librarian'],{ onSameUrlNavigation: 'reload' });


      } catch (err) {
      this.popupService.show('Erreur lors de l\'ajout.', 'error');
        console.error("Erreur lors de l'ajout du livre", err);
      } finally {
        this.isLoading = false;
      }
    }
  }
}
