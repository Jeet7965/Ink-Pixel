import jwt from "jsonwebtoken";
import { UserModel } from "../model/userModel.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.id);
 

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // ✅ Attach user to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "User not authenticated", error: error.message });
  }
};

export default authMiddleware;
