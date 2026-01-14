
import { ReviewModel } from "../model/reviewModel.js";


export const ReviewerPost = async (req, res) => {
    try {
        const { postId, rating, review } = req.body;
        const userId = req.user.id
        const alreadyReviewed = await ReviewModel.findOne({
            postId,
            reviewerId: userId
        });
        
        if (alreadyReviewed) {
            return res.status(400).json({
                message: "You have already reviewed this post"
            });
        }
        const newReview = await ReviewModel.create({
            reviewerId: userId,
            postId,
            rating,
            review

        })

        res.status(201).json({
            message: "Review successfull submited",
            status: true,
            newReview
        });
    } catch (error) {
        console.error(err);
        res.status(500).json({ message:"Error submitting review"  });
    }
}

export const reviewGet = async (req, res) => {
    try {
        const { postId } = req.params;

        const reviews = await ReviewModel.find({ postId })
            .populate("reviewerId", "name email") // show user name
            .sort({ createdAt: -1 }); // latest first

        res.status(200).json({
            message:"all reviews fetched",
            status:true,
            reviews

        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


export const deleteReview = async(req,res)=>{
 try {
        const { reviewId } = req.params;
        const userId = req.user.id; // logged in user

        const deletedReview = await ReviewModel.findOneAndDelete({
            _id: reviewId,
            reviewerId: userId
        });

        if (!deletedReview) {
            return res.status(403).json({
                message: "Not allowed or review not found"
            });
        }

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting review" });
    }
}

