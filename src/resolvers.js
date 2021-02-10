import { hash, compare } from "bcryptjs";
import { verify } from "jsonwebtoken";
import { createAccessToken, createAdminAccessToken } from "./auth";
import { Admin } from "./models/admin";
import { Channel } from "./models/channel";
import { Post } from "./models/post";

export const resolvers = {
  Query: {
    hello: () => "Hello World",
    getPosts: async (_, {}, { req, res, payload }) => {
      const authorization = req.headers["authorization"];
      if (!authorization) {
        throw new Error("NOT ALLOWED");
      }
      try {
        const mypayload = verify(
          authorization,
          process.env.ACCESS_TOKEN_SECRET
        );
        payload = mypayload;
        console.log(mypayload);
        let posts = await Post.find({ channel: payload.channelId }).exec();
        return posts;
      } catch (err) {
        console.log(err);
        throw new Error("INVALID TOKEN");
      }
    },
  },
  Mutation: {
    createAdmin: async (_, { username, password }) => {
      const hashedpassword = await hash(password, 12);
      const user = new Admin({ username, password: hashedpassword });
      return user.save();
    },
    adminLogin: async (_, { username, password }, { req, res }) => {
      const admin = await Admin.findOne({ username });
      if (!admin) {
        return {
          errors: "that admin doesn't exist",
        };
      }
      const pssdvalidation = await compare(password, admin.password);
      if (!pssdvalidation) {
        return {
          errors: "somethin went wrong",
        };
      }
      return {
        accessToken: createAdminAccessToken(admin),
        admin: admin,
      };
    },
    createChannel: async (_, { password }, { req, res, payload }) => {
      //const hashedpassword = await hash(password, 12);
      const authorization = req.headers["authorization"];
      if (!authorization) {
        throw new Error("NOT ALLOWED");
      }
      try {
        const mypayload = verify(authorization, process.env.ADMIN_TOKEN_SECRET);
        payload = mypayload;
        console.log(mypayload);
        if (payload.admin) {
          const channel = new Channel({ password: password });
          return channel.save();
        } else {
          return "UNAUTHORIZED";
        }
      } catch (err) {
        console.log(err);
        return "failed to create channel";
      }
    },
    loginToChannel: async (_, { password }, { req, res }) => {
      const channel = await Channel.findOne({ password });
      if (channel) {
        return {
          accessToken: createAccessToken(channel),
        };
      } else {
        return {
          errors: "that channel doesn't exist",
        };
      }
    },
    createPost: async (
      _,
      { status, lat, long, poster },
      { req, res, payload }
    ) => {
      const authorization = req.headers["authorization"];
      if (!authorization) {
        throw new Error("NOT ALLOWED");
      }
      try {
        const mypayload = verify(
          authorization,
          process.env.ACCESS_TOKEN_SECRET
        );
        payload = mypayload;
        console.log(mypayload);
        const post = new Post({
          channel: payload.channelId,
          status: status,
          lat: lat,
          long: long,
          poster: poster,
        });
        return post.save();
      } catch (err) {
        console.log(err);
        return "failed to create post";
      }
    },
  },
};
