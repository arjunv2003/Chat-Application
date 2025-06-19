import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  accessChat,
  addToGroup,
  clearChat,
  createGroupChat,
  deleteChat,
  fetchChats,
  leaveGroup,
  removeFromGroup,
  renameGroup,
} from "../controllers/chatControllers.js"; // Ensure file extension is added
export const router = express.Router();

router.post("/", protect, accessChat);
router.get("/", protect, fetchChats);
router.post("/group", protect, createGroupChat);
router.put("/rename", protect, renameGroup);
router.put("/groupadd", protect, addToGroup);
router.put("/groupremove", protect, removeFromGroup);
router.put("/leave", protect, leaveGroup);
router.delete("/clear", protect, clearChat);
router.delete("/delete", protect, deleteChat);

export default router;
