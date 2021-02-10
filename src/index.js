import "dotenv/config";
import { ApolloServer, gql } from "apollo-server-express";
import express from "express";
import mongoose from "mongoose";
import { resolvers } from "./resolvers";
import { typeDefs } from "./typeDefs";
import cors from "cors";
import cookieParser from "cookie-parser";

const startServer = async () => {
  const app = express();
  app.use(cookieParser());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res, payload }) => ({ req, res, payload }),
  });

  server.applyMiddleware({ app });

  app.use(cors({ origin: "http://localhost:3000/", credentials: true }));

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  app.listen({ port: process.env.SERVER_PORT || 4000 }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${process.env.SERVER_PORT || 4000}${
        server.graphqlPath
      }`
    )
  );
};

startServer();
