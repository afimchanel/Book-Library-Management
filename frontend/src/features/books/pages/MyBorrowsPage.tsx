import { Link } from 'react-router-dom';
import { BookMarked, Loader2, RotateCcw, Calendar, AlertTriangle } from 'lucide-react';
import { useMyBorrowsPage } from '../hooks';
import { cn } from '@/lib';
import type { BorrowRecord } from '@/types';

export function MyBorrowsPage() {
  const {
    borrowRecords,
    isLoading,
    error,
    handleReturn,
    isReturning,
    formatDate,
    isOverdue,
    getDaysRemaining,
  } = useMyBorrowsPage();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <BookMarked className="h-8 w-8 text-blue-600" />
          My Borrowed Books
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your currently borrowed books
        </p>
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
          Failed to load borrowed books. Please try again.
        </div>
      )}

      {/* Empty State */}
      {!isLoading && borrowRecords && borrowRecords.length === 0 && (
        <div className="text-center py-12">
          <BookMarked className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No borrowed books
          </h3>
          <p className="text-gray-600 mb-4">
            You haven't borrowed any books yet.
          </p>
          <Link
            to="/books"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Books
          </Link>
        </div>
      )}

      {/* Borrowed Books List */}
      {!isLoading && borrowRecords && borrowRecords.length > 0 && (
        <div className="space-y-4">
          {borrowRecords.map((record: BorrowRecord) => {
            const overdue = isOverdue(record.dueDate);
            const daysRemaining = getDaysRemaining(record.dueDate);

            return (
              <div
                key={record.id}
                className={cn(
                  'bg-white rounded-lg shadow-md p-6 border-l-4',
                  overdue ? 'border-red-500' : 'border-blue-500'
                )}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <Link
                      to={`/books/${record.book.id}`}
                      className="text-xl font-semibold text-gray-900 hover:text-blue-600"
                    >
                      {record.book?.title || 'Unknown Book'}
                    </Link>
                    <p className="text-gray-600 mt-1">
                      by {record.book?.author || 'Unknown Author'}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-3 text-sm">
                      <span className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        Borrowed: {formatDate(record.borrowedAt)}
                      </span>
                      <span
                        className={cn(
                          'flex items-center',
                          overdue ? 'text-red-600 font-medium' : 'text-gray-500'
                        )}
                      >
                        {overdue && <AlertTriangle className="h-4 w-4 mr-1" />}
                        Due: {formatDate(record.dueDate)}
                        {!overdue && daysRemaining <= 3 && (
                          <span className="ml-1 text-yellow-600">
                            ({daysRemaining} days left)
                          </span>
                        )}
                        {overdue && (
                          <span className="ml-1 text-red-600">
                            ({Math.abs(daysRemaining)} days overdue)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleReturn(record.book.id)}
                    disabled={isReturning}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Return Book
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
