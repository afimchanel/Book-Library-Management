import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookService } from '@/services/book.service';
import { useState } from 'react';
import { BOOKS_QUERY_KEYS } from '../constants';

export function useDeleteBook() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: bookService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKS_QUERY_KEYS.all });
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to delete book');
    },
  });

  return {
    deleteBook: mutation.mutate,
    isDeleting: mutation.isPending,
    error,
    clearError: () => setError(null),
  };
}
