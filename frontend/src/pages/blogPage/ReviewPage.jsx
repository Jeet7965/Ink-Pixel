import React from 'react'
import api from '../../config/ApiUrl'
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Review({blogId}) {
    
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const fetchReview = async () => {
        try {
            const res = await api.get(`/review/${blogId}`);
            setReviews(res.data.reviews);


        } catch (error) {
            console.log(error);
            toast.error("Error fetching reviews");
        }
    }

    useEffect(() => {
        fetchReview()
    }, [blogId])

    // Handle review submission
    const handleReviewSubmit = async () => {
        // You can add the logic to send the review data to the backend
        if (!reviewText || rating === 0) {
            toast.error("Please add rating and review");
            return;
        }
        try {
            await api.post("/review", {
                postId:blogId,
                rating,
                review: reviewText
            });
            toast.success("Review submitted successfully");
            setReviewText("");
            setRating(0);
            fetchReview();
        } catch (error) {
            console.log(error);
            if (error.response?.status === 400) {
                toast.error("You already reviewed this post");
            } else {
                toast.error("Something went wrong");
            }
        }
    };


    const handleDelete = async (reviewId) => {
        if (!window.confirm("Are you sure?")) return;

        try {
            await api.delete(`/review/${reviewId}`);
            toast.success("Review deleted");
            fetchReview(); // refresh list
        } catch (error) {
            toast.error("You cannot delete this review");
        }
    };
    return (
        <>

            {/* Review Section */}
            <div className="mt-12">
                {/* Review Form */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Leave a Review</h2>
                    <div className="flex items-center mb-4">
                        {/* Star Rating for new review */}
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`w-6 h-6 ${rating >= star ? "text-yellow-400" : "text-gray-300"} cursor-pointer`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 15l-3.09 1.636L7.64 12.6 5 9.636l4.49-.364L10 2l1.51 7.272L16 9.636l-2.64 2.964 1.73 4.036L10 15z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            ))}
                        </div>
                    </div>

                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl p-4 h-32 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm mb-4"
                        placeholder="Write your review..."
                    ></textarea>

                    <button
                        onClick={handleReviewSubmit}
                        className="bg-blue-600 text-white px-8 py-2 rounded-lg text-lg font-medium hover:bg-blue-700 transition shadow-sm"
                    >
                        Submit Review
                    </button>
                </div>

                <h2 className="text-xl font-bold mb-4 text-gray-900">Reviews</h2>
                <div className="space-y-4">
                    {/* Review Cards */}
                    {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <div key={index} className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-all">
                                <div className=" flex justify-between items-center">
                                    <div className="flex items-center mb-4">
                                        {/* User Info */}
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white mr-4">
                                            {review.reviewerId?.name?.[0]}

                                        </div>
                                        <div >
                                            <h3 className="text-lg font-semibold text-gray-900">{review.reviewerId?.name}</h3>
                                            <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                        </div>


                                    </div>
                                    <div>
                                        {review.reviewerId._id && (
                                            <button
                                                onClick={() => handleDelete(review._id)}
                                                className="text-red-500 text-l hover:underline"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>

                                </div>
                                <div className="flex mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={`text-xl ${review.rating >= star
                                                ? "text-yellow-400"
                                                : "text-gray-300"
                                                }`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>

                                {/* Review Text */}
                                <p className="text-gray-700">{review.review}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No reviews yet. Be the first to leave a review!</p>
                    )}
                </div>


            </div>

        </>
    )
}

export default Review