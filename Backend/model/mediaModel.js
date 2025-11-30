
import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema({
  fileName: String,
  fileUrl: String,
  fileType: String,
  uploadedAt: { type: Date, default: Date.now },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" 
  },
  category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
});

export default mongoose.model("Media", MediaSchema);
