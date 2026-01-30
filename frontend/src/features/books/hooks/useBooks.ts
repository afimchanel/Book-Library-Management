import { useQuery } from '@tanstack/react-query';
import { bookService } from '@/services/book.service';
import type { SearchBookParams } from '@/types/api.types';
import { BOOKS_QUERY_KEYS } from '../constants';

export function useBooks(params?: SearchBookParams) {
  return useQuery({
    queryKey: BOOKS_QUERY_KEYS.list(params),
    queryFn: () => bookService.getAll(params),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: BOOKS_QUERY_KEYS.detail(id),
    queryFn: () => bookService.getById(id),
    enabled: !!id,
  });
}

// Use 'search' param to match backend SearchBookDto
export function useSearchBooks(query: string, params?: SearchBookParams) {
  return useQuery({
    queryKey: BOOKS_QUERY_KEYS.search(query, params),
    queryFn: () => bookService.getAll({ ...params, search: query }),
    enabled: query.length >= 2,
    staleTime: 30 * 1000,
  });
}
