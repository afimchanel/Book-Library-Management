import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User, Menu, X, BookMarked } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useState } from 'react';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/books" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <BookOpen className="h-7 w-7" />
            <span className="hidden sm:inline">Library</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/books"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Books
            </Link>

            {isAuthenticated && (
              <Link
                to="/my-borrows"
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 font-medium"
              >
                <BookMarked className="h-4 w-4" />
                My Borrows
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="h-5 w-5" />
                  <span>{user?.username}</span>
                  {user?.role === 'admin' && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-gray-600 hover:text-red-600"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <Link
                to="/books"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Books
              </Link>

              {isAuthenticated && (
                <Link
                  to="/my-borrows"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900 font-medium"
                >
                  <BookMarked className="h-4 w-4" />
                  My Borrows
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-5 w-5" />
                    <span>{user?.username}</span>
                    {user?.role === 'admin' && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-1 text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-blue-600 font-medium"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
