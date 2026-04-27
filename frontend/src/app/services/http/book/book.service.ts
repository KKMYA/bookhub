import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Book, BookDto, BookHome } from "../../../models/book.model";
import { firstValueFrom, Observable } from "rxjs";
import { PaginatedFilesDto } from "../../../models/paginatedFiles.model";
import { Endpoints } from "../../../constants/endpoints";


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

    //  public updateBook(datas: Book){
    //   this.http.put(ApiEndpoint, datas)
    //   .subscribe();
    //  }
    // TODO  si la suppression ne se fait pas afficher un message utilisateur
    //  public deleteBook(bookId : number) : Promise<void> {
    //   const promise = new Promise<void>((resolve) =>{
    //     this.http.delete<void>(`${ApiEndpoint}/${bookId}`, {
    //       headers : {
    //     'Content-Type':'application/json,charset=utf-8'
    //       }
    //     })
    //     .subscribe({
    //       complete() {
    //         resolve();
    //       }
    //     });
    //   });
    //   return promise;
    //  }


}
