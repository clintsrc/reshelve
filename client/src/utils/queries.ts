/*
 * Queries
 *
 * Defines the queries for the GraphQL API. 
 * 
 * Retrieve user data including the associated list of saved books
 * 
 */

import { gql } from "@apollo/client";

/**
 * User query
 * 
 * Input: username
 * 
 * Fetches a specific user's data.
 *
 */
export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;

/**
 * Me query
 * 
 * Input: none
 * 
 * The logged-in user's credentials are used automatically
 * .
 */
export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;
