import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Book, BookHome } from "../../../models/book.model";
import { Observable } from "rxjs";
import { PaginatedFilesDto } from "../../../models/paginatedFiles.model";
import { Endpoints } from "../../../constants/endpoints";
import { Rating } from '../../../models/rating.model';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private http: HttpClient) {}

  fetchRatings(idBook: number, page: number = 0, size: number = 10): Observable<PaginatedFilesDto<Rating>> {
    return this.http.get<PaginatedFilesDto<Rating>>(
      `${Endpoints.getBooksApiEndpoint}/${idBook}/ratings?page=${page}&size=${size}`
    );
  }
}
