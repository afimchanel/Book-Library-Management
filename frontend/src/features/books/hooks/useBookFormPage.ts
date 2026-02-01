import { bookRepository } from "../repositories";
import { useBookForm } from "./useBookForm";

export function useBookFormPage(bookId?: string) {
  const isEditing = !!bookId;

  // Fetch book data when editing
  const bookQuery = bookRepository.useDetail(bookId || "");

  // Form logic
  const formHook = useBookForm({
    book: bookQuery.data,
  });

  return {
    // Book data (for edit mode)
    book: bookQuery.data,
    isLoadingBook: bookQuery.isLoading,
    bookError: bookQuery.error,

    // Form
    ...formHook,

    // State
    isEditing,
  };
}
