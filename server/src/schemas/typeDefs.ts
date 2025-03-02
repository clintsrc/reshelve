const typeDefs = `
  type Book {
    _id: ID
    bookId: String  # from the Google Books API
    title: String
    authors: [String] # handle multiple authors
    description: String!
    image: String
    link: String
  }

  type User {
    _id: ID
    username: String
    email: String
    password: String
    bookCount: Int
    savedBooks: [Book]!
  }

  input BookInput {
    bookId: String!
    title: String!
    authors: [String]!
    description: String!
    image: String
    link: String
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  ##############  Queries
  type Query {
    user(username: String!): User
    # me: User  # TODO -- add in later
  }

  ##############  Mutations
  type Mutation {
    # Add a new user (signup)
    addUser(input: UserInput!): Auth
    
    # Login user and return JWT token (signin)
    login(email: String!, password: String!): Auth
    
    # Save a book to a user's books list
    saveBook(input: BookInput!): User

    # Delete a book from a user's books list
    removeBook(bookId: String!): User
  }

`;

export default typeDefs;
