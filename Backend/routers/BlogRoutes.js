import express from "express"
import upload from "../middleware/ImgUpload.js";

import { AddBlog,DeleteBlog,UpdateBlog,showOwnBlog,GetBlogbyID  } from "../controllers/blogController.js";

import authMiddleware from "../middleware/AuthMiddleware.js";

const router=express.Router();

router.get("/show-Own-blog",authMiddleware,showOwnBlog )
router.post("/create-blog", authMiddleware,upload.single("file"), AddBlog)
router.get("/getblog/:id",authMiddleware,GetBlogbyID )
router.delete("/delete-blog/:id",authMiddleware, DeleteBlog);
router.put("/update-blog/:id",authMiddleware,  upload.single("file"),UpdateBlog);

export default router