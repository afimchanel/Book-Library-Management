# Book Library Management - Backend

A NestJS backend API for managing a book library system with authentication, CRUD operations, and book borrowing/returning functionality.

## Tech Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Token)
- **Validation**: class-validator
- **File Upload**: Multer (local storage)

## Architecture & Design Principles



### Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── dto/                # Data Transfer Objects
│   ├── guards/             # JWT Auth guards
│   ├── strategies/         # Passport JWT strategy
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   └── auth.service.spec.ts  # Unit tests
├── books/                   # Books module
│   ├── dto/                # Book, BorrowRecord DTOs
│   ├── mappers/            # Entity to DTO mappers
│   ├── books.controller.ts
│   ├── books.module.ts
│   ├── books.service.ts
│   ├── books.service.spec.ts # Unit tests
│   └── books.interface.ts
├── users/                   # Users module
│   ├── dto/
│   ├── mappers/            # User entity to DTO mappers
│   ├── users.module.ts
│   └── users.service.ts
├── database/                # Database layer
│   ├── entities/           # TypeORM entities
│   ├── repositories/       # Custom repositories
│   └── migrations/         # Database migrations
├── common/                  # Shared utilities
│   ├── constant/           # Constants (UserRole, DueDate, etc.)
│   ├── dto/                # Pagination DTO
│   ├── entities/           # Base entity classes
│   ├── filters/            # Exception filters
│   └── middleware/         # Request logger
├── helper/                  # Helper functions
├── testing/                 # Test utilities
│   └── mocks/              # Reusable mock factories
├── config/                  # Configuration
└── main.ts                 # Application entry point
```

## Design Patterns

- **Repository Pattern**: Custom repositories with `baseQueryBuilder()` pattern for consistent query building
- **DTO/Mapper Pattern**: Clear separation between Entity (database) and DTO (API response)
- **Dependency Injection**: NestJS built-in DI for loose coupling
- **Soft Delete**: Books support soft delete for data recovery

## Prerequisites

- Node.js >= 18
- PostgreSQL 15+
- Docker (optional, for running PostgreSQL)

## Setup & Installation

### 1. Start PostgreSQL (using Docker)

```bash
docker-compose up -d postgres
```

Or configure your own PostgreSQL instance.

### 2. Configure Environment

Copy `.env.example` to `.env` and update values:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=library_user
DB_PASSWORD=library_password
DB_NAME=library_db

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# App
PORT=3000

FRONTEND_URL=http://localhost:5173
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000/api`

## 🌱 Database Seeding

To populate the database with default test users:

```bash
# Create default users (admin/admin123 and user/user123)
npm run seed
```

This script:
- Creates admin user with admin role
- Creates test user with user role
- Skips if users already exist
- Can be run multiple times safely

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Books (Protected - requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books (with pagination & search) |
| GET | `/api/books/:id` | Get a specific book |
| POST | `/api/books` | Create a new book |
| PATCH | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Delete a book |
| POST | `/api/books/:id/cover` | Upload book cover image |
| POST | `/api/books/:id/borrow` | Borrow a book |
| POST | `/api/books/:id/return` | Return a book |

### Query Parameters for GET /api/books

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Global search (title, author, ISBN)
- `title`: Filter by title
- `author`: Filter by author
- `isbn`: Filter by ISBN

## Request/Response Examples

### Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}

# Response
{
  "accessToken": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": "uuid",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe"
  }
}
```

### Create Book

```bash
POST /api/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "9780743273565",
  "publicationYear": 1925,
  "quantity": 5,
  "description": "A classic novel..."
}
```

### Search Books

```bash
GET /api/books?search=gatsby&page=1&limit=10
Authorization: Bearer <token>
```

### Upload Cover Image

```bash
POST /api/books/:id/cover
Authorization: Bearer <token>
Content-Type: multipart/form-data

cover: <image file>
```

## Running Tests

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## Trade-offs & Future Improvements

Given the time constraints (3-4 hours), here are some trade-offs made:

### Trade-offs Made:

1. **Simple JWT Auth**: Using basic JWT without refresh tokens. In production, implement refresh token rotation.

2. **Local File Storage**: Cover images are stored locally in `uploads/covers/`. For production, use cloud storage (S3, CloudStorage).

3. **Basic Rate Limiting**: Only login endpoint has rate limiting (5 attempts/minute). Should add to all endpoints.

4. **In-Memory Session**: No persistent session store. Consider Redis for production.

5. **Simple Pagination**: Offset-based pagination. Cursor-based would be better for large datasets.

### What's Already Implemented:

- ✅ Full CRUD for books with validation
- ✅ User authentication (register/login) with JWT
- ✅ Book borrowing/returning with quantity management
- ✅ BorrowRecord entity tracking who borrowed what and when
- ✅ User roles (admin/user)
- ✅ Soft delete for books
- ✅ Cover image upload
- ✅ Search by title, author, ISBN
- ✅ Pagination support
- ✅ Swagger API documentation (`/api/docs`)
- ✅ Unit tests for business logic (AAA pattern)
- ✅ Global exception filter
- ✅ Request logging middleware

### Suggested Improvements with More Time:

- [ ] Add E2E tests with test database
- [ ] Implement refresh token mechanism  
- [ ] Migrate to cloud storage for images
- [ ] Add Redis for caching frequently accessed books
- [ ] Implement book categories/tags
- [ ] Add book reservation system
- [ ] Email notifications for due dates
- [ ] Admin dashboard for statistics
- [ ] More comprehensive input validation

## License

UNLICENSED
