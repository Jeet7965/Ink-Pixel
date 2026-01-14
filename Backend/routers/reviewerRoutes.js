import e from "express";
import { ReviewerPost,reviewGet,deleteReview } from "../controllers/reviewcontroller.js";
import authMiddleware from "../middleware/AuthMiddleware.js";
const router = e.Router()
router.post("/",authMiddleware,ReviewerPost);
router.get("/:postId",authMiddleware,reviewGet)
router.delete("/:reviewId",authMiddleware,deleteReview)

export default router