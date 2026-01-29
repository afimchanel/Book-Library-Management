import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, BookMarked, Loader2, BookOpen } from 'lucide-react';
import { useBook, useDeleteBook, useBorrowBook } from '../hooks';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils';

export function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: book, isLoading, error } = useBook(id || '');
  const { deleteBook, isDeleting } = useDeleteBook();
  const { borrowBook, isBorrowing } = useBorrowBook();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBook(id || '', {
        onSuccess: () => navigate('/books'),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          Book not found or failed to load.
        </div>
        <Link
          to="/books"
          className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to books
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/books"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to books
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Book Cover */}
            <div className="shrink-0">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={`Cover of ${book.title}`}
                  className="w-48 h-64 object-cover rounded-lg shadow-md"
                />
              ) : (
                <div className="w-48 h-64 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-white opacity-50" />
                </div>
              )}
            </div>

            {/* Book Details */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
                  <p className="text-xl text-gray-600 mt-1">by {book.author}</p>
                </div>
                <span
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-full',
                    book.availableQuantity > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  )}
                >
                  {book.availableQuantity > 0
                    ? `${book.availableQuantity} Available`
                    : 'Unavailable'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {book.isbn && (
                  <div>
                    <span className="text-sm text-gray-500">ISBN</span>
                    <p className="font-medium">{book.isbn}</p>
                  </div>
                )}
                {book.publicationYear && (
                  <div>
                    <span className="text-sm text-gray-500">Published Year</span>
                    <p className="font-medium">{book.publicationYear}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-500">Total Copies</span>
                  <p className="font-medium">{book.quantity}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Available</span>
                  <p className="font-medium">{book.availableQuantity}</p>
                </div>
              </div>

              {book.description && (
                <div className="mb-6">
                  <h3 className="text-sm text-gray-500 mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">{book.description}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                {user && book.availableQuantity > 0 && (
                  <button
                    onClick={() => borrowBook(book.id)}
                    disabled={isBorrowing}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isBorrowing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <BookMarked className="h-4 w-4 mr-2" />
                    )}
                    Borrow Book
                  </button>
                )}

                {user?.role === 'admin' && (
                  <>
                    <Link
                      to={`/books/${book.id}/edit`}
                      className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
