import React, { useEffect, useState } from "react";
import { FiHeart, FiSearch } from "react-icons/fi";
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
  const [page, setPage] = useState(1);  
  const [limit] = useState(10);  
  const [totalItems, setTotalItems] = useState(0);  


  const handleImageLoad = (e, index) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImageSizes((prev) => ({
      ...prev,
      [index]: { w: naturalWidth, h: naturalHeight },
    }));
  };

  const fetchMedia = async (page = 1) => {
    try {
      const res = await api.get("/media/show-media",{params: { page, limit } });
      setMediaItems(res.data.media);
      setTotalItems(res.data.totalMedia)
    } catch (error) {
      toast.error("Failed to fetch media");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/category/show-category");
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories!");
    }
  };

  useEffect(() => {
    fetchMedia(page);
    fetchCategories();
  }, [page]);

  const filteredMedia = mediaItems.filter((item) => {
    const fileName = item.fileName?.toLowerCase() || "";
    const categoryName = item.category?.name?.toLowerCase() || "";
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      fileName.includes(search) || categoryName.includes(search);

    const matchesCategory =
      selectedCategory ? item.category?._id === selectedCategory : true;

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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <select
            className="w-full sm:w-40 bg-[#0F1736] text-white px-4 py-2 rounded-lg"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>

          <div className="relative w-full sm:flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FiSearch />
            </span>
            <input
              type="text"
              placeholder="Search by name & category..."
              className="w-full bg-[#0F1736] text-white pl-10 pr-4 py-2 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="w-full sm:w-40 bg-[#0F1736] text-white px-4 py-2 rounded-lg"
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
            <TailSpin height={50} width={50} color="#3B82F6" />
          </div>
        )}

        {/* Masonry Grid */}
        {!loading && filteredMedia.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredMedia.map((item, index) => (
              <div
                key={item._id}
                className="break-inside-avoid group rounded-xl shadow-xl bg-[#0F1736] p-3"
              >

                {/* TOP ICONS ABOVE THE IMAGE */}
                <div
                  className="
                    flex justify-between items-center mb-3
                    opacity-100 md:opacity-0 md:group-hover:opacity-100
                    transition duration-300
                  "
                >
                  <button className="text-white text-xl hover:text-red-400">
                    <FiHeart />
                  </button>

                  <Link
                    to={`/media/download/${item._id}`}
                    className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700"
                  >
                    Download
                  </Link>
                </div>

                {/* IMAGE / VIDEO */}
                {item.fileType.includes("image") ? (
                  <img
                    src={item.fileUrl}
                    onLoad={(e) => handleImageLoad(e, index)}
                    className="w-full rounded-xl"
                    alt={item.fileName}
                  />
                ) : item.fileType.includes("video") ? (
                  <video src={item.fileUrl} controls className="w-full rounded-xl" />
                ) : (
                  <div className="p-4 text-center text-gray-300">
                    <span className="text-4xl">📄</span>
                    <p>{item.fileName}</p>
                  </div>
                )}

                {/* BOTTOM INFO */}
                <div className="mt-3 bg-black/40 backdrop-blur-md p-3 rounded-lg flex items-center justify-between">
                  <p className="text-gray-300 text-sm">
                    {new Date(item.uploadedAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2">
                    {item.uploadedBy?.profilePic && (
                      <img
                        src={item.uploadedBy.profilePic}
                        className="w-7 h-7 rounded-full object-cover"
                        alt={item.uploadedBy?.name}
                      />
                    )}
                    <p className="text-white text-sm">
                      {item.uploadedBy?.name || "Unknown"}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {!loading && filteredMedia.length === 0 && (
          <p className="text-gray-500 mt-10">No media found.</p>
        )}
      </div>
      <Pagination
        totalItems={totalItems}
        page={page}
        limit={limit}
        setPage={setPage}
      />
      <Newsletter />
    </>
  );
};

export default GallerySection;
