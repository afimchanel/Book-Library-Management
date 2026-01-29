// API Types - matching backend DTOs

// Auth
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserProfile;
}

export interface LoginResponse {
  statusCode: number;
  data: AuthResponse;
}

export interface RegisterResponse {
  statusCode: number;
  data: AuthResponse;
}

export interface UserProfile {
  username: string;
  email: string;
  fullName?: string;
  role: "admin" | "user";
}

export interface UserPublic {
  username: string;
  fullName?: string;
}

export type User = UserProfile;

export interface BookDetail {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  coverImage?: string;
  quantity: number;
  availableQuantity: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookListItem {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  coverImage?: string;
  quantity: number;
  availableQuantity: number;
}

export interface BookSummary {
  id: string;
  title: string;
  author: string;
  isbn: string;
  coverImage?: string;
}

export type Book = BookDetail;

export interface CreateBookRequest {
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  quantity?: number;
  description?: string;
}

export interface UpdateBookRequest {
  title?: string;
  author?: string;
  isbn?: string;
  publicationYear?: number;
  quantity?: number;
  description?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Pagination - match backend PaginationResponse
export interface Pagination {
  page: number;
  limit: number;
  totalRows: number;
  totalPages: number;
}

// Old format for backward compatibility
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Backend PaginationResponse format
export interface PaginatedResponse<T> {
  statusCode: number;
  message: string;
  data: T[];
  pagination: Pagination;
  sourceKey?: string | null;
}

// API Response wrapper - matches backend TResponse/ResultResponse
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
}

// Specific Response Types matching backend
export interface BookDetailResponse {
  statusCode: number;
  data: BookDetail;
}

export interface BorrowRecordDetailResponse {
  statusCode: number;
  data: BorrowRecordDetail;
}

export interface BorrowRecordListResponse {
  statusCode: number;
  data: BorrowRecordDetail[];
}

// Search params matching backend SearchBookDto
export interface SearchBookParams {
  search?: string;
  title?: string;
  author?: string;
  isbn?: string;
  page?: number;
  limit?: number;
}

// Borrow Records - match backend BorrowRecordDetailDto, BorrowRecordListItemDto
export type BorrowStatus = "borrowed" | "returned" | "overdue";

export interface BorrowRecordDetail {
  id: string;
  status: BorrowStatus;
  borrowedAt: string;
  dueDate: string;
  returnedAt: string | null;
  book: BookSummary;
  user: UserPublic;
  createdAt: string;
  updatedAt: string;
}

export interface BorrowRecordListItem {
  id: string;
  status: BorrowStatus;
  borrowedAt: string;
  dueDate: string;
  returnedAt: string | null;
  book: BookSummary;
  user: UserPublic;
}

export interface BorrowRecordSummary {
  id: string;
  status: BorrowStatus;
  borrowedAt: string;
  dueDate: string;
  returnedAt: string | null;
}

// Alias for backward compatibility
export type BorrowRecord = BorrowRecordDetail;
