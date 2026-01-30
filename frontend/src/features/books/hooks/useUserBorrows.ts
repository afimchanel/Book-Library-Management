import { useQuery } from '@tanstack/react-query';
import { bookService } from '@/services/book.service';
import { BOOKS_QUERY_KEYS } from '../constants';

export function useUserBorrowedBooks() {
  return useQuery({
    queryKey: BOOKS_QUERY_KEYS.userBorrowed,
    queryFn: bookService.getUserBorrowedBooks,
  });
}

export function useUserBorrowHistory() {
  return useQuery({
    queryKey: BOOKS_QUERY_KEYS.userBorrowHistory,
    queryFn: bookService.getUserBorrowHistory,
  });
}
