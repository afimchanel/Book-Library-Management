/**
 * Interface สำหรับ create book
 */
export interface ICreateBookData {
  title: string;
  author: string;
  isbn: string;
  publicationYear: number;
  quantity?: number;
  availableQuantity?: number;
  description?: string;
  coverImage?: string;
}

/**
 * Interface สำหรับ update book
 */
export interface IUpdateBookData {
  title?: string;
  author?: string;
  isbn?: string;
  publicationYear?: number;
  quantity?: number;
  description?: string;
  coverImage?: string;
}
