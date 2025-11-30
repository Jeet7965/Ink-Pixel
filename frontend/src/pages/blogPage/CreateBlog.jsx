import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin } from "react-loader-spinner";

import api from "../../config/ApiUrl";
import Newsletter from "../../components/NewsSletter";


function CreateBlog() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    const [form, setForm] = useState({
        title: "",
        content: "",
        tags: "",
        file: null,
    });

    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    // HANDLE TEXT INPUT
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // HANDLE FILE (IMAGE / VIDEO)
    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        setForm({ ...form, file: uploadedFile });

        if (uploadedFile) {
            setPreview(URL.createObjectURL(uploadedFile));
        } else {
            setPreview(null);
        }
    };

    // FETCH CATEGORY LIST
    const fetchCategory = async () => {
        try {
            const { data } = await api.get("/category/show-category");
            setCategories(data);
        } catch (error) {
            toast.error("Failed to load categories!");
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    // SUBMIT BLOG
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title || !form.content || !selectedCategory) {
            return toast.error("Please fill all required fields");
        }

        try {
            setLoading(true);

            const payload = new FormData();
            payload.append("title", form.title);
            payload.append("content", form.content);
            payload.append("category", selectedCategory);

            // Handle multiple tags
            form.tags
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t !== "")
                .forEach((tag) => payload.append("tags", tag));

            if (form.file) {
                payload.append("file", form.file);
            }

            const res = await api.post("/blog/create-blog",payload );

            toast.success("Blog created successfully!");

            // reset
            setForm({
                title: "",
                content: "",
                tags: "",
                file: null,
            });
            setSelectedCategory("");
            setPreview(null);

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create blog!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-800">
            <Navbar />
            <ToastContainer />

            <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* <h1 className="text-3xl font-bold mb-6">Create Blog</h1> */}

                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-md rounded-lg p-6 sm:p-8 flex flex-col gap-4"
                >
                    {/* Title */}
                    <div>
                        <label className="font-medium">Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full border rounded-md p-2 mt-1"
                            required
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="font-medium">Content *</label>
                        <textarea
                            name="content"
                            value={form.content}
                            onChange={handleChange}
                            rows="6"
                            className="w-full border rounded-md p-2 mt-1"
                            required
                        ></textarea>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="font-medium">Category *</label>
                        <select
                            className="w-full p-2 border rounded-md mt-1"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="font-medium">Tags (comma separated)</label>
                        <input
                            type="text"
                            name="tags"
                            value={form.tags}
                            onChange={handleChange}
                            className="w-full border rounded-md p-2 mt-1"
                        />
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="font-medium">Upload Image / Video</label>
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            className="mt-1"
                        />

                        {preview && (
                            <div className="mt-3">
                                {form.file?.type.startsWith("image/") ? (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="rounded-md max-h-64 object-contain w-full"
                                    />
                                ) : (
                                    <video
                                        src={preview}
                                        controls
                                        className="rounded-md max-h-64 w-full"
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 flex justify-center items-center"
                    >
                        {loading ? (
                            <TailSpin height={22} width={22} color="#fff" />
                        ) : (
                            "Create Blog"
                        )}
                    </button>
                </form>
            </div>
            <Newsletter></Newsletter>
        </div>
    );
}

export default CreateBlog;
