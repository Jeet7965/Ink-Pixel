import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../config/ApiUrl";
import Navbar from "../../components/Navbar";
import { Link } from "react-router";
import Newsletter from "../../components/NewsSletter";
import { TailSpin } from "react-loader-spinner";
import Pagination from "../../components/Pagination";

const MyBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit] = useState(6);
    const [totalItems, setTotalItems] = useState(0);
    const [inactiveMessage, setInactiveMessage] = useState("");

    const fetchBlogs = async (page = 1) => {
        try {
            setLoading(true);
            const res = await api.get("/blog/show-own-blog", { params: { page, limit } });

            if (!res.data.status) {
                // User is inactive
                setInactiveMessage(res.data.message || "Your account is inactive");
                setBlogs([]);
                setTotalItems(0);
            } else {
                setInactiveMessage("");
                setBlogs(res.data.result || []);
                setTotalItems(res.data.totalBlogs || 0);
            }
        } catch (error) {
            toast.error("Error fetching blogs");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this blog?")) return;

        try {
            setLoading(true);
            await api.delete(`/blog/delete-blog/${id}`);
            toast.success("Blog deleted successfully");
            fetchBlogs(page);
        } catch (error) {
            toast.error("Error deleting blog");
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs(page);
    }, [page]);

    const limitWords = (text, limit) => {
        const words = text.split(" ");
        if (words.length <= limit) return text;
        return words.slice(0, limit).join(" ") + "...";
    };

    const DEFAULT_BLOG_IMAGE = "https://via.placeholder.com/400x250?text=No+Image";

    return (
        <>
            <Navbar />

            <div className="w-full bg-[#0A1128] py-5 px-6 md:px-12 lg:px-20 text-white">

                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-xl md:text-3xl font-extrabold"> My Blog Stories </h2>
                    <hr className="mt-2" />
                </div>

                {/* Inactive User Message */}
                {inactiveMessage && (
                    <div className="text-center text-red-400 font-semibold mb-5">
                        {inactiveMessage}
                    </div>
                )}

                {/* Loader */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <TailSpin
                            height="80"
                            width="80"
                            color="#4fa94d"
                            ariaLabel="tail-spin-loading"
                            radius="1"
                            visible={true}
                        />
                    </div>
                ) : (
                    /* Blog Grid */
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
                                        className="w-full h-56 object-contain rounded-lg mb-4"
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
                                    <span className="text-gray-400">
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="bg-gray-800 text-gray-200 px-3 py-1 rounded-full text-xs">
                                        {blog.category?.name || "Uncategorized"}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold mb-2 hover:text-gray-300 cursor-pointer">
                                    {blog.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-400 mb-5 line-clamp-1.5">
                                    {limitWords(blog.content, 15)}
                                    <Link
                                        to={`/blog/${blog._id}`}
                                        className="inline-block text-blue-600 underline text-sm mt-1"
                                    >
                                        Continue reading →
                                    </Link>
                                </p>

                                {/* Edit & Delete Buttons */}
                                <div className="flex justify-between mt-4">
                                    <Link
                                        to={`/update-blog/${blog._id}`}
                                        className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        onClick={() => handleDelete(blog._id)}
                                        className="text-red-400 hover:text-red-300 text-sm font-semibold"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {blogs.length > 0 && (
                <Pagination
                    totalItems={totalItems}
                    page={page}
                    limit={limit}
                    setPage={setPage}
                />
            )}

            <Newsletter />
        </>
    );
};

export default MyBlogs;
