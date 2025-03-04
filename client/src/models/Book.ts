/*
 * Book model
 *
 * Define the structure of a book object to ensure that all book data has a
 * consistent shape.
 *
 */

export interface Book {
  authors: string[],
  description: string;
  bookId: string;
  image: string;
  link: string;
  title: string;
}
