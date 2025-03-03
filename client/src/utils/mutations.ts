import { gql } from "@apollo/client";


/**
 * User access
 */
export const ADD_USER = gql`
  mutation addUser($input: UserInput!) {
    addUser(input: $input) {
      user {
        username
        _id
        email
      }
      token
    }
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

/**
 * Book changes
 */
export const SAVE_BOOK = gql`
  mutation saveBook($bookInput: BookInput!) {
    saveBook(input: $bookInput) {
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

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      _id
      username
      savedBooks {
        bookId
      }
    }
  }
`;
