import { BookHome } from "./book.model";
import { PaginatedFilesDto } from "./paginatedFiles.model";

export interface SearchParams {
  query: string,
  category: string,
  isAvailable: boolean
}

export interface SearchEvent {
  results: PaginatedFilesDto<BookHome>;
  filters: SearchParams;
}
