import { Rating } from './rating.model';

export interface PaginatedFilesDto<T> {
  content: Rating[];
  data: T[];
  totalElements: number;
}
