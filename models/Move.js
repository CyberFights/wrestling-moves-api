import mongoose from "mongoose";

const MoveSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: {
      type: String,
      enum: ["Strike", "Grapple", "Power", "Submission"],
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Move", MoveSchema);
