import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookService } from '@/services/book.service';
import { useState } from 'react';

export function useDeleteBook() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: bookService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
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
