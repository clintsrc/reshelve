import User from "../models/User.js";
import { signToken, AuthenticationError } from "../utils/auth.js";

// Define interfaces for mutation arguments

// Queries
interface UserArgs {
  username: string;
}

// Mutations
interface AddUserArgs {
  // signup
  input: {
    username: string;
    email: string;
    password: string;
  };
}

interface LoginUserArgs {
  // signin
  email: string;
  password: string;
}

interface SaveBookArgs {
  input: {
    bookId: string;
    title: string;
    authors?: string[];
    description?: string;
    image?: string;
    link?: string;
  };
}

interface RemoveBookArgs {
  bookId: string;
}

const resolvers = {
  /***
   * Queries
   */
  Query: {
    // return the user's information including their saved booklist
    user: async (_parent: unknown, { username }: UserArgs) => {
      return User.findOne({ username });
    },

    // Get the authenticated user's information from the context payload
    me: async (_parent: unknown, _args: any, context: any) => {
      // If the user is authenticated, find their user information including their saved booklist
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      // If the user is not authenticated, throw an AuthenticationError
      throw new AuthenticationError("Could not authenticate user.");
    },
  },

  /***
   * Mutations
   */
  Mutation: {
    // Create a new user and return a token (signup)
    addUser: async (_parent: unknown, { input }: AddUserArgs) => {
      try {
        // Create a new user with the provided username, email, and password
        const user = await User.create({ ...input });

        // Sign a token with the user's information
        const token = signToken(user.username, user.email, user._id);

        // Return the token and the user
        return { token, user };
      } catch (error) {
        throw new Error("Error creating user.");
      }
    },

    // Login user and return a token (signin)
    loginUser: async (_parent: unknown, { email, password }: LoginUserArgs) => {
      try {
        // Find a user with the provided email
        const user = await User.findOne({ email });

        // If no user is found, throw an AuthenticationError
        if (!user) {
          throw new AuthenticationError("Could not authenticate user.");
        }

        // Check if the provided password is correct
        const correctPw = await user.isCorrectPassword(password);

        // If the password is incorrect, throw an AuthenticationError
        if (!correctPw) {
          throw new AuthenticationError("Could not authenticate user.");
        }

        // Sign a token with the user's information
        const token = signToken(user.username, user.email, user._id);

        // Return the token and the user
        return { token, user };
      } catch (error) {
        throw new AuthenticationError("Login failed.");
      }
    },

    // Save a book to the user's book list
    saveBook: async (
      _parent: unknown,
      { input }: SaveBookArgs,
      context: any
    ) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              savedBooks: { ...input },
            },
          },
          { new: true } // Return the updated document
        );

        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    // Delete a book from the user's book list
    removeBook: async (
      _parent: unknown,
      { bookId }: RemoveBookArgs,
      context: any
    ) => {
      if (context.user) {
        // Find the user
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } }, // remove the book from the saved list array
          { new: true } // Return the updated document
        );

        if (!updatedUser) {
          throw new Error("User not found");
        }

        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  }, // end mutations
}; // end resolvers

export default resolvers;
