import mongoose from "mongoose";

export const Channel = mongoose.model("Channel", {
  password: { type: String, unique: true, required: true },
});
