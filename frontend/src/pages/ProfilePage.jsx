import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../config/ApiUrl";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin } from "react-loader-spinner";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ FIXED

  const fetchUser = async () => {
    try {
      const id = JSON.parse(localStorage.getItem("USER_ID"));
      const res = await api.get(`/users/get-user/${id}`);

      setUser(res.data.result);
      setLoading(false); // ⬅ stop loading
    } catch (err) {
      console.log(err);
      setLoading(false); // ⬅ stop loading on error too
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  // Update only profile image
  const handleProfilePicUpdate = async () => {
    if (!profilePic) return toast.warning("Please select an image first.");

    const formData = new FormData();
    formData.append("profileImage", profilePic);

    try {
      const id = user._id;
      const res = await api.put(`/users/update-profile/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile picture updated!");
      setUser(res.data.result);
      setProfilePic(null);
      setPreview(null);
    } catch (err) {
      toast.error("Profile picture update failed!");
      console.log(err);
    }
  };

  // Update personal info
  const handleProfileInfoUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("phone", user.phone);
    formData.append("bio", user.bio);

    try {
      const id = user._id;
      const res = await api.put(`/users/profile-info/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });


      toast.success("Profile information updated!");
      setUser(res.data.result);
    } catch (err) {
      toast.error("Profile update failed!");
      console.log(err);
    }
  };


//   const handlePasswordChange = async () => {
//   if (newPassword !== confirmPassword)
//     return toast.error("Passwords do not match");

//   try {
//     const id = user._id;

//     const res = await api.put(`/users/change-password/${id}`, {
//       currentPassword,
//       newPassword,
//     });

//     toast.success("Password changed!");

//     setCurrentPassword("");
//     setNewPassword("");
//     setConfirmPassword("");
//   } catch (err) {
//     toast.error(err.response?.data?.error || "Password change failed");
//   }
// };
  // SHOW LOADING SPINNER WHEN DATA IS FETCHING
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1128] flex items-center justify-center">
        <TailSpin height={80} width={80} color="#4fa94d" />
        <p className="text-white ml-4 text-xl">Loading profile...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <ToastContainer />

      <div className="min-h-screen bg-[#0A1128] px-4 py-10 flex justify-center">
        <div className="w-full max-w-5xl space-y-10">
          {/* HEADER */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Profile Settings
            </h1>
            <p className="text-gray-300 mt-2">
              Manage your personal information and avatar.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT SIDEBAR */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-[#0F1736] p-6 rounded-xl shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Your Profile
                </h2>

                <div className="flex flex-col items-center">
                  <img
                    src={
                      preview ||
                      user.profilePic ||
                      "https://i.pravatar.cc/150?u=avatar"
                    }
                    className="w-28 h-28 rounded-full shadow-lg object-cover"
                    alt="Profile"
                  />

                  <input
                    type="file"
                    className="hidden"
                    id="avatarUpload"
                    onChange={handleFileChange}
                    accept="image/*"
                  />

                  <label
                    htmlFor="avatarUpload"
                    className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition"
                  >
                    Choose Avatar
                  </label>

                  {profilePic && (
                    <button
                      onClick={handleProfilePicUpdate}
                      className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                      Update Avatar
                    </button>
                  )}

                  <p className="mt-4 text-gray-300 text-center text-sm">
                    Upload JPG, PNG, or WEBP. Max 2MB.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="lg:col-span-2 space-y-8">
              <form onSubmit={handleProfileInfoUpdate}>
                <div className="bg-[#0F1736] p-8 rounded-xl shadow-xl">
                  <h2 className="text-xl font-semibold text-white mb-6">
                    Personal Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-gray-300">Name</label>
                      <input
                        disabled
                        type="text"
                        value={user.name}
                        className="mt-1 w-full px-4 py-2 rounded-md bg-[#0A1128] opacity-50 cursor-not-allowed text-white border border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300">Email</label>
                      <input
                        disabled
                        type="text"
                        value={user.email}
                        className="mt-1 w-full px-4 py-2 rounded-md bg-[#0A1128] opacity-50 cursor-not-allowed text-white border border-gray-600"
                      />
                    </div>

                    <div>
                      <label className="text-gray-300">Phone</label>
                      <input
                        type="text"
                        value={user.phone}
                        onChange={(e) =>
                          setUser({ ...user, phone: e.target.value })
                        }
                        className="mt-1 w-full px-4 py-2 rounded-md bg-[#0A1128] text-white border border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300">Current Password</label>
                      <input
                        type="text"
                        value={user.password}
                        onChange={(e) =>
                          setUser({ ...user, password: e.target.value })
                        }
                        className="mt-1 w-full px-4 py-2 rounded-md bg-[#0A1128] text-white border border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300">New Password</label>
                      <input
                        type="text"
                        value={user.phone}
                        onChange={(e) =>
                          setUser({ ...user, newpassword: e.target.value })
                        }
                        className="mt-1 w-full px-4 py-2 rounded-md bg-[#0A1128] text-white border border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300">Confirm Password</label>
                      <input
                        type="text"
                        value={user.phone}
                        onChange={(e) =>
                          setUser({ ...user, confirmPassword: e.target.value })
                        }
                        className="mt-1 w-full px-4 py-2 rounded-md bg-[#0A1128] text-white border border-gray-600"
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="text-gray-300">Bio</label>
                    <textarea
                      value={user.bio}

                      onChange={(e) =>
                        setUser({ ...user, bio: e.target.value })
                      }
                      className="mt-1 w-full px-4 py-2 rounded-md bg-[#0A1128] text-white border border-gray-600 h-28 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
