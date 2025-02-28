import User from "../models/User.js";

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
  userId: string;
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

// Define types for GraphQL resolvers' context and arguments
interface ResolverContext {
  userId?: string; // Example for context userId
}

const resolvers = {
  Query: {
    getUser: async (_parent: unknown, { id, username }: { id?: string, username?: string }, context: ResolverContext) => {
      try {
        if (!id && !username && !context.userId) {
          throw new Error("Must provide an ID, username, or userId from context.");
        }

        const query = id ? { _id: id } : { username };

        const user = await User.findOne(query);
        if (!user) throw new Error("User not found.");

        return user;
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : "Error retrieving user."
        );
      }
    },
  },

  Mutation: {
    createUser: async (
      _parent: unknown, 
      { username, email, password }: CreateUserArgs
    ) => {
      try {
        const user = new User({ username, email, password });
        await user.save();
        return user;
      } catch (err) {
        throw new Error("Error creating user.");
      }
    },

    loginUser: async (
      _parent: unknown, 
      { username, password }: LoginUserArgs
    ) => {
      try {
        const user = await User.findOne({ username });
        if (!user) throw new Error("Login failed.");
        const isValid = await user.isCorrectPassword(password);
        if (!isValid) throw new Error("Invalid password.");
        return { user }; // Replace with actual JWT logic later
      } catch (err) {
        throw new Error("Login failed.");
      }
    },

    saveBook: async (
      _parent: unknown,
      { userId, bookId, title, authors, description, image, link }: SaveBookArgs
    ) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: userId },
          {
            $addToSet: {
              savedBooks: { bookId, title, authors, description, image, link },
            },
          },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (err) {
        throw new Error("Error saving book.");
      }
    },

    deleteBook: async (
      _parent: unknown,
      { bookId }: DeleteBookArgs,
      context: { userId: string }
    ) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.userId },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        if (!updatedUser) throw new Error("User not found.");
        return updatedUser;
      } catch (err) {
        throw new Error("Error deleting book.");
      }
    },
  },
};

export default resolvers;
