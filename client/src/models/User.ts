/*
 * User model
 *
 * Define the structure of a User object to ensure that all user data has a
 * consistent shape.
 *
 */


import type { Book } from './Book';

export interface User {
  username: string | null;
  email: string | null;
  password: string | null;
  savedBooks: Book[];
}
