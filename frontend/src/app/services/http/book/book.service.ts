import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Book, BookDto, BookHome } from "../../../models/book.model";
import { firstValueFrom, Observable } from "rxjs";
import { PaginatedFilesDto } from "../../../models/paginatedFiles.model";
import { Endpoints } from "../../../constants/endpoints";
import { SearchParams } from "../../../models/searchParam.model";


@Injectable({
    providedIn: 'root'
})

export class BookService {

    constructor(
        private http: HttpClient
    ) { }

    fetchBooks(page: number = 0, size: number = 9): Observable<PaginatedFilesDto<BookHome>> {
        return this.http.get<PaginatedFilesDto<BookHome>>(`${Endpoints.getBooksApiEndpoint}?page=${page}&size=${size}`);
    }

        fetchBooksForDashboard(page: number = 0, size: number = 9): Observable<PaginatedFilesDto<BookDto>> {
        return this.http.get<PaginatedFilesDto<BookDto>>(`${Endpoints.getBooksForDashboardApiEndpoint}?page=${page}&size=${size}`);
    }

    public getBookById(bookId: number): Observable<Book> {
        return this.http.get<Book>(`${Endpoints.getBooksApiEndpoint}/${bookId}`)
    }

    public createBook(book: BookDto){
        this.http.post(Endpoints.createBooksApiEndpoint, book)
        .subscribe();
    }

     public updateBook(datas: Book){
      this.http.put(Endpoints.updateBooksApiEndpoint, datas)
      .subscribe();
     }


     public deleteBook(bookId : number) : Promise<void> {
      const promise = new Promise<void>((resolve) =>{
        this.http.delete<void>(`${Endpoints.deleteBooksApiEndpoint}/${bookId}`, {
          headers : {
        'Content-Type':'application/json,charset=utf-8'
          }
        })
        .subscribe({
          complete() {
            resolve();
          }
        });
      });
      return promise;
     }

     public searchBooks(filters: SearchParams, page: number = 0, size: number = 9): Observable<PaginatedFilesDto<BookHome>> {
      let params = new HttpParams()
        // .set('page', page.toString())
        // .set('size', size.toString())
                console.log('Filters envoyés au service de recherche :', filters);
        if (filters.query) {
          console.log("coucou filters")
            params = params.set('searchTerm', filters.query);
        }
        if (filters.category) {
            params = params.set('categoryLibelle', filters.category);
        }
        if (filters.isAvailable !== undefined) {
            params = params.set('isAvailable', filters.isAvailable.toString());
        }
        return this.http.get<PaginatedFilesDto<BookHome>>(`${Endpoints.searchBooksApiEndpoint}?${params.toString()}`);
    }

}
