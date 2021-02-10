import { sign } from "jsonwebtoken";

export const createAccessToken = async (channel) => {
  return sign({ channelId: channel.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });
};

export const createAdminAccessToken = async (admin) => {
  return sign(
    { userId: admin.id, username: admin.username, admin: true },
    process.env.ADMIN_TOKEN_SECRET,
    {
      expiresIn: "30m",
    }
  );
};
