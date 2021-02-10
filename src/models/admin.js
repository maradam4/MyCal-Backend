import mongoose from "mongoose";

export const Admin = mongoose.model("Admin", {
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});
