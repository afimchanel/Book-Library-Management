# 📚 Book Library Management System

A full-stack book library management application built with NestJS and React.


### User Stories Implemented ✅

- [x] User authentication before accessing the application
- [x] Add a new book with details (title, author, ISBN, publication year, cover image)
- [x] View list of all books in the library
- [x] Search for a book by title, author, or ISBN
- [x] View detailed information of a specific book
- [x] Update book details
- [x] "Borrow" a book (reducing available quantity)
- [x] "Return" a book (increasing available quantity)

## 🛠 Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- Docker & Docker Compose

### 1. Start Database

```bash
docker-compose up -d
```

### 2. Setup Backend

```bash
cd backend
npm install
npm run migration:run
npm run seed              # Create default users
npm run start:dev
```

Backend runs at: `http://localhost:3000/api`

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

## 📖 API Documentation

Swagger UI is available at: `http://localhost:3000/api/docs`

## 🧪 Running Tests

```bash
# Backend unit tests
cd backend
npm test

# Test with coverage
npm run test:cov
```

## 📁 Project Structure

```
.
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── books/          # Books module
│   │   ├── users/          # Users module
│   │   ├── database/       # Entities, repositories, migrations
│   │   └── testing/        # Test utilities and mocks
│   └── test/
├── frontend/               # React SPA
│   └── src/
│       ├── components/     # Shared components
│       ├── features/       # Feature modules (auth, books)
│       ├── services/       # API service layer
│       └── stores/         # Zustand stores
├── docker-compose.yml      # PostgreSQL container
└── TRADE_OFFS.md          # Architecture decisions & improvements
```

## 🔑 Default Users

The seed script creates these default users automatically:

```
Username: admin | Password: admin123 (Admin role)
Username: user  | Password: user123  (User role)
```

To run seeding manually:

```bash
cd backend
npm run seed
```

## 📋 Features

### Authentication
- JWT-based authentication
- Role-based access (admin/user)
- Token expiry handling

### Books Management
- Full CRUD operations
- Cover image upload
- Search by title/author/ISBN
- Pagination support

### Borrowing System
- Borrow/return books
- Track borrow history
- Prevent double borrowing
- Quantity management

## 📝 Trade-offs & Improvements

See [TRADE_OFFS.md](./TRADE_OFFS.md) for detailed documentation on:
- Architectural decisions
- Trade-offs made due to time constraints
- Future improvement roadmap

## 📄 License

UNLICENSED - Coding Challenge Submission
