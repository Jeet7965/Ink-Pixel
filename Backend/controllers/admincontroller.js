import { UserModel } from "../model/userModel.js";
import { BlogModel } from "../model/blogModel.js";


// ----------------- View all users -----------------
export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find().select("-password");

        res.json({
             message: "All users fetched successfully",
            status: true,
            users
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await BlogModel.find()
            .populate({
                path: "postBy",
                select: "name  profilePic  active",
                match: { active: true }   //Only active users
            }).populate({
    path: "category",
    select: "name" // only fetch category name
  });

        // Filter blogs where postBy is null (inactive users filtered out)
        const visibleBlogs = blogs.filter(blog => blog.postBy !== null);

        res.json({
            status: true,
            blogs: visibleBlogs
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};




// export const getUserById = async (req, res) => {
//   try {
//     const userId = req.params.id;

//     // Check if ID is provided
//     if (!userId) {
//       return res.status(400).json({
//         message: "User ID is required",
//         status: false,
//       });
//     }

//     // Find user
//     const user = await UserModel.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//         status: false,
//       });
//     }

//     // Success response
//     return res.status(200).json({
//       message: "User fetched successfully",
//       status: true,
//       result: user,
//     });

//   } catch (error) {
//     console.error("Get User Error:", error.message);
//     return res.status(500).json({
//       message: "Internal server error",
//       error: error.message,
//       status: false,
//     });
//   }
// };

export const DeleteUser = async (req, res) => {
    try {
          if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Only admin can delete users",
                status: false
            });
        }
        const user = await UserModel.findByIdAndDelete(req.params.id);
         if (!user) {
            return res.status(404).json({
                message: "User not found",
                status: false
            });
        }
         
 
        await BlogModel.deleteMany({ postBy:req.user._id });

        res.json({
            message: " user and blogs delete successfully",
            status: true,
            result: user
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const toggleUserStatus = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // toggle active/inactive
        user.active = !user.active;
        await user.save();

        res.json({
            message: `User is now ${user.active ? "Active" : "Inactive"}`,
            status: true,
            result: user
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};