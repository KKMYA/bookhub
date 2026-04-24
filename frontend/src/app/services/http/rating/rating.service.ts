import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Book, BookHome } from "../../../models/book.model";
import { Observable } from "rxjs";
import { PaginatedFilesDto } from "../../../models/paginatedFiles.model";
import { Endpoints } from "../../../constants/endpoints";

@Injectable({
    providedIn: 'root'
})

export class RatingService {
    constructor(
        private http: HttpClient
    ) { }

    fetchRatings(page: number = 0, size: number = 9, idBook: number): Observable<PaginatedFilesDto<Rating>> {
        return this.http.get<PaginatedFilesDto<Rating>>(`${Endpoints.getBooksApiEndpoint}/${idBook}/ratings?page=${page}&size=${size}`);
    }
}
