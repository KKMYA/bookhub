import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Book, BookHome } from "../../../models/book.model";
import { Observable } from "rxjs";
import { BookConstants } from "../../../constants/bookConstants";
import { PaginatedFilesDto } from "../../../models/paginatedFiles.model";


@Injectable({
    providedIn: 'root'
})

export class BookService {

    constructor(
        private http: HttpClient
    ) { }

    fetchBooks(page: number = 0, size: number = 9): Observable<PaginatedFilesDto<BookHome>> {
        return this.http.get<PaginatedFilesDto<BookHome>>(`${BookConstants.getBooksApiEndpoint}?page=${page}&size=${size}`);
    }

    public getBookById(bookId: number): Observable<Book> {
        return this.http.get<Book>(`${BookConstants.getBooksApiEndpoint}/${bookId}`)
    }

    // public createBook(datas: Book){
    //     this.http.post(ApiEndpoint, datas)
    //     .subscribe();// ds le susb traiter l erreur
    // }

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
