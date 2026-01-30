import { useNavigate } from 'react-router-dom';
import { bookRepository } from '../repositories';

/**
 * Hook สำหรับ BookDetailPage
 * รวม logic ของ fetch book detail, delete, borrow
 */
export function useBookDetailPage(bookId: string) {
  const navigate = useNavigate();

  // Query
  const bookQuery = bookRepository.useDetail(bookId);

  // Mutations
  const deleteMutation = bookRepository.useDelete();
  const borrowMutation = bookRepository.useBorrow();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteMutation.mutate(bookId, {
        onSuccess: () => navigate('/books'),
      });
    }
  };

  const handleBorrow = () => {
    borrowMutation.mutate(bookId);
  };

  return {
    // Data
    book: bookQuery.data,
    isLoading: bookQuery.isLoading,
    error: bookQuery.error,

    // Actions
    handleDelete,
    handleBorrow,
    isDeleting: deleteMutation.isPending,
    isBorrowing: borrowMutation.isPending,
  };
}
