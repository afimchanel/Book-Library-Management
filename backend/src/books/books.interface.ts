/**
 * Interface Ã Â¸ÂªÃ Â¸Â³Ã Â¸Â«Ã Â¸Â£Ã Â¸Â±Ã Â¸Å¡ create book
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
 * Interface Ã Â¸ÂªÃ Â¸Â³Ã Â¸Â«Ã Â¸Â£Ã Â¸Â±Ã Â¸Å¡ update book
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
