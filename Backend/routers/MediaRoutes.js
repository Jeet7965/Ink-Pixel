import express from "express";

import Media from "../model/mediaModel.js";
import upload from "../middleware/ImgUpload.js";
import { v2 as cloudinary } from "cloudinary";
import authMiddleware from "../middleware/AuthMiddleware.js";
const router = express.Router();



//  Upload route
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const { category } = req.body;
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // ✅ Ensure `req.user` exists
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const newMedia = new Media({
      fileName: req.file.originalname,
      fileUrl: req.file.path, // Cloudinary URL
      fileType: req.file.mimetype,
      uploadedBy: req.user._id, // ✅ store uploader ID
      category: category
    });

    await newMedia.save();

    res.status(201).json({
      message: "File uploaded successfully",
      media: newMedia,
    });
  } catch (error) {
    console.error("Upload error:", error);

    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File is too large. Max size is 50 MB" });
    }
    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
});

//  Get all media
// router.get("/show-media", async (req, res) => {
//   try {
   
//     const files = await Media.find().populate("uploadedBy", "name profilePic").populate("category", "name").sort({ uploadedAt: -1 });
//     res.json(files);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch media", error: error.message });
//   }
// });

router.get("/show-media", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Count only media uploaded by ACTIVE users
    const totalMedia = await Media.countDocuments();

    // Fetch paginated media and populate user + category
    const media = await Media.find()
      .skip(skip)
      .limit(limit)
      .sort({ uploadedAt: -1 })
      .populate({
        path: "uploadedBy",
        select: "name profilePic active",
        match: { active: true }          // Only active users
      })
      .populate("category", "name");

    // Remove media from inactive users (where uploadedBy becomes null)
    const visibleMedia = media.filter(item => item.uploadedBy !== null);

    res.json({
      status: true,
      media: visibleMedia,
      totalMedia,
      currentPage: page,
      totalPages: Math.ceil(totalMedia / limit)
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch media",
      error: error.message
    });
  }
});



//  Show own media
router.get("/show-own-media", authMiddleware, async (req, res) => {
  try {
    console.log("USER FROM TOKEN:", req.user);

    if (!req.user.active) {
      return res.json({
        message: "Your account is inactive. Media cannot be shown.",
        status: false,
        result: [],
      });
    }

    const media = await Media.find({ uploadedBy: req.user._id })
      .populate("uploadedBy", "name profilePic")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json({
      message: "Media fetched successfully",
      status: true,
      result: media,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// get by id route
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id)
      .populate("uploadedBy", "name profilePic")
      .populate("category", "name");

    if (!media)
      return res.status(404).json({ message: "Media not found" });

    res.json(media);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching media",
      error: error.message,
    });
  }
});

// Download routes

router.get("/download/:id", async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "File not found" });

    const downloadUrl = media.fileUrl.replace("/upload/", "/upload/fl_attachment/");
    res.redirect(downloadUrl);

  } catch (error) {
    res.status(500).json({ message: "Download failed", error: error.message });
  }
});



// router.get("/download/:id", authMiddleware, async (req, res) => {
//   try {
//     const media = await Media.findById(req.params.id);
//     if (!media) return res.status(404).json({ message: "File not found" });

//     const signedUrl = cloudinary.url(media.publicId, {
//       type: "upload",
//       transformation: [{ flags: "attachment" }],
//       sign_url: true,
//       expires_at: Math.floor(Date.now() / 1000) + 60 // 1-minute expiry
//     });

//     res.redirect(signedUrl);
//   } catch (error) {
//     res.status(500).json({ message: "Download failed", error: error.message });
//   }
// });



router.delete("/delete-media/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;  // FIXED
    const userId = req.user._id;
    const userRole = req.user.role;

    const media = await Media.findById(id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    // Permission check
    if (media.uploadedBy.toString() !== userId.toString() && userRole !== "admin") {
      return res.status(403).json({ message: "You do not have permission to delete this media" });
    }

    // Extract Cloudinary public ID
    const fileName = media.fileUrl.split("/").pop();
    const publicId = fileName.split(".")[0];

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(`media_library/${publicId}`);

    // Delete from database
    await media.deleteOne();

    res.json({ message: "Media deleted from Cloudinary and DB", media });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete media", error: error.message });
  }
});


export default router;
