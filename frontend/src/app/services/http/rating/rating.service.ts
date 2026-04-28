import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PaginatedFilesDto } from "../../../models/paginatedFiles.model";
import { Endpoints } from "../../../constants/endpoints";
import { Rating } from '../../../models/rating.model';
import { CreateRatingDto } from '../../../models/create-rating.dto';
import { UpdateRatingDto } from '../../../models/update-rating.dto';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  constructor(private http: HttpClient) {}

  fetchRatings(
    idBook: number,
    page: number = 0,
    size: number = 10,
  ): Observable<PaginatedFilesDto<Rating>> {
    return this.http.get<PaginatedFilesDto<Rating>>(
      `${Endpoints.getBooksApiEndpoint}/${idBook}/ratings?page=${page}&size=${size}`,
    );
  }

  createRating(idBook: number, dto: CreateRatingDto): Observable<any> {
    return this.http.post(`${Endpoints.getBooksApiEndpoint}/${idBook}/ratings`, dto);
  }

  deleteRating(idRating: number): Observable<any> {
    return this.http.delete(`${Endpoints.getRatingsApiEndPoint}/${idRating}`);
  }

  updateRating(idRating: number, dto: UpdateRatingDto): Observable<any> {
    return this.http.patch(`${Endpoints.getRatingsApiEndPoint}/${idRating}`, dto);
  }
}
