export interface Pagination {
 itemCount :number | undefined;
  pageCount :number | undefined;
  pageIndex :number | undefined;
  pageSize: number | undefined;
  hasPreviousPage: boolean | undefined;
  hasNextPage: boolean | undefined;
}