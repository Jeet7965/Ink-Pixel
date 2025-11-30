import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiUpload, FiX } from "react-icons/fi";
import api from "../../config/ApiUrl";
import { Oval } from "react-loader-spinner";
import Navbar from "../../components/Navbar";
import Newsletter from "../../components/NewsSletter";

const MediaUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [type, setType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const isVideo = selectedFile.type.startsWith("video");
    const isImage = selectedFile.type.startsWith("image");

    // LIMIT VIDEO SIZE TO 50MB
    if (isVideo && selectedFile.size > 50 * 1024 * 1024) {
      toast.error("Video size cannot exceed  50MB!");
      return;
    }

    // Optional: Limit image size too (e.g., 10MB)
    if (isImage && selectedFile.size > 10 * 1024 * 1024) {
      toast.error("Image size cannot exceed 10MB!");
      return;
    }

    setFile(selectedFile);
    setType(isVideo ? "video" : "image");
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) return;
    if (!selectedCategory) return toast.error("Please select a category!");

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", selectedCategory);

    try {
      const token = localStorage.getItem("token");
      await api.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
      });
      toast.success("Media uploaded successfully!");
      setFile(null);
      setPreview(null);
      setType("");
      setSelectedCategory("");
      setProgress(0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="w-full min-h-screen bg-[#0A1128] flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl p-6 rounded-xl shadow-xl bg-[#0F1736]">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">Upload Media</h2>

          {/* CATEGORY DROPDOWN */}
          <div className="mb-4">
            <label className="font-medium text-white">Category *</label>
            <select
              className=" w-full p-2 mt-1 rounded-md bg-[#0A1128]  text-white border border-gray-400  focus:border-blue-500 focus:ring-2 focus:ring-blue-600 cursor-pointer"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
            >
              <option value="" className="text-gray-500">Select Category</option>
              {categories?.map((cat) => (
                <option key={cat._id} value={cat._id} className="text-white">{cat.name}</option>
              ))}
            </select>
          </div>

          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:border-blue-500 transition">
            <FiUpload className="text-white text-4xl mb-2" />
            <span className="text-gray-400 text-center">Click or drag file to upload (Image/Video)</span>
            <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
          </label>

          {preview && (
            <div className="relative mt-6 w-full">
              {type === "image" ? (
                <img src={preview} alt="Preview" className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
              ) : (
                <video src={preview} controls className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
              )}
              <button onClick={() => { setFile(null); setPreview(null); setType(""); }} className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg">
                <FiX />
              </button>
            </div>
          )}

          {file && (
            <div className="mt-4 flex justify-between items-center text-gray-300">
              <p>{file.name}</p>
              <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <button onClick={handleUpload} disabled={uploading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                {uploading ? <Oval height={20} width={20} color="#fff" secondaryColor="#ccc" strokeWidth={2} /> : "Upload"}
              </button>
            </div>
          )}

          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div className="bg-blue-600 h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
            </div>
          )}
        </div>
      </div>
      <Newsletter />
    </>
  );
};

export default MediaUpload;
