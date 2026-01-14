import { BlogModel } from "../model/blogModel.js";

import { v2 as cloudinary } from "cloudinary";

export const AddBlog = async (req, res) => {
    try {
        const { title, content, category, tags } = req.body;


        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized user" });
        }
        // Validate required fields
        if (!title || !content || !category) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        let imageUrl = null;

        // If image uploaded (Cloudinary or local)
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path);
            imageUrl = uploadResult.secure_url;
        }

        const blog = await BlogModel.create({
            title,
            content,
            postBy: user._id,
            category,
            tags: typeof tags === "string" ? JSON.parse(tags) : tags,
            image: imageUrl
        });

        res.json({
            message: "Blog added successfully",
            status: true,
            result: blog,
        });

    } catch (error) {
        console.error("Error adding blog:", error);
        res.status(500).json({
            message: "Internal Server Error",
            status: false,
            error: error.message,
        });
    }
};

// Get all blogs created by the logged-in user

// export const showOwnBlog = async (req, res) => {
//     try {

//         if (!req.user.active) {
//             return res.json({
//                 message: "Your account is inactive. Blogs cannot be shown.",
//                 status: false,
//                 result: []
//             });
//         }
//         const blogs = await BlogModel.find({ postBy: req.user._id }).populate("postBy", "name ").populate("category", "name").sort({ createdAt: -1 });
//         res.json({
//             message: "Blogs fetched successfully",
//             status: true,
//             result: blogs
//         });

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }


// Get all blogs usnig pagination created by the logged-in user
export const showOwnBlog = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Check if user is active
        if (!req.user.active) {
            return res.json({
                message: "Your account is inactive. Blogs cannot be shown.",
                status: false,
                result: [],
                totalBlogs: 0,
                totalPages: 0,
                currentPage: page
            });
        }

        // Count total blogs for this user
        const totalBlogs = await BlogModel.countDocuments({ postBy: req.user._id });

        // Fetch paginated blogs
        const blogs = await BlogModel.find({ postBy: req.user._id })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate("postBy", "name")
            .populate("category", "name");

        res.json({
            message: "Blogs fetched successfully",
            status: true,
            result: blogs,
            totalBlogs,
            totalPages: Math.ceil(totalBlogs / limit),
            currentPage: page
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




export const GetBlogbyID = async (req, res) => {
    try {
        const { id } = req.params
        const blogs = await BlogModel.findById({ _id: id, postBy: req.user._id }).populate("postBy", "name profilePic").populate("category", "name");
        if (!blogs) return res.status(404).json({ status: false, message: "blog not found" });


        res.json({
            message: "Blogs fetched successfully",
            status: true,
            blogs
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



export const DeleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;  // Logged-in user's ID
        const userRole = req.user.role;  // User's role (e.g., 'user' or 'admin')

        // Find the blog
        const blog = await BlogModel.findById(id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Check if the user is the owner or an admin
        if (blog.postBy.toString() !== userId.toString() && userRole !== 'admin') {
            return res.status(403).json({ message: "You do not have permission to delete this blog" });
        }

        // Delete the blog
        await blog.deleteOne();

        return res.json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const UpdateBlog = async (req, res) => {

    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "Blog ID is required",
                status: false
            });
        }
        const blog = await BlogModel.findOne({ _id: id, postBy: req.user._id });
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
                status: false
            });
        }
        // Update fields
        blog.title = req.body.title || blog.title;
        blog.content = req.body.content || blog.content;
        blog.category = req.body.category || blog.category;

        // Tags (array)
        if (req.body.tags) {
            blog.tags = Array.isArray(req.body.tags)
                ? req.body.tags
                : [req.body.tags];
        }

        // If new image/video uploaded
        if (req.file) {
            blog.image = req.file.path; // or req.file.filename or cloudinary url
        }

        const updatedBlog = await blog.save();
        res.json({
            message: "updated blog succusefully",
            status: true,
            blogs: updatedBlog
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