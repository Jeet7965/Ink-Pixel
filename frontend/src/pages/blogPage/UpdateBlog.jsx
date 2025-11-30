import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin } from "react-loader-spinner";

import api from "../../config/ApiUrl";
import Newsletter from "../../components/NewsSletter";

function UpdateBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
    file: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    }
  };

  // FETCH CATEGORY LIST
  const fetchCategories = async () => {
    try {
      const res = await api.get("/category/show-category");
      setCategories(res.data);
    } catch (error) {
      toast.error("Failed to load categories!");
    }
  };

  // FETCH EXISTING BLOG DETAILS
  const fetchBlog = async () => {
    try {
        if (!id) return;

      const res = await api.get(`/blog/getblog/${id}`);
      const blog = res.data.blogs;
      console.log(blog)

      setForm({
        title: blog.title,
        content: blog.content,
        tags: blog.tags?.join(", ") || "",
        file: null,
      });

      setSelectedCategory(blog.category?._id || "");
      setPreview(blog.image || null);
    } catch (error) {
      toast.error("Failed to load blog data!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBlog();
  }, [id]);

  // SUBMIT UPDATED BLOG
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("content", form.content);
      payload.append("category", selectedCategory);

      // Tags
      form.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "")
        .forEach((tag) => payload.append("tags", tag));

      // File upload (optional)
      if (form.file) {
        payload.append("file", form.file);
      }

      await api.put(`/blog/update-blog/${id}`,payload);

      toast.success("Blog updated successfully!");
      navigate("/my-blogs");

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update blog!");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <p className="text-white text-center mt-10 text-xl">
        Loading blog details...
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar />
      <ToastContainer />

      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 sm:p-8 flex flex-col gap-4"
        >
          <h2 className="text-2xl font-bold mb-3 text-center text-gray-700">
            Update Blog
          </h2>

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
            <label className="font-medium">Upload New Image / Video</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="mt-1"
            />

            {preview && (
              <div className="mt-3">
                {preview.endsWith(".mp4") || preview.includes("video") ? (
                  <video
                    src={preview}
                    controls
                    className="rounded-md max-h-64 w-full"
                  />
                ) : (
                  <img
                    src={preview}
                    alt="Preview"
                    className="rounded-md max-h-64 object-contain w-full"
                  />
                )}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 flex justify-center items-center"
          >
            {saving ? (
              <TailSpin height={22} width={22} color="#fff" />
            ) : (
              "Update Blog"
            )}
          </button>
        </form>
      </div>

      <Newsletter />
    </div>
  );
}

export default UpdateBlog;
