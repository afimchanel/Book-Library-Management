import { bookRepository } from '../repositories';
import { formatDate, isOverdue, getDaysRemaining } from '@/lib/utils/date.utils';

/**
 * Hook สำหรับ MyBorrowsPage
 * รวม logic ของ fetch borrowed books และ return
 */
export function useMyBorrowsPage() {
  // Query
  const borrowsQuery = bookRepository.useUserBorrowedBooks();

  // Mutation
  const returnMutation = bookRepository.useReturn();

  const handleReturn = (bookId: string) => {
    returnMutation.mutate(bookId);
  };

  return {
    // Data
    borrowRecords: borrowsQuery.data,
    isLoading: borrowsQuery.isLoading,
    error: borrowsQuery.error,

    // Actions
    handleReturn,
    isReturning: returnMutation.isPending,

    // Utilities (re-export for convenience)
    formatDate,
    isOverdue,
    getDaysRemaining,
  };
}
