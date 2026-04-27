import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
//import { CategoryFilter } from "../../../models/category.model";
import { Endpoints } from "../../../constants/endpoints";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class CategoryService {

      constructor(
        private http: HttpClient
    ) { }



  // public fetchCategories(): Observable<CategoryFilter[]> {
  //   return this.http.get<CategoryFilter[]>(`${Endpoints.getCategoriesApiEndpoint}`);
  // }
}
