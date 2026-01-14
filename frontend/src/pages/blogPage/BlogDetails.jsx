import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/ApiUrl";
import Navbar from "../../components/Navbar";
import { TailSpin } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Newsletter from "../../components/NewsSletter";

function BlogDetails() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([]);

    // Fetch blog details
    const fetchBlogById = async () => {
        try {
            const res = await api.get(`/blog/getblog/${id}`);
            setBlog(res.data.blogs);
        } catch (error) {
            console.log(error);
            toast.error("Error fetching blog details!");
        }
    };
    const fetchReview = async () => {
        try {
            const res = await api.get(`/review/${id}`);
            setReviews(res.data);
        } catch (error) {
            console.log(error);
            toast.error("Error fetching reviews");
        }
    }

    useEffect(() => {
        fetchBlogById();
        fetchReview()
    }, [id]);

    if (!blog)
        return (
            <div className="flex justify-center items-center h-screen bg-gray-800">
                <TailSpin height="80" width="80" color="#4fa94d" ariaLabel="loading" />
            </div>
        );

    // Handle review submission
    const handleReviewSubmit = async () => {
        // You can add the logic to send the review data to the backend
        if (!reviewText || rating === 0) {
            toast.error("Please add rating and review");
            return;
        }
        try {
            await api.post("/review", {
             
                postId: id,
                rating,
                review: reviewText
            });
            toast.success("Review submitted successfully");
            setReviewText("");
            setRating(0);
            fetchReview();
        } catch (error) {
            console.log(error);
            toast.error("Failed to submit review");
        }
    };

    return (
        <>
            <Navbar></Navbar>
            <div className="bg-gray-800 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-6 md:p-10 border border-gray-100">

                    {/* Title */}
                    <h3 className="text-xl md:text-3xl font-extrabold text-gray-900 text-center mb-6">
                        {blog.title}
                    </h3>

                    {/* Image */}
                    {blog.image && (
                        <img
                            src={blog.image}
                            alt="Blog"
                            className="w-full h-auto object-cover rounded-2xl shadow-lg mb-8"
                        />
                    )}

                    {/* Author Info */}
                    <div className="mb-8 flex justify-between items-center ">
                        <p className="text-gray-700 text-sm md:text-base">
                            <span className="font-semibold">Published By:</span>{" "}
                            {blog.postBy.name}
                        </p>
                        <p className="text-gray-700 text-sm md:text-base">
                            <span className="font-semibold">Post Date: </span>{new Date(blog.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Blog Content */}
                    <div className="prose max-w-none text-gray-800 leading-8 text-lg">
                        {blog.content}
                    </div>

                    {/* Tags */}
                    {blog.tags?.length > 0 && (
                        <div className="mt-10">
                            <h3 className="font-semibold text-gray-900 text-lg mb-3">Tags</h3>
                            <div className="flex flex-wrap gap-3">
                                {blog.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Review Section */}
                    <div className="mt-12">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Reviews</h2>
                        <div className="space-y-4">
                            {/* Review Cards */}
                            {reviews.length > 0 ? (
                                reviews.map((review, index) => (
                                    <div key={index} className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-all">
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
                    </div>

                </div>
            </div>

            <Newsletter></Newsletter>
        </>
    );
}

export default BlogDetails;
