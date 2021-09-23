import mongoose from "mongoose";

const OutputSchema = new mongoose.Schema(
  {},
  { strict: false, timestamps: true }
);

export default mongoose.model("Output", OutputSchema);
