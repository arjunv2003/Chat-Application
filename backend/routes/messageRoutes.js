import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  allMessages,
  deleteMessage,
  sendMessage,
} from "../controllers/messageControllers.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:chatId", protect, allMessages);
router.delete("/delete/:messageId", protect, deleteMessage);
export default router;
