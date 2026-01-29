import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookService } from '@/services/book.service';
import { useState } from 'react';

export function useBorrowBook() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const borrowMutation = useMutation({
    mutationFn: bookService.borrow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['userBorrowedBooks'] });
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to borrow book');
    },
  });

  const returnMutation = useMutation({
    mutationFn: bookService.return,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['userBorrowedBooks'] });
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to return book');
    },
  });

  return {
    borrowBook: borrowMutation.mutate,
    returnBook: returnMutation.mutate,
    isBorrowing: borrowMutation.isPending,
    isReturning: returnMutation.isPending,
    error,
    clearError: () => setError(null),
  };
}
