import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, BookOpen, Loader2, Trash2, Edit, BookMarked } from 'lucide-react';
import { useBooks, useSearchBooks, useDeleteBook, useBorrowBook } from '../hooks';
import { useAuthStore } from '@/stores/auth.store';
import { cn, useDebounce } from '@/lib';
import type { BookListItem } from '@/types/api.types';

export function BookListPage() {
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Debounce search input (300ms delay)
  const debouncedSearch = useDebounce(searchInput, 300);

  const { user } = useAuthStore();
  const isSearching = debouncedSearch.length >= 2;

  const booksQuery = useBooks({ page, limit });
  const searchBooksQuery = useSearchBooks(debouncedSearch, { page, limit });

  const { deleteBook, isDeleting } = useDeleteBook();
  const { borrowBook, isBorrowing } = useBorrowBook();

  const activeQuery = isSearching ? searchBooksQuery : booksQuery;
  const { data, isLoading, error } = activeQuery;

  const books = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBook(id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            Library Books
          </h1>
          <p className="text-gray-600 mt-1">
            Browse and manage the book collection
          </p>
        </div>

        {user?.role === 'admin' && (
          <Link
            to="/books/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Book
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setPage(1);
          }}
          placeholder="Search by title, author, or ISBN..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {searchInput && searchInput !== debouncedSearch && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          Failed to load books. Please try again.
        </div>
      )}

      {/* Empty State */}
      {!isLoading && books.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isSearching ? 'No books found' : 'No books yet'}
          </h3>
          <p className="text-gray-600">
            {isSearching
              ? 'Try adjusting your search terms'
              : 'Start by adding some books to the library'}
          </p>
        </div>
      )}

      {/* Book Grid */}
      {!isLoading && books.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book: BookListItem) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Book Cover */}
              <Link to={`/books/${book.id}`} className="block">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={`Cover of ${book.title}`}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-white opacity-50" />
                  </div>
                )}
              </Link>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/books/${book.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-2"
                    >
                      {book.title}
                    </Link>
                    <p className="text-gray-600 text-sm mt-1">by {book.author}</p>
                  </div>
                  <span
                    className={cn(
                      'px-2 py-1 text-xs font-medium rounded-full ml-2 shrink-0',
                      book.availableQuantity > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    )}
                  >
                    {book.availableQuantity > 0 ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                {book.isbn && (
                  <p className="text-sm text-gray-500 mb-2">ISBN: {book.isbn}</p>
                )}

                {book.publicationYear && (
                  <p className="text-sm text-gray-500 mb-2">
                    Published: {book.publicationYear}
                  </p>
                )}

                <p className="text-sm text-gray-700 mb-4">
                  {book.availableQuantity} / {book.quantity} copies available
                </p>

                <div className="flex flex-wrap gap-2">
                  {user && book.availableQuantity > 0 && (
                    <button
                      onClick={() => borrowBook(book.id)}
                      disabled={isBorrowing}
                      className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      <BookMarked className="h-4 w-4 mr-1" />
                      Borrow
                    </button>
                  )}

                  {user?.role === 'admin' && (
                    <>
                      <Link
                        to={`/books/${book.id}/edit`}
                        className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(book.id)}
                        disabled={isDeleting}
                        className="inline-flex items-center px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
