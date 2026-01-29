import { useQuery } from '@tanstack/react-query';
import { bookService } from '@/services/book.service';
import type { SearchBookParams } from '@/types/api.types';

export function useBooks(params?: SearchBookParams) {
  return useQuery({
    queryKey: ['books', params],
    queryFn: () => bookService.getAll(params),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ['books', id],
    queryFn: () => bookService.getById(id),
    enabled: !!id,
  });
}

// Use 'search' param to match backend SearchBookDto
export function useSearchBooks(query: string, params?: SearchBookParams) {
  return useQuery({
    queryKey: ['books', 'search', query, params],
    queryFn: () => bookService.getAll({ ...params, search: query }),
    enabled: query.length >= 2,
    staleTime: 30 * 1000,
  });
}
