import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../config/ApiUrl";
import Navbar from "../../components/Navbar";
import { Link } from "react-router";
import Newsletter from "../../components/NewsSletter";
import Pagination from "../../components/Pagination";

const BlogSection = () => {
    const [blogs, setBlogs] = useState([]);

    const fetchBlogs = async () => {
        try {
            const res = await api.get("/admin/get-all-blogs");
            setBlogs(res.data.blogs || []);
        } catch (error) {
            toast.error("Error fetching blogs");
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const limitWords = (text, limit) => {
        const words = text.split(" ");
        if (words.length <= limit) return text;
        return words.slice(0, limit).join(" ") + "...";
    };

    const DEFAULT_BLOG_IMAGE = "https://via.placeholder.com/400x250?text=No+Image";
    const DEFAULT_AUTHOR_IMAGE = "https://via.placeholder.com/50?text=Author";

    return (
        <>
            <Navbar />
            <div className="w-full bg-[#0A1128] py-12 px-6 md:px-12 lg:px-20 text-white">
                {/* Header */}
                <div className="text-center mb-14">
                    <h2 className="text-4xl md:text-5xl font-extrabold"> blogs</h2>
                    <p className="text-gray-300 mt-3 text-lg max-w-2xl mx-auto">
                        “Write your blog, add images or videos, and share with the world.”
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {blogs.map((blog, index) => (
                        <div
                            key={index}
                            className="bg-[#0F1736] p-4 rounded-xl shadow-lg hover:-translate-y-2 duration-300"
                        >
                            {/* Media Preview */}
                            {blog.mediaType === "video" ? (
                                <video
                                    src={blog.image || DEFAULT_BLOG_IMAGE}
                                    controls
                                    className="w-full  h-56 object-contain rounded-lg mb-4"
                                />
                            ) : (
                                <img
                                    src={blog.image || DEFAULT_BLOG_IMAGE}
                                    alt={blog.title}
                                    className="w-full h-56 object-cover rounded-lg mb-4"
                                />
                            )}

                            {/* Date + Category */}
                            <div className="flex items-center gap-3 text-sm mb-3">
                                <span className="text-gray-400"> {new Date(blog.createdAt).toLocaleDateString()}</span>
                                <span className="bg-gray-800 text-gray-200 px-3 py-1 rounded-full text-xs">
                                    {blog.category?.name || "Uncategorized"}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold mb-2 hover:text-gray-300 cursor-pointer">
                                {blog.title}
                            </h3>

                            {/* Description */}
                            <div>
                                <p className="text-gray-400 mb-5 line-clamp-1.5">
                                    {limitWords(blog.content, 15)}
                                    <Link
                                        to={`/blog/${blog._id}`}
                                        className="inline-block text-blue-600 underline text-sm mt-1"
                                    >
                                        Continue reading →
                                    </Link>
                                </p>
                            </div>


                            {/* Author */}
                            <div className="flex items-center gap-3 mt-4">
                                {blog.postBy?.profilePic && (
                                    <img
                                        src={blog.postBy.profilePic || DEFAULT_AUTHOR_IMAGE}
                                        className="w-10 h-10 rounded-full object-cover"
                                        alt={blog.postBy.name || "Auther"}
                                    />
                                )}
                                <div>
                                    <p className="font-medium">{blog.postBy?.name || "Unknown"}</p>
                                    {/* <p className="text-gray-400 text-sm">{blog.authorRole || "N/A"}</p> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
            </div>
           
                {/* <Pagination></Pagination> */}
            

            <Newsletter></Newsletter>
        </>
    );
};

export default BlogSection;
