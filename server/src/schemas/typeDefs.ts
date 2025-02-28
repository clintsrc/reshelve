const typeDefs = `
  type Book {
    _id: ID
    bookId: String
    title: String
    authors: [String]
    description: String!
    image: String
    link: String
  }

  type User {
    id: ID
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
  }

  type Query {
    # Get a single user by their id or username
    getUser(id: ID, username: String): User
  }

  type Mutation {
    # Create a new user
    createUser(username: String!, email: String!, password: String!): User
    
    # Login user and return JWT token
    loginUser(username: String!, password: String!): String  # Returns JWT (token)
    
    # Save a book to a user's savedBooks
    saveBook(bookId: String!, title: String!, authors: [String]!, description: String!, image: String, link: String): User
    
    # Delete a book from a user's savedBooks
    deleteBook(bookId: String!): User
  }

`;

export default typeDefs;
