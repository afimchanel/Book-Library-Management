import type { SearchBookParams } from '@/types/api.types';

export const BOOKS_QUERY_KEYS = {
  all: ['books'] as const,
  list: (params?: SearchBookParams) => ['books', params] as const,
  detail: (id: string) => ['books', id] as const,
  search: (query: string, params?: SearchBookParams) =>
    ['books', 'search', query, params] as const,
  userBorrowed: ['userBorrowedBooks'] as const,
  userBorrowHistory: ['userBorrowHistory'] as const,
};
