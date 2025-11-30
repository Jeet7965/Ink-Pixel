import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../config/ApiUrl";
import Navbar from "../../components/Navbar";
import { Link } from "react-router";
import Newsletter from "../../components/NewsSletter";

const MyBlogs = () => {
    const [blogs, setBlogs] = useState([]);

    const fetchBlogs = async () => {
        try {
            const res = await api.get("/blog/show-Own-blog");
            setBlogs(res.data.result || []);
        } catch (error) {
            toast.error("Error fetching blogs");
            console.error(error);
        }
    };
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this blog?")) return;

        try {
            await api.delete(`/blog/delete-blog/${id}`);
            toast.success("Blog deleted successfully");
            fetchBlogs(); // refresh after delete
        } catch (error) {
            toast.error("Error deleting blog");
            console.log(error);
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
    // const DEFAULT_AUTHOR_IMAGE = "https://via.placeholder.com/50?text=Author";

    return (
        <>
            <Navbar />
            <div className="w-full bg-[#0A1128] py-12 px-6 md:px-12 lg:px-20 text-white">
                {/* Header */}
                <div className="text-center mb-14">
                    <h2 className="text-4xl md:text-5xl font-extrabold">From the blog</h2>
                    <p className="text-gray-300 mt-3 text-lg max-w-2xl mx-auto">
                        Learn how to grow your business with our expert advice.
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

                            {/* Author
                            <div className="flex items-center gap-3 mt-4">
                                <img
                                    src={blog.authorImg || DEFAULT_AUTHOR_IMAGE}
                                    alt={blog.postBy.name || "Author"}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-medium">{blog.postBy?.name || "Unknown"}</p>
                                    <p className="text-gray-400 text-sm">{blog.authorRole || "N/A"}</p>
                                </div>
                            </div> */}


                            {/* Edit & Delete Buttons */}
                            <div className="flex justify-between mt-4">
                                <Link
                                    to={`/update-blog/${blog._id}`}
                                    className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold"
                                >
                                    ✏️ Edit
                                </Link>

                                <button
                                    onClick={() => handleDelete(blog._id)}
                                    className="text-red-400 hover:text-red-300 text-sm font-semibold"
                                >
                                    🗑️ Delete
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
            <Newsletter></Newsletter>
        </>
    );
};

export default MyBlogs;
