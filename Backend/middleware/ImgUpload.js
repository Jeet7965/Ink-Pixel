import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";  // <-- VERY IMPORTANT

// console.log("Using Cloudinary instance:", cloudinary.config()); // TEMP TEST

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "media_library",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "mp4", "mov",],
    resource_type: "auto",
  },
});

const upload = multer({ storage, limits:{ fileSize: 50 * 1024 * 1024 }});

export default upload;
