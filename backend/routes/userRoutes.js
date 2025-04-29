import express from "express";
import {
  allUsers,
  authUser,
  registerUser,
  updateProfile,
} from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
router.put("/updateprofile", protect, updateProfile);
export default router;
