import { PaginatedResult } from "../types/paginated-result.type";

export function paginate<T>(
  items: T[],
  pageStr?: string,
  limitStr?: string,
): PaginatedResult<T> {
  let page = pageStr ? parseInt(pageStr, 10) : 1;
  let limit = limitStr ? parseInt(limitStr, 10) : 10;

  if (isNaN(page) || page <= 0) {
    page = 1;
  }
  if (isNaN(limit) || limit <= 0) {
    limit = 1;
  }
  if (limit > 50) {
    limit = 50;
  }

  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;

  const data = items.slice(offset, offset + limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}
