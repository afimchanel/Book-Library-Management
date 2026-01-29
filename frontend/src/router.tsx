import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout, ProtectedRoute } from '@/components';
import { LoginPage, RegisterPage } from '@/features/auth';
import { BookListPage, BookDetailPage, BookFormPage, MyBorrowsPage } from '@/features/books';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/books" replace />,
      },
      {
        path: 'books',
        children: [
          {
            index: true,
            element: <BookListPage />,
          },
          {
            path: ':id',
            element: <BookDetailPage />,
          },
          {
            path: 'new',
            element: (
              <ProtectedRoute requiredRole="admin">
                <BookFormPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ':id/edit',
            element: (
              <ProtectedRoute requiredRole="admin">
                <BookFormPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: 'my-borrows',
        element: (
          <ProtectedRoute>
            <MyBorrowsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '*',
    element: <Navigate to="/books" replace />,
  },
]);
