import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,       //  prevents duplicate accounts
      lowercase: true,    //  good for login consistency
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,       //  prevents password exposure in queries
    },

    profilePic: {
      type: String,
      default: null,       // Cloudinary or local URL
    },
    phone: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      maxlength: 200,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    active: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
    
  }, { timestamps: true });

export const UserModel = mongoose.model("User", userSchema);
