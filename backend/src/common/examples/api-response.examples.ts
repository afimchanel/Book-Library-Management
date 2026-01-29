/**
 * API Response Examples
 * Used in Swagger documentation for clearer API reference
 */

export const ApiResponseExamples = {
  // Auth responses
  loginSuccess: {
    statusCode: 200,
    data: {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTQ0NzAwMDAiLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzM5MDk0ODAwLCJleHAiOjE3Mzk2OTk2MDB9...',
      user: {
        username: 'admin',
        email: 'admin@example.com',
        fullName: 'Administrator',
        role: 'admin',
      },
    },
  },

  registerSuccess: {
    statusCode: 201,
    data: {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDEwMDEiLCJ1c2VybmFtZSI6ImpvaG4uZG9lIiwiaWF0IjoxNzM5MDk0ODAwLCJleHAiOjE3Mzk2OTk2MDB9...',
      user: {
        username: 'john.doe',
        email: 'john.doe@example.com',
        fullName: 'John Doe',
        role: 'user',
      },
    },
  },

  // Book responses
  bookDetail: {
    statusCode: 200,
    data: {
      id: '4c193613-b801-401a-bcca-0f3b52f67601',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '9780743273565',
      publicationYear: 1925,
      quantity: 10,
      availableQuantity: 7,
      description: 'A classic novel of the Jazz Age',
      coverImage: '/uploads/covers/4c193613-b801-401a-bcca-0f3b52f67601.png',
      createdAt: '2026-01-29T10:00:00.000Z',
      updatedAt: '2026-01-29T11:00:00.000Z',
    },
  },

  bookListItem: {
    id: '4c193613-b801-401a-bcca-0f3b52f67601',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '9780743273565',
    publicationYear: 1925,
    quantity: 10,
    availableQuantity: 7,
    coverImage: '/uploads/covers/4c193613-b801-401a-bcca-0f3b52f67601.png',
  },

  bookListResponse: {
    statusCode: 200,
    message: 'Books retrieved successfully',
    data: [
      {
        id: '4c193613-b801-401a-bcca-0f3b52f67601',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '9780743273565',
        publicationYear: 1925,
        quantity: 10,
        availableQuantity: 7,
        coverImage: '/uploads/covers/4c193613-b801-401a-bcca-0f3b52f67601.png',
      },
      {
        id: '5d2a4714-c912-512b-cddb-1g4c63g78712',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '9780061120084',
        publicationYear: 1960,
        quantity: 8,
        availableQuantity: 5,
        coverImage: '/uploads/covers/5d2a4714-c912-512b-cddb-1g4c63g78712.png',
      },
    ],
    pagination: {
      page: 1,
      limit: 10,
      totalRows: 25,
      totalPages: 3,
    },
  },

  paginatedBooks: {
    statusCode: 200,
    data: [
      {
        id: '4c193613-b801-401a-bcca-0f3b52f67601',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '9780743273565',
        publicationYear: 1925,
        quantity: 10,
        availableQuantity: 7,
        coverImage: '/uploads/covers/4c193613-b801-401a-bcca-0f3b52f67601.png',
      },
      {
        id: '5d2a4714-c912-512b-cddb-1g4c63g78712',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '9780061120084',
        publicationYear: 1960,
        quantity: 8,
        availableQuantity: 5,
        coverImage: '/uploads/covers/5d2a4714-c912-512b-cddb-1g4c63g78712.png',
      },
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 25,
      totalPages: 3,
    },
  },

  // Borrow record response
  borrowRecordDetail: {
    statusCode: 200,
    data: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      status: 'borrowed',
      borrowedAt: '2026-01-29T10:00:00.000Z',
      dueDate: '2026-02-12T10:00:00.000Z',
      returnedAt: null,
      book: {
        id: '4c193613-b801-401a-bcca-0f3b52f67601',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '9780743273565',
        coverImage: '/uploads/covers/4c193613-b801-401a-bcca-0f3b52f67601.png',
      },
      user: {
        username: 'john.doe',
        fullName: 'John Doe',
      },
      createdAt: '2026-01-29T10:00:00.000Z',
      updatedAt: '2026-01-29T10:00:00.000Z',
    },
  },

  // Error response
  badRequest: {
    statusCode: 400,
    message: 'Bad Request',
    error: 'No available copies of this book',
  },

  unauthorized: {
    statusCode: 401,
    message: 'Unauthorized',
    error: 'Invalid credentials',
  },

  notFound: {
    statusCode: 404,
    message: 'Not Found',
    error: 'Book with ID not found',
  },

  conflict: {
    statusCode: 409,
    message: 'Conflict',
    error: 'Book with ISBN already exists',
  },
};
