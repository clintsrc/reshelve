/*
 * Authentication
 *
 * Implements JWT (JSON Web Token) for user authentication.
 *  Requires a JWT_SECRET_KEY environment variable to sign and verify tokens.
 *  Generates an encrypted token when a user provides valid credentials.
 *  Verifies and decodes tokens received from the client.
 * 
 * The client can store the token (e.g. in localStorage) for use during the session
 * 
 * For local development, create a .env file containing JWT_SECRET_KEY 
 *  (see .env.EXAMPLE).
 * 
 */

import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import dotenv from "dotenv";
dotenv.config();

/*
 * authenticateToken Middleware
 *
 * Extracts and verifies a JWT token from the request:
 *  Reads the token from req.body, req.query, or the Authorization header.
 *  Uses JWT verify() to check if the token is valid and not expired.
 *  If valid, attaches the decoded user data to req.user for use in the application.
 *  If invalid or missing, logs an error (if applicable) and returns the request as-is.
 * 
 */
export const authenticateToken = ({ req }: any) => {
  // Allows token to be sent via req.body, req.query, or headers
  let token = req.body.token || req.query.token || req.headers.authorization;

  // If the token is sent in the authorization header, extract the token from the header
  if (req.headers.authorization) {
    token = token.split(" ").pop().trim();
  }

  // If no token is provided, return the request object as is
  if (!token) {
    return req;
  }

  // Try to verify the token
  try {
    const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || "", {
      maxAge: "2hr",
    });
    
    // If the token is valid, attach the user data to the request object
    req.user = data;
  } catch (err) {
    // If the token is invalid, log an error message
    console.log("Invalid token");
  }

  // Return the request object
  return req;
};

/* 
 * signToken
 * 
 * Generates a new JWT token for an authenticated user.
 *  Encrypts user information using the JWT_SECRET_KEY.
 *  Sets an expiration time of 2 hours.
 *  Returns the signed token, which can be stored on the client (e.g., in localStorage).
 * 
 */
export const signToken = (username: string, email: string, _id: unknown) => {
  // Create a payload with the user information
  const payload = { username, email, _id };
  const secretKey: any = process.env.JWT_SECRET_KEY; // Get the secret key from environment variables

  // Sign the token with the payload and secret key, and set it to expire in 2 hours
  return jwt.sign({ data: payload }, secretKey, { expiresIn: "2h" });
};

/* 
 * AuthenticationError
 *
 * Provides custom error handling for GraphQL authentication failures.
 *
 */
export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, ["UNAUTHENTICATED"]);
    Object.defineProperty(this, "name", { value: "AuthenticationError" });
  }
}
