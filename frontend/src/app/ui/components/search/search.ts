import { Component, OnInit, Output, EventEmitter, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../../../services/http/book/book.service';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../services/http/category/category.service';
import { SearchEvent } from '../../../models/searchParam.model';
import { CategoryFilter } from '../../../models/category.model';


@Component({
    templateUrl: './search.html',
    selector: 'app-search',
    standalone: true,
    imports: [
      ReactiveFormsModule,
      CommonModule,
    ],
  })

export class SearchComponent implements OnInit {
  searchForm!: FormGroup;
categories = signal<CategoryFilter[]>([])
  isExpanded = false;

 private categoryService = inject(CategoryService);
 private bookService = inject(BookService);

  constructor(private fb: FormBuilder) {}

  toggle(): void {
    this.isExpanded = !this.isExpanded;
  }

  async ngOnInit(): Promise<void> {

    this.searchForm = this.fb.group({
        query: [''],
        category: [''],
        isAvailable: [false]
    });

    try {
      const data = await this.categoryService.fetchCategories();
      this.categories.set(data);
    } catch (err) {
      console.error('Erreur lors de la récupération des catégories', err);
      this.categories.set([]);
    }

  }


  @Output() resultsFound = new EventEmitter<SearchEvent>();

 onSearch(): void {
  const filters = this.searchForm.value;
  this.bookService.searchBooks(filters, 0, 9).subscribe({
    next: (res) => {
      this.resultsFound.emit({
        results: res,
        filters: filters
      });
    },
    error: (err) => {
      console.error('Erreur lors de la recherche :', err);
    },
  });
}

  resetFilters(): void {
    this.searchForm.reset({ query: '', category: '', isAvailable: false });
    this.onSearch();
  }
}
