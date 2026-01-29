import { useQuery } from '@tanstack/react-query';
import { bookService } from '@/services/book.service';

export function useUserBorrowedBooks() {
  return useQuery({
    queryKey: ['userBorrowedBooks'],
    queryFn: bookService.getUserBorrowedBooks,
  });
}

export function useUserBorrowHistory() {
  return useQuery({
    queryKey: ['userBorrowHistory'],
    queryFn: bookService.getUserBorrowHistory,
  });
}
