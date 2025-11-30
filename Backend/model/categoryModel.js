import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const CategoryModel = mongoose.model("Category", categorySchema);
