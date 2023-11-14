export type Pagination = {
  total: number;
  last_page: number;
  current_page: number;
  limit: number;
  prev: number | null;
  next: number | null;
}