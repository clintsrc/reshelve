import User from "../models/User.js";
import { signToken, AuthenticationError } from "../utils/auth.js"; // Import AuthenticationError

// Define interfaces for mutation arguments
interface CreateUserArgs {
  username: string;
  email: string;
  password: string;
}

interface LoginUserArgs {
  username: string;
  password: string;
}

interface SaveBookArgs {
  bookId: string;
  title: string;
  authors: string[];
  description: string;
  image: string;
  link: string;
}

interface DeleteBookArgs {
  bookId: string;
}

interface ResolverContext {
  userId?: string;
}

const resolvers = {
  Query: {
    getUser: async (_parent: unknown, { id, username }: { id?: string, username?: string }, context: ResolverContext) => {
      try {
        if (!id && !username && !context.userId) {
          throw new AuthenticationError("Must provide an ID, username, or userId from context.");
        }

        const query = id ? { _id: id } : { username };
        const user = await User.findOne(query);
        if (!user) throw new AuthenticationError("User not found.");

        return user;
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Error retrieving user.");
      }
    },
  },

  Mutation: {
    // Create a new user and return a token
    createUser: async (_parent: unknown, { username, email, password }: CreateUserArgs) => {
      try {
        const user = new User({ username, email, password });
        await user.save();
        const token = signToken(user.username, user.email, user._id); // Generate JWT token
        return { token, user };
      } catch (err) {
        throw new Error("Error creating user.");
      }
    },

    // Login user and return a token
    loginUser: async (_parent: unknown, { username, password }: LoginUserArgs) => {
      try {
        const user = await User.findOne({ username });
        if (!user) throw new AuthenticationError("Login failed.");
        const isValid = await user.isCorrectPassword(password);
        if (!isValid) throw new AuthenticationError("Invalid password.");
        const token = signToken(user.username, user.email, user._id); // Generate JWT token
        return { token, user };
      } catch (err) {
        throw new AuthenticationError("Login failed.");
      }
    },

    // Save a book for the user (authentication required)
    saveBook: async (_parent: unknown, { bookId, title, authors, description, image, link }: SaveBookArgs, context: ResolverContext) => {
      try {
        if (!context.userId) {
          throw new AuthenticationError("You must be logged in to save a book.");
        }

        const updatedUser = await User.findOneAndUpdate(
          { _id: context.userId },
          {
            $addToSet: {
              savedBooks: { bookId, title, authors, description, image, link },
            },
          },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (err) {
        throw new AuthenticationError("Error saving book.");
      }
    },

    // Delete a book for the user (authentication required)
    deleteBook: async (_parent: unknown, { bookId }: DeleteBookArgs, context: ResolverContext) => {
      try {
        if (!context.userId) {
          throw new AuthenticationError("You must be logged in to delete a book.");
        }

        const updatedUser = await User.findOneAndUpdate(
          { _id: context.userId },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        if (!updatedUser) throw new AuthenticationError("User not found.");
        return updatedUser;
      } catch (err) {
        throw new AuthenticationError("Error deleting book.");
      }
    },
  },
};

export default resolvers;
