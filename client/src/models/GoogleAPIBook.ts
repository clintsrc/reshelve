/*
 * GoogleAPIBooks model
 *
 * Defines the structure of a book object returned from the Google Books API
 * to ensure that all data fetched from the API has a consistent shape.
 *
 */

export interface GoogleAPIVolumeInfo {
  title: string;
  authors: string[];
  description: string;
  imageLinks: {
    smallThumbnail: string;
    thumbnail: string;
  };
}

export interface GoogleAPIBook {
    id: string;
    volumeInfo: GoogleAPIVolumeInfo;
}
