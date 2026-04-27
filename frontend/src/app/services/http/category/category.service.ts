import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Endpoints } from "../../../constants/endpoints";
import { firstValueFrom, Observable } from "rxjs";
import { CategoryFilter } from "../../../models/category.model";

@Injectable({
    providedIn: 'root'
})

export class CategoryService {

      constructor(
        private http: HttpClient
    ) { }

public async fetchCategories(): Promise<CategoryFilter[]> {
  const categories$ = this.http.get<CategoryFilter[]>(`${Endpoints.getCategoriesApiEndpoint}`);
  return await firstValueFrom(categories$);
}
}
