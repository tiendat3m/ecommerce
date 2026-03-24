export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const getPagination = (page?: string | number, limit?: string | number): PaginationParams => {
  const pageNum = Math.max(1, parseInt(String(page || '1')));
  const limitNum = Math.min(100, Math.max(1, parseInt(String(limit || '10'))));
  
  return {
    page: pageNum,
    limit: limitNum,
    skip: (pageNum - 1) * limitNum,
  };
};

export const getPaginationMeta = (page: number, limit: number, total: number): PaginationMeta => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};