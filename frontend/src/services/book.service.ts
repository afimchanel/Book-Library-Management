import { apiClient } from "@/lib/api-client";
import type {
  BookDetail,
  BookListItem,
  BorrowRecordDetail,
  CreateBookRequest,
  UpdateBookRequest,
  SearchBookParams,
  BookDetailResponse,
  BorrowRecordDetailResponse,
  BorrowRecordListResponse,
  Pagination,
} from "@/types";

export interface BookListResponse {
  statusCode: number;
  message: string;
  data: BookListItem[];
  pagination: Pagination;
}

export const bookService = {
  getAll: async (params?: SearchBookParams): Promise<BookListResponse> => {
    const response = await apiClient.get<BookListResponse>("/books", {
      params,
    });
    return response.data;
  },

  getById: async (id: string): Promise<BookDetail> => {
    const response = await apiClient.get<BookDetailResponse>(`/books/${id}`);
    return response.data.data;
  },

  create: async (data: CreateBookRequest): Promise<BookDetail> => {
    const response = await apiClient.post<BookDetailResponse>("/books", data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateBookRequest): Promise<BookDetail> => {
    const response = await apiClient.patch<BookDetailResponse>(
      `/books/${id}`,
      data,
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/books/${id}`);
  },

  uploadCover: async (id: string, file: File): Promise<BookDetail> => {
    const formData = new FormData();
    formData.append("cover", file);
    const response = await apiClient.post<BookDetailResponse>(
      `/books/${id}/cover`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data.data;
  },

  borrow: async (id: string): Promise<BorrowRecordDetail> => {
    const response = await apiClient.post<BorrowRecordDetailResponse>(
      `/books/${id}/borrow`,
    );
    return response.data.data;
  },

  return: async (id: string): Promise<BorrowRecordDetail> => {
    const response = await apiClient.post<BorrowRecordDetailResponse>(
      `/books/${id}/return`,
    );
    return response.data.data;
  },

  // User's borrowed books
  getUserBorrowedBooks: async (): Promise<BorrowRecordDetail[]> => {
    const response = await apiClient.get<BorrowRecordListResponse>(
      "/books/user/borrowed",
    );
    return response.data.data;
  },

  getUserBorrowHistory: async (): Promise<BorrowRecordDetail[]> => {
    const response = await apiClient.get<BorrowRecordListResponse>(
      "/books/user/history",
    );
    return response.data.data;
  },
};
