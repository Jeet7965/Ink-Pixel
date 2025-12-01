import { useEffect, useState } from "react";
import api from "../../config/ApiUrl";
import { TailSpin } from "react-loader-spinner";
import { FiTrash2 } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/Navbar";
import Newsletter from "../../components/NewsSletter";

const MyGallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await api.get("/media/show-own-media");
        if (res.data.status) setMedia(res.data.result);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchMedia();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this media?")) return;

    try {
      await api.delete(`/media/delete-media/${id}`);
      setMedia((prev) => prev.filter((item) => item._id !== id));
      toast.success("Deleted Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete media");
    }
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="w-full min-h-screen bg-black text-white p-4">
        <ToastContainer position="top-center" autoClose={3000} />
        <h2 className="text-2xl font-bold mb-4 text-center">My Gallery</h2>

        {loading && (
          <div className="flex justify-center mt-12">
            <TailSpin height="70" width="70" color="#ffffff" ariaLabel="loading" />
          </div>
        )}

        {!loading && media.length === 0 && (
          <p className="text-center text-gray-400 mt-10">No media uploaded yet.</p>
        )}

        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {media.map((item) => (
              <div
                key={item._id}
                className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-800"
              >
                {/* MEDIA: IMAGE OR VIDEO */}
                {item.fileType.startsWith("video/") ? (
                  <video
                    src={item.fileUrl}
                    className="w-full h-full object-contain bg-black"
                    controls
                  />
                ) : (
                  <img
                    src={item.fileUrl}
                    alt="media"
                    className="w-full h-full object-contain"
                  />
                )}

                {/* ALWAYS VISIBLE OVERLAY */}
                <div className="absolute inset-0 bg-black/60 flex flex-col justify-between p-2">
                  {/* TOP: DELETE BUTTON */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-600 hover:bg-red-700 p-1 rounded-full text-white shadow-lg"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  {/* BOTTOM: USER INFO & FILE SIZE */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.uploadedBy?.profilePic}
                        className="w-8 h-8 rounded-full object-cover border border-gray-500"
                        alt="profile"
                      />
                      <div className="flex flex-col leading-tight">
                        <p className="text-sm font-semibold">{item.uploadedBy?.name}</p>
                        <p className="text-xs text-gray-300">{item.category?.name}</p>
                      </div>
                    </div>
                    {/* <span className="bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {(item.fileSize / 1024 / 1024).toFixed(2)} MB
                    </span> */}
                  </div>
                </div>
              </div>

            ))}
          </div>
        )}
      </div>
      <Newsletter></Newsletter>
    </>
  );
};

export default MyGallery;
