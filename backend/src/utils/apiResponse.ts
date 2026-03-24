import { PaginationMeta } from './pagination';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: PaginationMeta;
}

export const successResponse = <T>(data: T, message?: string, meta?: PaginationMeta): ApiResponse<T> => {
  return {
    success: true,
    data,
    message,
    meta,
  };
};

export const errorResponse = (message: string): ApiResponse => {
  return {
    success: false,
    message,
  };
};