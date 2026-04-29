export interface PaginatedFilesDto<T> {
  content: T[];
  data: T[];
  totalElements: number;
}
