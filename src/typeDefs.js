import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    hello: String!
    getPosts: [Post]
  }
  type Mutation {
    createAdmin(username: String!, password: String!): Admin!
    adminLogin(username: String!, password: String!): AdminLoginResponse!
    createChannel(password: String!): Channel
    loginToChannel(password: String!): LoginResponse!
    createPost(
      channel: ID!
      status: String!
      lat: String!
      long: String!
      poster: String!
    ): Post
  }
  type Admin {
    id: ID!
    username: String!
  }
  type Channel {
    id: ID!
    password: String!
  }
  type Post {
    id: ID!
    channel: ID!
    status: String!
    lat: String!
    long: String!
    poster: String!
    dte: String!
  }
  type AdminLoginResponse {
    accessToken: String
    admin: Admin
    errors: String
  }
  type LoginResponse {
    accessToken: String
    errors: String
  }
`;
