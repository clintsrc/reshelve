import { typeDefs, resolvers } from "./schemas/index.js";
import { authenticateToken } from './utils/auth.js';
import type { Request, Response } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import db from "./config/connection.js";
import routes from "./routes/index.js"; //remove
import dotenv from "dotenv";
dotenv.config(); // check the env for PORT

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();
  await db();

  const PORT = process.env.PORT || 3001;
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(
    "/graphql",
    expressMiddleware(server as any, 
      {
        context: authenticateToken as any 
      }
  ));

  // if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === "production") {
    // Manually define __dirname in ES modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    app.use(express.static(path.join(__dirname, "../../../client/dist")));

    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../../../client/dist/index.html"));
    });
  }

  app.use(routes); // remove

  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
