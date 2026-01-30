import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookService } from '@/services/book.service';
import type { SearchBookParams, CreateBookRequest } from '@/types/api.types';
import { BOOKS_QUERY_KEYS } from '../constants';

/**
 * Book Repository Layer
 * เป็นชั้น abstraction ระหว่าง hooks กับ service layer
 * จัดการ React Query operations และ cache invalidation
 */

export const bookRepository = {
  /**
   * Query Operations
   */
  useList(params?: SearchBookParams) {
    return useQuery({
      queryKey: BOOKS_QUERY_KEYS.list(params),
      queryFn: () => bookService.getAll(params),
      staleTime: 30 * 1000,
    });
  },

  useDetail(id: string) {
    return useQuery({
      queryKey: BOOKS_QUERY_KEYS.detail(id),
      queryFn: () => bookService.getById(id),
      enabled: !!id,
    });
  },

  useSearch(query: string, params?: SearchBookParams) {
    return useQuery({
      queryKey: BOOKS_QUERY_KEYS.search(query, params),
      queryFn: () => bookService.getAll({ ...params, search: query }),
      enabled: query.length >= 2,
      staleTime: 30 * 1000,
    });
  },

  useUserBorrowedBooks() {
    return useQuery({
      queryKey: BOOKS_QUERY_KEYS.userBorrowed,
      queryFn: bookService.getUserBorrowedBooks,
    });
  },

  useUserBorrowHistory() {
    return useQuery({
      queryKey: BOOKS_QUERY_KEYS.userBorrowHistory,
      queryFn: bookService.getUserBorrowHistory,
    });
  },

  /**
   * Mutation Operations
   */
  useCreate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: CreateBookRequest) => bookService.create(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEYS.all });
      },
    });
  },

  useUpdate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<CreateBookRequest> }) =>
        bookService.update(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEYS.all });
      },
    });
  },

  useDelete() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: bookService.delete,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEYS.all });
      },
    });
  },

  useBorrow() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: bookService.borrow,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEYS.all });
        queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEYS.userBorrowed });
      },
    });
  },

  useReturn() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: bookService.return,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEYS.all });
        queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEYS.userBorrowed });
      },
    });
  },

  useUploadCover() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ bookId, file }: { bookId: string; file: File }) =>
        bookService.uploadCover(bookId, file),
      onSuccess: (book) => {
        queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEYS.all });
        queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEYS.detail(book.id) });
      },
    });
  },
};
