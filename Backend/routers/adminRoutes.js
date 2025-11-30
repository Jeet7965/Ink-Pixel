import express from "express"

import { getAllBlogs,getAllUsers,DeleteUser,toggleUserStatus } from "../controllers/admincontroller.js"

import authMiddleware from "../middleware/AuthMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router=express.Router()

router.get("/get-all-blogs", getAllBlogs);
router.get("/analytics",authMiddleware,adminMiddleware, getAllUsers);
// router.get("/get-user/:id",authMiddleware,adminMiddleware,getUserById);
router.delete("/delete-user/:id",authMiddleware, adminMiddleware,DeleteUser);
router.put("/toggle-user/:id",authMiddleware,adminMiddleware, toggleUserStatus);


export default router