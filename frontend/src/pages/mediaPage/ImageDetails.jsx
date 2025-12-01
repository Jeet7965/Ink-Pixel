import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiDownload, FiMoreVertical } from "react-icons/fi";
import { TailSpin } from "react-loader-spinner";

import api from "../../config/ApiUrl";

const ImageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await api.get(`/media/${id}`);
        setMedia(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchMedia();
  }, [id]);

  const handleDownload = () => {
    window.location.href = `${api.defaults.baseURL}/media/download/${id}`;
  };

  // ----- LOADER -----
  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-black">
        <TailSpin
          height="70"
          width="70"
          color="#ffffff"
          ariaLabel="loading"
        />
      </div>
    );
  }

  if (!media) return <p className="text-center text-red-400 mt-10">Media not found</p>;

  return (
    <div className="w-full min-h-screen bg-black flex flex-col justify-between relative">

      {/* TOP BAR */}
      <div className="flex items-center justify-between p-4 fixed top-0 left-0 w-full bg-black/70 z-20 backdrop-blur-md">
        <button onClick={() => navigate(-1)}>
          <FiArrowLeft className="text-white text-2xl" />
        </button>

        <div className="flex items-center gap-4">
          <button onClick={handleDownload}>
            <FiDownload className="text-white text-2xl" />
          </button>
          <FiMoreVertical className="text-white text-2xl" />
        </div>
      </div>

      {/* MEDIA DISPLAY */}
      <div className="flex justify-center items-center flex-1 w-full pt-20 pb-24 px-2">
        {media.fileType.startsWith("video/") ? (
          <video
            src={media.fileUrl}
            className="max-w-full max-h-screen rounded-lg"
            controls // user can play/pause
          />
        ) : (
          <img
            src={media.fileUrl}
            alt={media.title || "media"}
            className="max-w-full max-h-screen object-contain rounded-lg"
          />
        )}
      </div>

      {/* USER INFO */}
      <div className="fixed bottom-0 left-0 w-full bg-black/70 p-4 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img
            src={media.uploadedBy?.profilePic}
            className="w-12 h-12 rounded-full object-cover border border-gray-600"
            alt="profile"
          />
          <div>
            <p className="text-white font-semibold">{media.uploadedBy?.name}</p>
            <p className="text-gray-400 text-sm">{media.category?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDetails;
