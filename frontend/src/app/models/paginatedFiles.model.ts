export interface PaginatedFilesDto<T> {
  content: T[];
  data: T[];
  totalElements: number;

  totalPages?: number;
  size?: number;
  number?: number;
}
