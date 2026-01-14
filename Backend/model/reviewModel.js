import mongoose from "mongoose";

export const ReviewSchema= new mongoose.Schema({
    reviewerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"

    },
    review:{
        type:String,
        require:true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    },
    rating:{
        type:Number,
        require: true,
        min: 1,
        max: 5
    }
}, { timestamps: true });
ReviewSchema.index(
    { postId: 1, reviewerId: 1 },
    { unique: true }
);

export const ReviewModel=mongoose.model("Review",ReviewSchema)