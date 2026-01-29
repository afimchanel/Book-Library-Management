import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { bookService } from '@/services/book.service';
import type { BookDetail, CreateBookRequest } from '@/types/api.types';
import { useState } from 'react';

// Match backend CreateBookDto validation
const bookSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be at most 255 characters'),
  author: z.string()
    .min(1, 'Author is required')
    .max(255, 'Author must be at most 255 characters'),
  isbn: z.string()
    .min(1, 'ISBN is required')
    .regex(/^(?:\d{10}|\d{13})$/, 'ISBN must be 10 or 13 digits'),
  description: z.string().optional(),
  publicationYear: z.coerce.number()
    .min(1000, 'Year must be at least 1000')
    .max(new Date().getFullYear() + 1, `Year cannot be after ${new Date().getFullYear() + 1}`),
  quantity: z.coerce.number()
    .min(1, 'Quantity must be at least 1')
    .default(1),
});

export type BookFormData = z.infer<typeof bookSchema>;

interface UseBookFormOptions {
  book?: BookDetail;
  onSuccess?: () => void;
}

export function useBookForm({ book, onSuccess }: UseBookFormOptions = {}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!book;

  const form = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book?.title || '',
      author: book?.author || '',
      isbn: book?.isbn || '',
      description: book?.description || '',
      publicationYear: book?.publicationYear || new Date().getFullYear(),
      quantity: book?.quantity ?? 1,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateBookRequest) => bookService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      onSuccess?.();
      navigate('/books');
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to create book');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BookFormData> }) =>
      bookService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      onSuccess?.();
      navigate('/books');
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to update book');
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    setError(null);
    
    if (isEditing && book) {
      updateMutation.mutate({ id: book.id, data });
    } else {
      createMutation.mutate(data as CreateBookRequest);
    }
  });

  return {
    form,
    onSubmit,
    isLoading: createMutation.isPending || updateMutation.isPending,
    error,
    isEditing,
  };
}
