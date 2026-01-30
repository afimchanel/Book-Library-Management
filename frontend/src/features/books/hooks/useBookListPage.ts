import { useState } from 'react';
import { bookRepository } from '../repositories';
import { useDebounce } from '@/lib/hooks';

/**
 * Hook สำหรับ BookListPage
 * รวม logic ของ search, pagination, delete, borrow
 */
export function useBookListPage() {
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const debouncedSearch = useDebounce(searchInput, 300);
  const isSearching = debouncedSearch.length >= 2;

  // Queries
  const booksQuery = bookRepository.useList({ page, limit });
  const searchBooksQuery = bookRepository.useSearch(debouncedSearch, { page, limit });

  // Mutations
  const deleteMutation = bookRepository.useDelete();
  const borrowMutation = bookRepository.useBorrow();

  const activeQuery = isSearching ? searchBooksQuery : booksQuery;
  const { data, isLoading, error } = activeQuery;

  const books = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setPage(1);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleBorrow = (id: string) => {
    borrowMutation.mutate(id);
  };

  return {
    // Search state
    searchInput,
    debouncedSearch,
    isSearching,
    handleSearch,

    // Pagination
    page,
    setPage,
    totalPages,

    // Data
    books,
    isLoading,
    error,

    // Actions
    handleDelete,
    handleBorrow,
    isDeleting: deleteMutation.isPending,
    isBorrowing: borrowMutation.isPending,
  };
}
