import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 100,
    },
    content: {
      type: String,
      required: true,
      maxLength: 1000,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Note || mongoose.model("Note", noteSchema);
