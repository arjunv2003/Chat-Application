import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allMessages, sendMessage } from "../controllers/messageControllers.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:chatId", protect, allMessages);

export default router;
