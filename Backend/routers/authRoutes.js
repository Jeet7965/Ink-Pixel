import express from "express"
import { login,forgotPassword,resetPassword,register,refreshAccessToken,logout } from "../controllers/authController.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logout);

export default router;