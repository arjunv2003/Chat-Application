import express from "express";
import {
  allUsers,
  authUser,
  registerUser,
} from "../controllers/userControllers.js"; // ✅ Correct Import
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers); // ✅ Register and Get all users
router.post("/login", authUser); // ✅ Login Route
export default router;
