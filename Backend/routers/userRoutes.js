import express from "express"
import { registerUser,updateProfile,loginUser,getUserById,updateInfo} from "../controllers/userController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";
import upload from "../middleware/ImgUpload.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router=express.Router()

router.post("/register", registerUser);
router.post("/login", loginUser);


router.put("/update-profile/:id", authMiddleware, upload.single("profileImage"), updateProfile);
router.put("/profile-info/:id",updateInfo);
router.get("/get-user/:id",authMiddleware,getUserById);
router.get("/dashboard", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: "Protected Data", user: req.user });
});
export default router