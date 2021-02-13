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
        return [
          {
            errors: "INVALID TOKEN",
          },
        ];
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
      } catch {
        return [
          {
            errors: "INVALID TOKEN",
          },
        ];
      }
    },
  },
  Mutation: {
    createAdmin: async (_, { username, password }) => {
      if (username && password) {
        const hashedpassword = await hash(password, 12);
        const user = new Admin({ username, password: hashedpassword });
        try {
          await user.save();
          return user;
        } catch {
          return {
            errors: "USER EXISTS",
          };
        }
      } else {
        return {
          errors: "INVALID CREDENTIALS",
        };
      }
    },
    adminLogin: async (_, { username, password }, { req, res }) => {
      const admin = await Admin.findOne({ username });
      if (!admin) {
        return {
          errors: "NOT FOUND",
        };
      }
      const pssdvalidation = await compare(password, admin.password);
      if (!pssdvalidation) {
        return {
          errors: "INVALID CREDENTIALS",
        };
      }
      return {
        accessToken: createAdminAccessToken(admin),
      };
    },
    createChannel: async (_, { password }, { req, res, payload }) => {
      //const hashedpassword = await hash(password, 12);
      const authorization = req.headers["authorization"];
      if (!authorization) {
        return {
          errors: "INVALID TOKEN",
        };
      }
      const mypayload = verify(authorization, process.env.ADMIN_TOKEN_SECRET);
      payload = mypayload;
      console.log(mypayload);
      if (payload.admin) {
        const channel = new Channel({ password: password });
        try {
          await channel.save();
          return channel;
        } catch {
          return {
            errors: "CHANNEL EXISTS",
          };
        }
      } else {
        return {
          errors: "INVALID TOKEN",
        };
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
          errors: "NOT FOUND",
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
        return {
          errors: "INVALID TOKEN",
        };
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
        try {
          await post.save();
          return post;
        } catch {
          return {
            errors: "FAILED",
          };
        }
      } catch {
        return {
          errors: "FAILED",
        };
      }
    },
  },
};
