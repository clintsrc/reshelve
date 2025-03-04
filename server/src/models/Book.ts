/*
 * Book model
 *
 * Defines interfaces, schemas, virtual functions, getters and setters for book data
 * retrieved from the Google Books API.
 *
 * This schema is used as an embedded subdocument inside the User model for storing
 * saved books.
 *
 * Compiles the Book model from the schema
 *
 */

import { Schema, type Document } from "mongoose";

export interface BookDocument extends Document {
  bookId: string;
  title: string;
  authors: string[];
  description: string;
  image: string;
  link: string;
}

/* This is a subdocument schema, it won't become its own model but we'll use it as 
  the schema for the User's `savedBooks` array in User.js */
const bookSchema = new Schema<BookDocument>({
  authors: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  // saved book id from GoogleBooks
  bookId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
});

export default bookSchema;
