import React, { useEffect, useState } from "react";
import { FiHeart, FiDownload, FiSearch } from "react-icons/fi";
import Navbar from "../../components/Navbar";
import api from "../../config/ApiUrl";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin } from "react-loader-spinner";
import Newsletter from "../../components/NewsSletter";
import { Link } from "react-router";
import Pagination from "../../components/Pagination";

const GallerySection = () => {
  const [imageSizes, setImageSizes] = useState({});
  const [mediaItems, setMediaItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const handleImageLoad = (e, index) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImageSizes((prev) => ({
      ...prev,
      [index]: { w: naturalWidth, h: naturalHeight },
    }));
  };

  // Fetch media
  const fetchMedia = async () => {
    try {
      const res = await api.get("/media/show-media");
      setMediaItems(res.data);
    } catch (error) {
      toast.error("Failed to fetch media");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/category/show-category");
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories!");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMedia();
    fetchCategories();
  }, []);

  // Filter media
  const filteredMedia = mediaItems.filter((item) => {
    const fileName = item.fileName?.toLowerCase() || "";
    const categoryName = item.category?.name?.toLowerCase() || "";
    const search = searchQuery.toLowerCase();

    // Search in file name OR category name
    const matchesSearch =
      fileName.includes(search) || categoryName.includes(search);

    // Category filter (compare IDs correctly)
    const matchesCategory =
      selectedCategory ? item.category?._id === selectedCategory : true;

    // Type filter
    const matchesType =
      selectedType === "image"
        ? item.fileType.includes("image")
        : selectedType === "video"
          ? item.fileType.includes("video")
          : true;

    return matchesSearch && matchesCategory && matchesType;
  });


  return (
    <>
      <Navbar />
      <div className="w-full bg-[#0A1128] min-h-screen px-6 md:px-12 lg:px-20 py-10">
        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          {/* Type Dropdown */}
          <select
            className="w-full sm:w-40 bg-[#0F1736] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>

          {/* Search Input */}
          <div className="relative w-full sm:flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FiSearch />
            </span>
            <input
              type="text"
              placeholder="Search by name & category...."
              className="w-full bg-[#0F1736] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Dropdown */}
          <select
            className="w-full sm:w-40 bg-[#0F1736] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center mt-20">
            <TailSpin height={50} width={50} color="#3B82F6" ariaLabel="loading" />
          </div>
        )}

        {/* Masonry Layout */}
        {!loading && filteredMedia.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredMedia.map((item, index) => (
              <div
                key={item._id}
                className="break-inside-avoid relative group overflow-hidden rounded-xl shadow-xl bg-[#0F1736]"
              >
                {/* IMAGE/VIDEO */}
                {item.fileType.includes("image") ? (
                  <img
                    src={item.fileUrl}
                    alt={item.fileName}
                    onLoad={(e) => handleImageLoad(e, index)}
                    className="w-full rounded-xl"
                  />
                ) : item.fileType.includes("video") ? (
                  <video src={item.fileUrl} controls className="w-full rounded-xl" />
                ) : (
                  <div className="flex flex-col justify-center items-center p-4 h-48 text-gray-600">
                    <span className="text-4xl mb-2">📄</span>
                    <span className="text-sm">{item.fileName}</span>
                  </div>
                )}

                {/* IMAGE SIZE HOVER */}
                {imageSizes[index] && item.fileType.includes("image") && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/60 
                                  text-white text-xs px-3 py-1 rounded-full opacity-0 
                                  group-hover:opacity-100 transition duration-300">
                    {imageSizes[index].w} × {imageSizes[index].h} px
                  </div>
                )}

                {/* TOP ICONS */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-center
                                bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg opacity-0 
                                group-hover:opacity-100 transition duration-300">
                  <button className="text-white text-xl hover:text-red-400 transition">
                    <FiHeart />
                  </button>

                  <Link   
                      to = {`/media/download/${item._id}`}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                   Download
                  </Link>
                </div>

                {/* BOTTOM INFO */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md p-3 flex items-center justify-between">
                  <p className="text-gray-300 text-sm">{new Date(item.uploadedAt).toLocaleDateString()}</p>
                  <div className="flex items-center gap-2">
                    {item.uploadedBy?.profilePic && (
                      <img
                        src={item.uploadedBy.profilePic}
                        className="w-7 h-7 rounded-full object-cover"
                        alt={item.uploadedBy.name}
                      />
                    )}
                    <p className="text-white text-sm">{item.uploadedBy?.name || "Unknown"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No media */}
        {!loading && filteredMedia.length === 0 && (
          <p className="text-gray-500 mt-10">No media found.</p>
        )}
      </div>
      {/* <Pagination></Pagination> */}
      <Newsletter></Newsletter>
    </>
  );
};

export default GallerySection;
