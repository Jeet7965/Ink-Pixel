import express from "express"
import authMiddleware from "../middleware/AuthMiddleware.js";
import { CategoryModel } from "../model/categoryModel.js";

const router = express.Router()

router.post("/add-category", authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    // Only admin can add category
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Category name is required." });
    }

    const category = await CategoryModel.create({ name: name.trim() });

    res.json({
      status: true,
      message: "Category added successfully",
      category,
    });

  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({
      status: false,
      message: "Error adding category",
      error: error.message,
    });
  }
});

router.get("/show-category",authMiddleware, async (req, res) => {
  try {
  const categories = await CategoryModel.find().sort({ createdAt: -1 });
  res.json(categories);
  } catch (error) {
      console.error("Error fetching categories:", error);
    res.status(500).json({
      status: false,
      message: "Error fetching categories",
      error: error.message,
    });

  }
});

// only admin delete-category
router.delete("/delete-category/:id", authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    // Check if user is admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { id } = req.params;

    const category = await CategoryModel.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully", category });

  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error: error.message });
  }
});

export default router