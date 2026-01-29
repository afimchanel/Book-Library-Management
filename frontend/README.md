# Book Library Management - Frontend

A React frontend for the Book Library Management System.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand (with persist middleware)
- **Server State**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod validation
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/           # Shared components
│   ├── Layout.tsx       # Main layout wrapper
│   ├── Navbar.tsx       # Navigation bar
│   ├── ProtectedRoute.tsx # Auth guard component
│   └── ErrorBoundary.tsx # Error boundary
├── features/            # Feature modules
│   ├── auth/           # Authentication
│   │   ├── hooks/      # useLogin, useRegister
│   │   └── pages/      # LoginPage, RegisterPage
│   └── books/          # Books management
│       ├── components/ # Book-specific components
│       ├── hooks/      # useBooks, useBorrowBook, etc.
│       └── pages/      # BookListPage, BookDetailPage, etc.
├── lib/                 # Utilities
│   ├── api-client.ts   # Axios instance with interceptors
│   ├── utils.ts        # Helper functions (cn, debounce)
│   └── hooks/          # Custom hooks (useDebounce)
├── services/            # API service layer
│   ├── auth.service.ts
│   └── book.service.ts
├── stores/              # Zustand stores
│   └── auth.store.ts   # Auth state with persistence
├── types/               # TypeScript types
│   └── api.types.ts    # API request/response types
├── router.tsx          # Route configuration
└── main.tsx            # Application entry
```

## Setup & Installation

### Prerequisites

- Node.js >= 18
- Backend running at `http://localhost:3000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Features

- ✅ User authentication (login/register)
- ✅ JWT token management with auto-expiry check
- ✅ Book listing with pagination
- ✅ Search by title, author, ISBN
- ✅ Book details view
- ✅ Create/Edit/Delete books (admin only)
- ✅ Cover image upload with preview
- ✅ Borrow/Return books
- ✅ My borrowed books view
- ✅ Responsive design
- ✅ Loading states and error handling
- ✅ Error Boundary for graceful error recovery

## API Proxy

Vite dev server proxies API requests:

```typescript
// vite.config.ts
proxy: {
  '/api': { target: 'http://localhost:3000' },
  '/uploads': { target: 'http://localhost:3000' }
}
```

## State Management

### Auth Store (Zustand)

```typescript
// Persisted to sessionStorage
- token: JWT access token
- user: User profile
- isAuthenticated: Auth status
- Auto logout on token expiry
```

### Server State (TanStack Query)

```typescript
// Queries
- ['books'] - Book list
- ['books', id] - Book detail

// Mutations
- Borrow/Return with cache invalidation
```

## Trade-offs & Future Improvements

### Trade-offs Made:

1. **SessionStorage**: Auth persisted to sessionStorage (cleared on tab close). Could use localStorage with refresh token.

2. **No Offline Support**: Requires constant network connection. Could add service worker.

3. **Simple Error Boundary**: Basic error boundary. Could add error reporting service.

### Future Improvements:

- [ ] Add comprehensive unit tests
- [ ] Implement dark mode
- [ ] Add book filters (year, availability)
- [ ] Book reservation queue
- [ ] Push notifications for due dates
- [ ] Progressive Web App (PWA) support