import mongoose from "mongoose";

export const Post = mongoose.model("Post", {
  channel: String,
  status: String,
  lat: String,
  long: String,
  poster: String,
  dte: { type: Date, default: Date.now, required: true },
});
