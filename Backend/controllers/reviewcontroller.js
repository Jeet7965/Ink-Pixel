
import { ReviewModel } from "../model/reviewModel.js";


export const  ReviewerPost =async(req,res)=>{
    try {
        const {postId, rating, review} = req.body;
        const newReview = await ReviewModel.create({
          reviewerId:req.user.id,
          postId,
          rating,
          review

        })
        
    res.status(201).json({
        message:"Review send",
        status:true,
        newReview
    });
    } catch (error) {
         console.error(err);
    res.status(500).json({ message: "Server error" });
    }
}

export const  reviewGet = async (req, res) => {
  try {
    const { postId } = req.params;

    const reviews = await ReviewModel.find({ postId })
      .populate("reviewerId", "name email") // show user name
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


