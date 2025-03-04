/*
 * API
 *
  * Provides external API functions for interacting with external services.
 * 
 * Utilizes the Google Books API for users to search for books that they can add
 *  to their saved books list.
 * 
 */

// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = (query: string) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};
