import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../../../services/http/book/book.service';
import { CommonModule } from '@angular/common';
// import { SearchEvent } from '../../../models/searchParams.model';
// import { CategoryFilter } from '../../../models/category.model';
import { CategoryService } from '../../../services/http/category/category.service';


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
  // categories : CategoryFilter[] = [];
  isExpanded = false;

 private categoryService = inject(CategoryService);
 private bookService = inject(BookService);

  constructor(private fb: FormBuilder) {}

  toggle(): void {
    this.isExpanded = !this.isExpanded;
  }

  ngOnInit(): void {

    this.searchForm = this.fb.group({
        query: [''],
        category: [''],
        isAvailable: [false]
    });

      // this.loadCategories();

  }
    // 2. Chargement des catégories

//   loadCategories(): void {
//     this.categoryService.fetchCategories().subscribe({
//         next: (data) => {
//             this.categories = data;
//         },
//         error: (err) => console.error(err)
//     });
//   }

//   @Output() resultsFound = new EventEmitter<SearchEvent>();

//  onSearch(): void {
//   const filters = this.searchForm.value;
//   this.bookService.searchBooks(filters, 0, 9).subscribe({
//     next: (res) => {
//       this.resultsFound.emit({
//         results: res,
//         filters: filters
//       });
//     },
//     error: (err) => {
//       console.error('Erreur lors de la recherche :', err);
//     },
//   });
// }

  resetFilters(): void {
    this.searchForm.reset({ query: '', category: '', isAvailable: false });
    // this.onSearch();
  }
}
