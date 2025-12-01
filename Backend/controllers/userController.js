import { UserModel } from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, profile, role } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newuser = await UserModel.create
            ({
                name,
                email,
                password: hashedPassword,
                profile,
                role,
            })
        res.json({
            message: "user created succsefully",
            status: true,
            user: newuser

        })
    } catch (error) {
        console.error("Error registering user:", error);
        res.json({
            message: "Internal Server Error",
            status: false,
            error: error.message,
        });

    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email }).select("+password");


        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = jwt.sign(
            { id: user._id ,role: user.role,email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};

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
    const { name, phone, bio } = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      { name, phone, bio },
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


export const PasswordChange = async (req,res)=>{
   try {
    const { password, newPassword } = req.body;

    const user = await UserModel.findById(req.params.id).select("+password");

    if (!user) return res.status(404).json({ error: "User not found" });

    // compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    // hash new password
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;

    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
}

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
