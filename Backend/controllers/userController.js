import { UserModel } from "../model/userModel.js";


export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if ID is provided
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        status: false,
      });
    }

    // Find user
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: false,
      });
    }

    // Success response
    return res.status(200).json({
      message: "User fetched successfully",
      status: true,
      result: user,
    });

  } catch (error) {
    console.error("Get User Error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: false,
    });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { profilePic: req.file.path }, // Cloudinary image URL
      { new: true }
    );

    res.json({
      message: "Profile updated successfully",
      status: true,
      result: updatedUser,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInfo = async (req,res)=>{
   try {
    const {phone, bio } = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      { phone, bio },
      { new: true }
    );

    res.json({
      message: "Profile Info updated successfully",
      success: true,
      result: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Update failed" });
  }
}


export const getCurrentUser = async (req, res) => {
  try {
    // user already exists from middleware
    return res.status(200).json({
      message: "Current user fetched successfully",
      status: true,
      result: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      status: false,
    });
  }
};


// export const PasswordChange = async (req,res)=>{
//    try {
//     const { password, newPassword } = req.body;

//     const user = await UserModel.findById(req.params.id).select("+password");

//     if (!user) return res.status(404).json({ error: "User not found" });

//     // compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: "Incorrect current password" });
//     }

//     // hash new password
//     const hash = await bcrypt.hash(newPassword, 10);
//     user.password = hash;

//     await user.save();

//     res.json({ success: true, message: "Password updated successfully" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Server error" });
//   }
// }

// export const updateProfile = async (req, res) => {
//   try {
//     const userId = req.params.id;

//     const updateData = {
//       name: req.body.name,
//       phone: req.body.phone,
//       bio: req.body.bio,
//     };

//     // File uploaded?
//     if (req.file && req.file.path) {
//       updateData.profilePic = req.file.path; // Cloudinary URL
//     }

//     const updatedUser = await UserModel.findByIdAndUpdate(
//       userId,
//       updateData,
//       { new: true }
//     ).select("-password");

//     res.json({
//       message: "Profile updated successfully",
//       status: true,
//       result: updatedUser,
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
