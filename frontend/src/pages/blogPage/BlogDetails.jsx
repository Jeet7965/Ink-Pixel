import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/ApiUrl";
import Navbar from "../../components/Navbar";
import { TailSpin } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Newsletter from "../../components/NewsSletter";
import Review from "./ReviewPage";
function BlogDetails() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);


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


    useEffect(() => {
        fetchBlogById();

    }, [id]);

    if (!blog)
        return (
            <div className="flex justify-center items-center h-screen bg-gray-800">
                <TailSpin height="80" width="80" color="#4fa94d" ariaLabel="loading" />
            </div>
        );




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

                    <Review blogId={blog._id}></Review>

                </div>
            </div>

            <Newsletter></Newsletter>
        </>
    );
}

export default BlogDetails;
