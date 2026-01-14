import e from "express";
import { ReviewerPost,reviewGet } from "../controllers/reviewcontroller.js";
import authMiddleware from "../middleware/AuthMiddleware.js";
const router = e.Router()
router.post("/",authMiddleware,ReviewerPost);
router.get("/:postId",authMiddleware,reviewGet)

export default router